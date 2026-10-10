import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), 'apps/api/.env') });
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function verifyCatalog() {
  console.log('Verifying catalog requirements...');
  try {
    const games = await prisma.game.findMany({
      include: {
        products: {
          where: { active: true },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });

    let hasError = false;
    const summary: Array<{ slug: string; name: string; productCount: number; packageTypes: string }> = [];

    if (games.length < 15) {
      console.error(`[FAIL] Total games is ${games.length}, expected >= 15.`);
      hasError = true;
    }

    const slugs = games.map((g) => g.slug);
    const uniqueSlugs = new Set(slugs);
    if (uniqueSlugs.size !== slugs.length) {
      console.error('[FAIL] Duplicate game slugs found.');
      hasError = true;
    }

    for (const g of games) {
      const pCount = g.products.length;
      const types = Array.from(new Set(g.products.map((p) => p.packageType)));
      summary.push({
        slug: g.slug,
        name: g.name,
        productCount: pCount,
        packageTypes: types.join(', '),
      });

      const minExpected = g.slug === 'clash-of-clans' ? 10 : 8;
      if (pCount < minExpected) {
        console.error(`[FAIL] Game "${g.slug}" has ${pCount} products (expected >= ${minExpected}).`);
        hasError = true;
      }

      for (const p of g.products) {
        if (!p.packageType) {
          console.error(`[FAIL] Product "${p.name}" in game "${g.slug}" missing packageType.`);
          hasError = true;
        }
        if (p.sellPriceCents <= 0 || p.costPriceCents <= 0) {
          console.error(`[FAIL] Product "${p.name}" in game "${g.slug}" has invalid price (${p.sellPriceCents} cents).`);
          hasError = true;
        }
      }
    }

    console.table(summary);

    if (hasError) {
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
