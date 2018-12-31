
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
//         title: '🌯 leaderboard',
//         color: '#2FA44F',
//         text: '#1: First Last - ##\n' +
//                 '#2: First Last - ##\n' +
//                 '...\n',
//         mrkdwn_in: ['text']
//     }
// ]

const handler = (payload, res) => {
    console.log('leaderboard command')

    function getAttachments() {
        let leaderboardQuery = `SELECT user_id, total_burritos AS results FROM burritos_by_user` +
        ` WHERE total_burritos > 0 ORDER BY total_burritos DESC, user_id DESC LIMIT 10;`
        console.log('leaderboardQuery: '+leaderboardQuery)

        connection.query(leaderboardQuery, (err, rows, fields) => {
            // TODO: send error message
            if (err) throw err
            console.log('rows ', rows)
            return {
                title: `🌯 leaderboard`,
                color: '#2FA44F',
                text: getText(rows),
                mrkdwn_in: ['text']
            }
        })
    }

    // Process results into message text
    function getText(rows) {
        console.log('getText for ', rows)
        let text = ''
        let i = 1;
        for(let row in rows) {
            console.log('row ', row)
            text += `#${i} ${row.user_id} ${row.total_burritos}\n`
            i++
        }
        console.log('text ',text)
        return text
    }

    // Query for top 10 # of burritos by user ID
    let msg = _.defaults({
        channel: payload.channel_name,
        attachments: getAttachments()
    }, msgDefaults)

    res.set('content-type', 'application/json')
    res.status(200).json(msg)
    return
}

module.exports = { pattern: /leaderboard/ig, handler: handler }

    /*
        // Query for top 10 # of burritos by user ID
    let msgAttachments = (result) => {
        // TODO: fix query with proper field names
        let leaderboardQuery = `SELECT * AS result FROM burritos_by_user
        WHERE total_burritos > 0 LIMIT 10 ORDER BY total_burritos DESC, username DESC`
        console.log('leaderboardQuery: '+leaderboardQuery)

        connection.connect()
        connection.query(leaderboardQuery, (err, rows, fields) => {
            if (err) {
                // TODO: send error message
                throw err
            }
            let result = rows[0].result
            console.log(payload.user_id, ' has this many burritos: ', result)
        })
        connection.end()

        // Process results into message text
        let msgText = (result) => {

        }

        return {
            title: `🌯 leaderboard`,
            color: '#2FA44F',
            text: (msgText) => {
                msgText
            },
            mrkdwn_in: ['text']
        }
    }
    */