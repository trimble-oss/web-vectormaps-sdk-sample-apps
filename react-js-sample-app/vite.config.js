import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 1776,
    proxy: {
      "/api": {
        target: "http://localhost:1776",
        changeOrigin: true,
      },
    },
    fs: {
      cachedChecks: false,
    },
  },
  plugins: [react()],
});
