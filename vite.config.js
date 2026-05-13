import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173,
    strictPort: false,
  },
  build: {
    target: 'es2020',
    cssCodeSplit: false,
    sourcemap: true,
  },
  // Served from the root of the custom domain (aamirahsankhan.me).
  // If you ever revert to GitHub Pages project URL, set this to '/fluffy-happiness/'.
  base: '/',
});
