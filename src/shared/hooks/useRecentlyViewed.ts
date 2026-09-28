import { useState, useCallback, useEffect } from "react";
import type { Product } from "@/features/products/types/product.model";

const STORAGE_KEY = "pulseshop_recently_viewed";
const EVENT_NAME = "pulseshop_recently_viewed_updated";
const MAX_ITEMS = 8;

function readFromStorage(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Product[]) : [];
  } catch {
    return [];
  }
}

function writeToStorage(items: Product[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignore quota errors (e.g. private browsing)
  }
}

/**
 * Tracks the last `MAX_ITEMS` (8) products the user has viewed.
 * State is persisted in localStorage so it survives page refreshes.
 * Uses custom window events to synchronize state across all active hooks
 * (e.g., search header dropdown and homepage catalog) without requiring refreshes.
 */
export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>(() =>
    readFromStorage(),
  );

  // Sync hook state whenever another instance dispatches the custom event,
  // or if localStorage changes in another browser tab/window.
  useEffect(() => {
    const handleUpdate = () => {
      setRecentlyViewed(readFromStorage());
    };

    window.addEventListener(EVENT_NAME, handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const trackProduct = useCallback((product: Product) => {
    // Read fresh from storage in case another component updated it recently
    const current = readFromStorage();
    const filtered = current.filter((p) => p.id !== product.id);
    const updated = [product, ...filtered].slice(0, MAX_ITEMS);

    writeToStorage(updated);
    setRecentlyViewed(updated);

    // Notify all other mounted useRecentlyViewed hooks
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  }, []);

  const clearHistory = useCallback(() => {
    writeToStorage([]);
    setRecentlyViewed([]);

    // Notify all other mounted useRecentlyViewed hooks
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  }, []);

  return { recentlyViewed, trackProduct, clearHistory };
}
