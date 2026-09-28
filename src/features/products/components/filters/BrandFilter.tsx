import { useState } from "react";
import type { BrandOption } from "@/features/products/lib/filterProducts";

interface BrandFilterProps {
  options: BrandOption[];
  selected: string[];
  isLoading: boolean;
  onChange: (brands: string[]) => void;
}

const SEARCH_THRESHOLD = 8;

export function BrandFilter({
  options,
  selected,
  isLoading,
  onChange,
}: BrandFilterProps) {
  const [search, setSearch] = useState("");

  const visibleOptions = search.trim()
    ? options.filter((o) =>
        o.name.toLowerCase().includes(search.trim().toLowerCase()),
      )
    : options;

  const toggle = (brand: string) => {
    onChange(
      selected.includes(brand)
        ? selected.filter((b) => b !== brand)
        : [...selected, brand],
    );
  };

  return (
    <fieldset className="filter-section">
      <legend className="filter-section-title">
        Brand
        {selected.length > 0 && (
          <button
            type="button"
            className="filter-section-clear"
            onClick={() => onChange([])}
          >
            Clear
          </button>
        )}
      </legend>

      {isLoading && (
        <div className="filter-skeleton-list" aria-busy="true">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="filter-skeleton-line" />
          ))}
        </div>
      )}

      {!isLoading && options.length === 0 && (
        <p className="filter-hint">No brands for these products.</p>
      )}

      {!isLoading && options.length > SEARCH_THRESHOLD && (
        <input
          type="search"
          className="filter-input filter-brand-search"
          placeholder="Search brands"
          aria-label="Search brands"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      )}

      {!isLoading && options.length > 0 && (
        <div className="filter-option-list">
          {visibleOptions.map((o) => {
            const isChecked = selected.includes(o.name);
            return (
              <label
                key={o.name}
                className={`filter-option ${o.count === 0 && !isChecked ? "is-empty" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  disabled={o.count === 0 && !isChecked}
                  onChange={() => toggle(o.name)}
                />
                <span>{o.name}</span>
                <span className="filter-option-count">{o.count}</span>
              </label>
            );
          })}
          {visibleOptions.length === 0 && (
            <p className="filter-hint">No brands match "{search}".</p>
          )}
        </div>
      )}
    </fieldset>
  );
}
