import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface SeedProduct {
  name: string;
  supplierSku: string;
  costPriceCents: number;
  sellPriceCents: number;
  packageType: 'currency' | 'pass' | 'bundle';
  badge?: 'popular' | 'best_value' | 'hot' | null;
  unitAmount?: number | null;
  unitLabel?: string | null;
  groupLabel?: string | null;
  sortOrder: number;
}

interface SeedGame {
  slug: string;
  name: string;
  imageUrl: string;
  category: string;
  inputFields: Array<{
    key: string;
    label: { en: string; km: string };
    type: string;
    required: boolean;
    placeholder?: string;
  }>;
  products: SeedProduct[];
}

const gamesData: SeedGame[] = [
  {
    slug: 'clash-of-clans',
    name: 'Clash of Clans',
    imageUrl: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=500',
    category: 'Mobile Games',
    inputFields: [
      { key: 'playerId', label: { en: 'Player Tag (#TAG)', km: 'ស្លាកអ្នកលេង (#TAG)' }, type: 'text', required: true, placeholder: '#2PP0Q8' }
    ],
    products: [
      { name: '80 Gems', supplierSku: 'COC_80', costPriceCents: 80, sellPriceCents: 99, packageType: 'currency', badge: 'popular', unitAmount: 80, unitLabel: 'Gems', groupLabel: 'Gems', sortOrder: 1 },
      { name: '500 Gems', supplierSku: 'COC_500', costPriceCents: 450, sellPriceCents: 499, packageType: 'currency', badge: null, unitAmount: 500, unitLabel: 'Gems', groupLabel: 'Gems', sortOrder: 2 },
      { name: '1200 Gems', supplierSku: 'COC_1200', costPriceCents: 900, sellPriceCents: 999, packageType: 'currency', badge: 'best_value', unitAmount: 1200, unitLabel: 'Gems', groupLabel: 'Gems', sortOrder: 3 },
      { name: '2500 Gems', supplierSku: 'COC_2500', costPriceCents: 1800, sellPriceCents: 1999, packageType: 'currency', badge: null, unitAmount: 2500, unitLabel: 'Gems', groupLabel: 'Gems', sortOrder: 4 },
      { name: '6500 Gems', supplierSku: 'COC_6500', costPriceCents: 4500, sellPriceCents: 4999, packageType: 'currency', badge: null, unitAmount: 6500, unitLabel: 'Gems', groupLabel: 'Gems', sortOrder: 5 },
      { name: '14000 Gems', supplierSku: 'COC_14000', costPriceCents: 9000, sellPriceCents: 9999, packageType: 'currency', badge: 'hot', unitAmount: 14000, unitLabel: 'Gems', groupLabel: 'Gems', sortOrder: 6 },
      { name: 'Gold Pass', supplierSku: 'COC_PASS_GOLD', costPriceCents: 600, sellPriceCents: 699, packageType: 'pass', badge: 'popular', groupLabel: 'Season Pass', sortOrder: 7 },
      { name: 'Builder Pack (DEMO)', supplierSku: 'COC_BUNDLE_BUILDER', costPriceCents: 1200, sellPriceCents: 1499, packageType: 'bundle', badge: null, groupLabel: 'Bundles', sortOrder: 8 },
      { name: 'Heroic Pack (DEMO)', supplierSku: 'COC_BUNDLE_HERO', costPriceCents: 2000, sellPriceCents: 2499, packageType: 'bundle', badge: null, groupLabel: 'Bundles', sortOrder: 9 },
      { name: 'Town Hall Special (DEMO)', supplierSku: 'COC_BUNDLE_TH', costPriceCents: 3500, sellPriceCents: 3999, packageType: 'bundle', badge: 'best_value', groupLabel: 'Bundles', sortOrder: 10 },
      { name: 'Champion Statue Pack (DEMO)', supplierSku: 'COC_BUNDLE_STATUE', costPriceCents: 4500, sellPriceCents: 4999, packageType: 'bundle', badge: null, groupLabel: 'Bundles', sortOrder: 11 },
    ]
  },
  {
    slug: 'clash-royale',
    name: 'Clash Royale',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500',
    category: 'Mobile Games',
    inputFields: [
      { key: 'playerId', label: { en: 'Player Tag (#TAG)', km: 'ស្លាកអ្នកលេង (#TAG)' }, type: 'text', required: true, placeholder: '#2ABC9' }
    ],
    products: [
      { name: '80 Gems', supplierSku: 'CR_80', costPriceCents: 80, sellPriceCents: 99, packageType: 'currency', badge: null, unitAmount: 80, unitLabel: 'Gems', groupLabel: 'Gems', sortOrder: 1 },
      { name: '500 Gems', supplierSku: 'CR_500', costPriceCents: 450, sellPriceCents: 499, packageType: 'currency', badge: 'popular', unitAmount: 500, unitLabel: 'Gems', groupLabel: 'Gems', sortOrder: 2 },
      { name: '1200 Gems', supplierSku: 'CR_1200', costPriceCents: 900, sellPriceCents: 999, packageType: 'currency', badge: null, unitAmount: 1200, unitLabel: 'Gems', groupLabel: 'Gems', sortOrder: 3 },
      { name: '2500 Gems', supplierSku: 'CR_2500', costPriceCents: 1800, sellPriceCents: 1999, packageType: 'currency', badge: 'best_value', unitAmount: 2500, unitLabel: 'Gems', groupLabel: 'Gems', sortOrder: 4 },
      { name: '6500 Gems', supplierSku: 'CR_6500', costPriceCents: 4500, sellPriceCents: 4999, packageType: 'currency', badge: null, unitAmount: 6500, unitLabel: 'Gems', groupLabel: 'Gems', sortOrder: 5 },
      { name: '14000 Gems', supplierSku: 'CR_14000', costPriceCents: 9000, sellPriceCents: 9999, packageType: 'currency', badge: null, unitAmount: 14000, unitLabel: 'Gems', groupLabel: 'Gems', sortOrder: 6 },
      { name: 'Pass Royale', supplierSku: 'CR_PASS_ROYALE', costPriceCents: 500, sellPriceCents: 599, packageType: 'pass', badge: 'popular', groupLabel: 'Pass', sortOrder: 7 },
      { name: 'Arena Bundle (DEMO)', supplierSku: 'CR_BUNDLE_ARENA', costPriceCents: 1000, sellPriceCents: 1299, packageType: 'bundle', badge: null, groupLabel: 'Bundles', sortOrder: 8 },
      { name: 'Champion Chest Pack (DEMO)', supplierSku: 'CR_BUNDLE_CHEST', costPriceCents: 1500, sellPriceCents: 1799, packageType: 'bundle', badge: null, groupLabel: 'Bundles', sortOrder: 9 },
      { name: 'Royal Wild Pack (DEMO)', supplierSku: 'CR_BUNDLE_WILD', costPriceCents: 2000, sellPriceCents: 2299, packageType: 'bundle', badge: null, groupLabel: 'Bundles', sortOrder: 10 },
    ]
  },
  {
    slug: 'mobile-legends',
    name: 'Mobile Legends: Bang Bang',
    imageUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=500',
    category: 'Mobile Games',
    inputFields: [
      { key: 'playerId', label: { en: 'User ID', km: 'អត្តសញ្ញាណអ្នកប្រើប្រាស់' }, type: 'text', required: true, placeholder: '12345678' },
      { key: 'serverId', label: { en: 'Zone ID', km: 'តំបន់' }, type: 'text', required: true, placeholder: '2101' }
    ],
    products: [
      { name: '86 Diamonds', supplierSku: 'ML_86', costPriceCents: 120, sellPriceCents: 135, packageType: 'currency', badge: 'popular', unitAmount: 86, unitLabel: 'Diamonds', groupLabel: 'Diamonds', sortOrder: 1 },
      { name: '172 Diamonds', supplierSku: 'ML_172', costPriceCents: 240, sellPriceCents: 269, packageType: 'currency', badge: null, unitAmount: 172, unitLabel: 'Diamonds', groupLabel: 'Diamonds', sortOrder: 2 },
      { name: '257 Diamonds', supplierSku: 'ML_257', costPriceCents: 360, sellPriceCents: 399, packageType: 'currency', badge: null, unitAmount: 257, unitLabel: 'Diamonds', groupLabel: 'Diamonds', sortOrder: 3 },
      { name: '344 Diamonds', supplierSku: 'ML_344', costPriceCents: 480, sellPriceCents: 529, packageType: 'currency', badge: 'best_value', unitAmount: 344, unitLabel: 'Diamonds', groupLabel: 'Diamonds', sortOrder: 4 },
      { name: '706 Diamonds', supplierSku: 'ML_706', costPriceCents: 980, sellPriceCents: 1049, packageType: 'currency', badge: null, unitAmount: 706, unitLabel: 'Diamonds', groupLabel: 'Diamonds', sortOrder: 5 },
      { name: '2195 Diamonds', supplierSku: 'ML_2195', costPriceCents: 2900, sellPriceCents: 3099, packageType: 'currency', badge: null, unitAmount: 2195, unitLabel: 'Diamonds', groupLabel: 'Diamonds', sortOrder: 6 },
      { name: 'Weekly Diamond Pass', supplierSku: 'ML_WEEKLY_PASS', costPriceCents: 180, sellPriceCents: 199, packageType: 'pass', badge: 'popular', groupLabel: 'Pass', sortOrder: 7 },
      { name: 'Twilight Pass', supplierSku: 'ML_TWILIGHT_PASS', costPriceCents: 850, sellPriceCents: 999, packageType: 'pass', badge: null, groupLabel: 'Pass', sortOrder: 8 },
      { name: 'Starlight Bundle (DEMO)', supplierSku: 'ML_BUNDLE_STARLIGHT', costPriceCents: 900, sellPriceCents: 1099, packageType: 'bundle', badge: null, groupLabel: 'Bundles', sortOrder: 9 },
      { name: 'Collector Skin Pack (DEMO)', supplierSku: 'ML_BUNDLE_COLLECTOR', costPriceCents: 3500, sellPriceCents: 3999, packageType: 'bundle', badge: 'hot', groupLabel: 'Bundles', sortOrder: 10 },
    ]
  },
  {
    slug: 'free-fire',
    name: 'Free Fire',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500',
    category: 'Mobile Games',
    inputFields: [
      { key: 'playerId', label: { en: 'Player ID', km: 'អត្តសញ្ញាណអ្នកលេង' }, type: 'text', required: true, placeholder: '987654321' }
    ],
    products: [
      { name: '100 Diamonds', supplierSku: 'FF_100', costPriceCents: 90, sellPriceCents: 99, packageType: 'currency', badge: null, unitAmount: 100, unitLabel: 'Diamonds', groupLabel: 'Diamonds', sortOrder: 1 },
      { name: '210 Diamonds', supplierSku: 'FF_210', costPriceCents: 180, sellPriceCents: 199, packageType: 'currency', badge: 'popular', unitAmount: 210, unitLabel: 'Diamonds', groupLabel: 'Diamonds', sortOrder: 2 },
      { name: '530 Diamonds', supplierSku: 'FF_530', costPriceCents: 450, sellPriceCents: 499, packageType: 'currency', badge: null, unitAmount: 530, unitLabel: 'Diamonds', groupLabel: 'Diamonds', sortOrder: 3 },
      { name: '1080 Diamonds', supplierSku: 'FF_1080', costPriceCents: 900, sellPriceCents: 999, packageType: 'currency', badge: 'best_value', unitAmount: 1080, unitLabel: 'Diamonds', groupLabel: 'Diamonds', sortOrder: 4 },
      { name: '2200 Diamonds', supplierSku: 'FF_2200', costPriceCents: 1800, sellPriceCents: 1999, packageType: 'currency', badge: null, unitAmount: 2200, unitLabel: 'Diamonds', groupLabel: 'Diamonds', sortOrder: 5 },
      { name: 'Weekly Membership', supplierSku: 'FF_WEEKLY', costPriceCents: 180, sellPriceCents: 199, packageType: 'pass', badge: 'popular', groupLabel: 'Pass', sortOrder: 6 },
      { name: 'Monthly Membership', supplierSku: 'FF_MONTHLY', costPriceCents: 850, sellPriceCents: 999, packageType: 'pass', badge: null, groupLabel: 'Pass', sortOrder: 7 },
      { name: 'Level-up Pass (DEMO)', supplierSku: 'FF_BUNDLE_LEVEL', costPriceCents: 150, sellPriceCents: 199, packageType: 'bundle', badge: null, groupLabel: 'Bundles', sortOrder: 8 },
      { name: 'Booyah Pass Bundle (DEMO)', supplierSku: 'FF_BUNDLE_BOOYAH', costPriceCents: 500, sellPriceCents: 599, packageType: 'bundle', badge: null, groupLabel: 'Bundles', sortOrder: 9 },
      { name: 'Evo Gun Crate Pack (DEMO)', supplierSku: 'FF_BUNDLE_EVO', costPriceCents: 2000, sellPriceCents: 2299, packageType: 'bundle', badge: null, groupLabel: 'Bundles', sortOrder: 10 },
    ]
  },
  {
    slug: 'pubg-mobile',
    name: 'PUBG Mobile',
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500',
    category: 'Mobile Games',
    inputFields: [
      { key: 'playerId', label: { en: 'Character ID', km: 'អត្តសញ្ញាណតួអង្គ' }, type: 'text', required: true, placeholder: '5123456789' }
    ],
    products: [
      { name: '60 UC', supplierSku: 'PUBG_60', costPriceCents: 90, sellPriceCents: 99, packageType: 'currency', badge: null, unitAmount: 60, unitLabel: 'UC', groupLabel: 'UC', sortOrder: 1 },
      { name: '325 UC', supplierSku: 'PUBG_325', costPriceCents: 450, sellPriceCents: 499, packageType: 'currency', badge: 'popular', unitAmount: 325, unitLabel: 'UC', groupLabel: 'UC', sortOrder: 2 },
      { name: '660 UC', supplierSku: 'PUBG_660', costPriceCents: 900, sellPriceCents: 999, packageType: 'currency', badge: null, unitAmount: 660, unitLabel: 'UC', groupLabel: 'UC', sortOrder: 3 },
      { name: '1800 UC', supplierSku: 'PUBG_1800', costPriceCents: 2300, sellPriceCents: 2499, packageType: 'currency', badge: 'best_value', unitAmount: 1800, unitLabel: 'UC', groupLabel: 'UC', sortOrder: 4 },
      { name: '3850 UC', supplierSku: 'PUBG_3850', costPriceCents: 4600, sellPriceCents: 4999, packageType: 'currency', badge: null, unitAmount: 3850, unitLabel: 'UC', groupLabel: 'UC', sortOrder: 5 },
      { name: '8100 UC', supplierSku: 'PUBG_8100', costPriceCents: 9200, sellPriceCents: 9999, packageType: 'currency', badge: 'hot', unitAmount: 8100, unitLabel: 'UC', groupLabel: 'UC', sortOrder: 6 },
      { name: 'Royale Pass', supplierSku: 'PUBG_RP', costPriceCents: 900, sellPriceCents: 999, packageType: 'pass', badge: 'popular', groupLabel: 'Pass', sortOrder: 7 },
      { name: 'Elite Pass Plus (DEMO)', supplierSku: 'PUBG_RP_PLUS', costPriceCents: 2500, sellPriceCents: 2799, packageType: 'pass', badge: null, groupLabel: 'Pass', sortOrder: 8 },
      { name: 'M416 Glacier Pack (DEMO)', supplierSku: 'PUBG_BUNDLE_GLACIER', costPriceCents: 3500, sellPriceCents: 3999, packageType: 'bundle', badge: null, groupLabel: 'Bundles', sortOrder: 9 },
      { name: 'X-Suit Pharaoh Pack (DEMO)', supplierSku: 'PUBG_BUNDLE_XSUIT', costPriceCents: 5000, sellPriceCents: 5499, packageType: 'bundle', badge: 'hot', groupLabel: 'Bundles', sortOrder: 10 },
    ]
  },
  {
    slug: 'genshin-impact',
    name: 'Genshin Impact',
    imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500',
    category: 'PC & Mobile',
    inputFields: [
      { key: 'playerId', label: { en: 'UID', km: 'លេខសម្គាល់ UID' }, type: 'text', required: true, placeholder: '800123456' },
      { key: 'serverId', label: { en: 'Server', km: 'ស៊ើវើ' }, type: 'text', required: true, placeholder: 'os_asia' }
    ],
    products: [
      { name: '60 Genesis Crystals', supplierSku: 'GENSHIN_60', costPriceCents: 90, sellPriceCents: 99, packageType: 'currency', badge: null, unitAmount: 60, unitLabel: 'Crystals', groupLabel: 'Crystals', sortOrder: 1 },
      { name: '300 Genesis Crystals', supplierSku: 'GENSHIN_300', costPriceCents: 450, sellPriceCents: 499, packageType: 'currency', badge: null, unitAmount: 300, unitLabel: 'Crystals', groupLabel: 'Crystals', sortOrder: 2 },
      { name: '980 Genesis Crystals', supplierSku: 'GENSHIN_980', costPriceCents: 1400, sellPriceCents: 1499, packageType: 'currency', badge: 'best_value', unitAmount: 980, unitLabel: 'Crystals', groupLabel: 'Crystals', sortOrder: 3 },
      { name: '1980 Genesis Crystals', supplierSku: 'GENSHIN_1980', costPriceCents: 2800, sellPriceCents: 2999, packageType: 'currency', badge: null, unitAmount: 1980, unitLabel: 'Crystals', groupLabel: 'Crystals', sortOrder: 4 },
      { name: '3280 Genesis Crystals', supplierSku: 'GENSHIN_3280', costPriceCents: 4600, sellPriceCents: 4999, packageType: 'currency', badge: null, unitAmount: 3280, unitLabel: 'Crystals', groupLabel: 'Crystals', sortOrder: 5 },
      { name: '6480 Genesis Crystals', supplierSku: 'GENSHIN_6480', costPriceCents: 9200, sellPriceCents: 9999, packageType: 'currency', badge: 'hot', unitAmount: 6480, unitLabel: 'Crystals', groupLabel: 'Crystals', sortOrder: 6 },
      { name: 'Welkin Moon', supplierSku: 'GENSHIN_WELKIN', costPriceCents: 450, sellPriceCents: 499, packageType: 'pass', badge: 'popular', groupLabel: 'Pass', sortOrder: 7 },
      { name: 'Battle Pass (DEMO)', supplierSku: 'GENSHIN_BP', costPriceCents: 900, sellPriceCents: 999, packageType: 'pass', badge: null, groupLabel: 'Pass', sortOrder: 8 },
      { name: 'Starter Resource Bundle (DEMO)', supplierSku: 'GENSHIN_BUNDLE_START', costPriceCents: 500, sellPriceCents: 599, packageType: 'bundle', badge: null, groupLabel: 'Bundles', sortOrder: 9 },
      { name: 'Primogem Special Pack (DEMO)', supplierSku: 'GENSHIN_BUNDLE_PRIMO', costPriceCents: 1500, sellPriceCents: 1799, packageType: 'bundle', badge: null, groupLabel: 'Bundles', sortOrder: 10 },
    ]
  },
  {
    slug: 'honor-of-kings',
    name: 'Honor of Kings',
    imageUrl: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=500',
    category: 'Mobile Games',
    inputFields: [
      { key: 'playerId', label: { en: 'Player ID', km: 'អត្តសញ្ញាណអ្នកលេង' }, type: 'text', required: true, placeholder: '12345678' }
    ],
    products: [
      { name: '80 Tokens', supplierSku: 'HOK_80', costPriceCents: 80, sellPriceCents: 99, packageType: 'currency', badge: null, unitAmount: 80, unitLabel: 'Tokens', groupLabel: 'Tokens', sortOrder: 1 },
      { name: '240 Tokens', supplierSku: 'HOK_240', costPriceCents: 230, sellPriceCents: 269, packageType: 'currency', badge: 'popular', unitAmount: 240, unitLabel: 'Tokens', groupLabel: 'Tokens', sortOrder: 2 },
      { name: '560 Tokens', supplierSku: 'HOK_560', costPriceCents: 520, sellPriceCents: 599, packageType: 'currency', badge: null, unitAmount: 560, unitLabel: 'Tokens', groupLabel: 'Tokens', sortOrder: 3 },
      { name: '1200 Tokens', supplierSku: 'HOK_1200', costPriceCents: 1100, sellPriceCents: 1199, packageType: 'currency', badge: 'best_value', unitAmount: 1200, unitLabel: 'Tokens', groupLabel: 'Tokens', sortOrder: 4 },
      { name: '2500 Tokens', supplierSku: 'HOK_2500', costPriceCents: 2300, sellPriceCents: 2499, packageType: 'currency', badge: null, unitAmount: 2500, unitLabel: 'Tokens', groupLabel: 'Tokens', sortOrder: 5 },
      { name: '6000 Tokens', supplierSku: 'HOK_6000', costPriceCents: 5500, sellPriceCents: 5999, packageType: 'currency', badge: null, unitAmount: 6000, unitLabel: 'Tokens', groupLabel: 'Tokens', sortOrder: 6 },
      { name: 'Battle Pass', supplierSku: 'HOK_PASS', costPriceCents: 500, sellPriceCents: 599, packageType: 'pass', badge: 'popular', groupLabel: 'Pass', sortOrder: 7 },
      { name: 'Hero Bundle (DEMO)', supplierSku: 'HOK_BUNDLE', costPriceCents: 1000, sellPriceCents: 1199, packageType: 'bundle', badge: null, groupLabel: 'Bundles', sortOrder: 8 },
      { name: 'Skin Chest Pack (DEMO)', supplierSku: 'HOK_BUNDLE_SKIN', costPriceCents: 1800, sellPriceCents: 1999, packageType: 'bundle', badge: null, groupLabel: 'Bundles', sortOrder: 9 },
      { name: 'Deluxe Arcana Pack (DEMO)', supplierSku: 'HOK_BUNDLE_ARCANA', costPriceCents: 2500, sellPriceCents: 2799, packageType: 'bundle', badge: null, groupLabel: 'Bundles', sortOrder: 10 },
    ]
  },
  {
    slug: 'brawl-stars',
    name: 'Brawl Stars',
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500',
    category: 'Mobile Games',
    inputFields: [
      { key: 'playerId', label: { en: 'Player Tag (#TAG)', km: 'ស្លាកអ្នកលេង (#TAG)' }, type: 'text', required: true, placeholder: '#8P2Q' }
    ],
    products: [
      { name: '30 Gems', supplierSku: 'BS_30', costPriceCents: 80, sellPriceCents: 99, packageType: 'currency', badge: null, unitAmount: 30, unitLabel: 'Gems', groupLabel: 'Gems', sortOrder: 1 },
      { name: '80 Gems', supplierSku: 'BS_80', costPriceCents: 190, sellPriceCents: 219, packageType: 'currency', badge: 'popular', unitAmount: 80, unitLabel: 'Gems', groupLabel: 'Gems', sortOrder: 2 },
      { name: '170 Gems', supplierSku: 'BS_170', costPriceCents: 380, sellPriceCents: 419, packageType: 'currency', badge: null, unitAmount: 170, unitLabel: 'Gems', groupLabel: 'Gems', sortOrder: 3 },
      { name: '360 Gems', supplierSku: 'BS_360', costPriceCents: 750, sellPriceCents: 799, packageType: 'currency', badge: 'best_value', unitAmount: 360, unitLabel: 'Gems', groupLabel: 'Gems', sortOrder: 4 },
      { name: '950 Gems', supplierSku: 'BS_950', costPriceCents: 1800, sellPriceCents: 1999, packageType: 'currency', badge: null, unitAmount: 950, unitLabel: 'Gems', groupLabel: 'Gems', sortOrder: 5 },
      { name: '2000 Gems', supplierSku: 'BS_2000', costPriceCents: 3600, sellPriceCents: 3999, packageType: 'currency', badge: null, unitAmount: 2000, unitLabel: 'Gems', groupLabel: 'Gems', sortOrder: 6 },
      { name: 'Brawl Pass', supplierSku: 'BS_PASS', costPriceCents: 650, sellPriceCents: 699, packageType: 'pass', badge: 'popular', groupLabel: 'Pass', sortOrder: 7 },
      { name: 'Brawl Pass Plus (DEMO)', supplierSku: 'BS_PASS_PLUS', costPriceCents: 950, sellPriceCents: 999, packageType: 'pass', badge: null, groupLabel: 'Pass', sortOrder: 8 },
      { name: 'Starter Bundle (DEMO)', supplierSku: 'BS_BUNDLE', costPriceCents: 400, sellPriceCents: 499, packageType: 'bundle', badge: null, groupLabel: 'Bundles', sortOrder: 9 },
      { name: 'Mega Box Pack (DEMO)', supplierSku: 'BS_BUNDLE_MEGA', costPriceCents: 1200, sellPriceCents: 1399, packageType: 'bundle', badge: null, groupLabel: 'Bundles', sortOrder: 10 },
    ]
  },
  {
    slug: 'league-of-legends-wild-rift',
    name: 'League of Legends: Wild Rift',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500',
    category: 'Mobile & PC',
    inputFields: [
      { key: 'playerId', label: { en: 'Riot ID (Name#Tag)', km: 'Riot ID (ឈ្មោះ#តេក)' }, type: 'text', required: true, placeholder: 'Player#KH1' }
    ],
    products: [
      { name: '425 Wild Cores', supplierSku: 'WR_425', costPriceCents: 450, sellPriceCents: 499, packageType: 'currency', badge: null, unitAmount: 425, unitLabel: 'Wild Cores', groupLabel: 'Wild Cores', sortOrder: 1 },
      { name: '1000 Wild Cores', supplierSku: 'WR_1000', costPriceCents: 950, sellPriceCents: 1049, packageType: 'currency', badge: 'popular', unitAmount: 1000, unitLabel: 'Wild Cores', groupLabel: 'Wild Cores', sortOrder: 2 },
      { name: '2050 Wild Cores', supplierSku: 'WR_2050', costPriceCents: 1900, sellPriceCents: 2099, packageType: 'currency', badge: 'best_value', unitAmount: 2050, unitLabel: 'Wild Cores', groupLabel: 'Wild Cores', sortOrder: 3 },
      { name: '3500 Wild Cores', supplierSku: 'WR_3500', costPriceCents: 3200, sellPriceCents: 3499, packageType: 'currency', badge: null, unitAmount: 3500, unitLabel: 'Wild Cores', groupLabel: 'Wild Cores', sortOrder: 4 },
      { name: '5350 Wild Cores', supplierSku: 'WR_5350', costPriceCents: 4800, sellPriceCents: 5299, packageType: 'currency', badge: null, unitAmount: 5350, unitLabel: 'Wild Cores', groupLabel: 'Wild Cores', sortOrder: 5 },
      { name: 'Wild Pass', supplierSku: 'WR_PASS', costPriceCents: 550, sellPriceCents: 599, packageType: 'pass', badge: 'popular', groupLabel: 'Pass', sortOrder: 6 },
      { name: 'Wild Pass Elite (DEMO)', supplierSku: 'WR_PASS_ELITE', costPriceCents: 950, sellPriceCents: 999, packageType: 'pass', badge: null, groupLabel: 'Pass', sortOrder: 7 },
      { name: 'Champion Bundle (DEMO)', supplierSku: 'WR_BUNDLE_CHAMP', costPriceCents: 1200, sellPriceCents: 1499, packageType: 'bundle', badge: null, groupLabel: 'Bundles', sortOrder: 8 },
      { name: 'Skin Chest Pack (DEMO)', supplierSku: 'WR_BUNDLE_SKIN', costPriceCents: 2500, sellPriceCents: 2799, packageType: 'bundle', badge: null, groupLabel: 'Bundles', sortOrder: 9 },
    ]
  },
  {
    slug: 'call-of-duty-mobile',
    name: 'Call of Duty: Mobile',
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500',
    category: 'Mobile Games',
    inputFields: [
      { key: 'playerId', label: { en: 'OpenID / UID', km: 'OpenID / UID' }, type: 'text', required: true, placeholder: '1234567890' }
    ],
    products: [
      { name: '80 CP', supplierSku: 'CODM_80', costPriceCents: 90, sellPriceCents: 99, packageType: 'currency', badge: null, unitAmount: 80, unitLabel: 'CP', groupLabel: 'CP', sortOrder: 1 },
      { name: '420 CP', supplierSku: 'CODM_420', costPriceCents: 450, sellPriceCents: 499, packageType: 'currency', badge: 'popular', unitAmount: 420, unitLabel: 'CP', groupLabel: 'CP', sortOrder: 2 },
      { name: '880 CP', supplierSku: 'CODM_880', costPriceCents: 900, sellPriceCents: 999, packageType: 'currency', badge: null, unitAmount: 880, unitLabel: 'CP', groupLabel: 'CP', sortOrder: 3 },
      { name: '2400 CP', supplierSku: 'CODM_2400', costPriceCents: 2300, sellPriceCents: 2499, packageType: 'currency', badge: 'best_value', unitAmount: 2400, unitLabel: 'CP', groupLabel: 'CP', sortOrder: 4 },
      { name: '5000 CP', supplierSku: 'CODM_5000', costPriceCents: 4600, sellPriceCents: 4999, packageType: 'currency', badge: null, unitAmount: 5000, unitLabel: 'CP', groupLabel: 'CP', sortOrder: 5 },
      { name: 'Battle Pass', supplierSku: 'CODM_BP', costPriceCents: 500, sellPriceCents: 599, packageType: 'pass', badge: 'popular', groupLabel: 'Pass', sortOrder: 6 },
      { name: 'Premium Pass Bundle (DEMO)', supplierSku: 'CODM_BP_BUNDLE', costPriceCents: 1200, sellPriceCents: 1299, packageType: 'pass', badge: null, groupLabel: 'Pass', sortOrder: 7 },
      { name: 'Operator Crate Pack (DEMO)', supplierSku: 'CODM_BUNDLE', costPriceCents: 1800, sellPriceCents: 1999, packageType: 'bundle', badge: null, groupLabel: 'Bundles', sortOrder: 8 },
      { name: 'Legendary Draw Pack (DEMO)', supplierSku: 'CODM_BUNDLE_DRAW', costPriceCents: 3500, sellPriceCents: 3999, packageType: 'bundle', badge: 'hot', groupLabel: 'Bundles', sortOrder: 9 },
    ]
  },
  {
    slug: 'honkai-star-rail',
    name: 'Honkai: Star Rail',
    imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500',
    category: 'PC & Mobile',
    inputFields: [
      { key: 'playerId', label: { en: 'UID', km: 'លេខសម្គាល់ UID' }, type: 'text', required: true, placeholder: '800123456' },
      { key: 'serverId', label: { en: 'Server', km: 'ស៊ើវើ' }, type: 'text', required: true, placeholder: 'os_asia' }
    ],
    products: [
      { name: '60 Oneiric Shards', supplierSku: 'HSR_60', costPriceCents: 90, sellPriceCents: 99, packageType: 'currency', badge: null, unitAmount: 60, unitLabel: 'Shards', groupLabel: 'Shards', sortOrder: 1 },
      { name: '300 Oneiric Shards', supplierSku: 'HSR_300', costPriceCents: 450, sellPriceCents: 499, packageType: 'currency', badge: null, unitAmount: 300, unitLabel: 'Shards', groupLabel: 'Shards', sortOrder: 2 },
      { name: '980 Oneiric Shards', supplierSku: 'HSR_980', costPriceCents: 1400, sellPriceCents: 1499, packageType: 'currency', badge: 'best_value', unitAmount: 980, unitLabel: 'Shards', groupLabel: 'Shards', sortOrder: 3 },
      { name: '1980 Oneiric Shards', supplierSku: 'HSR_1980', costPriceCents: 2800, sellPriceCents: 2999, packageType: 'currency', badge: null, unitAmount: 1980, unitLabel: 'Shards', groupLabel: 'Shards', sortOrder: 4 },
      { name: '3280 Oneiric Shards', supplierSku: 'HSR_3280', costPriceCents: 4600, sellPriceCents: 4999, packageType: 'currency', badge: null, unitAmount: 3280, unitLabel: 'Shards', groupLabel: 'Shards', sortOrder: 5 },
      { name: 'Express Supply Pass', supplierSku: 'HSR_SUPPLY', costPriceCents: 450, sellPriceCents: 499, packageType: 'pass', badge: 'popular', groupLabel: 'Pass', sortOrder: 6 },
      { name: 'Nameless Glory (DEMO)', supplierSku: 'HSR_BP', costPriceCents: 900, sellPriceCents: 999, packageType: 'pass', badge: null, groupLabel: 'Pass', sortOrder: 7 },
      { name: 'Stellar Bundle (DEMO)', supplierSku: 'HSR_BUNDLE', costPriceCents: 1500, sellPriceCents: 1799, packageType: 'bundle', badge: null, groupLabel: 'Bundles', sortOrder: 8 },
    ]
  },
  {
    slug: 'valorant',
    name: 'Valorant',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500',
    category: 'PC Games',
    inputFields: [
      { key: 'playerId', label: { en: 'Riot ID (Name#Tag)', km: 'Riot ID (ឈ្មោះ#តេក)' }, type: 'text', required: true, placeholder: 'Player#KH1' }
    ],
    products: [
      { name: '475 VP', supplierSku: 'VAL_475', costPriceCents: 450, sellPriceCents: 499, packageType: 'currency', badge: null, unitAmount: 475, unitLabel: 'VP', groupLabel: 'VP', sortOrder: 1 },
      { name: '1000 VP', supplierSku: 'VAL_1000', costPriceCents: 950, sellPriceCents: 1049, packageType: 'currency', badge: 'popular', unitAmount: 1000, unitLabel: 'VP', groupLabel: 'VP', sortOrder: 2 },
      { name: '2050 VP', supplierSku: 'VAL_2050', costPriceCents: 1900, sellPriceCents: 2099, packageType: 'currency', badge: 'best_value', unitAmount: 2050, unitLabel: 'VP', groupLabel: 'VP', sortOrder: 3 },
      { name: '3650 VP', supplierSku: 'VAL_3650', costPriceCents: 3400, sellPriceCents: 3699, packageType: 'currency', badge: null, unitAmount: 3650, unitLabel: 'VP', groupLabel: 'VP', sortOrder: 4 },
      { name: '5350 VP', supplierSku: 'VAL_5350', costPriceCents: 4800, sellPriceCents: 5299, packageType: 'currency', badge: null, unitAmount: 5350, unitLabel: 'VP', groupLabel: 'VP', sortOrder: 5 },
      { name: 'Battle Pass (DEMO)', supplierSku: 'VAL_BP', costPriceCents: 950, sellPriceCents: 999, packageType: 'pass', badge: null, groupLabel: 'Pass', sortOrder: 6 },
      { name: 'Agent Unlock Pack (DEMO)', supplierSku: 'VAL_BUNDLE_AGENT', costPriceCents: 1500, sellPriceCents: 1799, packageType: 'bundle', badge: null, groupLabel: 'Bundles', sortOrder: 7 },
      { name: 'Night Market Skin Pack (DEMO)', supplierSku: 'VAL_BUNDLE_SKIN', costPriceCents: 2500, sellPriceCents: 2999, packageType: 'bundle', badge: 'hot', groupLabel: 'Bundles', sortOrder: 8 },
    ]
  },
  {
    slug: 'roblox',
    name: 'Roblox',
    imageUrl: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=500',
    category: 'PC & Mobile',
    inputFields: [
      { key: 'playerId', label: { en: 'Username', km: 'ឈ្មោះអ្នកប្រើប្រាស់' }, type: 'text', required: true, placeholder: 'RobloxUser' }
    ],
    products: [
      { name: '400 Robux', supplierSku: 'RBX_400', costPriceCents: 450, sellPriceCents: 499, packageType: 'currency', badge: null, unitAmount: 400, unitLabel: 'Robux', groupLabel: 'Robux', sortOrder: 1 },
      { name: '800 Robux', supplierSku: 'RBX_800', costPriceCents: 900, sellPriceCents: 999, packageType: 'currency', badge: 'popular', unitAmount: 800, unitLabel: 'Robux', groupLabel: 'Robux', sortOrder: 2 },
      { name: '1700 Robux', supplierSku: 'RBX_1700', costPriceCents: 1800, sellPriceCents: 1999, packageType: 'currency', badge: 'best_value', unitAmount: 1700, unitLabel: 'Robux', groupLabel: 'Robux', sortOrder: 3 },
      { name: '4500 Robux', supplierSku: 'RBX_4500', costPriceCents: 4600, sellPriceCents: 4999, packageType: 'currency', badge: null, unitAmount: 4500, unitLabel: 'Robux', groupLabel: 'Robux', sortOrder: 4 },
      { name: '10000 Robux', supplierSku: 'RBX_10000', costPriceCents: 9500, sellPriceCents: 9999, packageType: 'currency', badge: null, unitAmount: 10000, unitLabel: 'Robux', groupLabel: 'Robux', sortOrder: 5 },
      { name: 'Roblox Premium (DEMO)', supplierSku: 'RBX_PREM', costPriceCents: 900, sellPriceCents: 999, packageType: 'pass', badge: null, groupLabel: 'Pass', sortOrder: 6 },
      { name: 'Avatar Customizer Pack (DEMO)', supplierSku: 'RBX_BUNDLE_AVATAR', costPriceCents: 1200, sellPriceCents: 1499, packageType: 'bundle', badge: null, groupLabel: 'Bundles', sortOrder: 7 },
      { name: 'Gamepass Bundle (DEMO)', supplierSku: 'RBX_BUNDLE_GAMEPASS', costPriceCents: 2000, sellPriceCents: 2299, packageType: 'bundle', badge: null, groupLabel: 'Bundles', sortOrder: 8 },
    ]
  },
  {
    slug: 'steam-wallet',
    name: 'Steam Wallet USD',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500',
    category: 'PC Gift Cards',
    inputFields: [
      { key: 'playerId', label: { en: 'Steam Account Email / Username', km: 'អ៊ីមែល ឬឈ្មោះគណនី Steam' }, type: 'text', required: true, placeholder: 'steam_user' }
    ],
    products: [
      { name: '$5 Steam Gift Card', supplierSku: 'STEAM_5', costPriceCents: 480, sellPriceCents: 500, packageType: 'currency', badge: null, unitAmount: 5, unitLabel: 'USD', groupLabel: 'Gift Cards', sortOrder: 1 },
      { name: '$10 Steam Gift Card', supplierSku: 'STEAM_10', costPriceCents: 960, sellPriceCents: 1000, packageType: 'currency', badge: 'popular', unitAmount: 10, unitLabel: 'USD', groupLabel: 'Gift Cards', sortOrder: 2 },
      { name: '$20 Steam Gift Card', supplierSku: 'STEAM_20', costPriceCents: 1900, sellPriceCents: 2000, packageType: 'currency', badge: 'best_value', unitAmount: 20, unitLabel: 'USD', groupLabel: 'Gift Cards', sortOrder: 3 },
      { name: '$50 Steam Gift Card', supplierSku: 'STEAM_50', costPriceCents: 4750, sellPriceCents: 5000, packageType: 'currency', badge: null, unitAmount: 50, unitLabel: 'USD', groupLabel: 'Gift Cards', sortOrder: 4 },
      { name: '$100 Steam Gift Card', supplierSku: 'STEAM_100', costPriceCents: 9500, sellPriceCents: 10000, packageType: 'currency', badge: null, unitAmount: 100, unitLabel: 'USD', groupLabel: 'Gift Cards', sortOrder: 5 },
      { name: 'Summer Sale Bundle (DEMO)', supplierSku: 'STEAM_BUNDLE_SUMMER', costPriceCents: 2500, sellPriceCents: 2699, packageType: 'bundle', badge: null, groupLabel: 'Bundles', sortOrder: 6 },
    ]
  },
  {
    slug: 'ea-sports-fc-mobile',
    name: 'EA Sports FC Mobile',
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500',
    category: 'Mobile Games',
    inputFields: [
      { key: 'playerId', label: { en: 'User ID', km: 'លេខសម្គាល់អ្នកប្រើប្រាស់' }, type: 'text', required: true, placeholder: '12345678' }
    ],
    products: [
      { name: '100 FC Points', supplierSku: 'FC_100', costPriceCents: 90, sellPriceCents: 99, packageType: 'currency', badge: null, unitAmount: 100, unitLabel: 'Points', groupLabel: 'Points', sortOrder: 1 },
      { name: '500 FC Points', supplierSku: 'FC_500', costPriceCents: 450, sellPriceCents: 499, packageType: 'currency', badge: 'popular', unitAmount: 500, unitLabel: 'Points', groupLabel: 'Points', sortOrder: 2 },
      { name: '1050 FC Points', supplierSku: 'FC_1050', costPriceCents: 900, sellPriceCents: 999, packageType: 'currency', badge: 'best_value', unitAmount: 1050, unitLabel: 'Points', groupLabel: 'Points', sortOrder: 3 },
      { name: '2200 FC Points', supplierSku: 'FC_2200', costPriceCents: 1800, sellPriceCents: 1999, packageType: 'currency', badge: null, unitAmount: 2200, unitLabel: 'Points', groupLabel: 'Points', sortOrder: 4 },
      { name: '4600 FC Points', supplierSku: 'FC_4600', costPriceCents: 3600, sellPriceCents: 3999, packageType: 'currency', badge: null, unitAmount: 4600, unitLabel: 'Points', groupLabel: 'Points', sortOrder: 5 },
      { name: 'Star Pass', supplierSku: 'FC_PASS', costPriceCents: 900, sellPriceCents: 999, packageType: 'pass', badge: null, groupLabel: 'Pass', sortOrder: 6 },
      { name: 'Ultimate Team Pack (DEMO)', supplierSku: 'FC_BUNDLE', costPriceCents: 1500, sellPriceCents: 1799, packageType: 'bundle', badge: null, groupLabel: 'Bundles', sortOrder: 7 },
    ]
  },
  {
    slug: 'ragnarok-origin',
    name: 'Ragnarok Origin',
    imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500',
    category: 'Mobile Games',
    inputFields: [
      { key: 'playerId', label: { en: 'Role ID', km: 'លេខសម្គាល់តួអង្គ' }, type: 'text', required: true, placeholder: '12345678' },
      { key: 'serverId', label: { en: 'Server', km: 'ស៊ើវើ' }, type: 'text', required: true, placeholder: 'RO-Asia1' }
    ],
    products: [
      { name: '60 Nyan Berry', supplierSku: 'RO_60', costPriceCents: 90, sellPriceCents: 99, packageType: 'currency', badge: null, unitAmount: 60, unitLabel: 'Berries', groupLabel: 'Berries', sortOrder: 1 },
      { name: '300 Nyan Berry', supplierSku: 'RO_300', costPriceCents: 450, sellPriceCents: 499, packageType: 'currency', badge: 'popular', unitAmount: 300, unitLabel: 'Berries', groupLabel: 'Berries', sortOrder: 2 },
      { name: '680 Nyan Berry', supplierSku: 'RO_680', costPriceCents: 980, sellPriceCents: 1049, packageType: 'currency', badge: 'best_value', unitAmount: 680, unitLabel: 'Berries', groupLabel: 'Berries', sortOrder: 3 },
      { name: '1280 Nyan Berry', supplierSku: 'RO_1280', costPriceCents: 1800, sellPriceCents: 1999, packageType: 'currency', badge: null, unitAmount: 1280, unitLabel: 'Berries', groupLabel: 'Berries', sortOrder: 4 },
      { name: '3280 Nyan Berry', supplierSku: 'RO_3280', costPriceCents: 4600, sellPriceCents: 4999, packageType: 'currency', badge: null, unitAmount: 3280, unitLabel: 'Berries', groupLabel: 'Berries', sortOrder: 5 },
      { name: 'Nyan Pass', supplierSku: 'RO_PASS', costPriceCents: 900, sellPriceCents: 999, packageType: 'pass', badge: null, groupLabel: 'Pass', sortOrder: 6 },
      { name: 'Valhalla Chest Pack (DEMO)', supplierSku: 'RO_BUNDLE', costPriceCents: 1500, sellPriceCents: 1799, packageType: 'bundle', badge: null, groupLabel: 'Bundles', sortOrder: 7 },
    ]
  }
];

