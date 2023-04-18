import * as json from '../modules/json'
import * as path from 'path'

import { Guild } from 'discord.js'
import { Bot } from '../bot'

export interface IServerHandler {
    changePrefix(bot: Bot, guild: Guild, prefix: string | string[]): Promise<void>
    getPrefix(bot: Bot, guild: Guild): Promise<string>
}

export class ServerHandler implements IServerHandler {
    constructor() {}

    async changePrefix(bot: Bot, guild: Guild, prefix: string | string[]): Promise<void> {
        const servers = await json.read(
            path.join(bot.ConfigDir, 'servers.json')
        )
        servers[guild.id]['prefix'] = prefix
        await json.write(servers, path.join(bot.ConfigDir, 'servers.json'))
    }

    async getPrefix(bot: Bot, guild: Guild): Promise<string> {
        const servers = await json.read(
            path.join(bot.ConfigDir, 'servers.json')
        )
        return servers[guild.id]['prefix']
    }
}
