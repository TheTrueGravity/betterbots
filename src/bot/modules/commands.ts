import { readdirSync, PathLike } from 'fs'
import { AsciiTable3 as ascii } from 'ascii-table3'
import { Bot } from '../bot'
import * as path from 'path'
import { ICategory } from '../interfaces/ICategory'
import { ICommand } from '../interfaces/ICommand'

export default function Commands(bot: Bot, commandsFolder: PathLike) {
    const categories: ICategory[] = []
    const table = new ascii('Commands').setHeading('Command', 'Load status')

    readdirSync(commandsFolder).forEach((dir) => {
        const commands = readdirSync(
            path.join(commandsFolder.toString(), dir)
        ).filter((f) => f.endsWith('.js'))
        const temp = []

        for (let file of commands) {
            let pull = require(path.join(
                commandsFolder.toString(),
                dir,
                file.split('.')[0]
            ))
            
            if (pull.default) { pull = pull.default }

            if (file == '_category.js') {
                bot.Categories.set(pull.name, pull)
                continue
            }

            temp.push({
                name: pull.name,
                aliases: pull.aliases,
                category: pull.category,
                authLevel: pull.authLevel,
                description: pull.description
            })

            if (pull.name) {
                bot.Commands.set(pull.name, pull)
                table.addRow(file, '✅')
            } else {
                table.addRow(file, '❌ -> missing something?')
                continue
            }

            if (pull.aliases) {
                if (Array.isArray(pull.aliases)) {
                    pull.aliases.forEach((alias: string) =>
                        bot.Aliases.set(alias, pull.name)
                    )
                } else {
                    bot.Aliases.set(pull.aliases, pull.name)
                }
            }
        }

        bot.CategoryCommandList.set(dir, temp)
    })

    return table
}
