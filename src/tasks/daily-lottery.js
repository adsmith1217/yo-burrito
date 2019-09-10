
'use strict'

console.log('console log - daily lottery scheduled job')

const _ = require('lodash')
const Botkit = require('botkit')
const mysql = require('mysql')
const config = require('../config')
let connection = mysql.createConnection(process.env.JAWSDB_MARIA_URL)

var controller = Botkit.slackbot({})
var bot = controller.spawn()

bot.configureIncomingWebhook({ url: config('GENERAL_WEBHOOK_URL') })

const msgDefaults = {
    response_type: 'in_channel',
    username: 'Yo Burrito',
    icon_emoji: config('ICON_EMOJI')
}

connection.on('close', function (err) {
    console.log('console log - connection closed daily-lottery');
});

connection.on('error', function (err) {
    console.log('console log - connection error daily-lottery: ' + err);
});

let dailyLotteryQuery = `SELECT user_id FROM burritos_by_user ORDER BY RAND() LIMIT 1;`
console.log('console log - dailyLotteryQuery', dailyLotteryQuery)

// Get the lucky winner
connection.query(dailyLotteryQuery, (err, rows, fields) => {
    if (err) {
        console.log('console log - error dailyLotteryQuery code: ' + err.code);
        throw err;
    }
    // let user = rows[0].user_id
    let user = 'U94Q4683S';
    console.log('console log - winner: ',user)

    var attachments = [
        {
            title: `Daily Lottery`,
            color: '#2FA44F',
            text: `Congratulations <@${user}> you have won the daily ` +
                `burrito lottery!\n` +
                `Don't spend it all in one place.\n`,
            mrkdwn_in: ['text']
        }
    ];

    // let msg = _.defaults({
    //     channel: '#general',
    //     attachments: attachments
    // }, msgDefaults)

    let msg = _.defaults({
        channel: '#yo-burrito-testing',
        attachments: attachments
    }, msgDefaults)

    console.log('msg: '+JSON.stringify(msg));

    bot.sendWebhook(msg, (err, res) => {
        if (err) {
            console.log('console log - error sendWebhook code: ' + err.code);
            throw err;
        }
        console.log('console log - Daily Lottery job complete')
    })

    // Update tables
    let timestamp = new Date().getTime()
    let masterInsertQuery = `INSERT INTO burritos_master (burrito_id, given_by_username,` +
            ` given_to_username, given_by_id, given_to_id, message, timestamp)` +
            ` VALUES (NULL, NULL, NULL, 'yo_burrito', '${user}', 'daily-lottery', '${timestamp}');`
    let givenToUpdateQuery = `INSERT INTO burritos_by_user (user_id, total_burritos, daily_allowance, last_activity)` +
            ` VALUES ('${user}', 1, 5, NULL) ON DUPLICATE KEY UPDATE total_burritos = total_burritos + 1;`
    console.log('console log - masterInsertQuery', masterInsertQuery)
    console.log('console log - givenToUpdateQuery', givenToUpdateQuery)

    connection.query(masterInsertQuery, (err, rows, fields) => {
        if (err) {
            console.log('console log - error masterInsertQuery code: ' + err.code);
            throw err;
        }
        console.log('console log - Added to burritos_master')
    })
    connection.query(givenToUpdateQuery, (err, rows, fields) => {
        if (err) {
            console.log('console log - error givenToUpdateQuery code: ' + err.code);
            throw err;
        }
        console.log('console log - Updated burritos_by_user')
    })
})

// connection.end(function (err) {
//     if (err) {
//         console.log('console log - error code: ' + err.code);
//         throw err;
//     }
//     console.log('console log - connection ended on purpose');
//     // The connection is terminated now
// });


return
