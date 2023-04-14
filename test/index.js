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
    deployment: Deployment.Release,
    version: '1.0.0'
})
