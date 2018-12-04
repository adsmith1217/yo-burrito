
'use strict'

const _ = require('lodash')
const config = require('../config')
const mysql = require('mysql');
const connection = mysql.createConnection(process.env.JAWSDB_MARIA_URL);

const msgDefaults = {
    response_type: 'in_channel',
    username: 'Yo Burrito',
    icon_emoji: config('ICON_EMOJI')
}

// let attachments = [
//     {
//         title: `You have ## 🌯\'s`,
//         color: '#2FA44F',
//         mrkdwn_in: ['text']
//     }
// ]

const handler = (payload, res) => {
    console.log('mine command')

    // Query for # of burritos by user ID
    // TODO: use async/await

    async function attachments() {
        console.log('async started')
        connection.connect()
        connection.query(`SELECT COUNT(burrito_id) AS result FROM burritos_master WHERE given_to_id = 'U9V5W2R9B'`, function(err, rows, fields) {
            if (err) throw err
            let result = rows[0].result
            console.log('U9V5W2R9B has this many burritos: ', result)
        })
        connection.end()
        console.log('async returning')
        return {
            title: `You have ${result} 🌯\'s`,
            color: '#2FA44F',
            mrkdwn_in: ['text']
        }
    }

    attachments().then(console.log('async done'))

    /*
    var attachments = (result) => {
        connection.connect()
        connection.query(`SELECT COUNT(burrito_id) AS result FROM burritos_master WHERE given_to_id = 'U9V5W2R9B'`, function(err, rows, fields) {
            if (err) throw err
            let result = rows[0].result
            console.log('U9V5W2R9B has this many burritos: ', result)
        })
        connection.end()
        return {
            title: `You have ${result} 🌯\'s`,
            color: '#2FA44F',
            mrkdwn_in: ['text']
        }
    }
    */

    let msg = _.defaults({
        channel: payload.channel_name,
        attachments: attachments
    }, msgDefaults)

    res.set('content-type', 'application/json')
    res.status(200).json(msg)
    return
}

module.exports = { pattern: /mine/ig, handler: handler }
