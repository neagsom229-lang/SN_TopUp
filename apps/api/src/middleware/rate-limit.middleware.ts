import { Request, Response, NextFunction } from 'express';

const ipHits = new Map<string, { count: number; resetTime: number }>();

export function rateLimiter(windowMs: number = 60000, max: number = 60) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const record = ipHits.get(ip);

    if (!record || now > record.resetTime) {
      ipHits.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (record.count >= max) {
      return res.status(429).json({
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests, please try again later.',
        },
      });
    }

    record.count++;
    next();
  };
}
