import {
  Package,
  AlertTriangle,
  Star,
  DollarSign,
  Trash2,
  RefreshCw,
  Plus,
} from "lucide-react";
import { useDashboardProducts } from "@/features/products/queries/shop-products.query";
import { snackbar } from "@/shared/components/snackbar/emitter";
import { ErrorState } from "@/shared/components/ErrorState";
import { DashboardSkeleton } from "shared/components/Shimmer";
import "./DashboardOverview.css";

export function DashboardOverview() {
  const { data, isLoading, isError, refetch, isRefetching } =
    useDashboardProducts();

  const products = data?.products || [];

  // 1. Calculations for metrics
  const totalProducts = products.length;

  const lowStockCount = products.filter((p) => p.stock < 10).length;

  const averageRating = totalProducts
    ? (products.reduce((acc, p) => acc + p.rating, 0) / totalProducts).toFixed(
        2,
      )
    : "0.00";

  const totalInventoryValue = products
    .reduce((acc, p) => acc + p.price * p.stock, 0)
    .toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });

  // 2. Category distribution for chart
  const categoriesMap: Record<string, number> = {};
  products.forEach((p) => {
    categoriesMap[p.category] = (categoriesMap[p.category] || 0) + 1;
  });

  const categoryData = Object.entries(categoriesMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // top 5 categories

  const maxCategoryCount = Math.max(...categoryData.map((c) => c.count), 1);

  // 3. Mock actions
  const handleDeleteProduct = (_id: number, title: string) => {
    snackbar.success(`Product "${title}" removed from dashboard simulation!`);
  };

  const handleRestock = (title: string) => {
    snackbar.info(`Restock ordered for "${title}".`);
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Could not load analytics"
        message="There was an issue loading the store dashboard statistics. Please check your connection."
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="db-page-container">
      {/* Page Header */}
      <div className="db-page-header">
        <div>
          <h1 className="db-title">Store Overview</h1>
          <p className="db-subtitle">
            Monitor product catalogues, analytics, and stock alerts.
          </p>
        </div>
        <div className="db-header-actions">
          <button
            onClick={() => refetch()}
            className={`db-action-btn secondary ${isRefetching ? "spinning" : ""}`}
            disabled={isRefetching}
            aria-label="Refresh Data"
          >
            <RefreshCw size={16} /> Refresh
          </button>
          <button
            onClick={() =>
              snackbar.warning("Product additions are disabled in this demo.")
            }
            className="db-action-btn primary"
          >
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      {/* Summary Cards Grid */}
      <div className="db-metrics-grid">
        {/* Metric 1 */}
        <div className="db-metric-card">
          <div className="metric-header">
            <span className="metric-title">Total Products</span>
            <div className="metric-icon-wrapper products">
              <Package size={20} />
            </div>
          </div>
          <div className="metric-body">
            <span className="metric-value">{totalProducts}</span>
            <span className="metric-subtext">Active items in catalog</span>
          </div>
          <div className="metric-glow glow-indigo" />
        </div>

        {/* Metric 2 */}
        <div className="db-metric-card">
          <div className="metric-header">
            <span className="metric-title">Low Stock Alerts</span>
            <div className="metric-icon-wrapper warning">
              <AlertTriangle size={20} />
            </div>
          </div>
          <div className="metric-body">
            <span className="metric-value text-warning">{lowStockCount}</span>
            <span className="metric-subtext">Items with stock &lt; 10</span>
          </div>
          <div className="metric-glow glow-warning" />
        </div>

        {/* Metric 3 */}
        <div className="db-metric-card">
          <div className="metric-header">
            <span className="metric-title">Average Rating</span>
            <div className="metric-icon-wrapper rating">
              <Star size={20} />
            </div>
          </div>
          <div className="metric-body">
            <span className="metric-value">{averageRating}</span>
            <span className="metric-subtext">Out of 5.00 stars</span>
          </div>
          <div className="metric-glow glow-emerald" />
        </div>

        {/* Metric 4 */}
        <div className="db-metric-card">
          <div className="metric-header">
            <span className="metric-title">Inventory Value</span>
            <div className="metric-icon-wrapper value">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="metric-body">
            <span className="metric-value">{totalInventoryValue}</span>
            <span className="metric-subtext">Estimated total valuation</span>
          </div>
          <div className="metric-glow glow-blue" />
        </div>
      </div>

      {/* Analytics Charts & Alerts Split */}
      <div className="db-insights-grid">
        {/* Category distribution */}
        <div className="db-insight-card">
          <h3 className="insight-title">Top Product Categories</h3>
          <p className="insight-subtitle">Item concentration by department</p>
          <div className="category-chart">
            {categoryData.map((cat) => {
              const percentage = (cat.count / maxCategoryCount) * 100;
              return (
                <div key={cat.name} className="chart-bar-row">
                  <div className="chart-bar-info">
                    <span className="category-name">{cat.name}</span>
                    <span className="category-count">{cat.count} items</span>
                  </div>
                  <div className="chart-bar-container">
                    <div
                      className="chart-bar-fill"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stock alerts panel */}
        <div className="db-insight-card">
          <h3 className="insight-title">Urgent Actions Required</h3>
          <p className="insight-subtitle">Restocking and inventory notices</p>
          <div className="stock-alerts-list">
            {products
              .filter((p) => p.stock < 10)
              .slice(0, 4)
              .map((p) => (
                <div key={p.id} className="stock-alert-item">
                  <img
                    src={p.thumbnail}
                    alt={p.title}
                    className="alert-item-img"
                  />
                  <div className="alert-item-info">
                    <span className="alert-item-title">{p.title}</span>
                    <span className="alert-item-stock">
                      Only {p.stock} left in stock
                    </span>
                  </div>
                  <button
                    onClick={() => handleRestock(p.title)}
                    className="alert-restock-btn"
                  >
                    Restock
                  </button>
                </div>
              ))}
            {lowStockCount === 0 && (
              <p className="no-alerts-text">
                ✅ All stock levels are currently optimal.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Catalogue Table */}
      <div className="db-table-card">
        <div className="table-card-header">
          <h3 className="table-title">Product Catalogue</h3>
          <span className="table-count-badge">{products.length} Products</span>
        </div>
        <div className="table-responsive">
          <table className="db-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Rating</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.slice(0, 10).map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="table-product-cell">
                      <img
                        src={p.thumbnail}
                        alt={p.title}
                        className="table-product-img"
                      />
                      <span className="table-product-title">{p.title}</span>
                    </div>
                  </td>
                  <td>
                    <span className="table-category-tag">{p.category}</span>
                  </td>
                  <td className="text-secondary">{p.brand || "Generic"}</td>
                  <td className="font-semibold">${p.price.toFixed(2)}</td>
                  <td>
                    <span
                      className={`table-stock-badge ${p.stock < 10 ? "low" : "normal"}`}
                    >
                      {p.stock} left
                    </span>
                  </td>
                  <td>
                    <div className="table-rating-cell">
                      <Star size={14} className="star-icon" />
                      <span>{p.rating.toFixed(2)}</span>
                    </div>
                  </td>
                  <td className="text-right">
                    <button
                      onClick={() => handleDeleteProduct(p.id, p.title)}
                      className="table-action-btn delete"
                      title="Delete Product"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
