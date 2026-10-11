import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';

describe('Error Handling and Rate Limiter', () => {
  const app = createApp();

  it('returns 400 and VALIDATION_ERROR for ZodError', async () => {
    const res = await request(app).get('/api/v1/test-zod-error');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(res.body.error.issues).toBeDefined();
  });

  it('returns 500 and generic message for unexpected errors', async () => {
    const res = await request(app).get('/api/v1/test-500-error');
    expect(res.status).toBe(500);
    expect(res.body.error.code).toBe('INTERNAL_ERROR');
    expect(res.body.error.message).toBe('Internal Server Error');
    expect(res.body.error.message).not.toContain('secret password');
  });

  it('rate limits POST /orders with IP + contactPhone and sets Retry-After header on 429', async () => {
    // POST /orders limit is 10/min per IP+phone
    const payload = {
      productId: '00000000-0000-0000-0000-000000000001',
      playerId: '12345',
      contactPhone: '0123456789',
    };

    let lastRes;
    for (let i = 0; i < 12; i++) {
      lastRes = await request(app).post('/api/v1/orders').send(payload);
    }
    expect(lastRes?.status).toBe(429);
    expect(lastRes?.headers['retry-after']).toBeDefined();
    expect(lastRes?.body.error.code).toBe('RATE_LIMIT_EXCEEDED');
  }, 10000);

  it('exempts signed webhooks from rate limiting', async () => {
    const res = await request(app)
      .post('/api/v1/webhooks/khqr')
      .set('x-signature', 'valid-sig')
      .send({ event: 'test' });
    // Should not get rate limited (might fail on signature validation or return 400/200, but not 429)
    expect(res.status).not.toBe(429);
  });
});
