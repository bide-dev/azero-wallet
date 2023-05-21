import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';
import webpack from 'webpack';

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    plugins: [
      new webpack.NormalModuleReplacementPlugin(/node:/, (resource) => {
        resource.request = resource.request.replace(/^node:/, '');
      }),
      new NodePolyfillPlugin(),
    ],
    resolve: {
      fallback: {
        fs: false,
        net: false,
      },
    },
  });
};
