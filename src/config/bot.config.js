const production = process.env.NODE_ENV === 'production'

const config = {
    token: process.env.TIMETABLE_BOT_TELEGRAM_TOKEN,
    tgfancy: {
        orderedSending: true
    }
}

const devConfig = {
    polling: {
        interval: 1000,
        timeout: 0
    }
}

const prodConfig = {

}

module.exports = Object.assign({}, config, production ? prodConfig : devConfig)