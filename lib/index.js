"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.embeds = exports.TaskTypes = exports.Deployment = exports.AuthLevel = exports.Bot = exports.Manager = void 0;
var manager_1 = require("./manager");
Object.defineProperty(exports, "Manager", { enumerable: true, get: function () { return manager_1.Manager; } });
var bot_1 = require("./bot/bot");
Object.defineProperty(exports, "Bot", { enumerable: true, get: function () { return bot_1.Bot; } });
Object.defineProperty(exports, "AuthLevel", { enumerable: true, get: function () { return bot_1.AuthLevel; } });
Object.defineProperty(exports, "Deployment", { enumerable: true, get: function () { return bot_1.Deployment; } });
var ITask_1 = require("./bot/interfaces/ITask");
Object.defineProperty(exports, "TaskTypes", { enumerable: true, get: function () { return ITask_1.TaskTypes; } });
exports.embeds = __importStar(require("./bot/modules/embeds"));
