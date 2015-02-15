TPP Stats
--------------

![](https://i.imgur.com/8AiwsdT.png)

To run:
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
- run `node ./server/server.js`
- go to `localhost:8080` (default ip)

Building/Contributing
- `npm install` and `bower install` when needed
- run `grunt build` (at the moment the `dist/` folder is commited)

TODO
- refactor everything
- update grunt/use something else
- update socket.io, other packages
- remove `dist/` and be able to deploy
