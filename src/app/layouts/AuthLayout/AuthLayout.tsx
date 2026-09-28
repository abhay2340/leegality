import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { PageLoader } from "shared/components/PageLoader";
import "./AuthLayout.css";

export function AuthLayout() {
  return (
    <div className="auth-layout-container">
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </div>
  );
}
