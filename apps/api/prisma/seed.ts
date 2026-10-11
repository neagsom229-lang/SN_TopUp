import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import { getDbIdentity } from '../scripts/db-identity.js';

const directUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: directUrl,
    },
  },
});

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
  imageUrl: z
    .string()
    .nullable()
    .optional()
    .transform((val) => val || '')
    .refine((val) => !val || (!val.startsWith('http://') && !val.startsWith('https://')), {
      message: 'Third-party HTTP(S) image URLs are not allowed',
    }),
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

async function retryOperation<T>(fn: () => Promise<T>, retries = 5, delay = 1000): Promise<T> {
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
        `[WARN] Transient DB error (${msg}), retrying in ${delay}ms (${i + 1}/${retries})...`,
      );
      await new Promise((res) => setTimeout(res, delay));
      delay *= 2;
    }
  }
  throw new Error('Max retries reached');
}

async function main() {
  await retryOperation(async () => {
    await getDbIdentity(prisma);
  });

  console.log('Seeding database idempotently from games.json with Zod validation...');

  const dataPath = path.resolve(__dirname, './data/games.json');
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const parsedData = JSON.parse(rawData);
  const games = gamesListSchema.parse(parsedData);

  await retryOperation(async () => {
    await prisma.user.upsert({
      where: { email: 'admin@sntopup.com' },
      update: {},
      create: {
        email: 'admin@sntopup.com',
        name: 'Admin User',
        role: 'admin',
      },
    });
  });

  const categoriesMap = new Map<string, string>();
  let catOrder = 1;

  for (const game of games) {
    let catId = categoriesMap.get(game.category);
    if (!catId) {
      const categoryRecord = await retryOperation(async () => {
        return await prisma.gameCategory.upsert({
          where: { slug: game.category.toLowerCase().replace(/[^a-z0-9]+/g, '-') },
          update: { name: game.category },
          create: {
            slug: game.category.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            name: game.category,
            sortOrder: catOrder++,
            active: true,
          },
        });
      });
      catId = categoryRecord.id;
      categoriesMap.set(game.category, catId);
    }

    const gameRecord = await retryOperation(async () => {
      return await prisma.game.upsert({
        where: { slug: game.slug },
        update: {
          name: game.name,
          imageUrl: game.imageUrl ?? null,
          categoryId: catId,
          inputFields: game.inputFields,
          active: true,
        },
        create: {
          slug: game.slug,
          name: game.name,
          imageUrl: game.imageUrl ?? null,
          categoryId: catId,
          inputFields: game.inputFields,
          active: true,
          sortOrder: catOrder,
        },
      });
    });

    for (const prod of game.products) {
      await retryOperation(async () => {
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
