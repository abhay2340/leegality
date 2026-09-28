export {
  default as wishlistReducer,
  toggleWishlist,
  addToWishlist,
  removeFromWishlist,
} from "./model/wishlist.slice";

export {
  selectWishlistState,
  selectWishlistItems,
  selectWishlistCount,
  selectIsProductInWishlist,
} from "./model/wishlist.selectors";

export type { WishlistState } from "./model/types";

export { useWishlist } from "./hooks/useWishlist";
