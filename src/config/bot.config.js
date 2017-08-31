const production = process.env.NODE_ENV === 'production'

const config = {
    key: process.env.TIMETABLE_BOT_TELEGRAM_TOKEN
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