export async function checkCatalogData(
  games: Array<{
    slug: string;
    name: string;
    products: Array<{
      name: string;
      packageType: string;
      sellPriceCents: number;
      costPriceCents: number;
      active: boolean;
    }>;
  }>,
) {
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
      console.error(`[FAIL] Game "${g.slug}" has ${pCount} active products (expected >= ${minExpected}).`);
      hasError = true;
    }

    for (const p of activeProducts) {
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

  return !hasError;
}
