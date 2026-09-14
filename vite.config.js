import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    // Pinned so the dev server is always the same origin (localhost:5173).
    // Firebase's login session is stored per-origin (host+port) in the
    // browser, and the backend's CORS allowlist also hardcodes this port --
    // if Vite silently moved to 5174 (e.g. a stale dev server still holding
    // 5173), you'd land on what the browser treats as a different site with
    // no session, and API calls could get rejected by CORS too.
    port: 5173,
    strictPort: true,
  },
})