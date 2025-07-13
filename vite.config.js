// vite.config.js
import { defineConfig }    from 'vite';
import { viteStaticCopy }  from 'vite-plugin-static-copy';
import { terser }          from 'rollup-plugin-terser';

export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: '.',          // main.js & main.css at dist root
    cssCodeSplit: false,
    rollupOptions: {
      input: 'src/main.js',
      output: {
        entryFileNames: 'main.js',
        chunkFileNames: 'chunk-[hash].js',
        assetFileNames: (info) =>
          info.name?.endsWith('.css') ? 'main.css' : '[name][extname]',
        // Minify ONLY the standalone JS files copied from public/
        plugins: [
          terser({
            include: ['../public/**/*.js'],
            format: { comments: false }
          })
        ]
      }
    }
  },
  plugins: [
    // Copy everything in public/ to dist/ and minify CSS on the fly
    viteStaticCopy({
      targets: [
        {
          src: 'public/**/*',
          dest: '.',                 // keep same relative paths
          transform: async (code, filepath) => {
            if (filepath.endsWith('.css')) {
              const postcss = (await import('postcss')).default;
              const cssnano = (await import('cssnano')).default;
              const result = await postcss([cssnano()]).process(code, { from: undefined });
              return result.css;      // ← minified CSS
            }
            return code;              // JS already minified by terser above
          }
        }
      ]
    })
  ]
});