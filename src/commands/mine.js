
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

    const getAttachments = new Promise(
        (resolve, reject) => {
            let mineQuery = `SELECT total_burritos FROM burritos_by_user` +
                ` WHERE user_id = '${payload.user_id}';`
            console.log('mineQuery: '+mineQuery)
            connection.query(mineQuery, (err, rows, fields) => {
                // TODO: send error message
                if (err) reject(err)
                if(typeof rows[0] !== 'undefined') {
                    let totalBurritos = rows[0].total_burritos
                    console.log(payload.user_id, ' has this many burritos: ', totalBurritos)
                    let msg = _.defaults({
                        channel: payload.channel_name,
                        attachments: [
                            {
                                title: `🌯 Leaderboard`,
                                color: '#2FA44F',
                                text: `You have ${totalBurritos} burritos`,
                                mrkdwn_in: ['text']
                            }
                        ]
                    }, msgDefaults)

                    resolve(msg)
                }
            })
        }
    )

    const getMine = function() {
        getAttachments
            .then(msg => {
                res.set('content-type', 'application/json')
                res.status(200).json(msg)
                console.log('msg ', msg)
                return
            })
    }

    getMine();

/*
    // Query for # of burritos by user ID
    function getAttachments() {
        let mineQuery = `SELECT total_burritos FROM burritos_by_user` +
                ` WHERE user_id = '${payload.user_id}';`
        console.log('mineQuery: '+mineQuery)

        connection.query(mineQuery, (err, rows, fields) => {
            // TODO: send error message
            if (err) throw err
            console.log('rows[0]')
            console.log(rows[0])
            console.log('rows[0].total_burritos')
            console.log(rows[0].total_burritos)
            if(typeof rows[0] !== 'undefined') {
                let totalBurritos = rows[0].total_burritos
                console.log(payload.user_id, ' has this many burritos: ', totalBurritos)
                return {
                    title: `You have ${totalBurritos} 🌯\'s`,
                    color: '#2FA44F',
                    mrkdwn_in: ['text']
                }
            }
        })
    }

    let msg = _.defaults({
        channel: payload.channel_name,
        attachments: getAttachments()
    }, msgDefaults)

    res.set('content-type', 'application/json')
    res.status(200).json(msg)
    console.log('msg ', msg)
    return
*/
}

module.exports = { pattern: /mine/ig, handler: handler }