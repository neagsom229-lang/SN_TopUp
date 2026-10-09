export type OrderStatus = 'pending' | 'paid' | 'processing' | 'delivered' | 'failed' | 'expired' | 'refunded';
export type PaymentStatus = 'pending' | 'paid' | 'expired' | 'failed';
export type FulfillmentStatus = 'pending' | 'processing' | 'delivered' | 'failed';
export type UserRole = 'customer' | 'admin';

export interface GameInputField {
  key: string;
  label: { en: string; km: string };
  type: 'text' | 'number';
  required: boolean;
  placeholder?: string;
}

export interface CreateOrderRequest {
  productId: string;
  playerId: string;
  serverId?: string;
  contactPhone: string;
  contactEmail?: string;
  promoCode?: string;
}

export interface OrderResponse {
  id: string;
  code: string;
  status: OrderStatus;
  amountCents: number;
  currency: string;
  createdAt: string;
  payment?: {
    provider: string;
    checkoutUrl?: string;
    qrString?: string;
    qrMd5?: string;
    expiresAt?: string;
    status: PaymentStatus;
  };
}
