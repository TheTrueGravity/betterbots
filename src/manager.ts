import { isMainThread, Worker } from 'worker_threads'
import createWorker from './createWorker'
import Logger, { LogLevel } from 'betterjslogger'

export interface bot {
    path: string
    name: string
}

export interface ManagerConfig {
    logToFile?: boolean
    logFileName?: string
    logFolder?: string
}

export interface IManager {}

export class Manager implements IManager {
    private config: ManagerConfig
    private LOGGER: Logger
    private bots: bot[]
    private workers: Worker[]

    constructor(bots: bot[], config: ManagerConfig) {
        if (!isMainThread) {
            throw new Error('Manager not running in main thread!')
        }

        this.LOGGER = new Logger({
            logToFile: false,
            logFileName: config.logFileName,
            logFolder: config.logFolder
        })
        this.bots = bots
        this.config = config
        this.workers = []

        this.initializeWorkers()

        return this
    }

    public testManager() {
        return true
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

    public async addBot(bot: bot) {
        const worker = await createWorker(bot.path, bot.name, {}, this.LOGGER)
        this.workers.push(worker)
    }
}
