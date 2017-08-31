const bb = require('bot-brother')
const axios = require('axios')

const botConfig = require('./config/bot.config')
const platformConfig = require('./config/platform.config')

const bot = bb(botConfig)

const actionsResponse = await axios.get(platformConfig.actionsUrl)

actionsResponse.data.forEach(action => {
    bot.command(action).invoke((ctx) => {
        const userId = `telegram:${ctx.meta.user.id}`
        const response = await axios.get(`${platformConfig.actionsUrl}/${action}?userId=${userId}`)
        sendMessage(ctx, response.data)
    })
})

function sendMessage(ctx, meta) {
    meta.messages.forEach(message => ctx.sendMessage(message))
    if (meta.buttons) {
        const keyboard = meta.buttons.map(button => {
            const key = {}
            key[button.label] = { go: button.action }
        })
        ctx.keyboard(keyboard)
    }
}