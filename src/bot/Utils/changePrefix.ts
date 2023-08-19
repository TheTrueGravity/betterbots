import Bot, { AuthLevel } from '../bot'
import ICommand from '../interfaces/ICommand'
import { Message } from 'discord.js'

const changePrefix: ICommand = {
    name: 'changePrefix',
    description: 'Change the server prefix',
    category: 'Utils',
    aliases: ['cp'],
    authLevel: AuthLevel.Admin,
    async run(
        bot: Bot,
        message: Message<boolean>,
        args: string[],
        _args: string
    ) {
        message.reply('change prefix')
    }
}

export default changePrefix
