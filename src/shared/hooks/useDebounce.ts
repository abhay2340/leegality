import { useState, useEffect } from "react";

/**
 * Returns a debounced version of `value` that only updates after `delay` ms
 * of inactivity. Useful for search inputs, API calls, etc.
 *
 * @example
 *   const debouncedSearch = useDebounce(searchValue, 400);
 *   useEffect(() => { fetchResults(debouncedSearch); }, [debouncedSearch]);
 */
export function useDebounce<T>(value: T, delay: number = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
