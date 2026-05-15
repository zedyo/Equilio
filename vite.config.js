import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Statische GitHub-Pages-Demo wird unter /yourPlan/ ausgeliefert.
// Lokale Laravel-Integration ist nicht Teil dieses Setups (Backend-Phase).
export default defineConfig({
  base: '/yourPlan/',
  // Laravels public/ ist Web-Root des Backends (index.php etc.) und darf
  // NICHT in das statische Demo-Deploy kopiert werden.
  publicDir: false,
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: ['node_modules'],
        quietDeps: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
