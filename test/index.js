const { Bot, Deployment, ServerHandler } = require('../lib')
const { config } = require('dotenv')

config()

// class serverHandler implements ServerHandler {

// }

const bot = new Bot({
    logToFile: true,
    logFolder: 'D:\\code\\Discord\\BetterBotsTest\\logs',
    commandFolder:
        'D:\\code\\Discord\\BetterBotsTest\\build\\test0000\\commands',
    tasksFolder: 'D:\\code\\Discord\\BetterBotsTest\\build\\test0000\\tasks',
    configDir: 'D:\\code\\Discord\\BetterBotsTest\\build\\test0000\\config',
    deployment: Deployment.Stable,
    prefixes: '!',
    testers: [],
    token: process.env.TOKEN,
    version: '1.0.0',
    mainEmbedColour: 'Random'
}, )
