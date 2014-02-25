//create web server, socket.io
var async = require('async'),
    express = require('express'),
    path = require('path'),
    app = express(),
    http = require('http'),
    server = http.createServer(app),
    common = require('./common.js');

require('./ircServer.js');

//socket.io
common.io = require('socket.io').listen(server).set('match origin protocol', true);;
//reduce console logs
common.io.set('log level', 1);
// assuming io is the Socket.IO server object
// common.io.configure(function () {
//   common.io.set("transports", ["xhr-polling"]);
//   common.io.set("polling duration", 10);
// });
var tss = require('./timeSeriesServer.js'),
ts = require('./redisServer.js').ts;

//serve webapp
app.use(express.compress());
app.configure('development', function(){
    app.use(express.static(path.normalize(__dirname + '/../app')));
});
app.configure('production', function(){
    app.use(express.static(path.normalize(__dirname + '/../dist')));
});

//port to 8080
var port = Number(process.env.PORT || 8080);
server.listen(port);
console.log('http server listening on port ' + port + ' in ' + app.settings.env + ' mode');

//send history on connection (in parallel)
//redis pipes data so it's in order
common.io.sockets.on('connection', function(socket) {
    // console.log('client connected', socket.id);

    socket.on('graphInfo', function(data){
        var granularityLabel = data.step;
        if (ts.granularities.hasOwnProperty(granularityLabel)) {
            granularityDuration = ts.granularities[granularityLabel].duration;
            // console.log(granularityLabel,granularityDuration);
            async.parallel(tss.commands.map(
                function(cmd) {
                    return tss.createHandler(cmd, 720, granularityLabel);
                }), function(err, data) {
                        socket.emit('history',data);
                    });
            setInterval(function() {
                async.parallel(tss.commands.map(
                    function(cmd) {
                        return tss.createHandler(cmd, 1, granularityLabel);
                    }), function(err, data) {
                            socket.emit('realtime',data);
                        });
            }, granularityDuration*1000);
        }
    });
});
