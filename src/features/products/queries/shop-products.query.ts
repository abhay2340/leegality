import { useQuery } from "@tanstack/react-query";
import { productApi } from "../api/shop-products.api";
import {
  type ProductsResponse,
  type Product,
  type ProductCategory,
} from "../types/product.model";

export function useShopProducts(
  categoryParam?: string | null,
  searchParam?: string | null,
) {
  return useQuery<ProductsResponse>({
    queryKey: ["shop-products", categoryParam, searchParam],
    queryFn: () => {
      if (searchParam) {
        return productApi.searchProducts(searchParam);
      }
      if (categoryParam) {
        return productApi.getProductsByCategory(categoryParam);
      }
      return productApi.getProducts(12);
    },
  });
}

export function useCategories() {
  return useQuery<ProductCategory[]>({
    queryKey: ["product-categories"],
    queryFn: productApi.getCategories,
    staleTime: Infinity,
  });
}

export function useListingProducts(category: string | null, query: string) {
  const q = query.trim();
  return useQuery<ProductsResponse>({
    queryKey: ["listing-products", category ?? "all", q],
    queryFn: () => productApi.getListingProducts(category, q),
  });
}

export function useDashboardProducts() {
  return useQuery<ProductsResponse>({
    queryKey: ["dashboard-products"],
    queryFn: () => productApi.getProducts(100),
  });
}

export function useProductDetails(id: string | number) {
  return useQuery<Product>({
    queryKey: ["product-details", id],
    queryFn: () => productApi.getProductById(id),
    enabled: !!id,
  });
}
