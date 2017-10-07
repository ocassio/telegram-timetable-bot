const platformUrl = process.env.TIMETABLE_BOT_PLATFORM_URL

const config = {
    platformUrl,
    actionsUrl: `${platformUrl}/api/actions`,
    userIdPrefix: 'telegram:',
    clientName: 'Telegram'
}

module.exports = config