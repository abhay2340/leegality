import { Link, useLocation } from "react-router-dom";
import {
  ShoppingBag,
  ShoppingCart,
  User,
  Menu,
  X,
  Heart,
  ChevronDown,
} from "lucide-react";
import { SearchInput } from "@/shared/components/SearchInput";
import { appPaths } from "@/app/router/paths";

interface ShopHeaderProps {
  categories: string[];
  cartCount: number;
  favoritesCount: number;
  isMobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
}

export function ShopHeader({
  categories,
  cartCount,
  favoritesCount,
  isMobileMenuOpen,
  onToggleMobileMenu,
  onOpenCart,
  onOpenWishlist,
}: ShopHeaderProps) {
  const location = useLocation();

  return (
    <header className="shop-header">
      <div className="shop-header-wrapper">
        {/* Logo */}
        <Link to={appPaths.home} className="shop-logo">
          <ShoppingBag className="shop-logo-icon" size={26} />
          <span className="shop-logo-text">
            Pulse<span className="gradient-text">Shop</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="shop-desktop-nav">
          <ul className="shop-nav-list">
            <li>
              <Link
                to={appPaths.home}
                className={`shop-nav-link ${location.pathname === appPaths.home ? "active" : ""}`}
              >
                Home
              </Link>
            </li>
            <li className="shop-nav-dropdown-trigger">
              <span className="shop-nav-link">
                Categories <ChevronDown size={14} className="dropdown-arrow" />
              </span>
              <div className="shop-dropdown-menu">
                {categories.map((category) => (
                  <Link
                    key={category}
                    to={`${appPaths.products}?category=${category.toLowerCase()}`}
                    className="dropdown-item"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </li>
            <li>
              <Link
                to={appPaths.products}
                className={`shop-nav-link ${location.pathname === appPaths.products ? "active" : ""}`}
              >
                All Products
              </Link>
            </li>
          </ul>
        </nav>

        {/* Action Area (Search, Icons) */}
        <div className="shop-actions">
          {/* Search */}
          <SearchInput />

          {/* Favorite List */}
          <button
            className="shop-icon-btn"
            aria-label="Favorites"
            onClick={onOpenWishlist}
          >
            <Heart size={20} />
            {favoritesCount > 0 && (
              <span className="shop-badge">{favoritesCount}</span>
            )}
          </button>

          {/* Shopping Cart */}
          <button
            className="shop-icon-btn shop-cart-btn"
            aria-label="Cart"
            onClick={onOpenCart}
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="shop-badge cart-badge">{cartCount}</span>
            )}
          </button>

          {/* Profile */}
          <Link
            to={appPaths.auth}
            className="shop-icon-btn profile-btn"
            aria-label="User Account"
          >
            <User size={20} />
          </Link>

          {/* Mobile menu trigger */}
          <button className="shop-mobile-menu-btn" onClick={onToggleMobileMenu}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}
