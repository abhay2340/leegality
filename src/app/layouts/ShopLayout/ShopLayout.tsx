import { useState } from "react";
import { Outlet } from "react-router-dom";
import { ShopHeader } from "./components/ShopHeader";
import { ShopMobileDrawer } from "./components/ShopMobileDrawer";
import { ShopFooter } from "./components/ShopFooter";
import { useAppSelector } from "@/app/store";
import { selectCartCount } from "@/features/cart";
import { selectWishlistCount } from "@/features/wishlist";
import { CartDrawer } from "features/cart/components/CartDrawer";
import { WishlistDrawer } from "features/wishlist/components/WishlistDrawer";
import "./ShopLayout.css";

const categories = [
  "Smartphones",
  "Laptops",
  "Fragrances",
  "Skin-Care",
  "Groceries",
  "Home-Decoration",
  "Furniture",
  "Sunglasses",
];

export function ShopLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const cartCount = useAppSelector(selectCartCount);
  const favoritesCount = useAppSelector(selectWishlistCount);

  const handleToggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleCloseMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="shop-layout-container">
      <ShopHeader
        categories={categories}
        cartCount={cartCount}
        favoritesCount={favoritesCount}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={handleToggleMobileMenu}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
      />

      <ShopMobileDrawer
        categories={categories}
        isMobileMenuOpen={isMobileMenuOpen}
        onCloseMobileMenu={handleCloseMobileMenu}
      />

      {/* Shop Main Contents */}
      <main className="shop-main-content">
        <Outlet />
      </main>

      <ShopFooter />

      {/* Slide-out Drawers */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
      />
    </div>
  );
}
