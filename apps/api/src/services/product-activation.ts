export function determineProductActive(isProduction: boolean, supplierSku?: string | null): boolean {
  if (isProduction && (!supplierSku || supplierSku.trim() === '')) {
    return false;
  }
  return true;
}
