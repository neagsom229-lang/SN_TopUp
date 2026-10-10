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

async function run() {
  const games = await prisma.game.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: { sortOrder: 'asc' },
  });

  console.log('GAMES AND PRODUCT COUNTS:');
  const gameSummary = games.map((g) => ({
    slug: g.slug,
    name: g.name,
    productCount: g._count.products,
  }));
  console.table(gameSummary);

  const totalGames = games.length;
  console.log('TOTAL GAMES:', totalGames);
  await prisma.$disconnect();
}
run();
