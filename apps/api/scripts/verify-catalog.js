'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.checkCatalogData = checkCatalogData;
const client_1 = require('@prisma/client');
const dotenv_1 = __importDefault(require('dotenv'));
const path_1 = __importDefault(require('path'));
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), 'apps/api/.env') });
const prisma = new client_1.PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL,
    },
  },
});
async function checkCatalogData(games) {
  let hasError = false;
  const activeGames = games.filter((g) => g.products.some((p) => p.active));
  if (activeGames.length < 15) {
    console.error(`[FAIL] Total active games is ${activeGames.length}, expected >= 15.`);
    hasError = true;
  }
  const slugs = games.map((g) => g.slug);
  const uniqueSlugs = new Set(slugs);
  if (uniqueSlugs.size !== slugs.length) {
    console.error('[FAIL] Duplicate game slugs found.');
    hasError = true;
  }
  for (const g of games) {
    const activeProducts = g.products.filter((p) => p.active);
    const pCount = activeProducts.length;
    const minExpected = g.slug === 'clash-of-clans' ? 10 : 8;
    if (pCount < minExpected) {
      console.error(
        `[FAIL] Game "${g.slug}" has ${pCount} active products (expected >= ${minExpected}).`,
      );
      hasError = true;
    }
    for (const p of activeProducts) {
      if (!p.packageType) {
        console.error(`[FAIL] Product "${p.name}" in game "${g.slug}" missing packageType.`);
        hasError = true;
      }
      if (p.sellPriceCents <= 0 || p.costPriceCents <= 0) {
        console.error(
          `[FAIL] Product "${p.name}" in game "${g.slug}" has invalid price (${p.sellPriceCents} cents).`,
        );
        hasError = true;
      }
    }
  }
  return !hasError;
}
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
if (process.argv[1] && process.argv[1].endsWith('verify-catalog.ts')) {
  verifyCatalog();
}
