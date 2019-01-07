
'use strict'

const _ = require('lodash')
const config = require('../config')
const mysql = require('mysql')
const connection = mysql.createConnection(process.env.JAWSDB_MARIA_URL)

const msgDefaults = {
    response_type: 'ephemeral',
    username: 'Yo Burrito',
    icon_emoji: config('ICON_EMOJI')
}

const handler = (payload, res) => {
    console.log('leaderboard command')

    const getAttachments = new Promise(
        (resolve, reject) => {
            let leaderboardQuery = `SELECT user_id, total_burritos FROM burritos_by_user` +
            ` WHERE total_burritos > 0 ORDER BY total_burritos DESC, user_id DESC LIMIT 10;`
            console.log('leaderboardQuery: '+leaderboardQuery)
            connection.query(leaderboardQuery, (err, rows, fields) => {
                // TODO: send error message
                if (err) reject(err)
                resolve(rows)
            })
        }
    )

    const getFormattedText = function(rows) {
        console.log('getText for ', rows)
        let text = ''
        for(let i = 0; i < 10; i++) {
            if(typeof rows[i] !== 'undefined') {
                let row = rows[i]
                console.log('row ', row)
                text += `#${i + 1}: <@${row.user_id}> - ${row.total_burritos}\n`
            }
        }
        console.log('text ',text)
        let msg = _.defaults({
            channel: payload.channel_name,
            attachments: [
                {
                    title: ':burrito: Leaderboard',
                    color: '#2FA44F',
                    text: text,
                    mrkdwn_in: ['text']
                }
            ]
        }, msgDefaults)

        return Promise.resolve(msg)
    }

    const getLeaderboard = function() {
        getAttachments
            .then(getFormattedText)
            .then(msg => {
                res.set('content-type', 'application/json')
                res.status(200).json(msg)
                console.log('msg ', msg)
                return
            })
    }

    getLeaderboard();
}

module.exports = { pattern: /leaderboard/ig, handler: handler }