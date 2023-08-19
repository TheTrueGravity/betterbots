import { Message } from 'discord.js'
import Bot, { AuthLevel } from '../bot'
import ICommand from '../interfaces/ICommand'
import {
    createErrorEmbed,
    createTitleEmbed,
    replyWithEmbed
} from '../modules/embeds'

const help: ICommand = {
    name: 'help',
    category: 'Utils',
    description: 'The help command of the bot',
    aliases: ['h'],
    authLevel: AuthLevel.User,
    args: ['{}', '{Category name}', '{Command name}'],
    async run(
        bot: Bot,
        message: Message<boolean>,
        args: string[],
        _args: string
    ): Promise<void | Error> {
        const categories = bot.Categories

        // Main help page if no args given
        if (!args[0]) {
            var description = ''

            for (const category of categories.values()) {
                if (!bot.checkAuthLevel(category.authLevel, bot, message)) {
                    await replyWithEmbed(
                        message,
                        await createErrorEmbed(
                            'You do not have the required permissions!',
                            message.author
                        )
                    )
                    return
                }

                description += `${category.name} - ${category.description}\n\n`
            }

            await replyWithEmbed(
                message,
                await createTitleEmbed(
                    'Help',
                    description,
                    bot.MainEmbedColour,
                    message.author,
                    bot.MainEmbedThumbnail
                )
            )

            return
        }

        // Categories help page (checks if the given argument matches any category names)
        if (
            bot.Categories.map((x) => x.name.toLowerCase()).find(
                (e) => (e = args[0].toLowerCase())
            )
        ) {
            for (const category of categories.values()) {
                if (category.name.toLowerCase() == args[0].toLowerCase()) {
                    if (!bot.checkAuthLevel(category.authLevel, bot, message)) {
                        await replyWithEmbed(
                            message,
                            await createErrorEmbed(
                                'You do not have the required permissions!',
                                message.author
                            )
                        )
                        return
                    }

                    var description = `**${category.name.toUpperCase()} COMMANDS**\n\n`
                    const commands = bot.CategoryCommandList.get(category.name)

                    if (!commands) return

                    for (const command of commands) {
                        if (
                            !bot.checkAuthLevel(command.authLevel, bot, message)
                        )
                            continue
                        description += `**Name:** ${command.name}\n**Description**: ${command.description}`
                        if (command.aliases) {
                            description += `\n**Aliases** - ${command.aliases
                                .join(', ')
                                .substr(0, command.aliases.join(', ').length)}`
                        }
                        if (command.args) {
                            if (typeof command.args == 'string') {
                                description += `\n**Arguments** - ${command.args}`
                            } else {
                                description += `\n**Arguments** - ${command.args.join(
                                    ' '
                                )}`
                            }
                        }
                        description += '\n\n'
                    }

                    await replyWithEmbed(
                        message,
                        await createTitleEmbed(
                            'Help',
                            description,
                            bot.MainEmbedColour,
                            message.author,
                            bot.MainEmbedThumbnail
                        )
                    )

                    return
                }
            }
        }

        // Command help page (checks if the given argument matches any command names)
        for (var category of categories.keys()) {
            const commands = bot.CategoryCommandList.get(category)

            if (!commands) return

            if (
                commands
                    .map((x) => x.name)
                    .find((e) => e.toLowerCase() == args[0].toLowerCase())
            ) {
                const commandName = commands.find(
                    (e) => e.name.toLowerCase() == args[0].toLowerCase()
                )
                if (!commandName) return
                const command = bot.Commands.get(commandName.name)
                if (!command) return

                if (!bot.checkAuthLevel(command.authLevel, bot, message)) {
                    await replyWithEmbed(
                        message,
                        await createErrorEmbed(
                            'You do not have the required permissions!',
                            message.author
                        )
                    )
                    return
                }

                var description = `**Name:** ${
                    (await command).name
                }\n**Description**: ${command.description}\n**Category**: ${
                    command.category
                }`
                if (command.aliases) {
                    description += `\n**Aliases** - ${command.aliases}`
                }
                if (command.args) {
                    if (typeof command.args == 'string') {
                        description += `\n**Arguments** - ${command.args}`
                    } else {
                        description += `\n**Arguments** - ${command.args.join(
                            ' '
                        )}`
                    }
                }
                description += '\n\n'

                await replyWithEmbed(
                    message,
                    await createTitleEmbed(
                        'Help',
                        description,
                        bot.MainEmbedColour,
                        message.author,
                        bot.MainEmbedThumbnail
                    )
                )

                return
            }
        }

        const alias = bot.Aliases.get(args[0])
        if (alias) {
            const command = bot.Commands.get(alias)
            if (!command) return

            if (!bot.checkAuthLevel(command.authLevel, bot, message)) {
                await replyWithEmbed(
                    message,
                    await createErrorEmbed(
                        'You do not have the required permissions!',
                        message.author
                    )
                )
                return
            }

            var description = `**Name:** ${
                (await command).name
            }\n**Description**: ${command.description}\n**Category**: ${
                command.category
            }`
            if (command.aliases) {
                description += `\n**Aliases** - ${command.aliases}`
            }
            if (command.args) {
                if (typeof command.args == 'string') {
                    description += `\n**Arguments** - ${command.args}`
                } else {
                    description += `\n**Arguments** - ${command.args.join(' ')}`
                }
            }
            description += '\n\n'

            await replyWithEmbed(
                message,
                await createTitleEmbed(
                    'Help',
                    description,
                    bot.MainEmbedColour,
                    message.author,
                    bot.MainEmbedThumbnail
                )
            )

            return
        }

        await replyWithEmbed(
            message,
            await createErrorEmbed(
                `Invalid command or category: ${args[0]}`,
                message.author
            )
        )
        return
    }
}

export default help
