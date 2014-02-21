'use strict';

//create web server, socket.io connection
var express = require('express'),
	path = require('path'),
	app = express(),
	http = require('http'),
	server = http.createServer(app),
	common = require('./common.js');

//socket.io
common.io = require('socket.io').listen(server);
//reduce console logs
common.io.set('log level', 1);

//create irc server
require('./ircServer.js');

//serve webapp
app.use(express.compress());
// app.use(express.static(path.normalize(__dirname + '/../app')));
app.use(express.static(path.normalize(__dirname + '/../dist')));
server.listen(8080);
console.log('http server listening on port 8080');
