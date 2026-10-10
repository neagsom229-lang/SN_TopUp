import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import pinoHttp from 'pino-http';
import pino from 'pino';
import { env } from './env.js';
import { PrismaClient } from '@prisma/client';
import { apiRouter } from './routes/api.routes.js';

export const prisma = new PrismaClient();
export const logger = pino({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport: env.NODE_ENV !== 'production' ? { target: 'pino-pretty' } : undefined,
});

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(compression());
  app.use(
    cors({
      origin: [
        env.APP_BASE_URL,
        env.ADMIN_BASE_URL,
        'http://localhost:5173',
        'http://localhost:5174',
      ],
      credentials: true,
    }),
  );
  app.use(
    pinoHttp({
      logger,
      redact: [
        'req.headers.cookie',
        'req.headers.authorization',
        'req.headers["set-cookie"]',
        'req.headers["x-signature"]',
        'req.headers["signature"]',
        'req.headers["x-token"]',
        'req.headers["token"]',
        'res.headers["set-cookie"]',
      ],
      customProps: (req) => ({
        requestId: req.id,
      }),
      serializers: {
        req: (req) => ({
          method: req.method,
          url: req.url,
        }),
        res: (res) => ({
          status: res.statusCode,
        }),
      },
    }),
  );

  // Raw body for webhook verification route
  app.use('/api/v1/webhooks/khqr', express.raw({ type: 'application/json' }));
  app.use(express.json({ limit: '1mb' }));

  // Mount API router
  app.use('/api/v1', apiRouter);

  // Health endpoint
  app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Ready endpoint
  app.get('/ready', async (req: Request, res: Response) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      res.json({ status: 'ready', database: 'connected', timestamp: new Date().toISOString() });
    } catch (err) {
      logger.error({ err }, 'Database readiness check failed');
      res.status(503).json({ status: 'not_ready', error: 'Database connection failed' });
    }
  });

  // Centralized error handler
  app.use(
    (
      err: Error & { statusCode?: number; code?: string },
      req: Request,
      res: Response,
      _next: NextFunction,
    ) => {
      logger.error({ err, reqId: req.id }, 'Unhandled error');
      const statusCode = err.name === 'ZodError' ? 400 : err.statusCode || 500;
      const message =
        env.NODE_ENV === 'production' && statusCode === 500 ? 'Internal Server Error' : err.message;
      res.status(statusCode).json({
        error: {
          code: err.code || (err.name === 'ZodError' ? 'VALIDATION_ERROR' : 'INTERNAL_ERROR'),
          message,
        },
      });
    },
  );

  return app;
};
