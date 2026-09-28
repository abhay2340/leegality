import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_PATH || "/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      shared: path.resolve(__dirname, "./src/shared"),
      features: path.resolve(__dirname, "./src/features"),
      pages: path.resolve(__dirname, "./src/pages"),
    },
  },
});
