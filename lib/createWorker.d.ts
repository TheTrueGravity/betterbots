/// <reference types="node" />
/// <reference types="node" />
import { ILogger } from 'betterjslogger';
import { Worker } from 'worker_threads';
export default function createWorker(workerPath: string | URL, workerName: string, workerConfig: NodeJS.Dict<string>, LOGGER: ILogger, workerOptions?: WorkerOptions): Promise<Worker>;
