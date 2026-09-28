import { useCategories } from "@/features/products/queries/shop-products.query";

interface CategoryFilterProps {
  value: string | null;
  onChange: (category: string | null) => void;
}

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  const { data: categories, isLoading, isError, refetch } = useCategories();

  return (
    <fieldset className="filter-section">
      <legend className="filter-section-title">Category</legend>

      {isLoading && (
        <div className="filter-skeleton-list" aria-busy="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="filter-skeleton-line" />
          ))}
        </div>
      )}

      {isError && (
        <div className="filter-inline-error" role="alert">
          <span>Couldn't load categories.</span>
          <button type="button" onClick={() => void refetch()}>
            Retry
          </button>
        </div>
      )}

      {categories && (
        <div className="filter-option-list">
          <label className="filter-option">
            <input
              type="radio"
              name="category"
              checked={value === null}
              onChange={() => onChange(null)}
            />
            <span>All categories</span>
          </label>
          {categories.map((c) => (
            <label key={c.slug} className="filter-option">
              <input
                type="radio"
                name="category"
                checked={value === c.slug}
                onChange={() => onChange(c.slug)}
              />
              <span>{c.name}</span>
            </label>
          ))}
        </div>
      )}
    </fieldset>
  );
}
