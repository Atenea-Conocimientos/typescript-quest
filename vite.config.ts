import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['esbuild-wasm', 'esbuild-wasm/esm/browser.min.js'],
  },
  worker: {
    format: 'es',
  },
  build: {
    target: 'esnext',
  },
});
