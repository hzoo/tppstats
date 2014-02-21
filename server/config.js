var ircConfig = {
	//ex: irc.twitch.tv
	server: '199.9.252.26',
	//nick and username usually the same
	//your twitch username
	nick: 'twitchtypes',
	userName: 'twitchtypes',
	//ex: #twitchplayspokemon
	channel: '#twitchplayspokemon',
	//if joining more than one channel
	channelList: ['#twitchplayspokemon'],
	//default
	port: 6667,
    //needed for password
    sasl: true,
	//oauth token from www.twitchapps.com/tmi
	password: 'PASSWORD_HERE',
	//if you want to get all messages in real-time
	floodProtection: false,
    //only needed if true - in milliseconds
    floodProtectionDelay: 100
};

module.exports = ircConfig;
