import { prisma } from '../app.js';
import { mockPaymentProvider } from './mock.payment.js';
import { mockSupplier } from './mock.supplier.js';
import crypto from 'crypto';

export class OrderService {
  async createOrder(data: {
    productId: string;
    playerId: string;
    serverId?: string;
    contactPhone: string;
    contactEmail?: string;
    promoCode?: string;
  }) {
    // 1. Fetch product and verify price from DB
    const product = await prisma.product.findUnique({
      where: { id: data.productId },
      include: { game: true },
    });

    if (!product || !product.active) {
      const err: any = new Error('Product not found or inactive');
      err.statusCode = 400;
      throw err;
    }

    let discountCents = 0;
    let promoCodeId: string | undefined = undefined;

    if (data.promoCode) {
      const promo = await prisma.promoCode.findUnique({
        where: { code: data.promoCode },
      });
      if (
        promo &&
        promo.active &&
        promo.expiresAt > new Date() &&
        promo.usedCount < promo.maxUses
      ) {
        promoCodeId = promo.id;
        if (promo.discountType === 'percentage') {
          discountCents = Math.round((product.sellPriceCents * promo.discountValue) / 100);
        } else {
          discountCents = promo.discountValue;
        }
      }
    }

    const amountCents = Math.max(0, product.sellPriceCents - discountCents);
    const orderCode = `ORD-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

    // 2. Create order, initial payment record, and order event in a transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          code: orderCode,
          productId: product.id,
          playerId: data.playerId,
          serverId: data.serverId,
          amountCents,
          currency: 'USD',
          status: 'pending',
          contactPhone: data.contactPhone,
          contactEmail: data.contactEmail,
          promoCodeId,
        },
      });

      // Create charge via payment provider
      const charge = await mockPaymentProvider.createCharge({
        orderId: newOrder.id,
        orderCode: newOrder.code,
        amountCents,
        currency: 'USD',
        contactPhone: data.contactPhone,
      });

      await tx.payment.create({
        data: {
          orderId: newOrder.id,
          provider: 'khqr',
          providerRef: charge.providerRef,
          qrString: charge.qrString,
          qrMd5: charge.qrMd5,
          checkoutUrl: charge.checkoutUrl,
          amountCents,
          status: 'pending',
          expiresAt: charge.expiresAt,
        },
      });

      await tx.orderEvent.create({
        data: {
          orderId: newOrder.id,
          event: 'ORDER_CREATED',
          meta: { amountCents, productId: product.id },
        },
      });

      if (promoCodeId) {
        await tx.promoCode.update({
          where: { id: promoCodeId },
          data: { usedCount: { increment: 1 } },
        });
      }

      return newOrder;
    });

    return this.getOrderByCode(order.code);
  }

  async getOrderByCode(code: string) {
    const order = await prisma.order.findUnique({
      where: { code },
      include: {
        product: { include: { game: true } },
        payments: true,
        fulfillment: true,
        events: true,
      },
    });

    if (!order) {
      const err: any = new Error('Order not found');
      err.statusCode = 404;
      throw err;
    }

    return order;
  }

  async processPaymentSuccess(providerRef: string) {
    // Find payment & order inside transaction with row locking
    return await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findFirst({
        where: { providerRef },
        include: { order: { include: { product: true } } },
      });

      if (!payment || payment.status === 'paid') {
        return null; // Idempotency check: already paid or not found
      }

      const order = payment.order;
      if (order.status !== 'pending') {
        return order;
      }

      // 1. Update payment to paid
      await tx.payment.update({
        where: { id: payment.id },
        data: { status: 'paid', paidAt: new Date() },
      });

      // 2. Update order to paid -> processing
      const updatedOrder = await tx.order.update({
        where: { id: order.id },
        data: { status: 'processing' },
      });

      await tx.orderEvent.create({
        data: {
          orderId: order.id,
          event: 'PAYMENT_VERIFIED_AND_PROCESSING',
          meta: { providerRef, amountCents: payment.amountCents },
        },
      });

      // 3. Create fulfillment record
      const fulfillment = await tx.fulfillment.create({
        data: {
          orderId: order.id,
          supplier: 'mock',
          status: 'pending',
          attempts: 0,
        },
      });

      // 4. Trigger supplier fulfillment asynchronously / immediately
      setTimeout(async () => {
        try {
          const suppResult = await mockSupplier.createOrder(
            order.product.supplierSku,
            order.playerId,
            order.serverId || undefined,
            order.code,
          );

          await prisma.$transaction(async (innerTx) => {
            await innerTx.fulfillment.update({
              where: { id: fulfillment.id },
              data: {
                supplierRef: suppResult.supplierRef,
                status: suppResult.status === 'delivered' ? 'delivered' : 'failed',
                attempts: 1,
                deliveredAt: suppResult.status === 'delivered' ? new Date() : null,
                responseJson: suppResult.responseJson,
              },
            });

            if (suppResult.status === 'delivered') {
              await innerTx.order.update({
                where: { id: order.id },
                data: { status: 'delivered' },
              });
              await innerTx.orderEvent.create({
                data: {
                  orderId: order.id,
                  event: 'ORDER_DELIVERED',
                  meta: { supplierRef: suppResult.supplierRef },
                },
              });
            } else {
              await innerTx.order.update({
                where: { id: order.id },
                data: { status: 'failed' },
              });
              await innerTx.orderEvent.create({
                data: {
                  orderId: order.id,
                  event: 'FULFILLMENT_FAILED',
                  meta: { error: suppResult.error },
                },
              });
            }
          });
        } catch (err: any) {
          console.error('Fulfillment error:', err);
        }
      }, 100);

      return updatedOrder;
    });
  }
}

export const orderService = new OrderService();
