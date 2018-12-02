
'use strict'

const slack = require('slack')
const _ = require('lodash')
const config = require('./config')

let bot = slack.rtm.client()

bot.started((payload) => {
    this.self = payload.self
})

bot.message((msg) => {
    if (!msg.user) return
    // if (!_.includes(msg.text.match(/<@([A-Z0-9])+>/igm), `<@${this.self.id}>`)) return

    //🌯
    if(_.includes(msg.text.match(/:burrito:/igm))) {
        slack.chat.postMessage({
            toekn: config('SLACK_TOKEN'),
            icon_emoji: config('ICON_EMOJI'),
            channel: msg.channel,
            username: 'yo_burrito',
            text: 'giving a burrito to @username'
        }, (err, data) => {
            if (err) throw err

            let txt = _.truncate(data.message.text)

            console.log(`🤖🌯  I said: "${txt}"`)
        })
        return
    }

    //@yo_burrito
    if(_.includes(msg.text.match(/<@([A-Z0-9])+>/igm), `<@${this.self.id}>`)) {
        slack.chat.postMessage({
            token: config('SLACK_TOKEN'),
            icon_emoji: config('ICON_EMOJI'),
            channel: msg.channel,
            username: 'yo_burrito',
            text: 'Hi, ' + msg.user + '! I\'m hey_taco\'s thrifty cousin'
        }, (err, data) => {
            if (err) throw err
    
            let txt = _.truncate(data.message.text)
    
            console.log(`🤖🌯  I said: "${txt}"`)
        })
        return
    }

})

module.exports = bot
