// vite.config.js
import { defineConfig }     from 'vite';
import { viteStaticCopy }   from 'vite-plugin-static-copy';
import { terser }           from 'rollup-plugin-terser';
import { minify }           from 'terser';          // for public JS

export default defineConfig({
  base: '/',                                   // custom CNAME → root
  build: {
    outDir: 'dist',
    assetsDir: '.',                            // place files at dist root
    cssCodeSplit: false,                       // a single CSS bundle
    rollupOptions: {
      input: 'src/main.js',
      output: {
        entryFileNames: 'main.js',             // fixed names
        chunkFileNames: 'chunk-[hash].js',
        assetFileNames: info =>
          info.name?.endsWith('.css') ? 'main.css' : '[name][extname]',
      },
      plugins: [
        terser({ format: { comments: false } }) // extra squeeze for bundled JS
      ]
    }
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'public/**/*',                  // copy every file
          dest: '.',                           // preserve structure
          transform: async (code, filepath) => {
            // Minify standalone CSS from public/
            if (filepath.endsWith('.css')) {
              const postcss = (await import('postcss')).default;
              const cssnano = (await import('cssnano')).default;
              return (
                await postcss([cssnano()]).process(code, { from: undefined })
              ).css;
            }
            // Minify standalone JS from public/
            if (filepath.endsWith('.js')) {
              const { code: min } = await minify(code.toString(), {
                ecma: 2020,
                compress: true,
                mangle: true,
                format: { comments: false }
              });
              return min;
            }
            // Copy anything else verbatim
            return code;
          }
        }
      ]
    })
  ]
});