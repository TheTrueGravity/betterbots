export interface bot {
    path: string;
    name: string;
}
export interface ManagerConfig {
    logToFile?: boolean;
    logFileName?: string;
    logFolder?: string;
}
export interface IManager {
}
export default class Manager implements IManager {
    private config;
    private LOGGER;
    private bots;
    private workers;
    constructor(bots: bot[], config: ManagerConfig);
    testManager(): boolean;
    private initializeWorkers;
    addBot(bot: bot): Promise<void>;
}
