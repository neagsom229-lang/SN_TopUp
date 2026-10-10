export interface CreateChargeParams {
  orderId: string;
  orderCode: string;
  amountCents: number;
  currency: string;
  contactPhone: string;
}

export interface ChargeResult {
  providerRef: string;
  checkoutUrl?: string;
  qrString?: string;
  qrMd5?: string;
  expiresAt: Date;
}

export type PaymentCheckStatus = 'paid' | 'unpaid' | 'expired' | 'error';

export interface WebhookParseResult {
  valid: boolean;
  eventId: string;
  providerRef: string;
  amountCents: number;
  currency: string;
  status: PaymentCheckStatus;
}

export interface PaymentProvider {
  createCharge(params: CreateChargeParams): Promise<ChargeResult>;
  getStatus(providerRefOrMd5: string): Promise<PaymentCheckStatus>;
  verifyWebhook(
    rawBody: Buffer,
    headers: Record<string, string | undefined>,
  ): Promise<WebhookParseResult>;
}
