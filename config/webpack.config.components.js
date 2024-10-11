

const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const envKeys = require('../client/GlobalEnv');
const dotenv = require('dotenv');

// Load environment variables from .env file
const env = dotenv.config().parsed;

function getComponentEntries() {
  const componentsDir = path.resolve(__dirname, '..', 'client', 'widgets');
  const componentFiles = fs.readdirSync(componentsDir);
  const entries = {};

  componentFiles.forEach((file) => {
    const fileName = path.basename(file, '.jsx');
    entries[fileName] = path.resolve(componentsDir, file);
  });

  return entries;
}

module.exports = {
  mode: env.NODE_ENV || 'development',
  entry: getComponentEntries(),
  output: {
    path: path.resolve(__dirname, '..', 'dist', 'widgets'),
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
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
  plugins: [
    new webpack.DefinePlugin(envKeys)
  ]
};
