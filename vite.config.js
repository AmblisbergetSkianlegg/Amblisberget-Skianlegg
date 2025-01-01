import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    // Ensure Vite copies over the tile directories
    copyPublicDir: true,
    sourcemap: true,
  },
  css: {
    postcss: {
      plugins: [tailwind, autoprefixer],
    }
  }
});