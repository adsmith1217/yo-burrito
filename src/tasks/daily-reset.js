
// TODO: model for cron task - rework to reset daily burrito allowance in burritos_by_user
'use strict'

const _ = require('lodash')
const config = require('../config')
const trending = require('github-trending')
const Botkit = require('botkit')

var controller = Botkit.slackbot({})
var bot = controller.spawn()

bot.configureIncomingWebhook({ url: config('WEBHOOK_URL') })

const msgDefaults = {
    response_type: 'in_channel',
    username: 'Yo Burrito',
    icon_emoji: config('ICON_EMOJI')
}

trending('javascript', (err, repos) => {
    if (err) throw err

    var attachments = repos.slice(0, 5).map((repo) => {
        return {
            title: `${repo.owner}/${repo.title} `,
            title_link: repo.url,
            text: `_${repo.description}_\n${repo.language} • ${repo.star}`,
            mrkdwn_in: ['text', 'pretext']
        }
    })

    let msg = _.defaults({ attachments: attachments }, msgDefaults)

    bot.sendWebhook(msg, (err, res) => {
        if (err) throw err
        
        console.log(`\n🚀  yo_burrito report delivered 🚀`)
    })
})
