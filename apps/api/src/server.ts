import { createApp, logger, prisma } from './app.js';
import { env } from './env.js';

const app = createApp();
const port = env.PORT;

const server = app.listen(port, () => {
  logger.info(`🚀 API server running on port ${port} in ${env.NODE_ENV} mode`);
});

const gracefulShutdown = async (signal: string) => {
  logger.info(`Received signal ${signal}, shutting down gracefully...`);
  server.close(async () => {
    logger.info('HTTP server closed.');
    await prisma.$disconnect();
    logger.info('Database disconnected.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
