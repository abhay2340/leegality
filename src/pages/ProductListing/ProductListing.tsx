import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import {
  useCategories,
  useListingProducts,
} from "@/features/products/queries/shop-products.query";
import { useListingFilters } from "@/features/products/hooks/useListingFilters";
import {
  filterProducts,
  getBrandOptions,
} from "@/features/products/lib/filterProducts";
import { ProductCard } from "@/features/products/components/ProductCard";
import { FilterSidebar } from "@/features/products/components/filters/FilterSidebar";
import { Pagination } from "@/features/products/components/Pagination";
import { ErrorState } from "@/shared/components/ErrorState";
import "./ProductListing.css";

const PAGE_SIZE = 12;

export function ProductListing() {
  const { filters, updateFilters, setPage, clearFilters, hasActiveFilters } =
    useListingFilters();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const { data, isLoading, isError, refetch, isFetching } = useListingProducts(
    filters.category,
    filters.q,
  );
  const { data: categories } = useCategories();

  const allProducts = useMemo(() => data?.products ?? [], [data]);

  const filteredProducts = useMemo(
    () => filterProducts(allProducts, filters),
    [allProducts, filters],
  );

  const brandOptions = useMemo(
    () =>
      getBrandOptions(
        allProducts,
        filterProducts(allProducts, { ...filters, brands: [] }),
        filters.brands,
      ),
    [allProducts, filters],
  );

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  // Clamp rather than rewrite the URL, so a stale ?page= never shows an empty grid
  const page = Math.min(filters.page, totalPages);
  const pageStart = (page - 1) * PAGE_SIZE;
  const pageProducts = filteredProducts.slice(pageStart, pageStart + PAGE_SIZE);

  const categoryName =
    categories?.find((c) => c.slug === filters.category)?.name ??
    filters.category;

  const handlePageChange = (next: number) => {
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const activeFilterCount =
    (filters.category ? 1 : 0) +
    (filters.minPrice || filters.maxPrice ? 1 : 0) +
    filters.brands.length;

  return (
    <div className="listing-page">
      <header className="listing-header">
        <div>
          <h1 className="listing-title">{categoryName ?? "All Products"}</h1>
          {!isLoading && !isError && (
            <p className="listing-count">
              {filteredProducts.length === 0
                ? "0 results"
                : `Showing ${pageStart + 1}–${pageStart + pageProducts.length} of ${filteredProducts.length} results`}
              {filters.q && <> for “{filters.q}”</>}
            </p>
          )}
        </div>

        <button
          type="button"
          className="listing-mobile-filter-btn"
          onClick={() => setIsMobileFiltersOpen((open) => !open)}
          aria-expanded={isMobileFiltersOpen}
          aria-controls="listing-filters"
        >
          {isMobileFiltersOpen ? <X size={16} /> : <SlidersHorizontal size={16} />}
          Filters
          {activeFilterCount > 0 && (
            <span className="listing-filter-badge">{activeFilterCount}</span>
          )}
        </button>
      </header>

      <div className="listing-layout">
        <aside
          id="listing-filters"
          className={`listing-sidebar ${isMobileFiltersOpen ? "is-open" : ""}`}
          aria-label="Product filters"
        >
          <FilterSidebar
            filters={filters}
            brandOptions={brandOptions}
            isLoadingProducts={isLoading}
            hasActiveFilters={hasActiveFilters}
            onUpdate={updateFilters}
            onClearAll={clearFilters}
          />
        </aside>

        <section className="listing-results" aria-live="polite" aria-busy={isFetching}>
          {isLoading && (
            <div className="listing-grid">
              {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <div key={i} className="product-card shimmer-card" />
              ))}
            </div>
          )}

          {isError && (
            <ErrorState
              title="Could not load products"
              message="Something went wrong while fetching products. Please check your connection and try again."
              onRetry={() => void refetch()}
            />
          )}

          {!isLoading && !isError && filteredProducts.length === 0 && (
            <div className="shop-no-results">
              <p>No products match your filters.</p>
              {hasActiveFilters && (
                <button
                  type="button"
                  className="all-products-retry-btn"
                  onClick={clearFilters}
                  style={{ marginTop: "16px" }}
                >
                  Clear filters
                </button>
              )}
            </div>
          )}

          {!isLoading && !isError && pageProducts.length > 0 && (
            <>
              <div className="listing-grid">
                {pageProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </section>
      </div>
    </div>
  );
}
