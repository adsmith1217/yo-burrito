
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
    function getAttachments() {
        let mineQuery = `SELECT total_burritos AS result FROM burritos_by_user
                WHERE user_id = '${payload.user_id}'`
        console.log('mineQuery: '+mineQuery)

        connection.connect()
        connection.query(mineQuery, (err, rows, fields) => {
            // TODO: send error message
            if (err) throw err
            let result = rows[0].result
            console.log(payload.user_id, ' has this many burritos: ', result)
            return {
                title: `You have ${rows[0].result} 🌯\'s`,
                color: '#2FA44F',
                mrkdwn_in: ['text']
            }
        })
        connection.end()
    }

    let msg = _.defaults({
        channel: payload.channel_name,
        attachments: getAttachments()
    }, msgDefaults)

    res.set('content-type', 'application/json')
    res.status(200).json(msg)
    return
}

module.exports = { pattern: /mine/ig, handler: handler }

    /*
    // Query for # of burritos by user ID
    let msgAttachments = (result) => {
        let mineQuery = `SELECT COUNT(burrito_id) AS result FROM burritos_master
                WHERE given_to_id = ${payload.user_id}`
        console.log('mineQuery: '+mineQuery)

        connection.connect()
        connection.query(mineQuery, (err, rows, fields) => {
            if (err) {
                // TODO: send error message
                throw err
            }
            let result = rows[0].result
            console.log(payload.user_id, ' has this many burritos: ', result)
        })
        connection.end()
        return {
            title: `You have ${result} 🌯\'s`,
            color: '#2FA44F',
            mrkdwn_in: ['text']
        }
    }

    let msg = _.defaults({
        channel: payload.channel_name,
        attachments: msgAttachments
    }, msgDefaults)

    res.set('content-type', 'application/json')
    res.status(200).json(msg)
    return
    */

    /*
    var a = async function attachments() {
        console.log('async started')
        connection.connect()
        connection.query(`SELECT COUNT(burrito_id) AS result FROM burritos_master
                WHERE given_to_id = '${payload.user_id}'`, function(err, rows, fields) {
            if (err) throw err
            let result = rows[0].result
            console.log(payload.user_id, ' has this many burritos: ', result)
        })
        connection.end()
        console.log('async returning')
        return {
            title: `You have ${result} 🌯\'s`,
            color: '#2FA44F',
            mrkdwn_in: ['text']
        }
    }

    a().then(console.log('async done'))
   */