import { PrismaClient } from '@prisma/client';
import { getDbIdentity } from '../src/utils/db-identity.js';

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
    await getDbIdentity(prisma);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error('db:whoami failed:', err);
  process.exit(1);
});
