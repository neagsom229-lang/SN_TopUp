import pino from 'pino';

const logger = pino();

export class NotificationService {
  sanitizeMessage(text: string): string {
    return text
      .replace(/eyJ[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+/g, '[REDACTED_JWT]')
      .replace(/rbk_[a-zA-Z0-9\-_]{10,}/g, '[REDACTED_TOKEN]')
      .replace(/postgresql:\/\/[^:\s]+:[^@\s]+@/g, 'postgresql://[REDACTED]:[REDACTED]@');
  }

  async sendAlert(message: string) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const sanitized = this.sanitizeMessage(message);

    if (!token || !chatId || token === 'your-telegram-bot-token') {
      logger.info(
        { message: sanitized },
        '[NotificationService] Telegram alert skipped (not configured)',
      );
      return;
    }

    try {
      const url = `https://api.telegram.org/bot${token}/sendMessage`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: sanitized, parse_mode: 'Markdown' }),
      });
      if (!res.ok) {
        logger.error({ status: res.status }, '[NotificationService] Failed to send Telegram alert');
      }
    } catch (error) {
      logger.error({ error }, '[NotificationService] Error sending Telegram alert');
    }
  }
}

export const notificationService = new NotificationService();
