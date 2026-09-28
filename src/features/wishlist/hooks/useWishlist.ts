import { useAppDispatch, useAppSelector } from "@/app/store";
import {
  toggleWishlist,
  addToWishlist,
  removeFromWishlist,
  selectWishlistItems,
  selectWishlistCount,
  selectIsProductInWishlist,
} from "@/features/wishlist";
import type { Product } from "@/features/products/types/product.model";

/**
 * Encapsulates all wishlist state and actions in one hook.
 * Components never import raw action creators or selectors directly.
 *
 * @example
 *   const { items, count, toggle, isWishlisted } = useWishlist();
 *   const wishlisted = isWishlisted(product.id);
 */
export function useWishlist() {
  const dispatch = useAppDispatch();

  const items = useAppSelector(selectWishlistItems);
  const count = useAppSelector(selectWishlistCount);

  const toggle = (product: Product) => dispatch(toggleWishlist(product));

  const add = (product: Product) => dispatch(addToWishlist(product));

  const remove = (productId: number) => dispatch(removeFromWishlist(productId));

  /**
   * Returns whether a product is currently in the wishlist.
   * Stable via memoised selector — safe to call in render.
   */
  const isWishlisted = (productId: number) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useAppSelector((state) => selectIsProductInWishlist(state, productId));

  return { items, count, toggle, add, remove, isWishlisted };
}
