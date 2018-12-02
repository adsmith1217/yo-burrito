
'use strict'

const _ = require('lodash')
const config = require('../config')

const msgDefaults = {
    response_type: 'in_channel',
    username: 'yo_burrito',
    icon_emoji: config('ICON_EMOJI')
}

let attachments = [
    {
        title: '🌯 leaderboard',
        color: '#2FA44F',
        text: '#1\n' +
                '#2\n' +
                '...\n',
        mrkdwn_in: ['text']
    }
]

const handler = (payload, res) => {
    console.log('leaderboard command')
    let msg = _.defaults({
        channel: payload.channel_name,
        attachments: attachments
    }, msgDefaults)

    res.set('content-type', 'application/json')
    res.status(200).json(msg)
    return
}

module.exports = { pattern: /leaderboard/ig, handler: handler }
