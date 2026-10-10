import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../app.js';
import { orderService } from '../services/order.service.js';
import { mockPaymentProvider } from '../services/mock.payment.js';
import { mockSupplier } from '../services/mock.supplier.js';
import { env } from '../env.js';
import { z } from 'zod';
import { rateLimiter } from '../middleware/rate-limit.middleware.js';
import { cacheService } from '../services/cache.service.js';

export const apiRouter = Router();

// Rate limit sensitive endpoints
const sensitiveLimiter = rateLimiter(60000, 30);

// GET /games
apiRouter.get('/games', async (req: Request, res: Response, next) => {
  try {
    const games = await prisma.game.findMany({
      where: { active: true },
      include: {
        products: {
          where: { active: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });
    res.json({ games });
  } catch (err) {
    next(err);
  }
});

// GET /games/:slug
apiRouter.get('/games/:slug', async (req: Request, res: Response, next) => {
  try {
    const slug = req.params.slug;
    const cacheKey = `game_${slug}`;
    const cached = cacheService.get(cacheKey);
    if (cached) {
      res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=120');
      return res.json(cached);
    }

    const game = await prisma.game.findUnique({
      where: { slug },
      include: {
        products: {
          where: { active: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
    if (!game) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Game not found' } });
    }

    const productsWithUnitPrice = game.products.map((p) => {
      let unitPriceMicros = null;
      if (p.unitAmount && p.unitAmount > 0) {
        unitPriceMicros = Math.round((p.sellPriceCents * 10000) / p.unitAmount);
      }
      return { ...p, unitPriceMicros };
    });

    const grouped = {
      currency: productsWithUnitPrice.filter((p) => p.packageType === 'currency'),
      pass: productsWithUnitPrice.filter((p) => p.packageType === 'pass'),
      bundle: productsWithUnitPrice.filter((p) => p.packageType === 'bundle'),
    };

    const responseData = {
      game: {
        ...game,
        products: productsWithUnitPrice,
        groupedProducts: grouped,
      },
    };

    cacheService.set(cacheKey, responseData, 60);
    res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=120');
    res.json(responseData);
  } catch (err) {
    next(err);
  }
});

// POST /orders
const createOrderSchema = z.object({
  productId: z.string().uuid(),
  playerId: z.string().min(1),
  serverId: z.string().optional(),
  contactPhone: z.string().min(8),
  contactEmail: z.string().email().optional(),
  promoCode: z.string().optional(),
});

apiRouter.post('/orders', sensitiveLimiter, async (req: Request, res: Response, next) => {
  try {
    const data = createOrderSchema.parse(req.body);
    const order = await orderService.createOrder(data);
    res.status(201).json({ order });
  } catch (err) {
    next(err);
  }
});

// GET /orders/:code
apiRouter.get('/orders/:code', async (req: Request, res: Response, next) => {
  try {
    const order = await orderService.getOrderByCode(req.params.code);
    res.json({ order });
  } catch (err) {
    next(err);
  }
});

// GET /orders/:code/status
apiRouter.get('/orders/:code/status', async (req: Request, res: Response, next) => {
  try {
    const order = await orderService.getOrderByCode(req.params.code);
    res.json({
      status: order.status,
      paymentStatus: order.payments[0]?.status,
      fulfillmentStatus: order.fulfillment?.status,
    });
  } catch (err) {
    next(err);
  }
});

// POST /promo/validate
apiRouter.post('/promo/validate', async (req: Request, res: Response, next) => {
  try {
    const { code } = req.body;
    const promo = await prisma.promoCode.findUnique({ where: { code } });
    if (
      !promo ||
      !promo.active ||
      promo.expiresAt < new Date() ||
      promo.usedCount >= promo.maxUses
    ) {
      return res
        .status(400)
        .json({ error: { code: 'INVALID_PROMO', message: 'Promo code is invalid or expired' } });
    }
    res.json({ valid: true, discountType: promo.discountType, discountValue: promo.discountValue });
  } catch (err) {
    next(err);
  }
});

// POST /players/check
apiRouter.post('/players/check', sensitiveLimiter, async (req: Request, res: Response, next) => {
  try {
    const { gameSlug, playerId, serverId } = req.body;
    const result = await mockSupplier.checkPlayer(gameSlug, playerId, serverId);
    if (!result.valid) {
      return res.status(400).json({ error: { code: 'INVALID_PLAYER', message: result.error } });
    }
    res.json({ valid: true, playerName: result.playerName });
  } catch (err) {
    next(err);
  }
});

// POST /webhooks/khqr
apiRouter.post('/webhooks/khqr', async (req: Request, res: Response, next) => {
  try {
    const rawBody = req.body; // Needs express.raw or handled carefully
    const parsed = await mockPaymentProvider.verifyWebhook(rawBody, req.headers as any);
    if (!parsed.valid) {
      return res
        .status(401)
        .json({ error: { code: 'INVALID_SIGNATURE', message: 'Invalid webhook signature' } });
    }

    // Replay protection check
    const existing = await prisma.webhookEvent.findUnique({ where: { eventId: parsed.eventId } });
    if (existing) {
      return res.status(200).json({ received: true });
    }

    await prisma.webhookEvent.create({
      data: {
        provider: 'khqr',
        eventId: parsed.eventId,
        payload: req.body,
        signatureValid: true,
      },
    });

    if (parsed.status === 'paid') {
      await orderService.processPaymentSuccess(parsed.providerRef);
    }

    res.json({ received: true });
  } catch (err) {
    next(err);
  }
});

// DEV & TESTING helpers (strictly development/test only)
apiRouter.use('/dev', (req, res, next) => {
  if (env.NODE_ENV === 'production') {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Not found' } });
  }
  next();
});

apiRouter.post('/dev/mark-paid', async (req: Request, res: Response, next) => {
  try {
    const { providerRef } = req.body;
    mockPaymentProvider.setStatus(providerRef, 'paid');
    const updated = await orderService.processPaymentSuccess(providerRef);
    res.json({ success: true, updated });
  } catch (err) {
    next(err);
  }
});

apiRouter.get('/dev/checkout/:ref', async (req: Request, res: Response) => {
  const ref = req.params.ref;
  res.send(`
    <html>
      <body style="font-family: sans-serif; text-align: center; padding-top: 50px; background: #0f172a; color: white;">
        <h2>Mock KHQR Checkout</h2>
        <p>Reference: <b>${ref}</b></p>
        <p>Scan QR code or click below to simulate successful payment.</p>
        <div style="background: white; padding: 20px; display: inline-block; color: black; font-weight: bold; margin: 20px;">
          [ MOCK KHQR CODE ]
        </div>
        <br/>
        <button onclick="pay()" style="background: #10b981; color: white; border: none; padding: 12px 24px; font-size: 16px; border-radius: 6px; cursor: pointer;">
          Simulate Successful Payment
        </button>
        <script>
          async function pay() {
            const res = await fetch('/api/v1/dev/mark-paid', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ providerRef: '${ref}' })
            });
            if (res.ok) {
              alert('Payment successful! You can close this window.');
              window.close();
            } else {
              alert('Payment simulation failed');
            }
          }
        </script>
      </body>
    </html>
  `);
});

// Admin endpoints disabled: real Supabase JWT verification middleware not built yet
apiRouter.all('/admin/*', (_req: Request, res: Response) => {
  res.status(501).json({
    error: {
      code: 'NOT_IMPLEMENTED',
      message: 'Admin endpoints disabled: real Supabase JWT verification middleware not built yet',
    },
  });
});
