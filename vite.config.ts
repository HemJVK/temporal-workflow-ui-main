import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
console.log("🔥 VITE PROXY CONFIG LOADED");

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    watch: {
      usePolling: true,
    },
    proxy: {
      "/api": {
        target: process.env.VITE_API_URL || "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
      "/temporal": {
        target: "http://localhost:8233", // Standard Temporal Web UI port
        changeOrigin: true,
        secure: false,
        // Remove '/temporal' from the start of the path
        rewrite: (path) => path.replace(/^\/temporal/, ""),
      },
    },
  },
});
