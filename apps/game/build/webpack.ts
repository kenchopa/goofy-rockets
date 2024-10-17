/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */
import HtmlWebpackPlugin from 'html-webpack-plugin';
import * as IP from 'ip';
import Path from 'path';
import Webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

const config: Webpack.Configuration & WebpackDevServer.Configuration = {
  devServer: {
    allowedHosts: 'all',
    client: {
      overlay: true,
    },
    host: IP.address(),
    open: 'index.html',
    port: 8080,
    static: [
      { directory: Path.join(__dirname, '..', 'dist') },
      { directory: Path.join(__dirname, '..', 'src') },
      { directory: Path.join(__dirname, '..', 'public') },
    ],
    server: {
      type: 'https',
    },
  },
  devtool: 'source-map',
  entry: {
    testbed: './src/index.ts',
  },
  mode: 'development',
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.tsx?$/i,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: 'build/tsconfig.json',
          },
        },
      },
      {
        exclude: /node_modules/,
        test: /\.(jpe?g|png|gif|svg|json)$/i,
        type: 'asset',
      },
      {
        exclude: /node_modules/,
        test: /\.css$/i,
        use: [
          {
            loader: 'style-loader',
            options: {},
          },
          {
            loader: 'css-loader',
            options: {},
          },
        ],
      },
    ],
  },
  output: {
    assetModuleFilename: '[path][name]-[hash:8][ext][query]',
    filename: 'testbed.js',
    libraryExport: 'default',
    libraryTarget: 'umd',
    path: Path.join(__dirname, '..', 'dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      inject: true,
      template: 'build/assets/index.html',
      title: 'Testing Bed',
    }),
    new NodePolyfillPlugin(),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    mainFields: ['module', 'main'],
  },
};

export default config;
