
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
        title: 'Yo Burrito Roadmap',
        color: '#2FA44F',
        text: '1) Support gifting to multiple users in a single message\n' +
                '2) Super Burritos - TBD\n' +
                '3) Burrito Ranking System\n' +
                '4) Burrito ordering system (for purchasing of real life burritos!)\n' +
                '5) Frontend site (yo-burrito.herokuapp.com)\n' +
                '6) Geolocation-based burrito restaurant locator\n' +
                ' \n' +
                '*Have an idea you\'d like to see here?*\n' +
                '_Head over to #yo-burrito or contact Adam Smith (amsmith@wmp.com)_\n' +
                ' \n' +
                'Buy Adam a burrito: Venmo @Adam-Smith-2369\n',
        mrkdwn_in: ['text']
    }
]

const handler = (payload, res) => {
    console.log('roadmap command')
    let msg = _.defaults({
        channel: payload.channel_name,
        attachments: attachments
    }, msgDefaults)

    res.set('content-type', 'application/json')
    res.status(200).json(msg)
    return
}

module.exports = { pattern: /roadmap/ig, handler: handler }
