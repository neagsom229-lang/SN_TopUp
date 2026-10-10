import { describe, it, expect } from 'vitest';

// Unit tests for unit-price calculation and package grouping logic
function computeUnitPrice(sellPriceCents: number, unitAmount?: number | null) {
  if (!unitAmount || unitAmount <= 0) return null;
  return Math.round((sellPriceCents / unitAmount) * 100) / 100;
}

function groupProducts(
  products: Array<{ packageType: string; name: string; [key: string]: unknown }>,
) {
  return {
    currency: products.filter((p) => p.packageType === 'currency'),
    pass: products.filter((p) => p.packageType === 'pass'),
    bundle: products.filter((p) => p.packageType === 'bundle'),
  };
}

describe('Catalog Unit Price & Package Grouping Logic', () => {
  it('computes per-unit price correctly', () => {
    expect(computeUnitPrice(105, 86)).toBe(1.22);
    expect(computeUnitPrice(210, 172)).toBe(1.22);
    expect(computeUnitPrice(100, 0)).toBeNull();
    expect(computeUnitPrice(100, null)).toBeNull();
  });

  it('groups products by packageType correctly', () => {
    const products = [
      { id: '1', name: '86 Gems', packageType: 'currency' },
      { id: '2', name: 'Brawl Pass', packageType: 'pass' },
      { id: '3', name: 'Starter Bundle', packageType: 'bundle' },
    ];
    const grouped = groupProducts(products);
    expect(grouped.currency).toHaveLength(1);
    expect(grouped.pass).toHaveLength(1);
    expect(grouped.bundle).toHaveLength(1);
    expect(grouped.currency[0].name).toBe('86 Gems');
  });
});
