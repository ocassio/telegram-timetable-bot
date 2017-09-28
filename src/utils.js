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
        callback_data: encodeAction(button.action, button.params)
    }])
}

/**
 * Encodes action name and params to callback data string
 * 
 * @param {string} name Action name
 * @param {object} params Action params
 * @returns {string} Encoded callback data
 */
function encodeAction(name, params) {
    let result = name
    if (params) {
        Object.keys(params).forEach(name => {
            const value = params[name]
            if (value) {
                result += `|${name}=${JSON.stringify(value)}`
            }
        })
    }
    return result
}

/**
 * Decodes action name and params from callback data string
 * 
 * @param {string} data Callback data
 * @returns {object} Decoded action with params
 */
function decodeAction(data) {
    const sections = data.split('|')
    const params = { action: sections[0] }
    
    sections.shift()    
    sections.forEach(section => {
        const subsections = section.split('=')
        params[subsections[0]] = JSON.parse(subsections[1])
    })

    return params
}

module.exports = {
    toPlatformUserId,
    toTelegramUserId,
    getKeyboard,
    encodeAction,
    decodeAction
}