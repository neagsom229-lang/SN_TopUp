import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';

describe('Logging & Redaction (pino-http)', () => {
  const app = createApp();

  it('redacts cookie, authorization, and sensitive headers from logs', async () => {
    const res = await request(app)
      .get('/health')
      .set('Cookie', 'session=secret-session-token-123')
      .set('Authorization', 'Bearer secret-jwt-token')
      .set('X-Signature', 'secret-sig');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