async function main() {
  console.log('Seeding database idempotently with 16 games and rich package catalogs...');

  await prisma.user.upsert({
    where: { email: 'admin@sntopup.com' },
    update: {},
    create: {
      email: 'admin@sntopup.com',
      name: 'System Admin',
      phone: '+85512345678',
      role: 'admin',
    },
  });
  console.log('Created/verified admin: admin@sntopup.com');

  for (const g of gamesData) {
    const game = await prisma.game.upsert({
      where: { slug: g.slug },
      update: {
        name: g.name,
        imageUrl: g.imageUrl,
        inputFields: g.inputFields as any,
        active: true,
      },
      create: {
        slug: g.slug,
        name: g.name,
        imageUrl: g.imageUrl,
        inputFields: g.inputFields as any,
        active: true,
      },
    });

    for (const p of g.products) {
      await prisma.product.upsert({
        where: { id: `prod-${game.slug}-${p.supplierSku}` },
        update: {
          name: p.name,
          costPriceCents: p.costPriceCents,
          sellPriceCents: p.sellPriceCents,
          packageType: p.packageType,
          badge: p.badge,
          bonusLabel: p.bonusLabel || null,
          unitAmount: p.unitAmount || null,
          unitLabel: p.unitLabel || null,
          groupLabel: p.groupLabel || null,
          sortOrder: p.sortOrder,
          active: true,
        },
        create: {
          id: `prod-${game.slug}-${p.supplierSku}`,
          gameId: game.id,
          name: p.name,
          supplierSku: p.supplierSku,
          costPriceCents: p.costPriceCents,
          sellPriceCents: p.sellPriceCents,
          packageType: p.packageType,
          badge: p.badge,
          bonusLabel: p.bonusLabel || null,
          unitAmount: p.unitAmount || null,
          unitLabel: p.unitLabel || null,
          groupLabel: p.groupLabel || null,
          sortOrder: p.sortOrder,
          active: true,
        },
      });
    }
  }

  console.log(`Seeding finished successfully for ${gamesData.length} games.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
