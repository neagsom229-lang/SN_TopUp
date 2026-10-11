import { PrismaClient } from '@prisma/client';

export async function getDbIdentity(prisma: PrismaClient) {
  const dbUrl = process.env.DIRECT_URL || process.env.DATABASE_URL || '';
  let maskedHost = 'unknown';
  let projectRef = 'unknown';

  try {
    const url = new URL(dbUrl);
    const host = url.hostname;
    const parts = host.split('.');
    if (parts.length > 0) {
      projectRef = parts[0];
    }
    maskedHost = host.replace(/^(.{3}).*(.{3}\..*)$/, '$1***$2');
  } catch {
    maskedHost = 'invalid-url';
  }

  const dbName = dbUrl.split('/').pop()?.split('?')[0] || 'postgres';

  let dbTime: any = null;
  let userCount = 0;
  let catCount = 0;
  let gameCount = 0;
  let prodCount = 0;

  const retryOperation = async (fn: () => Promise<any>, retries = 5, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (err: any) {
        const msg = err?.message || '';
        const isTransient =
          msg.includes('P1001') ||
          msg.includes('P1002') ||
          msg.includes('ECONNRESET') ||
          msg.includes('connection');
        if (i === retries - 1 || !isTransient) throw err;
        console.warn(
          `[WARN] Transient DB error encountered (${msg}), retrying in ${delay}ms (${i + 1}/${retries})...`,
        );
        await new Promise((res) => setTimeout(res, delay));
        delay *= 2;
      }
    }
  };

  await retryOperation(async () => {
    const res: any = await prisma.$queryRaw`SELECT current_database(), now()`;
    dbTime = res[0];
    userCount = await prisma.user.count();
    catCount = await prisma.gameCategory.count();
    gameCount = await prisma.game.count();
    prodCount = await prisma.product.count();
  });

  console.log('--- DATABASE IDENTITY ---');
  console.log(`Masked Host: ${maskedHost}`);
  console.log(`Project Ref: ${projectRef}`);
  console.log(`Database Name: ${dbName}`);
  console.log(`Current DB & Time:`, dbTime);
  console.log(
    `Row Counts -> users: ${userCount}, game_categories: ${catCount}, games: ${gameCount}, products: ${prodCount}`,
  );
  console.log('-------------------------');
}
