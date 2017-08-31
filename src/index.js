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
    const message = `${meta.title}\n\n${meta.message}`
    ctx.sendMessage(message)

    if (meta.actions) {
        const keyboard = meta.actions.map(action => {}) //TODO: create actual keyboard
        ctx.keyboard(keyboard)
    }
}