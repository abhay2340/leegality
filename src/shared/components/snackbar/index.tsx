import React, { useState, useEffect, useCallback } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  X,
} from "lucide-react";
import { listeners, type SnackbarItem } from "./emitter";
import "./snackbar.css";

export function SnackbarProvider({ children }: { children: React.ReactNode }) {
  const [snackbars, setSnackbars] = useState<SnackbarItem[]>([]);

  useEffect(() => {
    const addSnackbar = (item: SnackbarItem) => {
      setSnackbars((prev) => [...prev, item]);
    };

    listeners.add(addSnackbar);
    return () => {
      listeners.delete(addSnackbar);
    };
  }, []);

  const removeSnackbar = useCallback((id: string) => {
    setSnackbars((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return (
    <>
      {children}
      <div className="snackbar-container" id="snackbar-root">
        {snackbars.map((item) => (
          <SnackbarMessage
            key={item.id}
            item={item}
            onClose={() => removeSnackbar(item.id)}
          />
        ))}
      </div>
    </>
  );
}

function SnackbarMessage({
  item,
  onClose,
}: {
  item: SnackbarItem;
  onClose: () => void;
}) {
  const { message, variant, duration } = item;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration || 4000);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (variant) {
      case "success":
        return <CheckCircle2 className="snackbar-icon success" size={20} />;
      case "warning":
        return <AlertTriangle className="snackbar-icon warning" size={20} />;
      case "error":
        return <AlertCircle className="snackbar-icon error" size={20} />;
      case "info":
      default:
        return <Info className="snackbar-icon info" size={20} />;
    }
  };

  return (
    <div className={`snackbar-item ${variant}`}>
      <div className="snackbar-content">
        {getIcon()}
        <span className="snackbar-message">{message}</span>
      </div>
      <button className="snackbar-close" onClick={onClose} aria-label="Close">
        <X size={16} />
      </button>
    </div>
  );
}
