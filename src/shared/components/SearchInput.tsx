import { useState, useRef, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Search, Clock, X } from "lucide-react";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useRecentlyViewed } from "@/shared/hooks/useRecentlyViewed";
import { appPaths } from "@/app/router/paths";

interface SearchInputProps {
  className?: string;
  placeholder?: string;
  /** Debounce delay in ms before syncing to ?q= URL param (default: 400ms). */
  debounceMs?: number;
}

/**
 * Search input with:
 * 1. Debounced URL sync via `?q=` param — shareable / bookmarkable results.
 * 2. Focus dropdown showing the last 5 recently viewed products.
 * 3. Clears the dropdown when the user starts typing.
 */
export function SearchInput({
  className = "shop-search-bar",
  placeholder = "Search brands, products...",
  debounceMs = 400,
}: SearchInputProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const currentQuery = searchParams.get("q") ?? "";
  const [value, setValue] = useState(currentQuery);
  const [isFocused, setIsFocused] = useState(false);

  const { recentlyViewed, clearHistory } = useRecentlyViewed();

  // Sync input when URL param changes externally (back/forward nav)
  const [prevQuery, setPrevQuery] = useState(currentQuery);
  if (currentQuery !== prevQuery) {
    setPrevQuery(currentQuery);
    setValue(currentQuery);
  }

  const debouncedValue = useDebounce(value, debounceMs);

  // Sync debounced value to URL
  useEffect(() => {
    if (debouncedValue === currentQuery) return;

    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (debouncedValue.trim()) {
        next.set("q", debouncedValue);
      } else {
        next.delete("q");
      }
      next.delete("page");
      return next;
    });

    const isProductPage =
      window.location.pathname === "/" ||
      window.location.pathname === appPaths.products;

    if (!isProductPage) {
      navigate(
        debouncedValue.trim()
          ? `${appPaths.products}?q=${encodeURIComponent(debouncedValue)}`
          : appPaths.products,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Show dropdown: focused + no text typed + has recent items
  const showDropdown =
    isFocused && value.trim() === "" && recentlyViewed.length > 0;

  return (
    <div className={`${className} search-wrapper`} ref={wrapperRef}>
      <Search className="shop-search-icon" size={18} />
      <input
        id="search-input"
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        placeholder={placeholder}
        className="shop-search-input"
        aria-label="Search products"
        aria-expanded={showDropdown}
        aria-haspopup="listbox"
        autoComplete="off"
      />

      {/* Clear button when text is typed */}
      {value && (
        <button
          className="search-clear-btn"
          onClick={() => {
            setValue("");
            setSearchParams((prev) => {
              const next = new URLSearchParams(prev);
              next.delete("q");
              return next;
            });
          }}
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}

      {/* Recently viewed dropdown */}
      {showDropdown && (
        <div
          className="search-dropdown"
          role="listbox"
          aria-label="Recently viewed products"
        >
          <div className="search-dropdown-header">
            <span className="search-dropdown-label">
              <Clock size={13} />
              Recently Viewed
            </span>
            <button
              className="search-dropdown-clear"
              onClick={(e) => {
                e.stopPropagation();
                clearHistory();
              }}
              aria-label="Clear history"
            >
              Clear
            </button>
          </div>

          {recentlyViewed.map((product) => (
            <Link
              key={product.id}
              to={appPaths.productDetails.replace(":id", String(product.id))}
              className="search-dropdown-item"
              onClick={() => setIsFocused(false)}
              role="option"
            >
              <img
                src={product.thumbnail}
                alt={product.title}
                className="search-dropdown-thumb"
              />
              <div className="search-dropdown-info">
                <span className="search-dropdown-title">{product.title}</span>
                <span className="search-dropdown-price">
                  ${product.price.toFixed(2)}
                  <em className="search-dropdown-category">
                    {product.category}
                  </em>
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
