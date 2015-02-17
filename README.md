TPP Stats
--------------

[![Dependency Status]](https://david-dm.org/hzoo/tppstats)

![](https://i.imgur.com/8AiwsdT.png)

To run:
- Start a local copy of [redis](http://redis.io/download#installation)
    - `./src/redis-server`
- `npm install`
- `bower install`
- Create a `config.json` file (to store your twitch name and oauth token)
    + go to http://www.twitchapps.com/tmi to get your token
```js
// config.json
{
    // you can also set the environment variables in node (for heroku)
    "TWITCH_OAUTH": "OAUTH_HERE"
    "TWITCH_USERNAME": "TWITCH_NAME_HERE"
}
```
- run `npm start`
- go to `localhost:8080` (default ip)

Building/Contributing
- `npm install` and `bower install` when needed
- run `npm run lint` to check jshint/jscs
- run `grunt build` (at the moment the `dist/` folder is commited)

TODO
- refactor everything
- update grunt/use something else
- update socket.io, other packages
- babel: use generators
- remove `dist/` and be able to deploy

[Dependency Status]: https://img.shields.io/david/hzoo/tppstats.svg?style=flat-square
