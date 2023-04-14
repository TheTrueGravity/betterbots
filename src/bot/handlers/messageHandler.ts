import { Message } from 'discord.js'
import { ILogger, LogLevel } from 'betterjslogger'
import { AuthLevel, Deployment, _logger } from '../bot'
import { createErrorEmbed, reply } from '../modules/embeds'
import { Bot } from '../bot'

function checkAuthLevel(authLevel: AuthLevel, bot: Bot, message: Message) {
    switch (authLevel) {
        case AuthLevel.Mod:
            if (!message.guild) return false
            if (!bot.isMod(message.author, message.guild)) return
            return true
        case AuthLevel.Admin:
            if (!message.member?.roles.highest.permissions.has('Administrator'))
                return
            return true
        case AuthLevel.Owner:
            if (!message.guild) return false
            if (message.member?.id != message.guild.ownerId) return
            return true
        default:
            return true
    }
}

export async function handleMessage(
    bot: Bot,
    message: Message,
    Logger: ILogger | _logger
): Promise<void> {
    var hasPrefix = false
    var prefix = ''

    if (typeof bot.Prefixes == 'string') {
        if (message.content.toLowerCase().startsWith(bot.Prefixes)) {
            hasPrefix = true
            prefix = message.content.slice(0, bot.Prefixes.length)
        }
    } else {
        for (const _prefix of bot.Prefixes) {
            if (message.content.toLowerCase().startsWith(_prefix)) {
                hasPrefix = true
                prefix = message.content.slice(0, _prefix.length)
                break
            }
        }
    }

    if (message.author.bot) return
    if (!message.guild) return
    if (!hasPrefix) return

    const args = message.content.slice(prefix.length).trim().split(/ +/g)
    const _args = message.content
        .slice(prefix.length)
        .trimStart()
        .replace(args[0], '')
        .trimStart()

    const cmd = args.shift()?.toLowerCase()

    if (!cmd) return

    var command = bot.Commands.get(cmd)

    if (!command) {
        const alias = bot.Aliases.get(cmd)
        if (!alias) {
            message.reply('Command not found!')
            return
        }
        command = bot.Commands.get(alias)
    }

    if (!command) {
        message.reply('Command not found!')
        return
    }

    if (
        bot.Deployment == Deployment.Development &&
        !bot.Testers.includes(message.author.id)
    )
        return

    const category = bot.Categories.get(command.category)

    if (!category) return

    if (
        !checkAuthLevel(category.authLevel, bot, message) ||
        !checkAuthLevel(command.authLevel, bot, message)
    ) {
        await message.reply(
            `You do not have permission to run the command ${command.name}`
        )
    }

    const run = await command.run(bot, message, args, _args)

    if (run instanceof Error) {
        Logger.log(LogLevel.ERROR, run.message)
        await reply(
            message,
            await createErrorEmbed(
                `There was an error running the command: ${command.name}`,
                message.author
            )
        )
    }

    Logger.log(
        LogLevel.VERBOSE,
        `${message.author.username}#${message.author.discriminator} (${message.author.id}) successfully ran the command: ${command.name}`
    )
}
