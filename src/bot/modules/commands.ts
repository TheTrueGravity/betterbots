import { readdirSync, PathLike } from 'fs'
import { AsciiTable3 as ascii } from 'ascii-table3'
import { AuthLevel, Bot } from '../bot'
import * as path from 'path'
import { ICategory } from '../interfaces/ICategory'
import { ICommand } from '../interfaces/ICommand'

export default function Commands(bot: Bot, commandsFolder: PathLike) {
    const categories: ICategory[] = []
    const table = new ascii('Commands').setHeading('Command', 'Load status')

    var addedHelp = false

    readdirSync(commandsFolder).forEach((dir) => {
        const commands = readdirSync(
            path.join(commandsFolder.toString(), dir)
        ).filter((f) => f.endsWith('.js'))
        const temp = []

        if (dir.toLowerCase() == 'utils' && !commands.includes('help')) {
            let pull = require('./help')
            if (pull.default) {
                pull = pull.default
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
                table.addRow('help', '✅')
            } else {
                table.addRow('help', '❌ -> missing something?')
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

            addedHelp = true
        }

        for (let file of commands) {
            let pull = require(path.join(
                commandsFolder.toString(),
                dir,
                file.split('.')[0]
            ))

            if (pull.default) {
                pull = pull.default
            }

            if (file == '_category.js') {
                bot.Categories.set(pull.name, pull)
                continue
            }

            temp.push({
                name: pull.name,
                args: pull.args,
                aliases: pull.aliases,
                category: pull.category,
                authLevel: pull.authLevel,
                description: pull.description
            })

            if (pull.name) {
                bot.Commands.set(pull.name, pull)
                table.addRow(pull.name, '✅')
            } else {
                table.addRow(pull.name, '❌ -> missing something?')
                continue
            }

            if (pull.name == 'help') addedHelp = true

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

    if (!addedHelp) {
        let pull = require('./help')
        if (pull.default) {
            pull = pull.default
        }

        const temp = [
            {
                name: pull.name,
                aliases: pull.aliases,
                category: pull.category,
                authLevel: pull.authLevel,
                description: pull.description
            }
        ]

        if (pull.name) {
            bot.Commands.set(pull.name, pull)
            table.addRow('help', '✅')
        } else {
            table.addRow('help', '❌ -> missing something?')
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

        bot.Categories.set('Utils', {
            name: 'Utils',
            description: 'The utility category',
            authLevel: AuthLevel.User
        })
        bot.CategoryCommandList.set('Utils', temp)
    }

    return table
}
