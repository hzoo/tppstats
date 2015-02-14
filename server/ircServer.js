var irc = require('irc'),
config = require('./config.js'),
ts = require('./redisServer.js').ts;

var common = require('./commonServer');

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
}),
commandsBufferLength = 100,
commandsBuffer = [],
streamerBufferLength = 50,
streamerBuffer = [];
function addToBuffers(from, command) {
    if (commandsBuffer.length >= commandsBufferLength) {
        commandsBuffer.shift();
    }
    commandsBuffer.push(command);
    // console.log(from,command);
    // with redis-timeseries
    ts.recordHit(command).exec();
}

function shorten(message) {
    var command, sub = message.slice(0, 2).toLowerCase(), firstLetter = sub[0];
    if (sub === 'se') { command = 'e'; } //select
    else if (sub === 'an') { command = 'n'; } //anarchy
    else if (sub === 'de') { command = 'm'; } //democracy
    else { command = firstLetter.toLowerCase(); }
    return command;
}

client.addListener('message' + config.channel, function(from, message) {
    var trimMessage = message.trim();
    if (trimMessage.substring(0, 6) === '!move ' && trimMessage.substring(6).match(config.regexCommands)) {
        trimMessage = trimMessage.substring(6);
    }
    if (trimMessage.match(config.regexCommands)) {
        console.log(trimMessage);
        //shorten data to send
        var command = shorten(message);
        //add to buffers
        addToBuffers(from, command);

        //send to clients
        common.io.sockets.emit('cmd', command);
    } else if (from === 'twitchplayspokemon') {
        if (streamerBuffer.length >= streamerBufferLength) {
            streamerBuffer.shift();
        }
        streamerBuffer.push(message);
        common.io.sockets.emit('streamer', message);
    }
});

//when a connection starts, send buffer (last x commands)
common.io.sockets.on('connection', function(socket) {
    socket.emit('cb', commandsBuffer);
    socket.emit('sb', streamerBuffer);
});

client.addListener('error', function(message) {
    console.log('error: ', message);
});

client.connect();
console.log('irc client on ' + config.channel);
