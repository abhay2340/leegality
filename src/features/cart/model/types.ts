import { type Product } from "@/features/products/types/product.model";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
}
