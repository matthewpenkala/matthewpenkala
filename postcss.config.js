import cssnano from 'cssnano';
import postcssPresetEnv from 'postcss-preset-env';

export default {
  plugins: [
    postcssPresetEnv({
      stage: 3,
      autoprefixer: { flexbox: 'no-2009' }
    }),
    cssnano()
  ]
};