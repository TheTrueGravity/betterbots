import { readdirSync, PathLike } from 'fs'
import { AsciiTable3 } from 'ascii-table3'
import { Collection } from 'discord.js'
import { ITask } from '../interfaces/ITask'

export default function Tasks(
    tasks: Collection<string, ITask>,
    tasksDir: PathLike
) {
    const table = new AsciiTable3('Tasks')
    table.setHeading('Task', 'Load status')

    const dir = readdirSync(tasksDir)
    const _tasks = dir.filter((f) => f.endsWith('.js'))

    for (let file of _tasks) {
        let { default: pull } = require(`${tasksDir}/${file.split('.')[0]}`)

        if (pull.name) {
            tasks.set(pull.name, pull)
            table.addRow(file, '✅')
        } else {
            table.addRow(file, '❌ -> missing something?')
            continue
        }
    }

    return table
}
