import SnapsWebpackPlugin from '@metamask/snaps-webpack-plugin';
import { resolve } from 'path';
import { Configuration } from 'webpack';
import { merge } from 'webpack-merge';
import WebpackBarPlugin from 'webpackbar';

// Configuration that is shared between the two bundles
const common: Configuration = {
  // For simplicity, we don't do any optimisations here. Ideally, this would be
  // dependent on the `NODE_ENV` or script you're running.
  mode: 'none',
  // devtool: 'source-map',
  stats: 'errors-only',
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'index.js',
    publicPath: './dist',
  },
  resolve: {
    extensions: ['.ts', '.js'],
    fallback: {
      path: false,
      fs: false,
    },
  },
  module: {
    rules: [
      {
        test: /\.(m?js|ts)x?$/u,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
    ],
  },
  plugins: [new WebpackBarPlugin()],
  watchOptions: {
    ignored: ['**/snap.manifest.json'],
  },
};

// Configuration for the Snap bundle
const snapConfig: Configuration = merge(common, {
  entry: {
    snap: './src/index.ts',
  },
  output: {
    // Required so that webpack doesn't mangle our `exports` variable
    libraryTarget: 'commonjs',
  },
  plugins: [new SnapsWebpackPlugin({ eval: false })],
});

const config = [snapConfig];
export default config;
