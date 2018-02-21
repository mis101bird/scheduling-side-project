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
    historyApiFallback: true,
    open: true,
    inline: true,
    contentBase: './public',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loaders: [
          'react-hot-loader/webpack', 'babel-loader',
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
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
  ],
})
