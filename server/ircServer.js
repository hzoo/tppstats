var irc = require('irc'),
// printf = require('printf'),
// keyHandler = require('./keyHandler.js'),
config = require('./config.js'),
common = require('./common.js'),
ts = require('./redisServer.js').ts,
redisClient = require('./redisServer.js').client;

var client = new irc.Client(config.server, config.nick, {
    channels: config.channelList,
    port: config.port,
    sasl: config.sasl,
    nick: config.nick,
    userName: config.nick,
    password: config.password,
    floodProtection: config.floodProtection,
    floodProtectionDelay: config.floodProtectionDelay,
    autoConnect: false,
    autoRejoin: true
});

var commandsBufferLength = 100,
commandsBuffer = [],
politicsBufferLength = 1000,
politicsBuffer = [];

function addToBuffers(from, command) {
    // if (commandsBuffer.length >= commandsBufferLength) {
    //     commandsBuffer.shift();
    // }
    // commandsBuffer.push(command);
    // if (command === 'm' || command === 'n') {
    //     if (politicsBuffer.length >= politicsBufferLength) {
    //         politicsBuffer.shift();
    //     }
    //     politicsBuffer.push(command);
    // }

    //redis
    // var date = Date.now();
    // redisClient.zadd('commands',date,command+ '' +date);
    // if (command === 'm' || command === 'n') {
    //     // redisClient.zadd('politics',date,{'t': date, 'c': command});
    //     redisClient.zadd('politics',date,command+ '' +date);
    // }

    //with redis-timeseries
    ts.recordHit(command).exec();
}

function shorten(message) {
    var command, sub = message.slice(0,2).toLowerCase(), firstLetter = sub[0];
    if (sub === 'se') { command = 'e'; } //select
    else if (sub === 'an') { command = 'n'; } //anarchy
    else if (sub === 'de') { command = 'm'; } //democracy
    else { command = firstLetter.toLowerCase(); }
    return command;
}

client.addListener('message' + config.channel, function(from, message) {
    if (message.match(config.regexCommands)) {
        //shorten data to send
        var command = shorten(message);
        //add to buffers
        addToBuffers(from,command);

        //send to clients
        // common.io.sockets.emit('cmd',command);
    }
});

// var stepInterval = 5000;
// setInterval(function() {
//     //redis
//     var now = Date.now();
//     redisClient.zrangebyscore(['commands',now-stepInterval,now], function(err, res) {
//         if (err) {
//             console.log('Error: ', err);
//         }
//         common.io.sockets.emit('lastCmds',res);
//     });
// }, stepInterval);

//when a connection starts, send buffer (last x commands)
common.io.sockets.on('connection', function(socket) {
    //redis multi
    // var multi = redisClient.multi();
    // multi.zrevrange('commands',-1*commandsBufferLength,-1);
    // multi.zrevrange('politics',-1*politicsBufferLength,-1);
    // // drains multi queue and runs atomically
    // multi.exec(function (err, replies) {
    //     socket.emit('i', { 'cb': commandsBuffer, 'pb': politicsBuffer } );
    // });

    //redis-timeseries
    // ts.getHits(key, '1minute', 20, function(err, data) {
    //     // data.length == count
    //     // data = [ [ts1, count1], [ts2, count2]... ]
    //     if (err) {
    //         console.log('Error: ', err);
    //     } else {
    //         console.log('Data: ', data);
    //     }
    // });

    //redis
    // redisClient.zrevrange(['commands',-1*commandsBufferLength,-1], function(err, res) {
    //     // socket.emit('i', { 'cb': commandsBuffer} );
    //     if (err) {
    //         console.log('Error: ', err);
    //     }
    //     socket.emit('cb', res);
    // });
    // redisClient.zrevrange(['politics',-1*politicsBufferLength,-1], function(err, res) {
    //     // socket.emit('i', { 'pb': politicsBuffer} );
    //     if (err) {
    //         console.log('Error: ', err);
    //     }
    //     socket.emit('pb', res);
    // });

    //socket.emit('cb', commandsBuffer);
    //socket.emit('pb', politicsBuffer);
});

client.addListener('error', function(message) {
    console.log('error: ', message);
});

client.connect();
