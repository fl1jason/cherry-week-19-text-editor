const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');
const { InjectManifest } = require('workbox-webpack-plugin');

// Workbox plugins for service worker and manifest files.

module.exports = () => {
  return {
    mode: 'development',
    entry: {
      main: './src/js/index.js',
      install: './src/js/install.js'
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },

    //Added plugins
    plugins: [
      new HtmlWebpackPlugin({
        template: './index.html',
        title: 'Webapck Plugin'
      }),

    new InjectManifest ({
      swSrc: './src-sw.js',
      swDest: 'src-sw.js'
    }),

    new WebpackPwaManifest({
      name:'Just Another Text Editor',
      short_name: 'J.A.T.E',
      description: 'Edit your text!',
      background_color: '#C0C0C0',
      theme_color: '#6C6A61',
      start_url: './',
      publicPath: './',
      icons: [
        {
          src: path.resolve('src/images/logo.png'),
          sizes: [100, 120, 200, 280, 360, 480],
          destination: path.join('assets', 'icons'),
        },
      ],
    })
  ],

  // Addded CSS loaders and babel to webpack.

    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['@babel/plugin-proposal-object-rest-spread', '@babel/transform-runtime'],
            },
          },
        },
      ],
    },
  };
};
