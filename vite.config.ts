import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import { resolve } from 'path';
import { fileURLToPath } from 'url';

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': resolve(fileURLToPath(import.meta.url), './src'),
    },
  },
});
