const webpack = require('webpack')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  devtool: 'cheap-eval-source-map',
  devServer: {
    historyApiFallback: true,
    open: true,
    inline: true,
    contentBase: './public',
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
})
