import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
console.log("🔥 VITE PROXY CONFIG LOADED");

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const temporalUiUrl =
    env.VITE_NEXT_PUBLIC_TEMPORAL_UI_URL || "http://temporal-ui:8080";
  const backendUrl = env.VITE_API_URL || "http://localhost:3000";


  return {
    plugins: [react(), tailwindcss()],
    server: {
      watch: {
        usePolling: true,
      },
      proxy: {
        "/api": {
          target: backendUrl,
          changeOrigin: true,
          secure: false,
        },
        "/temporal": {
          target: temporalUiUrl,
          changeOrigin: true,
          secure: false,
          // Remove '/temporal' from the start of the path
          rewrite: (path) => path.replace(/^\/temporal/, ""),
        },
      },
    },
  };
});

