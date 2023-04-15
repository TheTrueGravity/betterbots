/**
 * @param {boolean} logToFile - If the bot logs to a file or not
 * @param {string} logFolder - The folder to place logs in
 * @param {string} logFileName - Custom log file name
 */
interface bot {
    name: string;
    path: string;
}
/**
 * The config for the bot manager
 * @param {boolean} logToFile - If the bot logs to a file or not
 * @param {string} logFolder - The folder to place logs in
 * @param {string} logFileName - Custom log file name
 */
export interface ManagerConfig {
    logToFile?: boolean;
    logFolder?: string;
    logFileName?: string;
}
export interface IManager {
    addBot(bot: bot): Promise<void>;
}
/**
 * Spawn and manage multiple bots at once
 */
export declare class Manager implements IManager {
    private config;
    private LOGGER;
    private bots;
    private workers;
    /**
     * @param {bot[]} bots - An array of bots to create and start
     * @param {ManagerConfig} config - The configuration for the manager
     * @returns {Manager}
     */
    constructor(bots: bot[], config: ManagerConfig);
    private initializeWorkers;
    /**
     * Pass in a bot and add it to the manager
     * @param {bot} bot - The bot to add to the manager
     */
    addBot(bot: bot): Promise<void>;
}
export {};
