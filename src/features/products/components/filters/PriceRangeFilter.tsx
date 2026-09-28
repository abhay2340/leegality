import { useEffect, useState } from "react";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { parsePrice } from "@/features/products/lib/filterProducts";

interface PriceRangeFilterProps {
  minPrice: string;
  maxPrice: string;
  onChange: (minPrice: string, maxPrice: string) => void;
}

export function PriceRangeFilter({
  minPrice,
  maxPrice,
  onChange,
}: PriceRangeFilterProps) {
  const [min, setMin] = useState(minPrice);
  const [max, setMax] = useState(maxPrice);

  // Sync inputs when the URL changes externally (Clear all, back/forward nav)
  const [prev, setPrev] = useState({ minPrice, maxPrice });
  if (prev.minPrice !== minPrice || prev.maxPrice !== maxPrice) {
    setPrev({ minPrice, maxPrice });
    setMin(minPrice);
    setMax(maxPrice);
  }

  // Debounce so the grid updates as the user types without refiltering on every keystroke
  const debouncedMin = useDebounce(min, 350);
  const debouncedMax = useDebounce(max, 350);

  useEffect(() => {
    if (debouncedMin !== minPrice || debouncedMax !== maxPrice) {
      onChange(debouncedMin, debouncedMax);
    }
    // Only react to the user's typing; depending on the props would undo external resets.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedMin, debouncedMax]);

  const minVal = parsePrice(min);
  const maxVal = parsePrice(max);
  const isInvalidRange = minVal !== null && maxVal !== null && minVal > maxVal;

  return (
    <fieldset className="filter-section">
      <legend className="filter-section-title">Price</legend>
      <div className="price-inputs-row">
        <input
          type="number"
          inputMode="decimal"
          min="0"
          placeholder="Min"
          aria-label="Minimum price"
          className="filter-input"
          value={min}
          onChange={(e) => setMin(e.target.value)}
        />
        <span className="price-separator">to</span>
        <input
          type="number"
          inputMode="decimal"
          min="0"
          placeholder="Max"
          aria-label="Maximum price"
          className="filter-input"
          value={max}
          onChange={(e) => setMax(e.target.value)}
        />
      </div>
      {isInvalidRange && (
        <p className="filter-hint error" role="alert">
          Min price is greater than max price.
        </p>
      )}
    </fieldset>
  );
}
