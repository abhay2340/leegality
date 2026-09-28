import { Suspense } from "react";
import { Routes, Route, Navigate, useParams } from "react-router-dom";

import { ShopLayout } from "@/app/layouts/ShopLayout/ShopLayout";
import { AuthLayout } from "@/app/layouts/AuthLayout/AuthLayout";
import { DashboardLayout } from "@/app/layouts/DashboardLayout/DashboardLayout";

import {
  ShopHome,
  LoginForm,
  Dashboard,
  ProductListing,
  ProductDetails,
} from "@/pages/pages";

import { appPaths } from "./paths";
import { PageLoader } from "@/shared/components/PageLoader";

export function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Shop Routes */}
        <Route path={appPaths.home} element={<ShopLayout />}>
          <Route index element={<ShopHome />} />
          <Route path={appPaths.products} element={<ProductListing />} />
          <Route path={appPaths.productDetails} element={<ProductDetails />} />
          {/* Old URLs from earlier builds */}
          <Route
            path="/products/all"
            element={<Navigate to={appPaths.products} replace />}
          />
          <Route path="/products/:id" element={<LegacyProductRedirect />} />
        </Route>

        {/* Auth Routes */}
        <Route path={appPaths.auth} element={<AuthLayout />}>
          <Route index element={<LoginForm />} />
        </Route>

        {/* Dashboard Routes */}
        <Route path={appPaths.dashboard} element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          {/* Fallback sub-routes redirect to main dashboard overview */}
          <Route
            path="*"
            element={<Navigate to={appPaths.dashboard} replace />}
          />
        </Route>

        {/* Global Fallback */}
        <Route path="*" element={<Navigate to={appPaths.home} replace />} />
      </Routes>
    </Suspense>
  );
}

function LegacyProductRedirect() {
  const { id = "" } = useParams();
  return (
    <Navigate to={appPaths.productDetails.replace(":id", id)} replace />
  );
}
