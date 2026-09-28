import { X, Trash2, ShoppingCart, Heart } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { selectWishlistItems, removeFromWishlist } from "@/features/wishlist";
import { addToCart } from "@/features/cart";
import { snackbar } from "@/shared/components/snackbar/emitter";
import "@/features/cart/components/CartDrawer.css";
import type { Product } from "@/features/products/types/product.model";

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WishlistDrawer({ isOpen, onClose }: WishlistDrawerProps) {
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector(selectWishlistItems);

  const handleRemove = (productId: number, title: string) => {
    dispatch(removeFromWishlist(productId));
    snackbar.info(`Removed "${title}" from favorites`, 2000);
  };

  const handleMoveToCart = (product: Product) => {
    dispatch(addToCart({ product, quantity: 1 }));
    dispatch(removeFromWishlist(product.id));
    snackbar.success(`Moved "${product.title}" to cart!`, 2000);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`cart-overlay ${isOpen ? "open" : ""}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`cart-drawer-container ${isOpen ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Favorites Wishlist"
      >
        <div className="cart-drawer-header">
          <div className="cart-header-title">
            <Heart
              size={20}
              className="header-cart-icon"
              style={{
                fill: "var(--color-primary)",
                color: "var(--color-primary)",
              }}
            />
            <span>Favorites</span>
            {wishlistItems.length > 0 && (
              <span className="cart-badge-count">{wishlistItems.length}</span>
            )}
          </div>
          <button
            className="cart-close-btn"
            onClick={onClose}
            aria-label="Close wishlist"
          >
            <X size={20} />
          </button>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="cart-empty-state">
            <div
              className="cart-empty-icon-wrapper"
              style={{ borderColor: "var(--color-primary)" }}
            >
              <Heart
                size={40}
                className="cart-empty-icon"
                style={{ color: "var(--color-primary)" }}
              />
            </div>
            <p className="cart-empty-text">Your favorites list is empty</p>
            <button
              className="cart-browse-btn"
              onClick={onClose}
              style={{
                background:
                  "linear-gradient(135deg, var(--color-primary), #f97316)",
              }}
            >
              Explore Products
            </button>
          </div>
        ) : (
          <div className="cart-items-list">
            {wishlistItems.map((product) => (
              <div className="cart-item" key={product.id}>
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="cart-item-img"
                />
                <div className="cart-item-details">
                  <span className="cart-item-category">{product.category}</span>
                  <h4 className="cart-item-title">{product.title}</h4>
                  <span className="cart-item-price">
                    ${product.price.toFixed(2)}
                  </span>

                  <div
                    className="cart-item-actions"
                    style={{ gap: "12px", marginTop: "8px" }}
                  >
                    <button
                      onClick={() => handleMoveToCart(product)}
                      className="cart-checkout-btn"
                      style={{
                        padding: "6px 12px",
                        fontSize: "12px",
                        height: "auto",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        background:
                          "linear-gradient(135deg, var(--color-primary), #f97316)",
                      }}
                    >
                      <ShoppingCart size={12} /> Add to Cart
                    </button>
                    <button
                      onClick={() => handleRemove(product.id, product.title)}
                      className="cart-item-remove-btn"
                      aria-label="Remove item"
                      style={{ position: "static" }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
