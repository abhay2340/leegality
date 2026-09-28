import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export interface ListingFilters {
  category: string | null;
  minPrice: string;
  maxPrice: string;
  brands: string[];
  q: string;
  page: number;
}

type FilterPatch = Partial<Omit<ListingFilters, "page">>;

/**
 * Listing filters live in the URL (?category=&minPrice=&maxPrice=&brand=&q=&page=)
 * so they survive navigating to a product and back, page refreshes, and can be shared.
 */
export function useListingFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo<ListingFilters>(() => {
    const page = Number(searchParams.get("page"));
    return {
      category: searchParams.get("category") || null,
      minPrice: searchParams.get("minPrice") ?? "",
      maxPrice: searchParams.get("maxPrice") ?? "",
      brands: searchParams.getAll("brand"),
      q: searchParams.get("q") ?? "",
      page: Number.isInteger(page) && page > 0 ? page : 1,
    };
  }, [searchParams]);

  /** Updates filters and resets pagination to page 1. */
  const updateFilters = useCallback(
    (patch: FilterPatch) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          for (const [key, value] of Object.entries(patch)) {
            if (key === "brands") {
              next.delete("brand");
              (value as string[]).forEach((b) => next.append("brand", b));
            } else if (value === null || value === "") {
              next.delete(key);
            } else {
              next.set(key, String(value));
            }
          }
          next.delete("page");
          return next;
        },
        // Filter tweaks replace the entry so Back from the listing doesn't step through every keystroke.
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const setPage = useCallback(
    (page: number) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (page <= 1) next.delete("page");
        else next.set("page", String(page));
        return next;
      });
    },
    [setSearchParams],
  );

  const clearFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  const hasActiveFilters =
    filters.category !== null ||
    filters.minPrice !== "" ||
    filters.maxPrice !== "" ||
    filters.brands.length > 0 ||
    filters.q !== "";

  return { filters, updateFilters, setPage, clearFilters, hasActiveFilters };
}
