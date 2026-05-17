import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// Statische GitHub-Pages-Demo wird unter /equilio/ ausgeliefert
// (Repo seit 2026-05-17 von „yourPlan" zu „equilio" umbenannt).
// Lokale Laravel-Integration ist nicht Teil dieses Setups (Backend-Phase).
export default defineConfig({
  base: '/equilio/',
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
    rollupOptions: {
      output: {
        // Vendor-Code in eigene, cachebare Chunks aufteilen
        // (verkleinert den App-Chunk, bessere Browser-Caches).
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          redux: ['@reduxjs/toolkit', 'react-redux'],
          bootstrap: ['react-bootstrap'],
          vendor: ['axios', 'moment'],
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    css: false,
    testTimeout: 20000,
    setupFiles: ['./tests/frontend/setup.js'],
    include: ['tests/frontend/**/*.test.{js,jsx}'],
  },
})
