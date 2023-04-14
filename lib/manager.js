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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Manager = void 0;
const worker_threads_1 = require("worker_threads");
const createWorker_1 = __importDefault(require("./createWorker"));
const betterjslogger_1 = __importDefault(require("betterjslogger"));
class Manager {
    constructor(bots, config) {
        if (!worker_threads_1.isMainThread) {
            throw new Error('Manager not running in main thread!');
        }
        this.LOGGER = new betterjslogger_1.default({
            logToFile: false,
            logFileName: config.logFileName,
            logFolder: config.logFolder
        });
        this.bots = bots;
        this.config = config;
        this.workers = [];
        this.initializeWorkers();
        return this;
    }
    testManager() {
        return true;
    }
    initializeWorkers() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const bot of this.bots) {
                const worker = yield (0, createWorker_1.default)(bot.path, bot.name, {}, this.LOGGER);
                this.workers.push(worker);
            }
        });
    }
    addBot(bot) {
        return __awaiter(this, void 0, void 0, function* () {
            const worker = yield (0, createWorker_1.default)(bot.path, bot.name, {}, this.LOGGER);
            this.workers.push(worker);
        });
    }
}
exports.Manager = Manager;
