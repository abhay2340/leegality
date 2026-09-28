import React from "react";
import { Link } from "react-router-dom";
import { Heart, Star, ShoppingCart } from "lucide-react";
import { type Product } from "@/features/products/types/product.model";
import { appPaths } from "@/app/router/paths";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { toggleWishlist, selectIsProductInWishlist } from "@/features/wishlist";
import { addToCart } from "@/features/cart";
import { snackbar } from "@/shared/components/snackbar/emitter";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (title: string, e: React.MouseEvent) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const detailsUrl = appPaths.productDetails.replace(":id", String(product.id));
  const dispatch = useAppDispatch();
  const isFavorite = useAppSelector((state) =>
    selectIsProductInWishlist(state, product.id),
  );

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlist(product));
    if (!isFavorite) {
      snackbar.success(
        `Added "${product.title}" to your favorites list!`,
        2000,
      );
    } else {
      snackbar.info(`Removed "${product.title}" from favorites.`, 2000);
    }
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({ product, quantity: 1 }));
    // trigger parent callback if it exists (mostly deprecated but nice to preserve)
    if (onAddToCart) {
      onAddToCart(product.title, e);
    } else {
      snackbar.success(`Added "${product.title}" to your shopping cart!`, 3000);
    }
  };

  return (
    <div className="product-card">
      <Link
        to={detailsUrl}
        className="product-img-link"
        style={{ display: "block" }}
      >
        <div className="product-img-wrapper">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="product-img"
            loading="lazy"
            decoding="async"
          />
          <button
            className={`favorite-btn ${isFavorite ? "active" : ""}`}
            aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
            onClick={handleToggleFavorite}
          >
            <Heart size={16} />
          </button>
          {product.discountPercentage > 10 && (
            <span className="discount-tag">
              -{Math.round(product.discountPercentage)}%
            </span>
          )}
        </div>
      </Link>
      <div className="product-info">
        <div className="product-meta">
          <span className="product-category">{product.category}</span>
          <div className="product-rating">
            <Star size={14} className="star-icon" />
            <span>{product.rating}</span>
          </div>
        </div>
        <h3 className="product-title">
          <Link to={detailsUrl} className="product-title-link">
            {product.title}
          </Link>
        </h3>
        <div className="product-footer">
          <span className="product-price">${product.price}</span>
          <button
            onClick={handleAddToCartClick}
            className="add-to-cart-btn"
            aria-label="Add to cart"
            disabled={product.stock === 0}
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
