export {
  default as cartReducer,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} from "./model/cart.slice";

export {
  selectCartState,
  selectCartItems,
  selectCartCount,
  selectCartTotal,
} from "./model/cart.selectors";

export type { CartItem, CartState } from "./model/types";

export { useCart } from "./hooks/useCart";
