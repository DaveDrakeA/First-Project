const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = [
  {
    mode: 'production',
    entry: './src/main.ts',
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'dist')
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: ['.ts', '.js']
    }
  },
  {
    mode: 'production',
    entry: './src/ui.ts',
    output: {
      filename: 'ui.js',
      path: path.resolve(__dirname, 'dist')
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/ui.html',
        filename: 'ui.html'
      })
    ],
    resolve: {
      extensions: ['.ts', '.js']
    }
  }
];