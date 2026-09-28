import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** Optional custom fallback UI. Receives the error and a reset callback. */
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary catches any uncaught render/lifecycle errors in its subtree
 * and renders a fallback UI instead of crashing the whole app.
 *
 * Usage:
 *   <ErrorBoundary>
 *     <SomeComponentThatMightThrow />
 *   </ErrorBoundary>
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // In production you'd send this to an error monitoring service (e.g. Sentry)
    console.error(
      "[ErrorBoundary] Uncaught error:",
      error,
      info.componentStack,
    );
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (!hasError || !error) return children;

    if (fallback) return fallback(error, this.handleReset);

    // ── Default fallback UI ──────────────────────────────────────────────────
    return (
      <div className="error-boundary">
        <div className="error-boundary__card">
          <span className="error-boundary__icon">⚠️</span>
          <h2 className="error-boundary__title">Something went wrong</h2>
          <p className="error-boundary__message">
            {error.message || "An unexpected error occurred."}
          </p>
          <button className="error-boundary__btn" onClick={this.handleReset}>
            Try again
          </button>
        </div>
      </div>
    );
  }
}
