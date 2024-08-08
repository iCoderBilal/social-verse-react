
const CracoBabelLoader = require('craco-babel-loader');
module.exports = {
  style: {
    postcss: {
      plugins: [
        require('autoprefixer'),
      ],
    },
    sass: {
      loaderOptions: {
        // Prefer 'sass' (dart-sass) over 'node-sass' if both packages are installed.
        implementation: require('sass'),
        // Workaround for this bug: https://github.com/webpack-contrib/sass-loader/issues/804
        webpackImporter: false,
      },
    },

  },
  babel: {
    plugins: [
      ['@babel/plugin-proposal-class-properties', { loose: true }],
      ['@babel/plugin-proposal-private-methods', { loose: true }],
    ],
  },
  plugins: [
    {
      plugin: CracoBabelLoader,
      options: {
        includes: [/(chart.js|other-dependency)/], // Specify dependencies as needed
      },
    },
  ],
}