var express = require('express');
var http = require('http');
var path = require('path');

var app = express(),
server = http.createServer(app),
io = require('socket.io')
    .listen(server)
    .set('match origin protocol', true);

//serve webapp
app.use(express.compress());
app.configure('development', function() {
    app.use(express.static(path.normalize(__dirname + '/../app')));
    // reduce console logs
    io.set('log level', 1);
    io.set('transports', [
        'websocket'
    ]);
});
app.configure('production', function() {
    app.use(express.static(path.normalize(__dirname + '/../dist')));
    // no logs
    io.set('log level', 0);
    io.enable('browser client minification');  // send minified client
    io.enable('browser client etag');          // apply etag caching logic based on version number
    io.enable('browser client gzip');          // gzip the file
    // use websockets first
    io.set('transports', [
        'websocket',
        'htmlfile',
        'xhr-polling',
        'jsonp-polling'
    ]);
});

//port to 8080
var port = Number(process.env.PORT || 8080);
server.listen(port);
console.log('http server listening on port ' + port + ' in ' + app.settings.env + ' mode');

module.exports = {
    express: express,
    app: app,
    server: server,
    io: io
};
