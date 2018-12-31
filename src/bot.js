
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
    console.log(`🤖🌯  Incoming message: "${msg.text}"`)

    // Has /🌯: don't do anything
    if (_.includes(msg.text, '/burrito')) return

    //@yo_burrito says hey
    if(_.includes(msg.text.match(/<@([A-Z0-9])+>/igm), `<@${this.self.id}>`)) {
        slack.chat.postMessage({
            token: config('SLACK_TOKEN'),
            icon_emoji: config('ICON_EMOJI'),
            channel: msg.channel,
            username: 'Yo Burrito',
            text: `Hi, <@${msg.user}>! :wave:\n` +
                    `I\'m yo_burrito, hey_taco\'s thrifty cousin\n` +
                    `Not sure what to do? Try \`/burrito\` for help`
        }, (err, data) => {
            if (err) throw err

            let txt = _.truncate(data.message.text)

            console.log(`🤖🌯  I said: "${txt}"`)
        })
        return
    }

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
        let allowanceCheckQuery = `SELECT daily_allowance FROM burritos_by_user` +
                ` WHERE user_id = '${msg.user} LIMIT 1';`
        console.log('allowanceCheckQuery', allowanceCheckQuery)

        const getAllowance = new Promise(
            (resolve, reject) => {
                connection.query(allowanceCheckQuery, (err, rows, fields) => {
                    if (err) throw err
                    console.log('rows[0] undefined check')
                    console.log(rows)
                    console.log(rows[0])
                    if(typeof rows[0] !== 'undefined') {
                        console.log('made it through check')
                        let dailyAllowance = rows[0].daily_allowance
                        console.log(msg.user + ' daily allowance: ' + dailyAllowance)
                        if(dailyAllowance <= 0) {
                            console.log('not enough allowance')
                            reject('Not enough allowance')
                        }
                        resolve()
                    } else {
                        reject('Rows undefined')
                    }
                })
            }
        )


        // connection.query(allowanceCheckQuery, (err, rows, fields) => {
        //     if (err) throw err
        //     console.log('rows[0] undefined check')
        //     console.log(rows)
        //     console.log(rows[0])
        //     if(typeof rows[0] !== 'undefined') {
        //         console.log('made it through check')
        //         let dailyAllowance = rows[0].daily_allowance
        //         console.log(msg.user + ' daily allowance: ' + dailyAllowance)
        //         if(dailyAllowance <= 0) {
        //             console.log('not enough allowance')
        //             return
        //         }
        //     }
        // })

        const giveBurrito = function() {
            getAllowance
                .then(res => {
                    let givenTo = msg.text.match(/<@([A-Z0-9])+>/im)
                    givenTo = givenTo[0].substring(2, givenTo[0].length - 1)

                    // Prevent self gifting
                    if(msg.user === givenTo) {
                        console.log('trying to give burrito to self')
                        slack.chat.postMessage({
                            token: config('SLACK_TOKEN'),
                            icon_emoji: config('ICON_EMOJI'),
                            channel: msg.channel,
                            username: 'Yo Burrito',
                            text: 'You can\'t give burritos to yourself, silly!'
                        }, (err, data) => {
                            if (err) throw err
                            let txt = _.truncate(data.message.text)
                            console.log(`🤖🌯  I said: "${txt}"`)
                        })
                        return
                    }

                    // TODO: condense into one query and add usernames to insert query
                    let timestamp = new Date().getTime()
                    let masterInsertQuery = `INSERT INTO burritos_master (burrito_id, given_by_username,` +
                            ` given_to_username, given_by_id, given_to_id, message, timestamp)` +
                            ` VALUES (NULL, NULL, NULL, '${msg.user}', '${givenTo}', '${msg.text}', '${timestamp}');`
                    let givenToUpdateQuery = `INSERT INTO burritos_by_user (user_id, total_burritos, daily_allowance, last_activity)` +
                            ` VALUES ('${givenTo}', 1, 5, NULL) ON DUPLICATE KEY UPDATE total_burritos = total_burritos + 1;`
                    let allowanceUpdateQuery = `INSERT INTO burritos_by_user (user_id, total_burritos, daily_allowance, last_activity)` +
                            ` VALUES ('${msg.user}', 0, 4, ${timestamp}) ON DUPLICATE KEY UPDATE daily_allowance = daily_allowance - 1,` +
                            ` last_activity = ${timestamp};`
                    console.log('masterInsertQuery', masterInsertQuery)
                    console.log('givenToUpdateQuery', givenToUpdateQuery)
                    console.log('allowanceUpdateQuery', allowanceUpdateQuery)

                    connection.query(masterInsertQuery, (err, rows, fields) => {
                        if (err) throw err
                        console.log('Added to burritos_master')
                    })
                    connection.query(givenToUpdateQuery, (err, rows, fields) => {
                        if (err) throw err
                        console.log('Updated burritos_by_user given_to')
                    })
                    connection.query(allowanceUpdateQuery, (err, rows, fields) => {
                        if (err) throw err
                        console.log('Updated burritos_by_user allowance')
                    })

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
            })
            .catch(error => console.log(error))
        }

        giveBurrito()
    }

})

module.exports = bot
