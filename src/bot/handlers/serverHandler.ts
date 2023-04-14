import * as json from '../modules/json'
import * as path from 'path'

import { Guild } from 'discord.js'
import { Bot } from '../bot'

export interface IServerHandler {
    changePrefix(guild: Guild, prefix: string | string[]): Promise<void>
    getPrefix(guild: Guild): Promise<string>
}

export class ServerHandler implements IServerHandler {
    private static instance: ServerHandler

    private Bot: Bot

    constructor(bot: Bot) {
        if (ServerHandler.instance) {
            throw new Error(
                'ServerHandler is a singleton class and cannot be instantiated more than once.'
            )
        }

        this.Bot = bot

        ServerHandler.instance = this
    }

    public static getInstance(bot: Bot): ServerHandler {
        if (!ServerHandler.instance) {
            new ServerHandler(bot)
        }
        return ServerHandler.instance
    }

    async changePrefix(guild: Guild, prefix: string | string[]): Promise<void> {
        const servers = await json.read(
            path.join(this.Bot.ConfigDir, 'servers.json')
        )
        servers[guild.id]['prefix'] = prefix
        await json.write(servers, path.join(this.Bot.ConfigDir, 'servers.json'))
    }

    async getPrefix(guild: Guild): Promise<string> {
        const servers = await json.read(
            path.join(this.Bot.ConfigDir, 'servers.json')
        )
        return servers[guild.id]['prefix']
    }
}
