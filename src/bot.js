
'use strict'

const slack = require('slack')
const _ = require('lodash')
const config = require('./config')
const mysql = require('mysql');
const connection = mysql.createConnection(process.env.JAWSDB_MARIA_URL);

let bot = slack.rtm.client()

bot.started((payload) => {
    this.self = payload.self
})

bot.message((msg) => {
    console.log(`🤖🌯 Incoming message: "${msg.text}"`)
    if (!msg.user) return
    // if (!_.includes(msg.text.match(/<@([A-Z0-9])+>/igm), `<@${this.self.id}>`)) return

    //🌯
    // if(_.includes(msg.text.match(/:burrito:/igm), )) {
    if(_.includes(msg.text, ':burrito:')) {
        // Insert a burrito for the given user by the message sender
        connection.connect();
        connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
        if (err) throw err;
        console.log('Burrito given: ', rows[0].solution);
        });
        connection.end();

        slack.chat.postMessage({
            token: config('SLACK_TOKEN'),
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
            text: `Hi, ${msg.user}! I\'m yo_burrito, hey_taco\'s thrifty cousin`
        }, (err, data) => {
            if (err) throw err
    
            let txt = _.truncate(data.message.text)
    
            console.log(`🤖🌯  I said: "${txt}"`)
        })
        return
    }

})

module.exports = bot
