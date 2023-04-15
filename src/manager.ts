import { isMainThread, Worker } from 'worker_threads'
import createWorker from './createWorker'
import Logger, { LogLevel } from 'betterjslogger'

/**
 * @param {boolean} logToFile - If the bot logs to a file or not
 * @param {string} logFolder - The folder to place logs in
 * @param {string} logFileName - Custom log file name
 */
interface bot {
    name: string
    path: string
}

/**
 * The config for the bot manager
 * @param {boolean} logToFile - If the bot logs to a file or not
 * @param {string} logFolder - The folder to place logs in
 * @param {string} logFileName - Custom log file name
 */
export interface ManagerConfig {
    logToFile?: boolean
    logFolder?: string
    logFileName?: string
}

export interface IManager {
    addBot(bot: bot): Promise<void>
}

/**
 * Spawn and manage multiple bots at once
 */
export class Manager implements IManager {
    private config: ManagerConfig
    private LOGGER: Logger
    private bots: bot[]
    private workers: Worker[]

    /**
     * @param {bot[]} bots - An array of bots to create and start
     * @param {ManagerConfig} config - The configuration for the manager
     * @returns {Manager}
     */
    constructor(bots: bot[], config: ManagerConfig) {
        if (!isMainThread) {
            throw new Error('Manager not running in main thread!')
        }

        this.LOGGER = new Logger({
            logToFile: config.logToFile,
            logFileName: config.logFileName,
            logFolder: config.logFolder
        })
        this.bots = bots
        this.config = config
        this.workers = []

        this.initializeWorkers()

        return this
    }

    private async initializeWorkers() {
        for (const bot of this.bots) {
            const worker = await createWorker(
                bot.path,
                bot.name,
                {},
                this.LOGGER
            )
            this.workers.push(worker)
        }
    }

    /**
     * Pass in a bot and add it to the manager
     * @param {bot} bot - The bot to add to the manager
     */
    public async addBot(bot: bot) {
        const worker = await createWorker(bot.path, bot.name, {}, this.LOGGER)
        this.workers.push(worker)
    }
}
