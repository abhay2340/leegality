import type { Product } from "../types/product.model";

export interface ClientFilters {
  minPrice: string;
  maxPrice: string;
  brands: string[];
}

export function parsePrice(value: string): number | null {
  if (value.trim() === "") return null;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

/**
 * Applies the filters DummyJSON can't do server-side (price, brand).
 * Category and text search are handled by the API.
 * All filters combine with AND; multiple brands combine with OR.
 */
export function filterProducts(
  products: Product[],
  { minPrice, maxPrice, brands }: ClientFilters,
): Product[] {
  const min = parsePrice(minPrice);
  const max = parsePrice(maxPrice);
  const brandSet = new Set(brands);

  return products.filter((p) => {
    if (min !== null && p.price < min) return false;
    if (max !== null && p.price > max) return false;
    if (brandSet.size > 0 && !(p.brand && brandSet.has(p.brand))) return false;
    return true;
  });
}

export interface BrandOption {
  name: string;
  count: number;
}

/**
 * Unique brands in the fetched products. Counts reflect the other active
 * filter (price) so users can see how many results a brand would give.
 * Selected brands are always kept so they can be unchecked.
 */
export function getBrandOptions(
  allProducts: Product[],
  productsMatchingOtherFilters: Product[],
  selectedBrands: string[],
): BrandOption[] {
  const counts = new Map<string, number>();
  for (const p of allProducts) {
    if (p.brand) counts.set(p.brand, 0);
  }
  for (const b of selectedBrands) {
    if (!counts.has(b)) counts.set(b, 0);
  }
  for (const p of productsMatchingOtherFilters) {
    if (p.brand) counts.set(p.brand, (counts.get(p.brand) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
