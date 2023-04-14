"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const betterjslogger_1 = require("betterjslogger");
const worker_threads_1 = require("worker_threads");
function createWorker(workerPath, workerName, workerConfig, LOGGER, workerOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!worker_threads_1.isMainThread) {
            throw new Error('This function can only be called from the main thread!');
        }
        var receivedResponse = false;
        var started = false;
        LOGGER.log(betterjslogger_1.LogLevel.INFO, `Creating worker ${workerName}`);
        const worker = new worker_threads_1.Worker(workerPath, Object.assign({ argv: process.argv.slice(2), env: Object.assign(Object.assign({}, workerConfig), process.env) }, workerOptions));
        LOGGER.log(betterjslogger_1.LogLevel.INFO, `Worker created`, workerName);
        worker.on('message', (message) => {
            switch (message.type) {
                case 'log':
                    LOGGER.log(message.level, `${message.message}`, workerName);
                    break;
                case 'error':
                    LOGGER.log(betterjslogger_1.LogLevel.ERROR, `${message.error}`, workerName);
                    break;
                case 'pong':
                    receivedResponse = true;
                    break;
                case 'init':
                    if (message.success) {
                        LOGGER.log(betterjslogger_1.LogLevel.INFO, `Worker initialized`, workerName);
                    }
                    else {
                        LOGGER.log(betterjslogger_1.LogLevel.ERROR, `Worker initialization failed`, workerName);
                    }
                    break;
                case 'start':
                    if (message.success) {
                        LOGGER.log(betterjslogger_1.LogLevel.INFO, `Worker started`, workerName);
                        started = true;
                    }
                    else {
                        LOGGER.log(betterjslogger_1.LogLevel.ERROR, `Worker start failed`, workerName);
                    }
                    break;
                default:
                    LOGGER.log(betterjslogger_1.LogLevel.ERROR, `Unknown message type: ${message.type}`, workerName);
                    break;
            }
        });
        worker.on('error', (error) => {
            LOGGER.log(betterjslogger_1.LogLevel.ERROR, error, workerName);
        });
        worker.on('exit', (code) => {
            if (code != 0) {
                LOGGER.log(betterjslogger_1.LogLevel.ERROR, `Worker exited with code ${code}`, workerName);
            }
        });
        worker.on('online', () => {
            LOGGER.log(betterjslogger_1.LogLevel.INFO, 'Worker online', workerName);
        });
        worker.postMessage({
            type: 'ping'
        });
        var count = 0;
        while (!receivedResponse) {
            yield new Promise((resolve) => setTimeout(resolve, 100));
            count++;
            if (count == 300) {
                throw new Error(`Worker response timeout for ${workerName}`);
            }
        }
        worker.postMessage({
            type: 'init'
        });
        worker.postMessage({
            type: 'start'
        });
        var count = 0;
        while (!started) {
            yield new Promise((resolve) => setTimeout(resolve, 100));
            count++;
            if (count == 300) {
                throw new Error(`Worker start timeout for ${workerName}`);
            }
        }
        return worker;
    });
}
exports.default = createWorker;
