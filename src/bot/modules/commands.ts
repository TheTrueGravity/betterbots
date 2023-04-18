import { readdirSync, PathLike, existsSync } from 'fs'
import { AsciiTable3 as ascii } from 'ascii-table3'
import { AuthLevel, Bot } from '../bot'
import * as path from 'path'
import { ICategory } from '../interfaces/ICategory'
import { ICommand } from '../interfaces/ICommand'

export default function Commands(bot: Bot, commandsFolder: PathLike) {
    if (!existsSync(commandsFolder)) return

    const categories: ICategory[] = []
    const table = new ascii('Commands').setHeading('Command', 'Load status')

    var addedUtilCommands = false

    readdirSync(commandsFolder).forEach((dir) => {
        const commands = readdirSync(
            path.join(commandsFolder.toString(), dir)
        ).filter((f) => f.endsWith('.js'))
        const temp = []

        if (dir.toLowerCase() == 'utils') {
            var pulls: string[] = []

            if (!commands.includes('help')) pulls.push('../Utils/help')
            if (!commands.includes('prefix')) pulls.push('../Utils/prefix')
            if (!commands.includes('changePrefix'))
                pulls.push('../Utils/changePrefix')

            for (const _pull in pulls) {
                var pull = require(_pull)
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
                    table.addRow(pull.name, '✅')
                } else {
                    table.addRow(pull.name, '❌ -> missing something?')
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

            addedUtilCommands = true
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

    if (!addedUtilCommands) {
        var pulls: string[] = []

        if (!bot.Commands.get('help')) pulls.push('../Utils/help')
        if (!bot.Commands.get('prefix')) pulls.push('../Utils/prefix')
        if (!bot.Commands.get('changePrefix'))
            pulls.push('../Utils/changePrefix')

        const temp = []

        for (const _pull of pulls) {
            var pull = require(_pull)
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
                table.addRow(pull.name, '✅')
            } else {
                table.addRow(pull.name, '❌ -> missing something?')
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

        addedUtilCommands = true
    }

    return table
}
