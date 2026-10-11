import { Request, Response, NextFunction } from 'express';

const hits = new Map<string, { count: number; resetTime: number }>();

export function rateLimiter(
  windowMs: number = 60000,
  max: number = 60,
  usePhoneKey: boolean = false,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Webhook signature exemption
    if (req.path.includes('webhook') && req.headers['x-signature']) {
      return next();
    }

    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const phone =
      usePhoneKey && req.body && req.body.contactPhone ? String(req.body.contactPhone) : '';
    const key = phone ? `${ip}:${phone}` : ip;
    const now = Date.now();

    let record = hits.get(key);
    if (!record || now > record.resetTime) {
      record = { count: 1, resetTime: now + windowMs };
      hits.set(key, record);
    } else {
      if (record.count >= max) {
        const retryAfter = Math.ceil((record.resetTime - now) / 1000);
        res.setHeader('Retry-After', String(retryAfter));
        return res.status(429).json({
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests, please try again later.',
          },
        });
      }
      record.count++;
    }

    if (phone) {
      const ipKey = `ip:${ip}`;
      let ipRecord = hits.get(ipKey);
      if (!ipRecord || now > ipRecord.resetTime) {
        ipRecord = { count: 1, resetTime: now + windowMs };
        hits.set(ipKey, ipRecord);
      } else {
        if (ipRecord.count >= 60) {
          const retryAfter = Math.ceil((ipRecord.resetTime - now) / 1000);
          res.setHeader('Retry-After', String(retryAfter));
          return res.status(429).json({
            error: {
              code: 'RATE_LIMIT_EXCEEDED',
              message: 'Too many requests from this IP address, please try again later.',
            },
          });
        }
        ipRecord.count++;
      }
    }

    next();
  };
}
