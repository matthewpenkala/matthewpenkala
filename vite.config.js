// vite.config.js
import { defineConfig }     from 'vite';
import { viteStaticCopy }   from 'vite-plugin-static-copy';
import { terser }           from 'rollup-plugin-terser';

export default defineConfig({
  base: '/',                    // custom domain → site root
  build: {
    outDir: 'dist',
    assetsDir: '.',             // put all build files at dist/ root
    cssCodeSplit: false,        // bundle imported CSS into ONE file
    rollupOptions: {
      input: 'src/main.js',
      output: {
        // fixed filenames for easy linking
        entryFileNames: 'main.js',
        chunkFileNames: 'chunk-[hash].js',
        assetFileNames: info =>
          info.name?.endsWith('.css') ? 'main.css' : '[name][extname]',
      },
      // extra JS minification pass (applies to main & public/*.js)
      plugins: [terser({ format: { comments: false } })]
    }
  },
  plugins: [
    // copy everything in public/ → dist/ and minify public CSS
    viteStaticCopy({
      targets: [
        {
          src: 'public/**/*',
          dest: '.',                   // preserve folder structure
          transform: async (code, filepath) => {
            if (filepath.endsWith('.css')) {
              const postcss = (await import('postcss')).default;
              const cssnano = (await import('cssnano')).default;
              const result  = await postcss([cssnano()]).process(code, { from: undefined });
              return result.css;        // return minified CSS
            }
            return code;                // JS already minified by terser
          }
        }
      ]
    })
  ]
});