import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';
import { checkCatalogData } from '../src/services/catalog-checker.js';

dotenv.config({ path: path.resolve(process.cwd(), 'apps/api/.env') });
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL,
    },
  },
});

async function verifyCatalog() {
  console.log('Verifying catalog requirements...');
  try {
    const games = await prisma.game.findMany({
      include: {
        products: true,
      },
      orderBy: { sortOrder: 'asc' },
    });

    const passed = await checkCatalogData(games);
    const summary = games.map((g) => ({
      slug: g.slug,
      name: g.name,
      productCount: g.products.filter((p) => p.active).length,
      packageTypes: Array.from(new Set(g.products.map((p) => p.packageType))).join(', '),
    }));

    console.table(summary);

    if (!passed) {
      console.error('❌ Catalog verification FAILED.');
      process.exit(1);
    } else {
      console.log('✅ Catalog verification PASSED successfully!');
      process.exit(0);
    }
  } catch (err) {
    console.error('Error during catalog verification:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verifyCatalog();
