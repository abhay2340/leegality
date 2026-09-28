export const appPaths = {
  home: "/",
  products: "/products",
  productDetails: "/product/:id",
  auth: "/auth",
  dashboard: "/dashboard",
} as const;

export type AppPath = (typeof appPaths)[keyof typeof appPaths];

export const appNestedPaths = {
  dashboard: "dashboard",
} as const;

export type NestedPath = (typeof appNestedPaths)[keyof typeof appNestedPaths];

export const DASHBOARD_PATHS = {
  overview: "/dashboard",
  products: "/dashboard/products",
  categories: "/dashboard/categories",
  inventory: "/dashboard/inventory",
  customers: "/dashboard/customers",
  settings: "/dashboard/settings",
  allProducts: "/products",
} as const;

export type DashboardPath =
  (typeof DASHBOARD_PATHS)[keyof typeof DASHBOARD_PATHS];
