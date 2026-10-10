import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';
import { notificationService } from '../services/notification.service.js';

describe('Rate Limiter, Admin 501, and Notification Security Tests', () => {
  const app = createApp();

  it('(a) abusive traffic on POST /orders gets 429 after threshold', async () => {
    const promises = [];
    for (let i = 0; i < 70; i++) {
      promises.push(request(app).post('/api/v1/orders').send({}));
    }
    const results = await Promise.all(promises);
    const tooManyRequests = results.some((r) => r.status === 429);
    expect(tooManyRequests).toBe(true);
  });

  it('(b) correctly signed webhook is never 429', async () => {
    const res = await request(app)
      .post('/api/v1/webhooks/khqr')
      .send({ eventId: 'evt-test-1', status: 'paid' });
    expect(res.status).not.toBe(429);
  });

  it('(c) /api/v1/admin/* returns 501 for no token, customer token, or any token', async () => {
    const r1 = await request(app).get('/api/v1/admin/metrics');
    expect(r1.status).toBe(501);
    expect(r1.body.error.code).toBe('NOT_IMPLEMENTED');

    const r2 = await request(app)
      .get('/api/v1/admin/orders')
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.customer');
    expect(r2.status).toBe(501);

    const r3 = await request(app)
      .get('/api/v1/admin/metrics')
      .set('X-Admin-Email', 'admin@sntopup.com');
    expect(r3.status).toBe(501);
  });

  it('(d) notification service redacts secrets by value pattern (eyJ..., rbk_...)', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    } as unknown as Response);

    process.env.TELEGRAM_BOT_TOKEN = 'mock-token';
    process.env.TELEGRAM_CHAT_ID = 'mock-chat';

    const secretJwt =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    const secretKey = 'rbk_live_998877665544332211';

    await notificationService.sendAlert(`Alert with JWT ${secretJwt} and API key ${secretKey}`);

    expect(fetchSpy).toHaveBeenCalled();
    const callBody = JSON.parse(String(fetchSpy.mock.calls[0][1]?.body || '{}'));
    expect(callBody.text).not.toContain(secretJwt);
    expect(callBody.text).not.toContain(secretKey);
    expect(callBody.text).toContain('[REDACTED_JWT]');
    expect(callBody.text).toContain('[REDACTED_TOKEN]');

    fetchSpy.mockRestore();
  });
});
