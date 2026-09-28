import { createSelector } from "@reduxjs/toolkit";
import { type WishlistState } from "./types";

export const selectWishlistState = (state: { wishlist: WishlistState }) =>
  state.wishlist;

export const selectWishlistItems = createSelector(
  [selectWishlistState],
  (wishlist) => wishlist.items,
);

export const selectWishlistCount = createSelector(
  [selectWishlistItems],
  (items) => items.length,
);

export const selectIsProductInWishlist = createSelector(
  [selectWishlistItems, (_state, id: number) => id],
  (items, id) => items.some((item) => item.id === id),
);
