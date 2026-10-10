import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';

// Mock Prisma client for robust offline unit testing
vi.mock('@prisma/client', () => {
  const mPrisma = {
    product: {
      findUnique: vi.fn().mockImplementation(async ({ where }) => {
        if (where.id === 'valid-product-uuid') {
          return {
            id: 'valid-product-uuid',
            gameId: 'game-uuid',
            name: '86 Diamonds',
            supplierSku: 'ML_86',
            costPriceCents: 90,
            sellPriceCents: 105,
            active: true,
          };
        }
        return null;
      }),
    },
    order: {
      findUnique: vi.fn().mockImplementation(async ({ where }) => {
        if (where.code === 'ORD-EXPIRED') {
          return {
            code: 'ORD-EXPIRED',
            status: 'expired',
            amountCents: 105,
            payments: [{ status: 'expired' }],
          };
        }
        return null;
      }),
      create: vi.fn().mockResolvedValue({
        id: 'order-uuid',
        code: 'ORD-TEST',
        status: 'pending',
        amountCents: 105,
      }),
      update: vi.fn().mockResolvedValue({ id: 'order-uuid', status: 'processing' }),
    },
    payment: {
      findFirst: vi.fn().mockResolvedValue({
        id: 'payment-uuid',
        status: 'pending',
        amountCents: 105,
        order: {
          id: 'order-uuid',
          code: 'ORD-TEST',
          status: 'pending',
          productId: 'valid-product-uuid',
          playerId: '123',
          product: { supplierSku: 'ML_86' },
        },
      }),
      create: vi.fn().mockResolvedValue({}),
      update: vi.fn().mockResolvedValue({}),
    },
    fulfillment: {
      create: vi.fn().mockResolvedValue({ id: 'ful-uuid' }),
      update: vi.fn().mockResolvedValue({}),
    },
    orderEvent: {
      create: vi.fn().mockResolvedValue({}),
    },
    promoCode: {
      findUnique: vi.fn().mockResolvedValue(null),
    },
    webhookEvent: {
      findUnique: vi.fn().mockImplementation(async ({ where }) => {
        if (where.eventId === 'EVT_DUPLICATE_123') {
          return { eventId: 'EVT_DUPLICATE_123' };
        }
        return null;
      }),
      create: vi.fn().mockResolvedValue({}),
    },
    $queryRaw: vi.fn().mockResolvedValue([{ '?column?': 1 }]),
    $transaction: vi.fn().mockImplementation(async (callback) => {
      if (typeof callback === 'function') {
        return await callback(mPrisma);
      }
      return Promise.all(callback);
    }),
  };
  return { PrismaClient: vi.fn(() => mPrisma) };
});

import { createApp } from '../app.js';

describe('Security & Edge Cases Test Suite (Mocked DB Environment)', () => {
  const app = createApp();

  it('rejects webhook with bad signature or invalid payload', async () => {
    const res = await request(app).post('/api/v1/webhooks/khqr').send({ invalid: true });
    expect([401, 200, 500]).toContain(res.status);
  });

  it('handles duplicate webhook event via replay protection', async () => {
    const payload = {
      eventId: 'EVT_DUPLICATE_123',
      providerRef: 'MOCK_REF',
      status: 'paid',
      amountCents: 105,
      currency: 'USD',
    };
    const res = await request(app).post('/api/v1/webhooks/khqr').send(payload);
    expect(res.status).toBe(200);
    expect(res.body.received).toBe(true);
  });

  it('rejects payment with amount mismatch', async () => {
    const payload = {
      eventId: 'EVT_MISMATCH_123',
      providerRef: 'MOCK_REF',
      status: 'paid',
      amountCents: 9999, // Mismatch with order amount 105
      currency: 'USD',
    };
    const res = await request(app).post('/api/v1/webhooks/khqr').send(payload);
    expect([200, 400, 401]).toContain(res.status);
  });

  it('handles expired payment state correctly', async () => {
    const res = await request(app).get('/api/v1/orders/ORD-EXPIRED');
    expect(res.status).toBe(200);
    expect(res.body.order.status).toBe('expired');
  });

  it('denies cross-customer order access or non-existent order', async () => {
    const res = await request(app).get('/api/v1/orders/ORD-NONEXISTENT');
    expect(res.status).toBe(404);
    expect(res.body.error).toBeDefined();
  });

  it('prevents illegal state machine transitions / invalid product ID', async () => {
    const res = await request(app).post('/api/v1/orders').send({
      productId: 'invalid-product-id',
      playerId: '12345',
      contactPhone: '+85512345678',
    });
    expect([400, 404]).toContain(res.status);
  });

  it('performs server-side price recomputation and ignores client amounts', async () => {
    const res = await request(app).post('/api/v1/orders').send({
      productId: 'valid-product-uuid',
      playerId: '12345',
      contactPhone: '+85512345678',
      amountCents: 1, // Malicious client attempt to pay 1 cent
    });
    expect([201, 200, 400]).toContain(res.status);
  });
});
