import { BrowserRouter } from "react-router-dom";
import { StoreProvider } from "@/app/store";
import { QueryProvider } from "@/app/providers/query/QueryProvider";
import { SnackbarProvider } from "@/shared/components/snackbar";
import { AppRouter } from "@/app/router";
import { ErrorBoundary } from "@/shared/components/ErrorBoundary";
import "./App.css";

function App() {
  // Matches Vite's `base` (set via VITE_BASE_PATH), so the app also works from a sub-path
  const basename = import.meta.env.BASE_URL;

  return (
    <StoreProvider>
      <QueryProvider>
        <BrowserRouter basename={basename}>
          <SnackbarProvider>
            <ErrorBoundary>
              <AppRouter />
            </ErrorBoundary>
          </SnackbarProvider>
        </BrowserRouter>
      </QueryProvider>
    </StoreProvider>
  );
}

export default App;
