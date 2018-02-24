const webpack = require('webpack')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  entry: {
    app: [
      'react-hot-loader/patch',
      './src/index.js',
    ],
  },
  devtool: 'cheap-eval-source-map',
  devServer: {
    open: true,
    historyApiFallback: true,
    hot: true,
    inline: true,
    contentBase: './public',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loaders: [
          'babel-loader',
        ],
        exclude: /node_modules/,
      }, {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader'],
      }, {
        test: /\.less$/,
        loaders: ['style-loader', 'css-loader', 'less-loader'],
      },
    ],
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
})
