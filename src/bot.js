
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

    // Has /🌯: don't do anything
    if (_.includes(msg.text, '/burrito')) return

    // 🚫🌯 no burrito: don't do anything
    if (!_.includes(msg.text, ':burrito:')) return

    // 🌯 & 🚫😀 burrito but no mention: instruct the user to include a mention
    if (!_.includes(msg.text, /<@([A-Z 0-9])+>/igm) && _.includes(msg.text, /</igm)) {
        slack.chat.postMessage({
            token: config('SLACK_TOKEN'),
            icon_emoji: config('ICON_EMOJI'),
            channel: msg.channel,
            username: 'Yo Burrito',
            text: 'Trying to send someone a burrito? Try mentioning them using @'
        }, (err, data) => {
            if (err) throw err

            let txt = _.truncate(data.message.text)

            console.log(`🤖🌯  I said: "${txt}"`)
        })
        return
    }

    // 🌯 & 😀 burrito and mention: give that mention a burrito!
    if(_.includes(msg.text, ':burrito:')) {

        // Check if the generous burrito gifter can give a burrito
        let allowanceCheckQuery = `SELECT daily_allowance AS result FROM burritos_by_user
                WHERE user_id = '${msg.user}'`
        connection.connect()
        connection.query(allowanceCheckQuery, (err, rows, fields) => {
            if (err) throw err
            let result = rows[0].result
            console.log(msg.user + ' daily allowance: ' + result)
            if(result = 0) return
        })
        connection.end()



        let givenTo = msg.text.match(/<@([A-Z0-9])+>/im)
        givenTo = givenTo[0].substring(2, givenTo[0].length - 1)
        // let timestamp = + new Date()
        let timestamp = new Date()
        console.log('timestamp: ' + timestamp)

        // TODO: add usernames and message context to insert query
        // TODO: fix timestamp
        let masterInsertQuery = `INSERT INTO burritos_master (burrito_id, given_by_username,
                given_to_username, given_by_id, given_to_id, message, timestamp)` +
                `VALUES (NULL, NULL, NULL, '${msg.user}', '${givenTo}', NULL, '${timestamp}');`
        let givenToUpdateQuery = `UPDATE burritos_by_user SET total_burritos = total_burritos + 1` +
                `WHERE user_id = '${givenTo}';`
        let allowanceUpdateQuery = `UPDATE burritos_by_user SET daily_allowance = daily_allowance - 1` +
        `WHERE user_id = '${msg.given}';`
        console.log('masterInsertQuery', masterInsertQuery)
        console.log('givenToUpdateQuery', givenToUpdateQuery)
        console.log('allowanceUpdateQuery', allowanceUpdateQuery)

        connection.connect()
        connection.query(masterInsertQuery, (err, rows, fields) => {
            if (err) throw err
            console.log('Added to burritos_master: ', rows[0])
        })
        connection.query(givenToUpdateQuery, (err, rows, fields) => {
            if (err) throw err
            console.log('Updated burritos_by_user given_to: ', rows[0])
        })
        connection.query(allowanceUpdateQuery, (err, rows, fields) => {
            if (err) throw err
            console.log('Updated burritos_by_user allowance: ', rows[0])
        })
        connection.end()

        // TODO: error handling and confirmation based on SQL result
        slack.chat.postMessage({
            response_type: 'ephemeral',
            token: config('SLACK_TOKEN'),
            icon_emoji: config('ICON_EMOJI'),
            channel: msg.channel,
            username: 'Yo Burrito',
            text: `Giving a burrito to <@${givenTo}>`
        }, (err, data) => {
            if (err) {
                slack.chat.postMessage({
                    response_type: 'ephemeral',
                    token: config('SLACK_TOKEN'),
                    icon_emoji: config('ICON_EMOJI'),
                    channel: msg.channel,
                    username: 'Yo Burrito',
                    text: `There was an error sending your burrito to <@${givenTo}> :(`
                })
                throw err
            }

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
            username: 'Yo Burrito',
            text: `Hi, ${msg.user}! :wave:\n
                    I\'m yo_burrito, hey_taco\'s thrifty cousin\n
                    Not sure what to do? Try \`/burrito\` for help`
        }, (err, data) => {
            if (err) throw err

            let txt = _.truncate(data.message.text)

            console.log(`🤖🌯  I said: "${txt}"`)
        })
        return
    }

})

module.exports = bot
