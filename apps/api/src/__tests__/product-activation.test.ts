import { describe, it, expect } from 'vitest';
import { determineProductActive } from '../services/product-activation.js';

describe('Product Activation Rule', () => {
  it('sets product inactive in production when supplierSku is missing or empty', () => {
    expect(determineProductActive(true, null)).toBe(false);
    expect(determineProductActive(true, undefined)).toBe(false);
    expect(determineProductActive(true, '')).toBe(false);
    expect(determineProductActive(true, '   ')).toBe(false);
  });

  it('sets product active in production when supplierSku is present', () => {
    expect(determineProductActive(true, 'ML_86')).toBe(true);
  });

  it('sets product active in development even when supplierSku is missing', () => {
    expect(determineProductActive(false, null)).toBe(true);
    expect(determineProductActive(false, undefined)).toBe(true);
    expect(determineProductActive(false, '')).toBe(true);
  });
});
