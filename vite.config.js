// vite.config.js
export default {
  base: '/',            // keep root because you have a CNAME
  build: {
    outDir: 'dist',
    assetsDir: '.',     // <── put JS/CSS directly in dist/
    rollupOptions: {
      input: 'src/main.js',
      output: {
        // still hashed to enable long-term caching
        entryFileNames: '[name]-[hash].js',
        chunkFileNames: '[name]-[hash].js',
        assetFileNames: '[name]-[hash][extname]'
      }
    }
  }
};
