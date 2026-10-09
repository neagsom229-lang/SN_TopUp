import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with 12+ games and packages...');

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@sntopup.com' },
    update: {},
    create: {
      email: 'admin@sntopup.com',
      name: 'System Admin',
      phone: '+85512345678',
      role: 'admin',
    },
  });
  console.log('Created admin:', admin.email);

  const gamesData = [
    {
      slug: 'mobile-legends',
      name: 'Mobile Legends: Bang Bang',
      imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500',
      inputFields: [
        { key: 'playerId', label: { en: 'User ID', km: 'អត្តសញ្ញាណអ្នកលេង (User ID)' }, type: 'text', required: true, placeholder: 'e.g. 12345678' },
        { key: 'serverId', label: { en: 'Zone ID', km: 'លេខ Zone ID' }, type: 'text', required: true, placeholder: 'e.g. 2101' },
      ],
      sortOrder: 1,
      products: [
        { name: '86 Diamonds', supplierSku: 'ML_86', costPriceCents: 90, sellPriceCents: 105, sortOrder: 1 },
        { name: '172 Diamonds', supplierSku: 'ML_172', costPriceCents: 180, sellPriceCents: 210, sortOrder: 2 },
        { name: '257 Diamonds', supplierSku: 'ML_257', costPriceCents: 270, sellPriceCents: 315, sortOrder: 3 },
        { name: '514 Diamonds', supplierSku: 'ML_514', costPriceCents: 540, sellPriceCents: 620, sortOrder: 4 },
        { name: '706 Diamonds', supplierSku: 'ML_706', costPriceCents: 740, sellPriceCents: 850, sortOrder: 5 },
        { name: '2195 Diamonds', supplierSku: 'ML_2195', costPriceCents: 2200, sellPriceCents: 2500, sortOrder: 6 },
      ],
    },
    {
      slug: 'free-fire',
      name: 'Free Fire',
      imageUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=500',
      inputFields: [
        { key: 'playerId', label: { en: 'Player ID', km: 'អត្តសញ្ញាណអ្នកលេង' }, type: 'text', required: true, placeholder: 'e.g. 987654321' },
      ],
      sortOrder: 2,
      products: [
        { name: '100 Diamonds', supplierSku: 'FF_100', costPriceCents: 80, sellPriceCents: 95, sortOrder: 1 },
        { name: '310 Diamonds', supplierSku: 'FF_310', costPriceCents: 240, sellPriceCents: 280, sortOrder: 2 },
        { name: '520 Diamonds', supplierSku: 'FF_520', costPriceCents: 400, sellPriceCents: 460, sortOrder: 3 },
        { name: '1060 Diamonds', supplierSku: 'FF_1060', costPriceCents: 800, sellPriceCents: 920, sortOrder: 4 },
        { name: '2180 Diamonds', supplierSku: 'FF_2180', costPriceCents: 1600, sellPriceCents: 1850, sortOrder: 5 },
        { name: 'Weekly Membership', supplierSku: 'FF_WEEKLY', costPriceCents: 180, sellPriceCents: 210, sortOrder: 6 },
      ],
    },
    {
      slug: 'pubg-mobile',
      name: 'PUBG Mobile',
      imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500',
      inputFields: [
        { key: 'playerId', label: { en: 'Player ID', km: 'អត្តសញ្ញាណអ្នកលេង' }, type: 'text', required: true, placeholder: 'e.g. 5123456789' },
      ],
      sortOrder: 3,
      products: [
        { name: '60 UC', supplierSku: 'PUBG_60', costPriceCents: 90, sellPriceCents: 105, sortOrder: 1 },
        { name: '325 UC', supplierSku: 'PUBG_325', costPriceCents: 450, sellPriceCents: 520, sortOrder: 2 },
        { name: '660 UC', supplierSku: 'PUBG_660', costPriceCents: 900, sellPriceCents: 1040, sortOrder: 3 },
        { name: '1800 UC', supplierSku: 'PUBG_1800', costPriceCents: 2300, sellPriceCents: 2650, sortOrder: 4 },
        { name: '3850 UC', supplierSku: 'PUBG_3850', costPriceCents: 4600, sellPriceCents: 5300, sortOrder: 5 },
        { name: '8100 UC', supplierSku: 'PUBG_8100', costPriceCents: 9200, sellPriceCents: 10600, sortOrder: 6 },
      ],
    },
    {
      slug: 'genshin-impact',
      name: 'Genshin Impact',
      imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500',
      inputFields: [
        { key: 'playerId', label: { en: 'UID', km: 'អត្តសញ្ញាណ UID' }, type: 'text', required: true, placeholder: 'e.g. 801234567' },
        { key: 'serverId', label: { en: 'Server', km: 'ស៊ែរဗာ (Server)' }, type: 'text', required: true, placeholder: 'os_asia / os_usa' },
      ],
      sortOrder: 4,
      products: [
        { name: '60 Genesis Crystals', supplierSku: 'GI_60', costPriceCents: 90, sellPriceCents: 105, sortOrder: 1 },
        { name: '300 Genesis Crystals', supplierSku: 'GI_300', costPriceCents: 450, sellPriceCents: 520, sortOrder: 2 },
        { name: '980 Genesis Crystals', supplierSku: 'GI_980', costPriceCents: 1400, sellPriceCents: 1600, sortOrder: 3 },
        { name: '1980 Genesis Crystals', supplierSku: 'GI_1980', costPriceCents: 2800, sellPriceCents: 3200, sortOrder: 4 },
        { name: 'Blessing of the Welkin Moon', supplierSku: 'GI_WELKIN', costPriceCents: 420, sellPriceCents: 490, sortOrder: 5 },
      ],
    },
    {
      slug: 'honor-of-kings',
      name: 'Honor of Kings',
      imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500',
      inputFields: [
        { key: 'playerId', label: { en: 'Player ID', km: 'អត្តសញ្ញាណអ្នកលេង' }, type: 'text', required: true, placeholder: 'e.g. 12345678' },
      ],
      sortOrder: 5,
      products: [
        { name: '80 Tokens', supplierSku: 'HOK_80', costPriceCents: 90, sellPriceCents: 105, sortOrder: 1 },
        { name: '240 Tokens', supplierSku: 'HOK_240', costPriceCents: 270, sellPriceCents: 315, sortOrder: 2 },
        { name: '400 Tokens', supplierSku: 'HOK_400', costPriceCents: 450, sellPriceCents: 520, sortOrder: 3 },
        { name: '560 Tokens', supplierSku: 'HOK_560', costPriceCents: 630, sellPriceCents: 730, sortOrder: 4 },
        { name: '1200 Tokens', supplierSku: 'HOK_1200', costPriceCents: 1350, sellPriceCents: 1550, sortOrder: 5 },
      ],
    },
    {
      slug: 'call-of-duty-mobile',
      name: 'Call of Duty: Mobile',
      imageUrl: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=500',
      inputFields: [
        { key: 'playerId', label: { en: 'Player ID / OpenID', km: 'OpenID អ្នកលេង' }, type: 'text', required: true, placeholder: 'e.g. 68123456789' },
      ],
      sortOrder: 6,
      products: [
        { name: '80 CP', supplierSku: 'CODM_80', costPriceCents: 90, sellPriceCents: 105, sortOrder: 1 },
        { name: '420 CP', supplierSku: 'CODM_420', costPriceCents: 450, sellPriceCents: 520, sortOrder: 2 },
        { name: '880 CP', supplierSku: 'CODM_880', costPriceCents: 900, sellPriceCents: 1040, sortOrder: 3 },
        { name: '2400 CP', supplierSku: 'CODM_2400', costPriceCents: 2300, sellPriceCents: 2650, sortOrder: 4 },
        { name: '5000 CP', supplierSku: 'CODM_5000', costPriceCents: 4600, sellPriceCents: 5300, sortOrder: 5 },
      ],
    },
    {
      slug: 'honkai-star-rail',
      name: 'Honkai: Star Rail',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500',
      inputFields: [
        { key: 'playerId', label: { en: 'UID', km: 'UID' }, type: 'text', required: true, placeholder: 'e.g. 801234567' },
        { key: 'serverId', label: { en: 'Server', km: 'ស៊ែរဗာ' }, type: 'text', required: true, placeholder: 'os_asia / os_usa' },
      ],
      sortOrder: 7,
      products: [
        { name: '60 Oneiric Shards', supplierSku: 'HSR_60', costPriceCents: 90, sellPriceCents: 105, sortOrder: 1 },
        { name: '300 Oneiric Shards', supplierSku: 'HSR_300', costPriceCents: 450, sellPriceCents: 520, sortOrder: 2 },
        { name: '980 Oneiric Shards', supplierSku: 'HSR_980', costPriceCents: 1400, sellPriceCents: 1600, sortOrder: 3 },
        { name: 'Express Supply Pass', supplierSku: 'HSR_PASS', costPriceCents: 420, sellPriceCents: 490, sortOrder: 4 },
      ],
    },
    {
      slug: 'valorant',
      name: 'Valorant',
      imageUrl: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=500',
      inputFields: [
        { key: 'playerId', label: { en: 'Riot ID (#Tag)', km: 'Riot ID' }, type: 'text', required: true, placeholder: 'e.g. Player#KH1' },
      ],
      sortOrder: 8,
      products: [
        { name: '475 VP', supplierSku: 'VAL_475', costPriceCents: 450, sellPriceCents: 520, sortOrder: 1 },
        { name: '1000 VP', supplierSku: 'VAL_1000', costPriceCents: 900, sellPriceCents: 1040, sortOrder: 2 },
        { name: '2050 VP', supplierSku: 'VAL_2050', costPriceCents: 1800, sellPriceCents: 2100, sortOrder: 3 },
      ],
    },
    {
      slug: 'roblox',
      name: 'Roblox',
      imageUrl: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=500',
      inputFields: [
        { key: 'playerId', label: { en: 'Username', km: 'ឈ្មោះអ្នកប្រើប្រាស់' }, type: 'text', required: true, placeholder: 'e.g. RobloxGamerKH' },
      ],
      sortOrder: 9,
      products: [
        { name: '400 Robux', supplierSku: 'RBX_400', costPriceCents: 450, sellPriceCents: 520, sortOrder: 1 },
        { name: '800 Robux', supplierSku: 'RBX_800', costPriceCents: 900, sellPriceCents: 1040, sortOrder: 2 },
        { name: '1700 Robux', supplierSku: 'RBX_1700', costPriceCents: 1800, sellPriceCents: 2100, sortOrder: 3 },
      ],
    },
    {
      slug: 'clash-of-clans',
      name: 'Clash of Clans',
      imageUrl: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=500',
      inputFields: [
        { key: 'playerId', label: { en: 'Player Tag', km: 'Player Tag (#)' }, type: 'text', required: true, placeholder: 'e.g. #2ABC123' },
      ],
      sortOrder: 10,
      products: [
        { name: '80 Gems', supplierSku: 'COC_80', costPriceCents: 90, sellPriceCents: 105, sortOrder: 1 },
        { name: '500 Gems', supplierSku: 'COC_500', costPriceCents: 450, sellPriceCents: 520, sortOrder: 2 },
        { name: '1200 Gems', supplierSku: 'COC_1200', costPriceCents: 900, sellPriceCents: 1040, sortOrder: 3 },
      ],
    },
    {
      slug: 'clash-royale',
      name: 'Clash Royale',
      imageUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=500',
      inputFields: [
        { key: 'playerId', label: { en: 'Player Tag', km: 'Player Tag (#)' }, type: 'text', required: true, placeholder: 'e.g. #8XYZ987' },
      ],
      sortOrder: 11,
      products: [
        { name: '80 Gems', supplierSku: 'CR_80', costPriceCents: 90, sellPriceCents: 105, sortOrder: 1 },
        { name: '500 Gems', supplierSku: 'CR_500', costPriceCents: 450, sellPriceCents: 520, sortOrder: 2 },
        { name: '1200 Gems', supplierSku: 'CR_1200', costPriceCents: 900, sellPriceCents: 1040, sortOrder: 3 },
      ],
    },
    {
      slug: 'steam-wallet',
      name: 'Steam Wallet USD',
      imageUrl: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=500',
      inputFields: [
        { key: 'playerId', label: { en: 'Email for Code Delivery', km: 'អ៊ីមែល nhận code' }, type: 'text', required: true, placeholder: 'your-email@domain.com' },
      ],
      sortOrder: 12,
      products: [
        { name: '$5 Steam Wallet Code', supplierSku: 'STEAM_5', costPriceCents: 480, sellPriceCents: 500, sortOrder: 1 },
        { name: '$10 Steam Wallet Code', supplierSku: 'STEAM_10', costPriceCents: 960, sellPriceCents: 1000, sortOrder: 2 },
        { name: '$20 Steam Wallet Code', supplierSku: 'STEAM_20', costPriceCents: 1920, sellPriceCents: 2000, sortOrder: 3 },
      ],
    },
  ];

  for (const g of gamesData) {
    const { products, ...gameInfo } = g;
    const game = await prisma.game.upsert({
      where: { slug: gameInfo.slug },
      update: { name: gameInfo.name, imageUrl: gameInfo.imageUrl, inputFields: gameInfo.inputFields, sortOrder: gameInfo.sortOrder },
      create: gameInfo,
    });

    for (const p of products) {
      // Check if product exists by supplierSku
      const existingProd = await prisma.product.findFirst({ where: { supplierSku: p.supplierSku } });
      if (!existingProd) {
        await prisma.product.create({
          data: {
            gameId: game.id,
            ...p,
            active: true,
          },
        });
      }
    }
  }

  // Sample Promo Code
  await prisma.promoCode.upsert({
    where: { code: 'SNWELCOME' },
    update: {},
    create: {
      code: 'SNWELCOME',
      discountType: 'percentage',
      discountValue: 10,
      maxUses: 1000,
      usedCount: 0,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      active: true,
    },
  });

  console.log('Seeding finished successfully for 12 games.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
