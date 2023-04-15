import { Bot } from '../bot'

/**
 * Task types for task modules
 *
 * @property onClientEvent - Uses discord.js client.on function to execute task
 * @property scheduled - Executes the task every set amount of time in milliseconds, requires interval in {@link ITask}
 */
export enum TaskTypes {
    onClientEvent,
    scheduled
}

/**
 * Task interface
 *
 * @param {string} name - The name of the task
 * @param {boolean} enabled - Whether or not the task is enable
 * @param {TaskTypes} taskType - What type the task is (see {@link TaskTypes})
 * @param {string} description - The description of the task
 * @param {number} interval - How often the task executes (if the task is a scheduled task)
 * @param {Promise<void>} init - Executes when the task gets loaded in
 * @param {void} run - Function called when the task is executed
 */
export interface ITask {
    name: string
    enabled: boolean
    taskType: TaskTypes
    description: string
    interval?: number
    
    /**
     * Executes when the task gets loaded in
     *
     * @param bot The bot associated to the task
     * @returns Promise void
     */
    init?: (bot: Bot) => Promise<void>
    
    /**
     * Called when the task gets executed
     * 
     * @param bot The bot associated to the task
     * @param args The arguments passed in when the task is executed
     * @returns void
     */
    run: (bot: Bot, ...args: any[]) => void
}
