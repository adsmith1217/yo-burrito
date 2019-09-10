
'use strict'

const slack = require('slack')
const _ = require('lodash')
const config = require('./config')
const mysql = require('mysql')
let connection = mysql.createConnection(process.env.JAWSDB_MARIA_URL)

let bot = slack.rtm.client()

bot.started((payload) => {
    this.self = payload.self
})

bot.message((msg) => {
    console.log(`console log - 🤖🌯  Incoming message: "${msg.text}"`)
    console.log('console log - msg:')
    console.log(msg)

    // Prevent secondary thread message
    if (msg.message) {
        console.log('console log - skipping due to secondary thread message')
        return
    }
    console.log('console log - passed secondary thread message check')

    // Check for a message sender
    if (!msg.user) {
        console.log('console log - skipping due to null message sender')
        return
    }
    console.log('console log - passed null message sender check')

    // Has /🌯 command: don't do anything
    if (_.includes(msg.text, '/burrito')) {
        console.log('console log - skipping due to slash command')
        return
    }
    console.log('console log - passed slash command check')

    // @yo_burrito says hey
    if (_.includes(msg.text.match(/<@([A-Z0-9])+>/igm), `<@${this.self.id}>`) && msg.user != this.self.id) {
        slack.chat.postMessage({
            token: config('SLACK_TOKEN'),
            icon_emoji: config('ICON_EMOJI'),
            channel: msg.channel,
            username: 'Yo Burrito',
            text: `Hi, <@${msg.user}>! :wave:\n` +
                `I\'m Yo Burrito, Hey Taco\'s thrifty cousin\n` +
                `Not sure what to do? Try \`/burrito\` for help`
        }, (err, data) => {
            if (err) {
                console.log('console log - error during yo_burrito saying hi')
                throw err
            }
            let txt = _.truncate(data.message.text)
                console.log(`console log - 🤖🌯  I said: "${txt}"`)
        })
        return
    }
    console.log('console log - passed saying hi check')

    // 🚫🌯||:wmp: no burrito or WMP spinner: don't do anything
    if (!(_.includes(msg.text, ':burrito:') || _.includes(msg.text, ':wmp:'))) {
        console.log('console log - skipping due to no burrito or spinner')
        return
    }
    console.log('console log - passed no burrito or spinner check')

    // 🌯||:wmp: & 🚫😀 burrito but no mention: instruct the user to include a mention
    if (!msg.text.match(/<@([A-Z0-9])+>/im)) {
        slack.chat.postMessage({
            response_type: 'ephemeral',
            token: config('SLACK_TOKEN'),
            icon_emoji: config('ICON_EMOJI'),
            channel: msg.user,
            username: 'Yo Burrito',
            text: 'Trying to send someone a burrito or :wmp:? Try mentioning them using @'
        }, (err, data) => {
            if (err) {
                console.log('console log - error telling user to include a mention')
                throw err
            }
            let txt = _.truncate(data.message.text)
                console.log(`console log - 🤖🌯  I said: "${txt}"`)
        })
        return
    }
    console.log('console log - passed mention check')

    console.log('console log - beginning burrito regex check')
    // 🌯 & 😀 burrito and mention: give that mention a burrito!
    if (_.includes(msg.text, ':burrito:') && msg.text.match(/<@([A-Z0-9])+>/im)) {

        // Check for multiple receviers
        var numOfReceivers = (msg.text.match(/<@([A-Z0-9])+>/igm) || []).length;
        console.log('console log - numOfReceivers:', numOfReceivers);
        if (numOfReceivers > 1) {
            slack.chat.postMessage({
                token: config('SLACK_TOKEN'),
                icon_emoji: config('ICON_EMOJI'),
                channel: msg.user,
                username: 'Yo Burrito',
                text: `You can only send burritos to a single person at a time right now - bug Adam if you want this feature.`
            }, (err, data) => {
                if (err) throw err
            })
            return
        }

        // Get number of burritos
        var numOfBurritos = (msg.text.match(/:burrito:/igm) || []).length;
        console.log('console log - numOfBurritos:', numOfBurritos);

        // Check if the generous burrito gifter can give a burrito
        const getAllowance = new Promise(
            (resolve, reject) => {
                let allowanceCheckQuery = `SELECT daily_allowance FROM burritos_by_user` +
                    ` WHERE user_id = '${msg.user}' LIMIT 1;`
                console.log('console log - allowanceCheckQuery', allowanceCheckQuery)
                connection.query(allowanceCheckQuery, (err, rows, fields) => {
                    if (err) {
                        console.log('console log - error in allowanceCheckQuery: ' + err.code);
                        throw err;
                    }
                    let dailyAllowance = 5
                    if (typeof rows[0] !== 'undefined') {
                        dailyAllowance = rows[0].daily_allowance
                        if (dailyAllowance >= numOfBurritos) {
                            resolve(dailyAllowance)
                        }
                        reject(`You can only give 5 burritos a day - you tried to give ${numOfBurritos}, but only have ${dailyAllowance} remaining.`)
                    } else {
                        resolve(dailyAllowance)
                    }
                })
            }
        )

        const giveBurrito = function () {
            console.log('console log - giveBurrito start');
            getAllowance
                .then(dailyAllowance => {
                    let givenTo = msg.text.match(/<@([A-Z0-9])+>/im)
                    // TODO: implement stronger sql injection protection
                    let msgText = msg.text.replace("'", "")
                    console.log('console log - msgText in giveBurrito', msgText)
                    givenTo = givenTo[0].substring(2, givenTo[0].length - 1)

                    // Prevent self gifting
                    if (msg.user === givenTo) {
                        console.log('console log - Trying to give burrito to self')
                        slack.chat.postMessage({
                            response_type: 'ephemeral',
                            token: config('SLACK_TOKEN'),
                            icon_emoji: config('ICON_EMOJI'),
                            channel: msg.user,
                            username: 'Yo Burrito',
                            text: 'You can\'t give burritos to yourself, silly!'
                        }, (err, data) => {
                            if (err) throw err
                            let txt = _.truncate(data.message.text)
                                console.log(`console log - 🤖🌯  I said: "${txt}"`)
                        })
                        return
                    }

                    // TODO: condense into one query and add usernames to insert query
                    let timestamp = new Date().getTime()
                    let masterInsertQuery = `INSERT INTO burritos_master (burrito_id, given_by_username,` +
                        ` given_to_username, given_by_id, given_to_id, message, timestamp)` +
                        ` VALUES (NULL, NULL, NULL, '${msg.user}', '${givenTo}', '${msgText}', '${timestamp}');`
                    let givenToUpdateQuery = `INSERT INTO burritos_by_user (user_id, total_burritos, daily_allowance, last_activity)` +
                        ` VALUES ('${givenTo}', 1, 5, NULL) ON DUPLICATE KEY UPDATE total_burritos = total_burritos + ${numOfBurritos};`
                    let allowanceUpdateQuery = `INSERT INTO burritos_by_user (user_id, total_burritos, daily_allowance, last_activity)` +
                        ` VALUES ('${msg.user}', 0, 4, ${timestamp}) ON DUPLICATE KEY UPDATE daily_allowance = daily_allowance - ${numOfBurritos},` +
                        ` last_activity = ${timestamp};`
                    console.log('console log - masterInsertQuery', masterInsertQuery)
                    console.log('console log - givenToUpdateQuery', givenToUpdateQuery)
                    console.log('console log - allowanceUpdateQuery', allowanceUpdateQuery)

                    for (let i = 0; i < numOfBurritos; i++) {
                        connection.query(masterInsertQuery, (err, rows, fields) => {
                            if (err) {
                                console.log('console log - error in added to burritos_master: ' + err.code);
                                throw err;
                            }
                            console.log('console log - Added to burritos_master')
                        })
                    }
                    connection.query(givenToUpdateQuery, (err, rows, fields) => {
                        if (err) {
                            console.log('console log - error in added to burritos_by_user given_to: ' + err.code);
                            throw err;
                        }
                        console.log('console log - Updated burritos_by_user given_to')
                    })
                    connection.query(allowanceUpdateQuery, (err, rows, fields) => {
                        if (err) {
                            console.log('console log - error in added to burritos_by_user allowance: ' + err.code);
                            throw err;
                        }
                        console.log('console log - Updated burritos_by_user allowance')
                    })

                    // Send message to giver
                    slack.chat.postMessage({
                        token: config('SLACK_TOKEN'),
                        icon_emoji: config('ICON_EMOJI'),
                        channel: msg.user,
                        username: 'Yo Burrito',
                        text: `Gave ${numOfBurritos} burrito(s) to <@${givenTo}>, you have ${dailyAllowance - numOfBurritos} burritos left to give today`
                    }, (err, data) => {
                        if (err) {
                            slack.chat.postMessage({
                                token: config('SLACK_TOKEN'),
                                icon_emoji: config('ICON_EMOJI'),
                                channel: msg.user,
                                username: 'Yo Burrito',
                                text: `There was an error sending your burrito to <@${givenTo}> :(`
                            });
                            console.log('console log - error in slack message to giver: ' + err.code);
                            throw err
                        }
                        let txt = _.truncate(data.message.text)
                            console.log(`console log - 🤖🌯  I said: "${txt}"`)
                    })

                    // Send message to receiver
                    slack.chat.postMessage({
                        token: config('SLACK_TOKEN'),
                        icon_emoji: config('ICON_EMOJI'),
                        channel: givenTo,
                        username: 'Yo Burrito',
                        text: `You received ${numOfBurritos} burrito(s) from <@${msg.user}>!`
                    }, (err, data) => {
                        if (err) {
                            console.log('console log - error in slack message to receiver: '+ err.code);
                            throw err;
                        }
                    })
                    return
                })
                .catch(error => {
                    slack.chat.postMessage({
                        response_type: 'ephemeral',
                        token: config('SLACK_TOKEN'),
                        icon_emoji: config('ICON_EMOJI'),
                        channel: msg.user,
                        username: 'Yo Burrito',
                        text: error
                    }, (err, data) => {
                        if (err) {
                            console.log('console log - error in giveBurrito catch: ' + err.code);
                            throw err;
                        }
                        let txt = _.truncate(data.message.text)
                        console.log(`🤖🌯  I said: "${txt}"`)
                    })
                    return
                })
        }

        giveBurrito()
    }
    console.log('console log - passed burrito regex and giveBurrito')

    console.log('console log - beginning spinner regex check')
    // :wmp: & 😀 wmp spinner and mention: give that mention a commendation!
    if (_.includes(msg.text, ':wmp:') && msg.text.match(/<@([A-Z0-9])+>/im)) {

        const giveCommendation = function () {
            let givenTo = msg.text.match(/<@([A-Z0-9])+>/im)
            // TODO: implement stronger sql injection protection
            let msgText = msg.text.replace("'", "")
            console.log('console log - msgText', msgText)
            givenTo = givenTo[0].substring(2, givenTo[0].length - 1)

            // Prevent self gifting
            if (msg.user === givenTo) {
                console.log('console log - Trying to give commendation to self')
                slack.chat.postMessage({
                    response_type: 'ephemeral',
                    token: config('SLACK_TOKEN'),
                    icon_emoji: config('ICON_EMOJI'),
                    channel: msg.user,
                    username: 'Yo Burrito',
                    text: 'You can\'t give commendations to yourself, silly!'
                }, (err, data) => {
                    if (err) throw err
                    let txt = _.truncate(data.message.text)
                        console.log(`console log - 🤖🌯  I said: "${txt}"`)
                })
                return
            }

            // TODO: condense into one query and add usernames to insert query
            let timestamp = new Date().getTime()
            let masterInsertQuery = `INSERT INTO commendations_master (commendation_id, given_by_username,` +
                ` given_to_username, given_by_id, given_to_id, message, timestamp)` +
                ` VALUES (NULL, NULL, NULL, '${msg.user}', '${givenTo}', '${msgText}', '${timestamp}');`
            console.log('console log - masterInsertQuery', masterInsertQuery)

            connection.query(masterInsertQuery, (err, rows, fields) => {
                if (err) throw err
                console.log('console log - Added to commendations_master')
            })

            // Send message to giver
            slack.chat.postMessage({
                token: config('SLACK_TOKEN'),
                icon_emoji: config('ICON_EMOJI'),
                channel: msg.user,
                username: 'Yo Burrito',
                text: `You have given a commendation!`
            }, (err, data) => {
                if (err) {
                    slack.chat.postMessage({
                        token: config('SLACK_TOKEN'),
                        icon_emoji: config('ICON_EMOJI'),
                        channel: msg.user,
                        username: 'Yo Burrito',
                        text: `There was an error sending your commendation, please contact Adam`
                    })
                    throw err
                }
                let txt = _.truncate(data.message.text)
                    console.log(`console log - 🤖🌯  I said: "${txt}"`)
            })
            return
        }

        giveCommendation()
    }
    console.log('console log - passed spinner regex and giveCommendation')
})

connection.end(function (err) {
    if (err) {
        console.log('console log - error code: ' + err.code);
        throw err;
    }
    console.log('console log - connection ended on purpose');
    // The connection is terminated now
});

module.exports = bot
