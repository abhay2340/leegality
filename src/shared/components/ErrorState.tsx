import { AlertTriangle } from "lucide-react";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  title?: string;
}

export function ErrorState({
  message,
  onRetry,
  title = "Something went wrong",
}: ErrorStateProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "400px",
        padding: "40px 24px",
        textAlign: "center",
        maxWidth: "480px",
        margin: "0 auto",
        fontFamily: "var(--font-sans, sans-serif)",
      }}
    >
      <AlertTriangle
        size={48}
        style={{ color: "var(--color-danger, #b91c1c)", marginBottom: "16px" }}
      />
      <h3
        style={{
          fontSize: "1.25rem",
          fontWeight: 700,
          color: "var(--color-text-primary, #1e2022)",
          marginBottom: "8px",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          color: "var(--color-text-secondary, #6e6b64)",
          fontSize: "0.9375rem",
          lineHeight: 1.5,
          marginBottom: "24px",
        }}
      >
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            background: "var(--color-primary, #e15a13)",
            color: "#ffffff",
            border: "none",
            padding: "10px 24px",
            fontSize: "0.875rem",
            fontWeight: 600,
            borderRadius: "10px",
            cursor: "pointer",
            transition: "all 0.2s",
            boxShadow: "0 4px 12px var(--glow-primary)",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          Try Again
        </button>
      )}
    </div>
  );
}
