import { configureStore, type Middleware } from "@reduxjs/toolkit";
import {
  type TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from "react-redux";
import { cartReducer } from "@/features/cart";
import { wishlistReducer } from "@/features/wishlist";
import type { CartState } from "@/features/cart";
import type { WishlistState } from "@/features/wishlist";

// ─── localStorage helpers ───────────────────────────────────────────────────

const CART_KEY = "pulseshop_cart";
const WISHLIST_KEY = "pulseshop_wishlist";

function loadFromStorage<T>(key: string): T | undefined {
  try {
    const serialized = localStorage.getItem(key);
    return serialized ? (JSON.parse(serialized) as T) : undefined;
  } catch {
    return undefined;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore write errors (e.g. private mode quota exceeded)
  }
}

// Middleware that persists cart & wishlist slices after every action
const localStorageMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  const { cart, wishlist } = store.getState();
  saveToStorage(CART_KEY, cart);
  saveToStorage(WISHLIST_KEY, wishlist);
  return result;
};

// ─── Hydrated initial state ──────────────────────────────────────────────────

const preloadedState: { cart: CartState; wishlist: WishlistState } = {
  cart: loadFromStorage<CartState>(CART_KEY) ?? { items: [] },
  wishlist: loadFromStorage<WishlistState>(WISHLIST_KEY) ?? { items: [] },
};

// ─── Store ───────────────────────────────────────────────────────────────────

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
  },
  preloadedState,
  // Keep default middleware and append our persistence layer.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
