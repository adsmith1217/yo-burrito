
'use strict'

console.log('daily lottery scheduled job')

const _ = require('lodash')
const Botkit = require('botkit')
const mysql = require('mysql')
const config = require('../config')
const connection = mysql.createConnection(process.env.JAWSDB_MARIA_URL)

var controller = Botkit.slackbot({})
var bot = controller.spawn()

bot.configureIncomingWebhook({ url: config('WEBHOOK_URL') })

const msgDefaults = {
    response_type: 'in_channel',
    username: 'Yo Burrito',
    icon_emoji: config('ICON_EMOJI')
}


let dailyLotteryQuery = `SELECT user_id FROM burritos_by_user ORDER BY RAND() LIMIT 1;`
console.log('dailyLotteryQuery', dailyLotteryQuery)

connection.query(dailyLotteryQuery, (err, rows, fields) => {
    if (err) throw err
    let user = rows[0].user_id
    console.log('winner: ',user)
    user = 'U9V5W2R9B'
    var attachments = [
        {
            title: `:burrito: Daily Lottery`,
            color: '#2FA44F',
            text: `Congratulations <@${user}> you have won the daily ` +
                `burrito lottery! Don't spend it all in one place.\n`,
            mrkdwn_in: ['text']
        }
    ];

    let msg = _.defaults({
        channel: '#yo-burrito-testing',
        attachments: attachments
    }, msgDefaults)

    bot.sendWebhook(msg, (err, res) => {
        if (err) throw err
        console.log('Daily Lottery job complete')
        return
    })
})
