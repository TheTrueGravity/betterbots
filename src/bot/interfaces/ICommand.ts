import { Message } from 'discord.js'
import { AuthLevel, Bot } from '../bot'

export interface ICommand {
    name: string
    aliases: string[]
    category: string
    description: string
    args: string | string[]
    authLevel: AuthLevel
    run(
        bot: Bot,
        message: Message,
        args: Array<string>,
        _args: string
    ): Promise<void | Error>
}
