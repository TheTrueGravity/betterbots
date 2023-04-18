import { AuthLevel, Bot } from '../bot'
import { ICommand } from '../interfaces/ICommand'
import { Message } from 'discord.js'

const changePrefix: ICommand = {
    name: 'prefix',
    description: 'Get the server prefix',
    category: 'Utils',
    aliases: ['p'],
    authLevel: AuthLevel.User,
    async run(
        bot: Bot,
        message: Message<boolean>,
        args: string[],
        _args: string
    ) {
        message.reply('prefix')
    }
}

export default changePrefix
