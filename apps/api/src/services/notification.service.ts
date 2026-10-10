import pino from 'pino';

const logger = pino();

export class NotificationService {
  async sendAlert(message: string) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId || token === 'your-telegram-bot-token') {
      logger.info({ message }, '[NotificationService] Telegram alert skipped (not configured)');
      return;
    }

    try {
      const url = `https://api.telegram.org/bot${token}/sendMessage`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'Markdown' }),
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
