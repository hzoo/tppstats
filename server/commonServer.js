var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = Number(process.env.PORT || 8080);
var env = process.env.NODE_ENV || 'development';
var serveDir = {
    development: 'app',
    production: 'dist'
};

server.listen(port, function() {
    console.log(`http server on port ${port} in ${env} mode`);
});
app.use(require('compression')());
app.use(express.static(
    require('path').join(__dirname + '/../' + serveDir[env])
));

module.exports = io;
