var path = require('path');
var express = require('express');
var fs = require('fs');

var app = express();
var webpack = require('webpack');
var config = require('./webpack.config');
var compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
}));

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

var server = app.listen(3000, '0.0.0.0', function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('App Server at http://%s:%s', host, port);
});

