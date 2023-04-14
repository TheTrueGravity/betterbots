const { Bot: _bot } = require('../../../lib/index')
const { Bot, Deployment } = _bot

const bot = new Bot({
    deployment: Deployment.Stable,
    prefixes: ['!'],
    testers: [],
    version: '1.0.0'
})
