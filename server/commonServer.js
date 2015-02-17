var path = require('path');
var serveStatic = require('serve-static');
var app = require('express')().use(require('compression')());
var server = require('http').Server(app);
var io = require('socket.io')(server);

var port = Number(process.env.PORT || 8080);
var env = process.env.NODE_ENV || 'development';
var serveDir = {
    development: 'app',
    production: 'dist'
};

server.listen(port);
app.use(serveStatic(__dirname + '/../' + serveDir[env]));

console.log(`http server on port ${port} in ${env} mode`);

module.exports = io;
