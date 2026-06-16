import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/auth": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
      "/users": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
      "/organizations": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
      "/drivers": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
      "/vehicles": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
      "/loads": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
      "/dispatches": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
      "/tracking": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
      "/load-assignments": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
      "/load-templates": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
      "/messaging": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
