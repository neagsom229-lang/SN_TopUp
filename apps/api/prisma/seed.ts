import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { z } from 'zod';

const prisma = new PrismaClient();

const productSchema = z.object({
  name: z.string(),
  supplierSku: z.string(),
  costPriceCents: z.number(),
  sellPriceCents: z.number(),
  packageType: z.enum(['currency', 'pass', 'bundle']),
  badge: z.enum(['popular', 'best_value', 'hot']).nullable().optional(),
  unitAmount: z.number().nullable().optional(),
  unitLabel: z.string().nullable().optional(),
  groupLabel: z.string().nullable().optional(),
  sortOrder: z.number(),
});

const gameSchema = z.object({
  slug: z.string(),
  name: z.string(),
  imageUrl: z.string(),
  category: z.string(),
  inputFields: z.array(
    z.object({
      key: z.string(),
      label: z.object({ en: z.string(), km: z.string() }),
      type: z.string(),
      required: z.boolean(),
      placeholder: z.string().optional(),
    }),
  ),
  products: z.array(productSchema),
});

const gamesListSchema = z.array(gameSchema);

async function main() {
  console.log('Seeding database idempotently from games.json with Zod validation...');

  const dataPath = path.resolve(__dirname, './data/games.json');
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const parsedData = JSON.parse(rawData);
  const games = gamesListSchema.parse(parsedData);

  // Seed default admin/customer users
  await prisma.user.upsert({
    where: { email: 'admin@sntopup.com' },
    update: {},
    create: {
      email: 'admin@sntopup.com',
      name: 'Admin User',
      role: 'admin',
    },
  });

  const categoriesMap = new Map<string, string>();
  let catOrder = 1;

  for (const game of games) {
    let catId = categoriesMap.get(game.category);
    if (!catId) {
      const categoryRecord = await prisma.gameCategory.upsert({
        where: { slug: game.category.toLowerCase().replace(/[^a-z0-9]+/g, '-') },
        update: { name: game.category },
        create: {
          slug: game.category.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          name: game.category,
          sortOrder: catOrder++,
          active: true,
        },
      });
      catId = categoryRecord.id;
      categoriesMap.set(game.category, catId);
    }

    const gameRecord = await prisma.game.upsert({
      where: { slug: game.slug },
      update: {
        name: game.name,
        imageUrl: game.imageUrl,
        category: game.category,
        inputFields: game.inputFields,
        active: true,
      },
      create: {
        slug: game.slug,
        name: game.name,
        imageUrl: game.imageUrl,
        category: game.category,
        inputFields: game.inputFields,
        active: true,
        sortOrder: catOrder,
      },
    });

    for (const prod of game.products) {
      await prisma.product.upsert({
        where: { supplierSku: prod.supplierSku },
        update: {
          name: prod.name,
          costPriceCents: prod.costPriceCents,
          sellPriceCents: prod.sellPriceCents,
          packageType: prod.packageType,
          badge: prod.badge ?? null,
          unitAmount: prod.unitAmount ?? null,
          unitLabel: prod.unitLabel ?? null,
          groupLabel: prod.groupLabel ?? null,
          sortOrder: prod.sortOrder,
          active: true,
        },
        create: {
          gameId: gameRecord.id,
          name: prod.name,
          supplierSku: prod.supplierSku,
          costPriceCents: prod.costPriceCents,
          sellPriceCents: prod.sellPriceCents,
          packageType: prod.packageType,
          badge: prod.badge ?? null,
          unitAmount: prod.unitAmount ?? null,
          unitLabel: prod.unitLabel ?? null,
          groupLabel: prod.groupLabel ?? null,
          sortOrder: prod.sortOrder,
          active: true,
        },
      });
    }
  }

  console.log(`Successfully seeded ${games.length} games from JSON data!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
