import { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import {
  ShoppingCart,
  Star,
  Heart,
  Shield,
  Truck,
  RotateCcw,
  Minus,
  Plus,
  ChevronRight,
  Package,
  ArrowLeft,
} from "lucide-react";
import { useProductDetails } from "@/features/products/queries/shop-products.query";
import { snackbar } from "@/shared/components/snackbar/emitter";
import { ErrorState } from "@/shared/components/ErrorState";
import { appPaths } from "@/app/router/paths";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { addToCart } from "@/features/cart";
import { toggleWishlist, selectIsProductInWishlist } from "@/features/wishlist";
import { ImageCarousel } from "@/shared/components/ImageCarousel/ImageCarousel";
import { useRecentlyViewed } from "@/shared/hooks/useRecentlyViewed";
import "./ProductDetails.css";

export function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const {
    data: product,
    isLoading,
    isError,
    refetch,
  } = useProductDetails(Number(id));

  const [quantity, setQuantity] = useState(1);

  const dispatch = useAppDispatch();
  const isFavorite = useAppSelector((state) =>
    selectIsProductInWishlist(state, product?.id ?? 0),
  );

  const { trackProduct } = useRecentlyViewed();

  const navigate = useNavigate();
  const location = useLocation();

  // Going back in history restores the listing URL, including its filters and page.
  // If this page was opened directly (no in-app history), fall back to the listing.
  const handleBack = () => {
    if (location.key !== "default") {
      navigate(-1);
    } else {
      navigate(appPaths.products);
    }
  };

  const backButton = (
    <button type="button" className="details-back-btn" onClick={handleBack}>
      <ArrowLeft size={16} />
      Back to products
    </button>
  );

  // Reset quantity when product changes
  const [prevId, setPrevId] = useState<string | undefined>(id);
  if (id !== prevId) {
    setPrevId(id);
    setQuantity(1);
  }

  // Track this product as recently viewed once it loads
  useEffect(() => {
    if (product) trackProduct(product);
  }, [product, trackProduct]);

  if (isLoading) {
    return (
      <div className="product-details-container shimmer-mode">
        {backButton}
        <div className="details-breadcrumbs-shimmer" />
        <div className="product-details-grid">
          <div className="details-gallery-shimmer" />
          <div className="details-info-shimmer">
            <div className="shimmer-line title" />
            <div className="shimmer-line price" />
            <div className="shimmer-line desc" />
            <div className="shimmer-line actions" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="product-details-container">
        {backButton}
        <ErrorState
          title="Could not load product details"
          message="We encountered an error fetching the product details. Please verify your connection and try again."
          onRetry={refetch}
        />
      </div>
    );
  }

  // Calculation for original price before discount
  const originalPrice = product.discountPercentage
    ? (product.price / (1 - product.discountPercentage / 100)).toFixed(2)
    : null;

  const handleDecreaseQty = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleIncreaseQty = () => {
    if (product.stock && quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    } else {
      snackbar.warning(`Only ${product.stock} items available in stock.`, 2000);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(addToCart({ product, quantity }));
    snackbar.success(
      `Added ${quantity} x "${product.title}" to your cart!`,
      3000,
    );
  };

  const handleToggleFavorite = () => {
    if (!product) return;
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

  const imagesList =
    product.images && product.images.length > 0
      ? product.images
      : [product.thumbnail];

  // Stock status styling helpers
  const getStockStatus = () => {
    if (product.stock === 0)
      return { label: "Out of Stock", class: "out-of-stock" };
    if (product.stock < 10)
      return {
        label: `Low Stock: Only ${product.stock} left`,
        class: "low-stock",
      };
    return { label: "In Stock", class: "in-stock" };
  };

  const stockStatus = getStockStatus();

  return (
    <div className="product-details-container">
      {backButton}

      {/* Breadcrumbs */}
      <nav className="details-breadcrumbs" aria-label="Breadcrumb">
        <Link to={appPaths.home} className="breadcrumb-link">
          Home
        </Link>
        <ChevronRight size={14} className="breadcrumb-separator" />
        <Link to={appPaths.products} className="breadcrumb-link">
          Products
        </Link>
        <ChevronRight size={14} className="breadcrumb-separator" />
        <Link
          to={`${appPaths.products}?category=${encodeURIComponent(product.category)}`}
          className="breadcrumb-link category-link"
        >
          {product.category}
        </Link>
        <ChevronRight size={14} className="breadcrumb-separator" />
        <span className="breadcrumb-current" aria-current="page">
          {product.title}
        </span>
      </nav>

      <div className="product-details-grid">
        {/* Left Column: Image Carousel with Zoom */}
        <div className="product-gallery-section">
          <ImageCarousel
            key={product.id}
            images={imagesList}
            alt={product.title}
            discountPercentage={product.discountPercentage}
          />
        </div>

        {/* Right Column: Info & Action Section */}
        <div className="product-info-section">
          <div className="info-header-meta">
            <span className="details-category-badge">{product.category}</span>
            <span className={`details-stock-badge ${stockStatus.class}`}>
              {stockStatus.label}
            </span>
          </div>

          <h1 className="details-product-title">{product.title}</h1>
          <p className="details-brand-text">
            Brand:{" "}
            <span className="brand-highlight">
              {product.brand || "Not specified"}
            </span>
          </p>

          {/* Rating */}
          <div className="details-rating-summary">
            <div className="stars-wrapper">
              {Array.from({ length: 5 }).map((_, idx) => {
                const filled = idx < Math.floor(product.rating);
                return (
                  <Star
                    key={idx}
                    size={18}
                    className={filled ? "star-filled" : "star-empty"}
                  />
                );
              })}
            </div>
            <span className="rating-score">{product.rating}</span>
            <span className="rating-divider">•</span>
            <a href="#reviews" className="rating-reviews-link">
              {product.reviews?.length || 0} customer reviews
            </a>
          </div>

          {/* Pricing */}
          <div className="details-price-row">
            <span className="details-current-price">
              ${product.price.toFixed(2)}
            </span>
            {originalPrice && (
              <span className="details-original-price">${originalPrice}</span>
            )}
          </div>

          <p className="details-description">{product.description}</p>

          {/* Actions */}
          <div className="details-actions-wrapper">
            <div className="qty-selector">
              <button
                onClick={handleDecreaseQty}
                className="qty-btn"
                aria-label="Decrease quantity"
                disabled={quantity <= 1 || product.stock === 0}
              >
                <Minus size={16} />
              </button>
              <span className="qty-value">{quantity}</span>
              <button
                onClick={handleIncreaseQty}
                className="qty-btn"
                aria-label="Increase quantity"
                disabled={
                  product.stock === 0 || quantity >= (product.stock || 0)
                }
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="details-add-to-cart-btn"
              disabled={product.stock === 0}
            >
              <ShoppingCart size={18} />
              Add to Shopping Cart
            </button>

            <button
              onClick={handleToggleFavorite}
              className={`details-favorite-btn ${isFavorite ? "active" : ""}`}
              aria-label={
                isFavorite ? "Remove from wishlist" : "Add to wishlist"
              }
            >
              <Heart size={20} className={isFavorite ? "heart-filled" : ""} />
            </button>
          </div>

          {/* Specs & Policy Blocks */}
          <div className="details-policy-grid">
            {product.warrantyInformation && (
              <div className="policy-block">
                <Shield className="policy-icon" size={20} />
                <div className="policy-info">
                  <span className="policy-title">Warranty</span>
                  <span className="policy-text">
                    {product.warrantyInformation}
                  </span>
                </div>
              </div>
            )}
            {product.shippingInformation && (
              <div className="policy-block">
                <Truck className="policy-icon" size={20} />
                <div className="policy-info">
                  <span className="policy-title">Shipping</span>
                  <span className="policy-text">
                    {product.shippingInformation}
                  </span>
                </div>
              </div>
            )}
            {product.returnPolicy && (
              <div className="policy-block">
                <RotateCcw className="policy-icon" size={20} />
                <div className="policy-info">
                  <span className="policy-title">Return Policy</span>
                  <span className="policy-text">{product.returnPolicy}</span>
                </div>
              </div>
            )}
          </div>

          {/* Specifications Panel */}
          <div className="details-specs-card">
            <h3 className="specs-card-title">Product Specifications</h3>
            <div className="specs-table">
              {product.sku && (
                <div className="specs-row">
                  <span className="spec-label">SKU</span>
                  <span className="spec-value">{product.sku}</span>
                </div>
              )}
              {product.weight !== undefined && (
                <div className="specs-row">
                  <span className="spec-label">Weight</span>
                  <span className="spec-value">{product.weight} kg</span>
                </div>
              )}
              {product.dimensions && (
                <div className="specs-row">
                  <span className="spec-label">Dimensions</span>
                  <span className="spec-value">
                    {product.dimensions.width} x {product.dimensions.height} x{" "}
                    {product.dimensions.depth} cm
                  </span>
                </div>
              )}
              <div className="specs-row">
                <span className="spec-label">Stock Status</span>
                <span className="spec-value">
                  {product.stock} units available
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="details-reviews-section" id="reviews">
        <h2 className="reviews-section-title">Customer Reviews</h2>
        {product.reviews && product.reviews.length > 0 ? (
          <div className="reviews-layout">
            {/* Reviews Summary Stats */}
            <div className="reviews-summary-card">
              <div className="summary-rating-value">{product.rating}</div>
              <div className="summary-stars">
                {Array.from({ length: 5 }).map((_, idx) => {
                  const filled = idx < Math.floor(product.rating);
                  return (
                    <Star
                      key={idx}
                      size={20}
                      className={filled ? "star-filled" : "star-empty"}
                    />
                  );
                })}
              </div>
              <span className="summary-reviews-count">
                Based on {product.reviews.length} ratings
              </span>
              <div className="verified-badge">
                <Shield size={14} className="verified-icon" />
                <span>100% Verified Customer Reviews</span>
              </div>
            </div>

            {/* Reviews List */}
            <div className="reviews-list">
              {product.reviews.map((review, idx) => (
                <div key={idx} className="review-item-card">
                  <div className="review-item-header">
                    <div className="reviewer-avatar">
                      {review.reviewerName.charAt(0).toUpperCase()}
                    </div>
                    <div className="reviewer-info">
                      <span className="reviewer-name">
                        {review.reviewerName}
                      </span>
                      <span className="review-date">
                        {new Date(review.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="reviewer-rating-stars">
                      {Array.from({ length: 5 }).map((_, starIdx) => (
                        <Star
                          key={starIdx}
                          size={14}
                          className={
                            starIdx < review.rating
                              ? "star-filled"
                              : "star-empty"
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="no-reviews-box">
            <Package size={32} className="no-reviews-icon" />
            <p>No reviews have been written for this product yet.</p>
          </div>
        )}
      </section>
    </div>
  );
}
