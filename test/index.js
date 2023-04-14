const { Bot: _bot } = require('../lib')
const { Bot, Deployment } = _bot
const { config } = require('dotenv')

config()

const bot = new Bot({
    logToFile: true,
    logFolder: 'D:\\code\\Discord\\BetterBotsTest\\logs',
    commandFolder: 'D:\\code\\Discord\\BetterBotsTest\\build\\commands',
    tasksFolder: 'D:\\code\\Discord\\BetterBotsTest\\build\\tasks',
    configDir: 'D:\\code\\Discord\\BetterBotsTest\\build\\config',
    deployment: Deployment.Stable,
    prefixes: '!',
    testers: [],
    token: process.env.TOKEN,
    version: '1.0.0',
    mainEmbedColour: 'Random'
})
