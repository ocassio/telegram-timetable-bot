const tgfancy = require('tgfancy')
const axios = require('axios')

const botConfig = require('./config/bot.config')
const platformConfig = require('./config/platform.config')

const bot = new tgfancy(botConfig.token, botConfig)

// Actions handling
bot.onText(/\/(.+)/, (msg, match) => execute(msg, match[1]))

// Responses handling
bot.onText(/^[^\/].+$/, (msg, match) => execute(msg, 'response', match[0]))

bot.on('callback_query', msg => execute(msg, msg.data))

async function execute(msg, action, value) {
    const userId = getUserId(msg.from.id)
    const response = await axios.get(`${platformConfig.actionsUrl}/${action}?userId=${userId}`)
    sendMessages(msg, response.data)
}

function sendMessages(msg, meta) {

    const messages = meta.messages
    const keyboard = getKeyboard(meta)
    
    for (let i = 0; i < messages.length - 1; i++) {
        bot.sendMessage(msg.from.id, messages[i])
    }

    const lastMessage = messages[messages.length - 1]
    if (lastMessage) {
        bot.sendMessage(msg.from.id, lastMessage, {
            reply_markup: keyboard ? { inline_keyboard: keyboard } : { hide_keyboard: true }
        })
    }
}

function getUserId(id) {
    return `telegram:${id}`
}

function getKeyboard(meta) {
    if (!meta.buttons || meta.buttons.length === 0) {
        return
    }
    return meta.buttons.map(button => [{
        text: button.label,
        callback_data: button.action
    }])
}