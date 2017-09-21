const { userIdPrefix } = require('./config/platform.config')

/**
 * Converts Telegram user id to the Platform one
 * 
 * @param {string} userId Telegram user id
 * @returns {string} Platform user id
 */
function toPlatformUserId(userId) {
    return userIdPrefix + userId
}

/**
 * Converts Platform user id to Telegram one
 * 
 * @param {string} userId Platform user id
 * @returns {string} Telegram user id
 */
function toTelegramUserId(userId) {
    return userId.replace(userIdPrefix, '')
}

/**
 * Forms a Telegram keyboard based on the Platform message format
 * 
 * @param {Object} meta Platform message
 * @returns {Array} Telegram keyboard
 */
function getKeyboard(meta) {
    if (!meta.buttons || meta.buttons.length === 0) {
        return
    }
    return meta.buttons.map(button => [{
        text: button.label,
        callback_data: button.action
    }])
}

module.exports = {
    toPlatformUserId,
    toTelegramUserId,
    getKeyboard
}