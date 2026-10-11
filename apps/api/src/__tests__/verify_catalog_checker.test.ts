import { describe, it, expect } from 'vitest';
import { checkCatalogData } from '../services/catalog-checker.js';

describe('Verify Catalog Checker Unit Test', () => {
  it('fails when a game has fewer than 8 products', async () => {
    const failingFixture = [
      {
        slug: 'test-game',
        name: 'Test Game',
        products: [
          {
            name: 'P1',
            packageType: 'currency',
            sellPriceCents: 100,
            costPriceCents: 90,
            active: true,
          },
        ],
      },
    ];
    const result = await checkCatalogData(failingFixture as any);
    expect(result).toBe(false);
  });
});
