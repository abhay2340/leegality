interface ShimmerProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function Shimmer({
  width = "100%",
  height = "100%",
  borderRadius = "8px",
  className = "",
  style = {},
}: ShimmerProps) {
  const boxStyle = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
    borderRadius,
    ...style,
  };
  return (
    <>
      <style>{`
        @keyframes shimmer-animation {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .shimmer-box {
          background: linear-gradient(
            90deg,
            var(--color-border, #e8e4dc) 25%,
            color-mix(in srgb, var(--color-border, #e8e4dc) 85%, var(--color-text-secondary, #6e6b64)) 50%,
            var(--color-border, #e8e4dc) 75%
          );
          background-size: 200% 100%;
          animation: shimmer-animation 1.6s infinite linear;
        }
      `}</style>
      <div className={`shimmer-box ${className}`} style={boxStyle} />
    </>
  );
}

export function ProductGridSkeleton() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "30px",
        padding: "40px 0",
      }}
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          style={{
            border: "1px solid var(--color-border)",
            borderRadius: "16px",
            padding: "20px",
            background: "var(--color-surface)",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <Shimmer height={240} borderRadius="12px" />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Shimmer width="40%" height={14} />
            <Shimmer width="20%" height={14} />
          </div>
          <Shimmer width="80%" height={20} />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "8px",
            }}
          >
            <Shimmer width="30%" height={24} />
            <Shimmer width={36} height={36} borderRadius="10px" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <Shimmer width={200} height={32} />
          <Shimmer width={300} height={18} style={{ marginTop: 8 }} />
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <Shimmer width={100} height={40} borderRadius="10px" />
          <Shimmer width={120} height={40} borderRadius="10px" />
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "20px",
        }}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            style={{
              border: "1px solid var(--color-border)",
              borderRadius: "16px",
              padding: "24px",
              background: "var(--color-surface)",
              height: "135px",
            }}
          >
            <Shimmer width="60%" height={16} />
            <Shimmer width="40%" height={32} style={{ marginTop: 16 }} />
            <Shimmer width="80%" height={14} style={{ marginTop: 8 }} />
          </div>
        ))}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
        }}
      >
        <div
          style={{
            border: "1px solid var(--color-border)",
            borderRadius: "16px",
            padding: "24px",
            background: "var(--color-surface)",
            height: "260px",
          }}
        >
          <Shimmer width="50%" height={20} />
          <Shimmer width="90%" height={14} style={{ marginTop: 24 }} />
          <Shimmer width="85%" height={14} style={{ marginTop: 16 }} />
          <Shimmer width="70%" height={14} style={{ marginTop: 16 }} />
        </div>
        <div
          style={{
            border: "1px solid var(--color-border)",
            borderRadius: "16px",
            padding: "24px",
            background: "var(--color-surface)",
            height: "260px",
          }}
        >
          <Shimmer width="50%" height={20} />
          <Shimmer width="90%" height={14} style={{ marginTop: 24 }} />
          <Shimmer width="85%" height={14} style={{ marginTop: 16 }} />
          <Shimmer width="70%" height={14} style={{ marginTop: 16 }} />
        </div>
      </div>
    </div>
  );
}
