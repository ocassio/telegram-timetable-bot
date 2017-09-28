const tgfancy = require('tgfancy')
const io = require('socket.io-client')

const { toPlatformUserId, toTelegramUserId, getKeyboard, decodeAction } = require('./utils')
const botConfig = require('./config/bot.config')
const platformConfig = require('./config/platform.config')

const bot = new tgfancy(botConfig.token, botConfig)
const socket = io(platformConfig.platformUrl)

socket.on('connect', () => console.log('Connection with the platform established successfully'))
socket.on('disconnect', () => console.log('Connection with the platform has been dropped'))
socket.on('connect_error', () => console.error('There is some connection problem'))

socket.on('sendMessage', data => {
    if (!data.recipients) return
    data.recipients.forEach(userId => sendMessages(toTelegramUserId(userId), data))
})

// Actions handling
bot.onText(/\/(.+)/, (msg, match) => execute(msg, { action: match[1] }))

// Responses handling
bot.onText(/^[^\/].*$/, (msg, match) => execute(msg, { action: 'response', value: match[0] }))

// Keyboard clicks handling
bot.on('callback_query', msg => execute(msg, decodeAction(msg.data)))

async function execute(msg, params = {}) {
    params.userId = toPlatformUserId(msg.from.id)
    socket.emit('action', params)
}

function sendMessages(userId, meta) {

    const messages = meta.messages
    const keyboard = getKeyboard(meta)
    
    for (let i = 0; i < messages.length - 1; i++) {
        bot.sendMessage(userId, messages[i])
    }

    const lastMessage = messages[messages.length - 1]
    if (lastMessage) {
        bot.sendMessage(userId, lastMessage, {
            reply_markup: keyboard ? { inline_keyboard: keyboard } : { hide_keyboard: true }
        })
    }
}