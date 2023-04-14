const { TaskTypes } = require('../../lib/bot/interfaces/ITask')

const Task = {
    name: 'Task 1',
    enabled: true,
    taskType: TaskTypes.scheduled,
    description: 'A test task',
    development: false,
    init: async (client) => {
        console.log('Initializing task 1...')
    },
    run: (client, ...args) => {
        console.log(`Running task 1 with args ${args}`)
    }
}

module.exports.default = Task
