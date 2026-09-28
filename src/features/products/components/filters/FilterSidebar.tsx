import type { ListingFilters } from "@/features/products/hooks/useListingFilters";
import type { BrandOption } from "@/features/products/lib/filterProducts";
import { CategoryFilter } from "./CategoryFilter";
import { PriceRangeFilter } from "./PriceRangeFilter";
import { BrandFilter } from "./BrandFilter";

interface FilterSidebarProps {
  filters: ListingFilters;
  brandOptions: BrandOption[];
  isLoadingProducts: boolean;
  hasActiveFilters: boolean;
  onUpdate: (patch: Partial<Omit<ListingFilters, "page">>) => void;
  onClearAll: () => void;
}

export function FilterSidebar({
  filters,
  brandOptions,
  isLoadingProducts,
  hasActiveFilters,
  onUpdate,
  onClearAll,
}: FilterSidebarProps) {
  return (
    <div className="filter-sidebar">
      <div className="filter-sidebar-header">
        <h2>Filters</h2>
        {hasActiveFilters && (
          <button type="button" className="filter-clear-all" onClick={onClearAll}>
            Clear all
          </button>
        )}
      </div>

      <CategoryFilter
        value={filters.category}
        // Brands are category-specific, so drop brand selections when the category changes
        onChange={(category) => onUpdate({ category, brands: [] })}
      />

      <PriceRangeFilter
        minPrice={filters.minPrice}
        maxPrice={filters.maxPrice}
        onChange={(minPrice, maxPrice) => onUpdate({ minPrice, maxPrice })}
      />

      <BrandFilter
        // Reset the brand search box when the category (and so the brand list) changes
        key={filters.category ?? "all"}
        options={brandOptions}
        selected={filters.brands}
        isLoading={isLoadingProducts}
        onChange={(brands) => onUpdate({ brands })}
      />
    </div>
  );
}
