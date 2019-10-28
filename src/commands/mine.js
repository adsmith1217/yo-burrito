
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
    console.log('mine command')

    const getAttachments = new Promise(
        (resolve, reject) => {
            let mineQuery = `SELECT total_burritos FROM burritos_by_user` +
                ` WHERE user_id = '${payload.user_id}';`
            console.log('mineQuery: '+mineQuery)
            connection.query(mineQuery, (err, rows, fields) => {
                // TODO: send error message
                if (err) reject(err)
                let totalBurritos = 0
                if(typeof rows[0] !== 'undefined') {
                    totalBurritos = rows[0].total_burritos
                }
                console.log(payload.user_id, ' has this many burritos: ', totalBurritos)
                let msg = _.defaults({
                    channel: payload.channel_name,
                    attachments: [
                        {
                            title: `You have ${totalBurritos} burritos`,
                            color: '#2FA44F',
                            mrkdwn_in: ['text']
                        }
                    ]
                }, msgDefaults)

                resolve(msg)
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

    connection.end(function (err) {
        if (err) {
            console.log('console log - error code: ' + err.code);
            throw err;
        }
        console.log('console log - connection ended on purpose');
        // The connection is terminated now
    });
}

module.exports = { pattern: /mine-broken/ig, handler: handler }