
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
    console.log('drawing command')

    const getAttachments = new Promise(
        (resolve, reject) => {
            let drawingQuery = `SELECT given_to_id FROM burritos_master` +
                ` WHERE timestamp > 1554076800000 ORDER BY RAND() LIMIT 1;`

            console.log('drawingQuery: '+drawingQuery)
            connection.query(drawingQuery, (err, rows, fields) => {
                // TODO: send error message
                if (err) reject(err)
                let userId = ''
                if(typeof rows[0] !== 'undefined') {
                    userId = rows[0].given_to_id
                }
                console.log(userId, ' has won the drawing')
                let msg = _.defaults({
                    channel: payload.channel_name,
                    attachments: [
                        {
                            title: `Sorry, friend! The burrito drawing isn't active right now.\n`,
                            color: '#2FA44F',
                            text: `Want to learn more about me? Just type \`/burrito\` in any channel`,
                            mrkdwn_in: ['text']
                        }
                    ]
                }, msgDefaults)

                resolve(msg)
            })
        }
    )

    const getDrawing = function() {
        getAttachments
            .then(msg => {
                res.set('content-type', 'application/json')
                res.status(200).json(msg)
                console.log('msg ', msg)
                return
            })
    }

    getDrawing();
}

module.exports = { pattern: /drawing/ig, handler: handler }