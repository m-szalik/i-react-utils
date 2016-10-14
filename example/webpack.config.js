/* eslint-disable no-var */
var path = require('path');
var webpack = require('webpack');

var wpPlugins = [
  new webpack.optimize.DedupePlugin(),
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.optimize.UglifyJsPlugin()
];

module.exports = {
  entry: ['./example/app'],
  devtool: 'eval-source-map',
  output: {
    path: __dirname + '/build/js',
    filename: 'app.js',
    publicPath: '/js/'
  },
  plugins: wpPlugins,
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      include: path.join(__dirname, '.')
    },
    {
      test: /\.js$/,
      loaders: ['babel'],
      include: path.join(__dirname, '../src')
    }
    ]
  }
};
