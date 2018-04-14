const platformUrl = process.env.TIMETABLE_BOT_PLATFORM_URL

const config = {
    platformUrl,
    actionsUrl: `${platformUrl}/api/actions`,
    userIdPrefix: 'telegram:',
    clientName: 'Telegram',
    token: process.env.TELEGRAM_TIMETBALE_PLATFORM_BOT_TOKEN
}

module.exports = config