
'use strict'

const _ = require('lodash')
const config = require('../config')
const mysql = require('mysql');
const connection = mysql.createConnection(process.env.JAWSDB_MARIA_URL);

const msgDefaults = {
    response_type: 'in_channel',
    username: 'yo_burrito',
    icon_emoji: config('ICON_EMOJI')
}

let attachments = [
    {
        title: 'You have ## 🌯\'s',
        color: '#2FA44F',
        mrkdwn_in: ['text']
    }
]

const handler = (payload, res) => {
    console.log('mine command')

    //
    connection.connect();
    connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
    if (err) throw err;
    console.log('The solution is: ', rows[0].solution);
    });
    connection.end();
    //

    let msg = _.defaults({
        channel: payload.channel_name,
        attachments: attachments
    }, msgDefaults)

    res.set('content-type', 'application/json')
    res.status(200).json(msg)
    return
}

module.exports = { pattern: /mine/ig, handler: handler }
