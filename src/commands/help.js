
'use strict'

const _ = require('lodash')
const config = require('../config')

const msgDefaults = {
    response_type: 'ephemeral',
    username: 'Yo Burrito',
    icon_emoji: config('ICON_EMOJI')
}

let attachments = [
    {
        title: 'Yo Burrito - because hey_taco was too expensive',
        color: '#2FA44F',
        text: 'Use @someone + Burrito Emoji to give a burrito \n' +
                '`/burrito leaderboard` - top 10 burrito earners\n' +
                '`/burrito mine` - your # of awarded burritos\n' +
                '`/burrito help` ... you\'re lookin at it!\n',
        mrkdwn_in: ['text']
    }
]

const handler = (payload, res) => {
    console.log('help command')
    let msg = _.defaults({
        channel: payload.channel_name,
        attachments: attachments
    }, msgDefaults)

    res.set('content-type', 'application/json')
    res.status(200).json(msg)
    return
}

module.exports = { pattern: /help/ig, handler: handler }
