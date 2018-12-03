
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
    
    // 🚫🌯 no burrito: don't do anything
    if (!_.includes(msg.text, ':burrito:')) return

    // TODO: fix this infinite loop
    // 🌯 & 🚫😀 burrito but no mention: instruct the user to include a mention
    // if (!_.includes(msg.text, /<@([A-Z0-9])+>/igm)) {
    //     slack.chat.postMessage({
    //         token: config('SLACK_TOKEN'),
    //         icon_emoji: config('ICON_EMOJI'),
    //         channel: msg.channel,
    //         username: 'yo_burrito',
    //         text: 'Trying to send someone a 🌯? Try mentioning them using @'
    //     }, (err, data) => {
    //         if (err) throw err

    //         let txt = _.truncate(data.message.text)

    //         console.log(`🤖🌯  I said: "${txt}"`)
    //     })
    //     return
    // }

    // 🌯 & 😀 burrito and mention: give that mention a burrito!
    if(_.includes(msg.text, ':burrito:')) {
        let givenTo = msg.text.match(/<@([A-Z0-9])+>/igm)
        givenTo = givenTo.substring(2, givenTo.length - 1)
        console.log('givenTo', givenTo)
        let timestamp = + new Date()
        console.log('timestamp', timestamp)
        let insertQuery = `INSERT INTO burritos_master (burrito_id, given_by_username, given_to_username, given_by_id, given_to_id, message, timestamp)` +
        `VALUES (1, 'NULL', 'NULL', ${msg.user}, ${givenTo}, ${msg.text}, ${timestamp});`

        connection.connect();
        connection.query(insertQuery, function(err, rows, fields) {
            if (err) throw err;
            console.log('Burrito given: ', rows[0].solution);
        });
        connection.end();

        slack.chat.postMessage({
            token: config('SLACK_TOKEN'),
            icon_emoji: config('ICON_EMOJI'),
            channel: msg.channel,
            username: 'yo_burrito',
            text: `giving a burrito to ${givenTo}`
        }, (err, data) => {
            if (err) throw err

            let txt = _.truncate(data.message.text)

            console.log(`🤖🌯  I said: "${txt}"`)
        })
        return
    }

    //@yo_burrito says hey
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
