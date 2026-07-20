import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Relative assets so the gateway can serve this SPA at
// /api/render/:handle/nico-palmer/ or a handle subdomain root.
export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    outDir: "build",
  },
  server: {
    port: 5175,
    strictPort: true,
    hmr: {
      clientPort: 5175,
      host: "localhost",
      protocol: "ws",
    },
    proxy: {
      "/api": {
        target: "http://localhost:5001",
        changeOrigin: true,
      },
    },
  },
});
