const bb = require('bot-brother')
const axios = require('axios')

const botConfig = require('./config/bot.config')
const platformConfig = require('./config/platform.config')

const bot = bb(botConfig)

bot.command(/.*/).invoke(ctx => execute(ctx, ctx.command.name))

bot.api.onText(/^[^\/].*$/, msg => {
    bot.api.sendMessage(msg.chat.id, 'Not a command')
})

async function execute(ctx, action) {
    const userId = `telegram:${ctx.meta.user.id}`
    const response = await axios.get(`${platformConfig.actionsUrl}/${action}?userId=${userId}`)
    sendMessage(ctx, response.data)
}

function sendMessage(ctx, meta) {
    if (meta.buttons) {
        const keyboard = meta.buttons.map(button => {
            const key = {}
            key[button.label] = { go: button.action }
            return [key]
        })
        ctx.keyboard(keyboard)
    } else {
        ctx.hideKeyboard()
    }
    meta.messages.forEach(message => ctx.sendMessage(message))
}