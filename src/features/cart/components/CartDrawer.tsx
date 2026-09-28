import { X, Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/store";
import {
  selectCartItems,
  selectCartTotal,
  updateQuantity,
  removeFromCart,
  clearCart,
} from "@/features/cart";
import { snackbar } from "@/shared/components/snackbar/emitter";
import "./CartDrawer.css";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);

  const handleUpdateQty = (productId: number, currentQty: number, change: number, stock?: number) => {
    const newQty = currentQty + change;
    if (newQty < 1) return;
    if (stock !== undefined && newQty > stock) {
      snackbar.warning(`Only ${stock} items available in stock.`, 2000);
      return;
    }
    dispatch(updateQuantity({ productId, quantity: newQty }));
  };

  const handleRemove = (productId: number, title: string) => {
    dispatch(removeFromCart(productId));
    snackbar.info(`Removed "${title}" from cart`, 2000);
  };

  const handleClear = () => {
    dispatch(clearCart());
    snackbar.info("Cart cleared", 2000);
  };

  const handleCheckout = () => {
    snackbar.success("Checkout simulation successful! Thank you for your purchase.", 3000);
    dispatch(clearCart());
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div className={`cart-overlay ${isOpen ? "open" : ""}`} onClick={onClose} />

      {/* Drawer */}
      <div className={`cart-drawer-container ${isOpen ? "open" : ""}`} role="dialog" aria-modal="true" aria-label="Shopping Cart">
        <div className="cart-drawer-header">
          <div className="cart-header-title">
            <ShoppingCart size={20} className="header-cart-icon" />
            <span>Shopping Cart</span>
            {cartItems.length > 0 && <span className="cart-badge-count">{cartItems.length}</span>}
          </div>
          <button className="cart-close-btn" onClick={onClose} aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="cart-empty-state">
            <div className="cart-empty-icon-wrapper">
              <ShoppingCart size={40} className="cart-empty-icon" />
            </div>
            <p className="cart-empty-text">Your shopping cart is empty</p>
            <button className="cart-browse-btn" onClick={onClose}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items-list">
              {cartItems.map(({ product, quantity }) => {
                const itemTotal = product.price * quantity;
                return (
                  <div className="cart-item" key={product.id}>
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="cart-item-img"
                    />
                    <div className="cart-item-details">
                      <span className="cart-item-category">{product.category}</span>
                      <h4 className="cart-item-title">{product.title}</h4>
                      <span className="cart-item-price">${product.price.toFixed(2)}</span>
                      
                      <div className="cart-item-actions">
                        <div className="cart-qty-selector">
                          <button
                            onClick={() => handleUpdateQty(product.id, quantity, -1)}
                            className="cart-qty-btn"
                            disabled={quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="cart-qty-val">{quantity}</span>
                          <button
                            onClick={() => handleUpdateQty(product.id, quantity, 1, product.stock)}
                            className="cart-qty-btn"
                            aria-label="Increase quantity"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <button
                          onClick={() => handleRemove(product.id, product.title)}
                          className="cart-item-remove-btn"
                          aria-label="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="cart-item-total">
                      ${itemTotal.toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="cart-drawer-footer">
              <div className="cart-total-row">
                <span className="total-label">Subtotal</span>
                <span className="total-value">${total.toFixed(2)}</span>
              </div>
              <div className="cart-footer-buttons">
                <button className="cart-clear-btn" onClick={handleClear}>
                  Clear All
                </button>
                <button className="cart-checkout-btn" onClick={handleCheckout}>
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
