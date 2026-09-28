import { useSearchParams, Link } from "react-router-dom";

import { useShopProducts } from "@/features/products/queries/shop-products.query";
import { ErrorState } from "@/shared/components/ErrorState";
import { ProductGridSkeleton } from "shared/components/Shimmer";
import { ProductCard } from "./ProductCard";
import { ShopHero } from "./ShopHero";
import { ShopCategories } from "@/features/categories/components/ShopCategories";
import { useRecentlyViewed } from "@/shared/hooks/useRecentlyViewed";
import { appPaths } from "@/app/router/paths";

export function ProductCatalog() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const searchParam = searchParams.get("q");

  const { data, isLoading, isError, refetch } = useShopProducts(
    categoryParam,
    searchParam,
  );

  const { recentlyViewed, clearHistory } = useRecentlyViewed();

  const products = data?.products || [];

  if (isLoading) {
    return (
      <div className="shop-home-container">
        {/* If category or search is set, we don't show the hero skeleton placeholder */}
        {!categoryParam && !searchParam && (
          <div
            style={{
              height: "300px",
              background: "var(--color-surface)",
              borderRadius: "24px",
              marginBottom: "40px",
              border: "1px solid var(--color-border)",
            }}
          />
        )}
        <ProductGridSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Could not load products"
        message="There was an issue loading the products catalogue. Please check your connection and try again."
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="shop-home-container">
      {/* Hero Header */}
      {!categoryParam && !searchParam && <ShopHero />}

      {/* Category Showcase Section */}
      {!categoryParam && !searchParam && <ShopCategories />}

      {/* Recently Viewed Section */}
      {!categoryParam && !searchParam && recentlyViewed.length > 0 && (
        <section className="shop-catalog-section" id="recently-viewed" style={{ marginBottom: "64px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "24px" }}>
            <h2 className="catalog-heading" style={{ margin: 0 }}>Recently Viewed</h2>
            <button
              onClick={clearHistory}
              style={{
                background: "transparent",
                border: "none",
                fontSize: "13.5px",
                fontWeight: 600,
                color: "var(--color-primary)",
                cursor: "pointer",
                transition: "opacity 0.2s"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Clear History
            </button>
          </div>
          <div className="recently-viewed-row">
            {recentlyViewed.map((product) => (
              <Link
                key={`recent-${product.id}`}
                to={appPaths.productDetails.replace(":id", String(product.id))}
                className="recently-viewed-card"
              >
                <div className="recent-img-wrapper">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="recent-img"
                    loading="lazy"
                  />
                </div>
                <div className="recent-info">
                  <h3 className="recent-title">{product.title}</h3>
                  <p className="recent-desc">{product.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Catalog Title */}
      <section className="shop-catalog-section" id="trending">
        <h2 className="catalog-heading">
          {searchParam
            ? `Search Results for "${searchParam}"`
            : categoryParam
              ? `Category: ${categoryParam}`
              : "Trending Products"}
        </h2>
        {products.length === 0 ? (
          <div className="shop-no-results">
            <p>No products found matching "{searchParam}".</p>
          </div>
        ) : (
          <div className={!searchParam && !categoryParam ? "trending-products-row" : "products-grid"}>
            {products.map((product) => (
              <ProductCard
                product={product}
                key={product.id}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
