// vite.config.js
import { defineConfig } from 'vite';
import { terser }       from 'rollup-plugin-terser';

import { minify }  from 'terser';
import postcss     from 'postcss';
import cssnano     from 'cssnano';

function minifyPublicAssets() {
  return {
    name: 'minify-public-assets',
    apply: 'build',
    async generateBundle(_, bundle) {
      for (const file of Object.values(bundle)) {
        if (file.type !== 'asset') continue;           // only .source assets

        if (file.fileName.endsWith('.js')) {           // ── JS ──
          const { code } = await minify(file.source.toString(), {
            ecma: 2020,
            compress: true,
            mangle: true,
            format: { comments: false }
          });
          file.source = code;

        } else if (file.fileName.endsWith('.css')) {   // ── CSS ──
          file.source = (
            await postcss([cssnano()]).process(file.source.toString(), {
              from: undefined
            })
          ).css;
        }
      }
    }
  };
}

export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: '.',              // put everything at dist/ root
    cssCodeSplit: false,
    rollupOptions: {
      input: 'src/main.js',
      output: {
        entryFileNames: 'main.js',
        chunkFileNames: 'chunk-[hash].js',
        assetFileNames: info =>
          info.name?.endsWith('.css') ? 'main.css' : '[name][extname]'
      },
      plugins: [
        terser({ format: { comments: false } })  // squeezes bundled JS
      ]
    }
  },
  plugins: [
    minifyPublicAssets()          // squeezes every copied JS/CSS file
  ]
});
