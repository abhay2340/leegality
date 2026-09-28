import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { appPaths } from "@/app/router/paths";

export function ShopFooter() {
  return (
    <footer className="shop-footer">
      <div className="shop-footer-wrapper minimalist">
        <div className="footer-left">
          <Link to={appPaths.home} className="shop-logo">
            <ShoppingBag className="shop-logo-icon" size={20} />
            <span className="shop-logo-text">
              Pulse<span className="gradient-text">Shop</span>
            </span>
          </Link>
          <span className="footer-copyright">
            &copy; {new Date().getFullYear()} PulseShop. All rights reserved.
          </span>
        </div>
        <div className="footer-right">
          <Link to={appPaths.products} className="footer-link">
            All Products
          </Link>
          <a href="#help" className="footer-link">
            Help
          </a>
          <a href="#privacy" className="footer-link">
            Privacy & Terms
          </a>
        </div>
      </div>
    </footer>
  );
}
