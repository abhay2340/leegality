import { lazy } from "react";

export const ShopHome = lazy(async () => {
  const { ShopHome } = await import("./ShopHome/ShopHome");
  return { default: ShopHome };
});

export const LoginForm = lazy(async () => {
  const { LoginForm } = await import("./Login/Login");
  return { default: LoginForm };
});

export const Dashboard = lazy(async () => {
  const { Dashboard } = await import("./Dashboard");
  return { default: Dashboard };
});

export const ProductListing = lazy(async () => {
  const { ProductListing } = await import("./ProductListing/ProductListing");
  return { default: ProductListing };
});

export const ProductDetails = lazy(async () => {
  const { ProductDetails } = await import("./ProductDetails/ProductDetails");
  return { default: ProductDetails };
});
