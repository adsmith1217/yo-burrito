
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

const handler = (payload, res) => {
    console.log('leaderboard command')

    let getAttachments = new Promise(
        (resolve, reject) => {
            console.log(1)
            let leaderboardQuery = `SELECT user_id, total_burritos FROM burritos_by_user` +
                    ` WHERE total_burritos > 0 ORDER BY total_burritos DESC, user_id DESC LIMIT 10;`
            console.log('leaderboardQuery: '+leaderboardQuery)
            connection.query(leaderboardQuery, (err, rows, fields) => {
                // TODO: send error message
                if (err) reject(err)
                console.log('rows ', rows)
                let res = {
                    title: `🌯 leaderboard`,
                    color: '#2FA44F',
                    text: 'new Promise(getText(rows))',
                    mrkdwn_in: ['text']
                }
                resolve(res)
            })
        }
    )

    const func = function() {
        getAttachments.then(fulfilled => {
            res.set('content-type', 'application/json')
            res.status(200).json(fulfilled)
            console.log('fulfilled ', fulfilled)
            return
        })
    }

    func();


/*
    // Query for top 10 # of burritos by user ID
    let msg = _.defaults({
        channel: payload.channel_name,
        attachments: new Promise(getAttachments(res, rej))
    }, msgDefaults)

    console.log('after msg')

    function getAttachments() {
        console.log('getAttachments')
        let leaderboardQuery = `SELECT user_id, total_burritos FROM burritos_by_user` +
                ` WHERE total_burritos > 0 ORDER BY total_burritos DESC, user_id DESC LIMIT 10;`
        console.log('leaderboardQuery: '+leaderboardQuery)
        connection.query(leaderboardQuery, (err, rows, fields) => {
            // TODO: send error message
            if (err) throw err
            console.log('rows ', rows)
            let res = {
                title: `🌯 leaderboard`,
                color: '#2FA44F',
                text: new Promise(getText(rows)),
                mrkdwn_in: ['text']
            }
            resolve(res)
        })
    }

    console.log('after getAttachments declared')

    // Process results into message text
    function getText(rows) {
        console.log('getText')
        console.log('getText for ', rows)
        let text = ''
        let i = 0;
        for(let i = 0; i < 10; i++) {
            if(typeof rows[i] !== 'undefined') {
                let row = rows[i]
                console.log('row ', row)
                text += `#${i + 1}: <@${row.user_id}> - ${row.total_burritos}\n`
            }
        }
        console.log('text ',text)
        resolve(text)
    }

    console.log('after getText declared')

    res.set('content-type', 'application/json')
    res.status(200).json(msg)
    console.log('msg ', msg)
    console.log('msg.attachments ', msg.attachments)
    return
*/
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