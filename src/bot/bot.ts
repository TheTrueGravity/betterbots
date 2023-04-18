import { isMainThread, parentPort } from 'worker_threads'
import Logger, { LogLevel } from 'betterjslogger'
import { ICommand } from './interfaces/ICommand'
import { ICategory } from './interfaces/ICategory'
import { ServerHandler } from './handlers/serverHandler'
import { ActivityType, ColorResolvable, Message } from 'discord.js'
import { handleMessage } from './handlers/messageHandler'
import Commands from './modules/commands'
import Tasks from './modules/tasks'
import { ITask, TaskTypes } from './interfaces/ITask'
import {
    Client,
    ClientOptions,
    Collection,
    Guild,
    Partials,
    User
} from 'discord.js'
import { ICommandSimple } from './interfaces/ICommand'

export interface IBot {
    get ConfigDir(): string

    get Client(): Client
    get Deployment(): Deployment
    get Version(): string
    get Prefixes(): string | string[]
    get Testers(): string[]

    get Commands(): Collection<string, ICommand>
    get Aliases(): Collection<string, string>
    get Categories(): Collection<string, ICategory>
    get CategoryCommandList(): Collection<string, ICommandSimple[]>
}

export interface _logger {
    log(level: LogLevel, message: string): any
}

export interface BotOptions {
    logToFile?: boolean
    logFileName?: string
    logFolder?: string
    deployment: Deployment
    version: string
    prefixes: string | string[]
    testers: string[]
    configDir: string
    commandFolder: string
    tasksFolder: string
    token: string
    mainEmbedThumbnail?: string
    mainEmbedColour: ColorResolvable
}

export enum Deployment {
    Stable = 'stable',
    Development = 'development'
}
export enum AuthLevel {
    User,
    Mod,
    Admin,
    Owner
}

/**
 * The bot class
 *
 * @param botOptions The bot options
 */
export class Bot implements IBot {
    private LOGGER: Logger | _logger
    private CONFIGDIR: string

    private TOKEN: string

    private COMMANDSDIR: string
    private TASKSDIR: string

    private CLIENT: Client
    private DEPLOYMENT: Deployment
    private VERSION: string
    private PREFIXES: string | string[]
    private TESTERS: string[]
    private MAINEMBEDTHUMBNAIL: string | undefined
    private MAINEMBEDCOLOUR: ColorResolvable

    private COMMANDS: Collection<string, ICommand>
    private ALIASES: Collection<string, string>
    private CATEGORIES: Collection<string, ICategory>
    private CATEGORYCOMMANDLIST: Collection<string, ICommandSimple[]>

    private serverHandler: ServerHandler

    private init(): void {
        const commands = Commands(this, this.COMMANDSDIR)

        const tasks: Collection<string, ITask> = new Collection()
        const _tasks = Tasks(tasks, this.TASKSDIR)

        tasks.forEach(async (task) => {
            if (!task.enabled) return

            if (task.init) await task.init(this)

            switch (task.taskType) {
                case TaskTypes.onClientEvent:
                    this.CLIENT.on(task.name, (...args) =>
                        task.run(this, ...args)
                    )
                    break
                case TaskTypes.scheduled:
                    setInterval(() => task.run(this), task.interval)
                    break
                default:
                    break
            }
        })

        if (commands) this.LOGGER.log(LogLevel.VERBOSE, commands.toString())
        if (_tasks) this.LOGGER.log(LogLevel.VERBOSE, _tasks.toString())
    }
    private start(): void {
        this.LOGGER.log(LogLevel.INFO, 'Client logging in...')
        this.CLIENT.login(this.TOKEN)
    }

