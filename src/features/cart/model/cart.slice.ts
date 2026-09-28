import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type Product } from "@/features/products/types/product.model";
import { type CartState } from "./types";

const initialState: CartState = {
  items: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{ product: Product; quantity: number }>,
    ) => {
      const { product, quantity } = action.payload;
      const existingItem = state.items.find(
        (item) => item.product.id === product.id,
      );

      if (existingItem) {
        // Increment quantity
        const newQty = existingItem.quantity + quantity;
        // Limit to stock if stock is defined and greater than 0
        const stockLimit =
          product.stock !== undefined ? product.stock : Infinity;
        existingItem.quantity = Math.min(newQty, stockLimit);
      } else {
        // Add new item
        state.items.push({ product, quantity });
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(
        (item) => item.product.id !== action.payload,
      );
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ productId: number; quantity: number }>,
    ) => {
      const { productId, quantity } = action.payload;
      const existingItem = state.items.find(
        (item) => item.product.id === productId,
      );

      if (existingItem) {
        const stockLimit =
          existingItem.product.stock !== undefined
            ? existingItem.product.stock
            : Infinity;
        existingItem.quantity = Math.max(1, Math.min(quantity, stockLimit));
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
