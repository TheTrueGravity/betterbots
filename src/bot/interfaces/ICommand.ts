import { Message } from 'discord.js'
import { AuthLevel, Bot } from '../bot'

/**
 * Command interface
 *
 * @param {string} name - The name of the command
 * @param {string[]} aliases - The aliases for the command
 * @param {string} category - The category the command is in (case sensitive)
 * @param {string} description - The description of the command
 * @param {string | string[]} args - The arguments the command takes in (only used for the help command)
 * @param {AuthLevel} authLevel - The authority level for user execution of the command
 * @param {Promise<void | Error>} run - The function run when the command is called
 */
export interface ICommand {
    name: string
    aliases: string[]
    category: string
    description: string
    args?: string | string[]
    authLevel: AuthLevel

    /**
     *
     * @param {Bot} bot - The bot associated to the command
     * @param {Message<Boolean>} message - The message that was sent to run the command
     * @param {string[]} args - The arguments given by the user for the command in a string array
     * @param {string} _args - The arguments by the user for the command in a single string
     */
    run(
        bot: Bot,
        message: Message,
        args: Array<string>,
        _args: string
    ): Promise<void | Error>
}

export interface ICommandSimple {
    name: string
    category: string
    aliases: string[]
    description: string
    authLevel: AuthLevel
    args?: string | string[]
}