    public constructor(
        botOptions: BotOptions,
        serverHandler: ServerHandler,
        clientOptions: ClientOptions = {
            intents: [
                'DirectMessages',
                'Guilds',
                'GuildMembers',
                'GuildMessages',
                'GuildMessageReactions',
                'GuildBans',
                'MessageContent'
            ],
            partials: [Partials.Message, Partials.Channel, Partials.Reaction]
        }
    ) {
        if (!serverHandler) {
            this.serverHandler = new ServerHandler()
        } else {
            this.serverHandler = serverHandler
        }
            
        this.CLIENT = new Client(clientOptions)

        if (!isMainThread) {
            this.LOGGER = {
                log: function (level: LogLevel, message: string | Error) {
                    if (level == LogLevel.ERROR) {
                        if (typeof message == 'string') {
                            parentPort?.postMessage({
                                type: 'error',
                                error: message
                            })
                        } else {
                            parentPort?.postMessage({
                                type: 'error',
                                error: `${message.name}: ${message.message}`
                            })
                        }
                    } else {
                        parentPort?.postMessage({
                            type: 'log',
                            level,
                            message
                        })
                    }
                }
            }

            parentPort?.on('message', async (message) => {
                switch (message.type) {
                    case 'ping':
                        parentPort?.postMessage({
                            type: 'pong'
                        })
                        break
                    case 'init':
                        this.init()
                        break
                    case 'start':
                        this.start()
                        break
                    default:
                        break
                }
            })
        } else {
            this.LOGGER = new Logger({
                logToFile: botOptions.logToFile,
                logFileName: botOptions.logFileName,
                logFolder: botOptions.logFolder
            })
        }

        this.TOKEN = botOptions.token

        this.CONFIGDIR = botOptions.configDir
        this.COMMANDSDIR = botOptions.commandFolder
        this.TASKSDIR = botOptions.tasksFolder

        this.DEPLOYMENT = botOptions.deployment
        this.VERSION = botOptions.version
        this.PREFIXES = botOptions.prefixes
        this.TESTERS = botOptions.testers
        this.MAINEMBEDTHUMBNAIL = botOptions.mainEmbedThumbnail
        this.MAINEMBEDCOLOUR = botOptions.mainEmbedColour

        this.COMMANDS = new Collection()
        this.ALIASES = new Collection()
        this.CATEGORIES = new Collection()
        this.CATEGORYCOMMANDLIST = new Collection()

        // this.serverHandler = ServerHandler.getInstance(this)

        this.CLIENT.on('ready', async () => {
            this.LOGGER.log(
                LogLevel.INFO,
                '-------------------------------------------'
            )
            this.LOGGER.log(
                LogLevel.INFO,
                `Logged in as ${this.CLIENT.user?.tag}!`
            )
            this.LOGGER.log(LogLevel.INFO, `Client id: ${this.CLIENT.user?.id}`)
            this.LOGGER.log(LogLevel.INFO, `Deployment: ${this.Deployment}`)
            this.LOGGER.log(LogLevel.INFO, `Version: ${this.Version}`)
            this.LOGGER.log(
                LogLevel.INFO,
                '-------------------------------------------'
            )

            const firstPrefix =
                typeof this.PREFIXES == 'string'
                    ? this.PREFIXES
                    : this.PREFIXES[0]

            this.CLIENT.user?.setActivity({
                name: `${firstPrefix}help`,
                type: ActivityType.Playing
            })

            if (!isMainThread) {
                parentPort?.postMessage({
                    type: 'start',
                    success: true
                })
            }
        })
        this.CLIENT.on('error', (err) => {
            return this.LOGGER.log(
                LogLevel.ERROR,
                `${err.message}\n\n${err.stack}`
            )
        })
        this.CLIENT.on('messageCreate', (message) =>
            handleMessage(this, message, this.LOGGER)
        )

        if (isMainThread) {
            this.init()
            this.start()
        }
    }

    public isMod(user: User, guild: Guild) {
        return false
    }

    public checkAuthLevel(
        authLevel: AuthLevel,
        bot: Bot,
        message: Message<boolean>
    ) {
        switch (authLevel) {
            case AuthLevel.Mod:
                if (!message.guild) return false
                if (
                    bot.isMod(message.author, message.guild) ||
                    this.checkAuthLevel(AuthLevel.Admin, bot, message)
                )
                    return true

                return
            case AuthLevel.Admin:
                if (
                    message.member?.roles.highest.permissions.has(
                        'Administrator'
                    ) ||
                    this.checkAuthLevel(AuthLevel.Owner, bot, message)
                )
                    return true
                return
            case AuthLevel.Owner:
                if (!message.guild) return false
                if (message.member?.id != message.guild.ownerId) return
                return true
            default:
                return true
        }
    }

    public get ConfigDir(): string {
        return this.CONFIGDIR
    }

    public get Client(): Client {
        return this.CLIENT
    }
    public get Deployment(): Deployment {
        return this.DEPLOYMENT
    }
    public get Version(): string {
        return this.VERSION
    }
    public get Prefixes(): string | string[] {
        return this.PREFIXES
    }
    public get Testers(): string[] {
        return this.TESTERS
    }
    public get MainEmbedThumbnail(): string | undefined {
        return this.MAINEMBEDTHUMBNAIL
    }
    public get MainEmbedColour(): ColorResolvable {
        return this.MAINEMBEDCOLOUR
    }

    public get Commands(): Collection<string, ICommand> {
        return this.COMMANDS
    }
    public get Aliases(): Collection<string, string> {
        return this.ALIASES
    }
    public get Categories(): Collection<string, ICategory> {
        return this.CATEGORIES
    }
    public get CategoryCommandList(): Collection<string, ICommandSimple[]> {
        return this.CATEGORYCOMMANDLIST
    }
}
