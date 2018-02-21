const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const { NODE_ENV } = process.env

const extractCss = new ExtractTextPlugin({
  filename: '[name]-1.[contenthash].css',
  allChunks: true,
})

const extractLess = new ExtractTextPlugin({
  filename: '[name]-2.[contenthash].css',
  allChunks: true,
})

module.exports = {
  entry: {
    app: [
      'react-hot-loader/patch',
      './src/index.js',
    ],
    vendor: [
      'antd',
      'react',
      'react-dom',
      'react-redux',
      'react-router-dom',
      'redux',
      'redux-thunk',
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      path.resolve(__dirname, 'src'),
      'node_modules',
    ],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: NODE_ENV === 'production' ? '[name].[chunkhash].js' : '[name].js',
  },
  devServer: {
    historyApiFallback: true,
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
        use: extractCss.extract({
          fallback: 'style-loader',
          use: 'css-loader',
        }),
      }, {
        test: /\.less$/,
        use: extractLess.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'less-loader'],
        }),
      }, {
        test: /\.(?:jpg|png|gif)$/,
        loader: 'url-loader',
        options: { limit: 10000 },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
      API_URL: JSON.stringify(process.env.API_URL),
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, 'public/index.html'),
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    extractCss,
    extractLess,
  ],
}
