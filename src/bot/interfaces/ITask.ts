import { Bot } from '../bot'

export enum TaskTypes {
    onClientEvent,
    scheduled
}

export interface ITask {
    name: string
    enabled: boolean
    taskType: TaskTypes
    description: string
    interval?: number
    init?: (bot: Bot) => Promise<void>
    run: (bot: Bot, ...args: any[]) => void
}
