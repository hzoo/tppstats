//create web server, socket.io
var async = require('async'),
    common = require('./commonServer');

require('./ircServer');

var ts = require('./redisServer.js').ts;
var shortendCommands = ['a','b','u','l','r','d','s','e','n','m'];

function createHandler(command, count, granularityLabel) {
    return function(callback) {
        ts.getHits(command, granularityLabel, count, function(err, data) {
            if (err) {
                console.log('err: ' + err);
            } else {
                var temp = data.map(function(data) {
                    //only return # of hits, not the unix time
                    return data[1];
                });
                callback(null, temp);
            }
        });
    };
}

//send history on connection (in parallel)
//redis pipes data so it's in order
common.io.sockets.on('connection', function(socket) {
    // console.log('client connected', socket.id);

    socket.on('graphInfo', function(data) {
        var granularityLabel = data.step;
        if (ts.granularities.hasOwnProperty(granularityLabel)) {
            var granularityDuration = ts.granularities[granularityLabel].duration;
            // console.log(granularityLabel,granularityDuration);

            // send historical data
            async.parallel(shortendCommands.map(
                function(cmd) {
                    return createHandler(cmd, 720, granularityLabel);
                }), function(err, data) {
                        socket.emit('history', data);
                    });
            // send new data every sec
            setInterval(function() {
                async.parallel(shortendCommands.map(
                    function(cmd) {
                        return createHandler(cmd, 1, granularityLabel);
                    }), function(err, data) {
                            socket.emit('realtime', data);
                        });
            }, granularityDuration * 1000);
        }
    });
});
