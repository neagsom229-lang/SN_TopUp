import {
  PaymentProvider,
  CreateChargeParams,
  ChargeResult,
  PaymentCheckStatus,
  WebhookParseResult,
} from './payment.interface.js';
import crypto from 'crypto';

export class MockPaymentProvider implements PaymentProvider {
  private charges = new Map<
    string,
    { status: PaymentCheckStatus; amountCents: number; currency: string }
  >();

  async createCharge(params: CreateChargeParams): Promise<ChargeResult> {
    const providerRef = `MOCK_REF_${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const qrMd5 = crypto.createHash('md5').update(providerRef).digest('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    this.charges.set(providerRef, {
      status: 'unpaid',
      amountCents: params.amountCents,
      currency: params.currency,
    });
    this.charges.set(qrMd5, {
      status: 'unpaid',
      amountCents: params.amountCents,
      currency: params.currency,
    });

    return {
      providerRef,
      checkoutUrl: `http://localhost:4000/api/v1/dev/checkout/${providerRef}`,
      qrString: `00020101021226580016A000000677010111011303123456753038405802KH5909SN TopUp6005Phnom6304${qrMd5.substring(0, 4)}`,
      qrMd5,
      expiresAt,
    };
  }

  async getStatus(providerRefOrMd5: string): Promise<PaymentCheckStatus> {
    const charge = this.charges.get(providerRefOrMd5);
    return charge ? charge.status : 'unpaid';
  }

  async verifyWebhook(
    rawBody: Buffer,
    headers: Record<string, string | undefined>,
  ): Promise<WebhookParseResult> {
    try {
      const payload = JSON.parse(rawBody.toString('utf8'));
      const providerRef = payload.providerRef;
      const charge = this.charges.get(providerRef);
      return {
        valid: true,
        eventId: payload.eventId || `EVT_${Date.now()}`,
        providerRef,
        amountCents: charge ? charge.amountCents : payload.amountCents || 0,
        currency: charge ? charge.currency : payload.currency || 'USD',
        status: payload.status || 'paid',
      };
    } catch {
      return {
        valid: false,
        eventId: '',
        providerRef: '',
        amountCents: 0,
        currency: 'USD',
        status: 'error',
      };
    }
  }

  // Dev helper to force status in mock
  public setStatus(providerRef: string, status: PaymentCheckStatus) {
    const charge = this.charges.get(providerRef);
    if (charge) {
      charge.status = status;
    }
  }
}

export const mockPaymentProvider = new MockPaymentProvider();
