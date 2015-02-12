//list of commands to filter for
var commands = [
    'left', 'right', 'up', 'down', 'start', 'select', 'a', 'b', 'democracy', 'anarchy','wait'
];

var ircConfig = {
    //IRC
    //ex: irc.twitch.tv or 199.9.252.26
    // server: '199.9.252.26',
    server: 'irc.twitch.tv',
    //ex: your twitch username
    nick: 'twitchtypes',
    //ex: your twitch username
    userName: 'twitchtypes',
    //oauth token from www.twitchapps.com/tmi
    password: 'PASSWORD_HERE',
    //ex: #twitchplayspokemon
    channel: '#twitchplayspokemon',
    //if you want to join more than one channel
    channelList: ['#twitchplayspokemon'],

    //other IRC
    //default
    port: 6667,
    //needed for password
    sasl: false,
    //if you want to get all messages in real-time keep false
    floodProtection: false,
    //only needed if true - in milliseconds
    floodProtectionDelay: 100,

    //commands
    //example of regex
    //don't need to modify if you need anarchy mode
    //matches for any of the words in 'commands'
    regexCommands: new RegExp('^(' + commands.join('|') + ')\d?$', 'i')
};

module.exports = ircConfig;
