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

app.get('/api/ajax-list', function (req, res) {
    const pg = parseInt(req.query.page || "1");
    const items = [];
    for(var j= 0,i=(pg-1) * 10; i<22 && j<10; i++, j++) {
        items.push('Item ' + i + ' (' + j + ')');
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ "items":items,"paging":{"page":pg,"count":10,"total":22}  }));
});

app.get('/api/lazy-load', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ message : 'Message from server' }));
});


app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

var server = app.listen(3000, '0.0.0.0', function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('App Server at http://%s:%s', host, port);
});

