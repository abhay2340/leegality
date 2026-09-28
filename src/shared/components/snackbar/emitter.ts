export type SnackbarVariant = "success" | "info" | "warning" | "error";

export interface SnackbarItem {
  id: string;
  message: string;
  variant: SnackbarVariant;
  duration?: number;
}

type SnackbarListener = (item: SnackbarItem) => void;
export const listeners = new Set<SnackbarListener>();

export const snackbar = {
  show: (
    message: string,
    variant: SnackbarVariant = "info",
    duration = 4000,
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    listeners.forEach((listener) =>
      listener({ id, message, variant, duration }),
    );
  },
  success: (message: string, duration?: number) =>
    snackbar.show(message, "success", duration),
  info: (message: string, duration?: number) =>
    snackbar.show(message, "info", duration),
  warning: (message: string, duration?: number) =>
    snackbar.show(message, "warning", duration),
  error: (message: string, duration?: number) =>
    snackbar.show(message, "error", duration),
};

export function useSnackbar() {
  return snackbar;
}
