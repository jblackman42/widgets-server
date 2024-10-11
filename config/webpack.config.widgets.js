const webpack = require('webpack');
const path = require('path');
const envKeys = require('../client/GlobalEnv');
const dotenv = require('dotenv');

// Load environment variables from .env file
const env = dotenv.config().parsed;

module.exports = {
  // mode: 'production',
  mode: env.NODE_ENV || 'development',
  entry: {
    customWidgets: path.resolve(__dirname, '..', 'client', 'customWidgets.jsx'),
  },
  output: {
    path: path.resolve(__dirname, '..', 'dist'),
    filename: '[name].bundle.js',
    library: '[name]',
    libraryTarget: 'umd',
    globalObject: 'this',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new webpack.DefinePlugin(envKeys)
  ]
  // React and ReactDOM will be bundled with customWidgets
};