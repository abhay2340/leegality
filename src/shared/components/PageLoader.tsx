export function PageLoader() {
  return (
    <div className="shop-loading-container" style={{ minHeight: "60vh" }}>
      <div className="shop-spinner" />
      <p style={{ color: "var(--color-text-secondary)" }}>Loading page...</p>
    </div>
  );
}
