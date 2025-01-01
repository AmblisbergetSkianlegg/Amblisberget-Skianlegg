import { defineConfig } from 'vite';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  base: './',
  build: {
    // Ensure Vite copies over the tile directories
    copyPublicDir: true,
    sourcemap: true,
  },
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    }
  }
});