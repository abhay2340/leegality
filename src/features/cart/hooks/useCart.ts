import { useAppDispatch, useAppSelector } from "@/app/store";
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  selectCartItems,
  selectCartCount,
  selectCartTotal,
} from "@/features/cart";
import type { Product } from "@/features/products/types/product.model";

/**
 * Encapsulates all cart state and actions in one hook.
 * Components never import raw action creators or selectors directly.
 *
 * @example
 *   const { items, count, total, add, remove, clear } = useCart();
 */
export function useCart() {
  const dispatch = useAppDispatch();

  const items = useAppSelector(selectCartItems);
  const count = useAppSelector(selectCartCount);
  const total = useAppSelector(selectCartTotal);

  const add = (product: Product, quantity: number = 1) =>
    dispatch(addToCart({ product, quantity }));

  const remove = (productId: number) => dispatch(removeFromCart(productId));

  const update = (productId: number, quantity: number) =>
    dispatch(updateQuantity({ productId, quantity }));

  const clear = () => dispatch(clearCart());

  const isInCart = (productId: number) =>
    items.some((item) => item.product.id === productId);

  return { items, count, total, add, remove, update, clear, isInCart };
}
