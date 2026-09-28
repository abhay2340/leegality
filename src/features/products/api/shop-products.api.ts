import { http } from "@/shared/api";
import {
  type ProductsResponse,
  type Product,
  type ProductCategory,
} from "../types/product.model";

const BASE_URL =
  import.meta.env.VITE_PRODUCTS_API_URL || "https://dummyjson.com/products";

// Only the fields the listing grid needs — keeps the full-catalogue payload ~80KB instead of ~300KB.
const LISTING_FIELDS = [
  "title",
  "description",
  "price",
  "discountPercentage",
  "rating",
  "stock",
  "brand",
  "category",
  "thumbnail",
].join(",");

export const productApi = {
  getProductById: (id: string | number) => {
    return http.get<Product>(`${BASE_URL}/${id}`);
  },

  getProducts: (limit = 12) => {
    return http.get<ProductsResponse>(`${BASE_URL}?limit=${limit}`);
  },

  getCategories: () => {
    return http.get<ProductCategory[]>(`${BASE_URL}/categories`);
  },

  /**
   * Fetches every product for the listing: search results when there is a query,
   * otherwise one category (or the whole catalogue).
   * `limit=0` tells DummyJSON to return all items, so brand/price filtering is accurate
   * across the full result set rather than just the current page.
   */
  getListingProducts: async (category: string | null, query: string) => {
    const params = { limit: 0, select: LISTING_FIELDS };

    if (query) {
      const data = await http.get<ProductsResponse>(`${BASE_URL}/search`, {
        params: { ...params, q: query },
      });
      // /products/search ignores a category param, so narrow the results here
      if (!category) return data;
      const products = data.products.filter((p) => p.category === category);
      return { ...data, products, total: products.length };
    }

    const url = category
      ? `${BASE_URL}/category/${encodeURIComponent(category)}`
      : BASE_URL;
    return http.get<ProductsResponse>(url, { params });
  },

  getProductsByCategory: (category: string) => {
    return http.get<ProductsResponse>(`${BASE_URL}/category/${category}`);
  },

  searchProducts: (query: string) => {
    return http.get<ProductsResponse>(`${BASE_URL}/search?q=${query}`);
  },
};
