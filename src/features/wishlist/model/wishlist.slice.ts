import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type Product } from "@/features/products/types/product.model";
import { type WishlistState } from "./types";

const initialState: WishlistState = {
  items: [],
};

export const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    toggleWishlist: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      const index = state.items.findIndex((item) => item.id === product.id);

      if (index >= 0) {
        // Remove
        state.items.splice(index, 1);
      } else {
        // Add
        state.items.push(product);
      }
    },
    addToWishlist: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      const exists = state.items.some((item) => item.id === product.id);
      if (!exists) {
        state.items.push(product);
      }
    },
    removeFromWishlist: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const { toggleWishlist, addToWishlist, removeFromWishlist } =
  wishlistSlice.actions;

export default wishlistSlice.reducer;
