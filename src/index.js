const bb = require('bot-brother')
const axios = require('axios')

const botConfig = require('./config/bot.config')
const platformConfig = require('./config/platform.config')

const bot = bb(botConfig)

bot.command(/.*/).invoke(ctx => execute(ctx, ctx.command.name))

bot.api.onText(/^[^\/].*$/, async msg => {
    const userId = getUserId(msg.from.id)
    const response = await axios.get(`${platformConfig.actionsUrl}/response?userId=${userId}`)
    
    const meta = response.data
    const messages = meta.messages
    const keyboard = getKeyboard(meta)

    for (let i = 0; i < messages.length - 1; i++) {
        bot.api.sendMessage(msg.chat.id, messages[i])
    }

    const lastMessage = messages[messages.length - 1]
    if (lastMessage) {
        bot.api.sendMessage(msg.chat.id, lastMessage, {
            'reply_markup': keyboard ? keyboard : { 'hide_keyboard': true }
        })
    }
})

async function execute(ctx, action) {
    const userId = getUserId(ctx.meta.user.id)
    const response = await axios.get(`${platformConfig.actionsUrl}/${action}?userId=${userId}`)
    sendMessage(ctx, response.data)
}

function sendMessage(ctx, meta) {
    const keyboard = getKeyboard(meta)
    if (keyboard) {
        ctx.keyboard(keyboard)
    } else {
        ctx.hideKeyboard()
    }
    meta.messages.forEach(message => ctx.sendMessage(message))
}

function getUserId(id) {
    return `telegram:${id}`
}

function getKeyboard(meta) {
    if (!meta.buttons || meta.buttons.length === 0) {
        return
    }
    return meta.buttons.map(button => {
        const key = {}
        key[button.label] = { go: button.action }
        return [key]
    })
}