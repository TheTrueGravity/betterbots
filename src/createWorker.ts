import { ILogger, LogLevel } from 'betterjslogger'
import { isMainThread, Worker } from 'worker_threads'

export default async function createWorker(
    workerPath: string | URL,
    workerName: string,
    workerConfig: NodeJS.Dict<string>,
    LOGGER: ILogger,
    workerOptions?: WorkerOptions
): Promise<Worker> {
    if (!isMainThread) {
        throw new Error(
            'This function can only be called from the main thread!'
        )
    }

    var receivedResponse = false
    var started = false

    LOGGER.log(LogLevel.INFO, `Creating worker ${workerName}`)

    const worker = new Worker(workerPath, {
        argv: process.argv.slice(2),
        env: {
            ...workerConfig,
            ...process.env
        },
        ...workerOptions
    })

    LOGGER.log(LogLevel.INFO, `Worker created`, workerName)

    worker.on('message', (message) => {
        switch (message.type) {
            case 'log':
                LOGGER.log(message.level, `${message.message}`, workerName)
                break
            case 'error':
                LOGGER.log(LogLevel.ERROR, `${message.error}`, workerName)
                break
            case 'pong':
                receivedResponse = true
                break
            case 'init':
                if (message.success) {
                    LOGGER.log(LogLevel.INFO, `Worker initialized`, workerName)
                } else {
                    LOGGER.log(
                        LogLevel.ERROR,
                        `Worker initialization failed`,
                        workerName
                    )
                }
                break
            case 'start':
                if (message.success) {
                    LOGGER.log(LogLevel.INFO, `Worker started`, workerName)
                    started = true
                } else {
                    LOGGER.log(
                        LogLevel.ERROR,
                        `Worker start failed`,
                        workerName
                    )
                }
                break
            default:
                LOGGER.log(
                    LogLevel.ERROR,
                    `Unknown message type: ${message.type}`,
                    workerName
                )
                break
        }
    })

    worker.on('error', (error) => {
        LOGGER.log(LogLevel.ERROR, error, workerName)
    })

    worker.on('exit', (code: number) => {
        if (code != 0) {
            LOGGER.log(
                LogLevel.ERROR,
                `Worker exited with code ${code}`,
                workerName
            )
        }
    })

    worker.on('online', () => {
        LOGGER.log(LogLevel.INFO, 'Worker online', workerName)
    })

    worker.postMessage({
        type: 'ping'
    })

    var count = 0
    while (!receivedResponse) {
        await new Promise((resolve) => setTimeout(resolve, 100))
        count++
        if (count == 300) {
            throw new Error(`Worker response timeout for ${workerName}`)
        }
    }

    worker.postMessage({
        type: 'init'
    })
    worker.postMessage({
        type: 'start'
    })

    var count = 0
    while (!started) {
        await new Promise((resolve) => setTimeout(resolve, 100))
        count++
        if (count == 300) {
            throw new Error(`Worker start timeout for ${workerName}`)
        }
    }

    return worker
}
