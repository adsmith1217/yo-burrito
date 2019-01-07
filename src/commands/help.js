
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
        title: 'Yo Burrito - because Hey Taco was too expensive',
        color: '#2FA44F',
        text: 'Use @someone + Burrito Emoji to give a burrito\n' +
                '`/burrito leaderboard` - top 10 burrito earners\n' +
                '`/burrito mine` - your # of awarded burritos\n' +
                '`/burrito roadmap` - shows a list of future features\n' +
                '`/burrito help` - you\'re lookin at it!\n' +
                ' \n' +
                'Want to bring Yo Burrito to your own channel?\n' +
                'Use `/invite @yo_burrito`\n' +
                ' \n' +
                'Questions? Ask Adam Smith (amsmith@wmp.com) or #yo-burrito\n' +
                ' \n' +
                'Repository: https://github.com/wmpcx/yo-burrito\n',
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
