var nconf = require('nconf').argv().env().file({ file:'config.json' });

//list of commands to filter for
var commands = [
    'left', 'right', 'up', 'down',
    'start', 'select',
    'a', 'b',
    'democracy', 'anarchy'
];

var username = process.env.TWITCH_USERNAME || nconf.get('TWITCH_USERNAME');
var oauth = process.env.TWITCH_OAUTH || nconf.get('TWITCH_OAUTH');

module.exports = {
    // ip: irc.twitch.tv (used to be 199.9.252.26 for tpp)
    server: 'irc.twitch.tv',
    // your twitch username (for both nick/userName)
    nick: username,
    userName: username,
    // get your oauth token from www.twitchapps.com/tmi
    password: oauth,
    // channel: #twitchplayspokemon
    channel: '#twitchplayspokemon',
    // only if you want to join more than one channel
    channelList: ['#twitchplayspokemon'],

    // default is 6667
    port: 6667,
    // don't need anymore?
    sasl: false,
    // if you want to get all messages in real-time use false
    floodProtection: false,
    // only needed if floodProtection is true (in milliseconds)
    floodProtectionDelay: 100,

    //commands
    //matches for any of the words in 'commands' including added digits
    regexCommands: new RegExp('^(' + commands.join('|') + ')\\d?$', 'i')
};
