// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',                 // custom domain -> root
  build: {
    outDir: 'dist',
    assetsDir: '.',          // put JS & CSS in dist/ root
    cssCodeSplit: false,     // bundle all imported CSS into ONE file
    rollupOptions: {
      input: 'src/main.js',
      output: {
        // --- no hash on the entry bundle ---
        entryFileNames: 'main.js',

        // keep dynamic chunks hashed (rare in your setup, but safe)
        chunkFileNames: 'chunk-[hash].js',

        // Rename every emitted asset (CSS, fonts, images) deterministically
        assetFileNames: (assetInfo) => {
          // Turn the single CSS bundle into main.css
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'main.css';
          }
          // Everything else keeps its original name (no hash)
          return '[name][extname]';
        }
      }
    }
  }
});
