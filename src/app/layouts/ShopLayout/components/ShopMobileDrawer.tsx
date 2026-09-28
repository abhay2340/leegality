import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { appPaths } from "@/app/router/paths";

interface ShopMobileDrawerProps {
  categories: string[];
  isMobileMenuOpen: boolean;
  onCloseMobileMenu: () => void;
}

export function ShopMobileDrawer({
  categories,
  isMobileMenuOpen,
  onCloseMobileMenu,
}: ShopMobileDrawerProps) {
  return (
    <>
      {/* Mobile Drawer Navigation */}
      <div className={`shop-mobile-drawer ${isMobileMenuOpen ? "open" : ""}`}>
        <div className="mobile-drawer-header">
          <span className="drawer-title">Navigation</span>
          <button className="close-drawer-btn" onClick={onCloseMobileMenu}>
            <X size={20} />
          </button>
        </div>
        <nav className="mobile-nav">
          <ul className="mobile-nav-list">
            <li>
              <Link
                to={appPaths.home}
                onClick={onCloseMobileMenu}
                className="mobile-nav-link"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to={appPaths.products}
                onClick={onCloseMobileMenu}
                className="mobile-nav-link"
              >
                All Products
              </Link>
            </li>
            <li className="mobile-section-title">Categories</li>
            {categories.map((category) => (
              <li key={category}>
                <Link
                  to={`${appPaths.products}?category=${category.toLowerCase()}`}
                  onClick={onCloseMobileMenu}
                  className="mobile-nav-link sub-link"
                >
                  {category}
                </Link>
              </li>
            ))}
            <li className="mobile-divider" />
            <li>
              <Link
                to={appPaths.dashboard}
                onClick={onCloseMobileMenu}
                className="mobile-nav-link seller-portal"
              >
                Seller Portal (Dashboard)
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="shop-overlay" onClick={onCloseMobileMenu} />
      )}
    </>
  );
}
