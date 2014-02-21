var irc = require('irc'),
printf = require('printf'),
keyHandler = require('./keyHandler.js'),
config = require('./config.js'),
common = require('./common.js');

var client = new irc.Client(config.server, config.nick, {
    channels: config.channelList,
    port: config.port,
    sasl: config.sasl,
    nick: config.nick,
    userName: config.nick,
    password: config.password,
    floodProtection: config.floodProtection,
    floodProtectionDelay: config.floodProtectionDelay,
    autoConnect: false
});

var commands = [
    "left", "right", "up", "down", "start", "select", "a", "b", "democracy", "anarchy"                                         
],
anarchy = true,
anarchyRegex = new RegExp("^(" + commands.join("|") + ")$", "i"),
democracyRegex = new RegExp("^((" + commands.join("|") + ")\\d?)$", "i");
var regex = anarchyRegex;

function shorten(message) {
    var command, sub = message.slice(0,2).toLowerCase(), firstLetter = sub[0];
    if (sub === 'se') { command = 'e'; } //select
    else if (sub === 'an') { command = 'n'; } //anarchy
    else if (sub === 'de') { command = 'm'; } //democracy
    else { command = firstLetter; }
    return command;
}

client.addListener('message' + config.channel, function (from, message) {
    if (message.match(regex)) {
        //shorten data to send
        var command = shorten(message);
        //send to clients
        common.io.sockets.emit('k', { 'k': command } );
    }
});

// client.addListener('message' + config.channel, function (from, message) {
//     //check if the message matches the filter
//     var regex = (anarchy === true) ? anarchyRegex : democracyRegex;
//     if (message.match(regex)) {

//         //only log first x letters
//         var maxChar = 8,
//         logFrom = from.substring(0,maxChar),
//         logMessage = message.substring(0,6).toLowerCase();
//         //format log
//         console.log(printf('%-' + maxChar + 's % 7s',logFrom,logMessage));

//         if (viz) {
//             //shorten commands
//             var command, sub = message.slice(0,2).toLowerCase(), firstLetter = sub[0];
//             if (sub === 'se') { command = 'e'; } //select
//             else if (sub === 'an') { command = 'n'; } //anarchy
//             else if (sub === 'de') { command = 'm'; } //democracy
//             else { command = firstLetter; }

//             //send command to client
//             io.sockets.emit('k', { 'k': command } );
//         }
//         if (key) {
//             //send key to program
//             keyHandler.sendKey(message,'Desmume');
//         }
//     } else {
//         //if you want to log messages that don't match
//         if (logAll) {
//             console.log('|' + from + ": " + message);
//         }
//     }
// });

client.addListener('error', function(message) {
    console.log('error: ', message);
});

client.connect();
