import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // Relative assets let the gateway serve this bundle at either a handle
  // subdomain root or /api/render/:handle without a separate template host.
  base: './',
  plugins: [react()],
  server: {
    port: 5174,
    strictPort: true,
    hmr: {
      clientPort: 5174,
      host: 'localhost',
      protocol: 'ws',
    },
    // Proxy public profile API for local template testing
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
    },
  },
})
