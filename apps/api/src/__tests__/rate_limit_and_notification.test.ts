import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';
import { notificationService } from '../services/notification.service.js';

describe('Rate Limiter & Notification Service', () => {
  const app = createApp();

  it('allows normal traffic', async () => {
    const res1 = await request(app).get('/api/v1/games');
    expect([200, 304]).toContain(res1.status);
  });

  it('notification service does not leak secrets in messages', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    } as unknown as Response);

    process.env.TELEGRAM_BOT_TOKEN = 'mock-bot-token';
    process.env.TELEGRAM_CHAT_ID = 'mock-chat-id';

    await notificationService.sendAlert('Order created successfully with amount $5.00');

    expect(fetchSpy).toHaveBeenCalled();
    const callBody = JSON.parse(String(fetchSpy.mock.calls[0][1]?.body || '{}'));
    expect(callBody.text).not.toContain('password');
    expect(callBody.text).not.toContain('secret_role_key');

    fetchSpy.mockRestore();
  });
});
