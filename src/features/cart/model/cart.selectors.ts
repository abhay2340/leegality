import { createSelector } from "@reduxjs/toolkit";
import { type CartState } from "./types";

export const selectCartState = (state: { cart: CartState }) => state.cart;

export const selectCartItems = createSelector(
  [selectCartState],
  (cart) => cart.items
);

export const selectCartCount = createSelector(
  [selectCartItems],
  (items) => items.reduce((acc, item) => acc + item.quantity, 0)
);

export const selectCartTotal = createSelector(
  [selectCartItems],
  (items) =>
    items.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
);
