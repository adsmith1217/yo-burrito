# 🌯 yo burrito

![yo burrito](https://heroku-www-files.s3.amazonaws.com/starbot/starbot-banner.png)

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

Reward your teammates with burritos!


### Supported `/slash` commands

Create a `/burrito` [custom slash command](https://api.slack.com/slash-commands), using the URL: `{app-name}.herokuapp.com/commands/burrito`. *Take note of the provided `token`, this is used to verify requests come from Slack.*

- `/burrito` or `/burrito help` - list available commands
- `/burrito leaderboard` - top 10 burrito earners
- `/burrito mine` - your # of awarded burritos

### Install

```shell
$ npm install
```

### Copy `.env-example` to `.env`

```shell
$ cp .env-example .env
```

### Configure

```shell
SLACK_TEAM_TOKEN=xoxb...8WRqKWx
NODE_ENV=development
PORT=3000
```
### Run

```shell
$ npm start

🤖🌯  Yo Burrito LIVES on PORT 3000
```

Visit [localhost:3000](http://localhost:3000).

### Deploy

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

_Or with the [Heroku Toolbelt](https://toolbelt.heroku.com)_

```shell
$ heroku create {optional-app-name}

Creating app... done, stack is cedar-14
https://blooming-scrubland-64464.herokuapp.com/

$ git push heroku master
...
remote: -----> Node.js app detected
...
remote:        https://blooming-scrubland-64464.herokuapp.com/ deployed to Heroku
...
To https://git.heroku.com/blooming-scrubland-64464.git
 * [new branch]      master -> master

$ heroku open
```

### License

**[This project is licensed under the terms of the MIT license.](http://license-me.herokuapp.com)**
 -- [_Need your own? There's a button for that :wink:_](https://github.com/mattcreager/license)
