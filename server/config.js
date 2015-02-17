var nconf = require('nconf').argv().env().file({ file:'config.json' });

//list of commands to keep
var commands = [
    'left', 'right', 'up', 'down',
    'start', 'select',
    'a', 'b',
    'democracy', 'anarchy'
];

var username = process.env.TWITCH_USERNAME || nconf.get('TWITCH_USERNAME');
var oauth = process.env.TWITCH_OAUTH || nconf.get('TWITCH_OAUTH');

module.exports = {
    // ip: irc.twitch.tv (used to be 199.9.252.26 for TPP?)
    server: 'irc.twitch.tv',
    // your twitch username
    userName: username,
    // get your oauth token from www.twitchapps.com/tmi
    password: oauth,
    // or if you want to join more than one channel
    channelList: ['#twitchplayspokemon'],
    // if you want to get all messages in real-time use false
    floodProtection: false,
    //matches for any of the words in 'commands' including added digits
    regexCommands: new RegExp('^(' + commands.join('|') + ')\\d?$', 'i')
};
