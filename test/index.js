const { Bot: _bot } = require('../lib')
const { Bot, Deployment } = _bot
const { Tasks } = require('../lib/bot/modules/tasks')
const { Collection } = require('discord.js')

// Task testing
// const tasks = new Collection()
// const taskTable = Tasks(tasks, 'D:/code/Discord/BetterBots/test/tasks')

// console.log(tasks.get("Task 1"))
// console.log(taskTable.toString())

const bot = new Bot({
    logToFile: true,
    logFolder: 'D:\\code\\Discord\\BetterBotsTest\\logs',
    commandFolder: 'D:\\code\\Discord\\BetterBotsTest\\build\\commands',
    tasksFolder: 'D:\\code\\Discord\\BetterBotsTest\\build\\tasks',
    configDir: 'D:\\code\\Discord\\BetterBotsTest\\build\\config',
    deployment: Deployment.Stable,
    prefixes: '!',
    testers: [],
    token: 'NzU1NDQ5OTQwNjUzODk5OTA3.Gj2A_Z.GgO5sZUhVCEKqdjbPJokecjc574yMusFgKo22I',
    version: '1.0.0'
})
