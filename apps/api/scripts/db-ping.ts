import { PrismaClient } from '@prisma/client';

async function main() {
  const directUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: directUrl,
      },
    },
  });

  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('Database ping successful!');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error('db:ping failed:', err);
  process.exit(1);
});
