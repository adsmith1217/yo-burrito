
'use strict'

const dotenv = require('dotenv')
const ENV = process.env.NODE_ENV || 'development'

if (ENV === 'development') dotenv.load()

const config = {
    ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    PROXY_URI: process.env.PROXY_URI,
    WEBHOOK_URL: process.env.WEBHOOK_URL,
    BURRITO_COMMAND_TOKEN: process.env.BURRITO_COMMAND_TOKEN, // TODO: switch auth strategy to use signing secret https://api.slack.com/docs/verifying-requests-from-slack
    SLACK_TOKEN: process.env.SLACK_TOKEN,
    ICON_EMOJI: ':burrito:'
}

module.exports = (key) => {
    if (!key) return config
    return config[key]
}
