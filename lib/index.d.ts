export { IManager, Manager, ManagerConfig } from './manager';
export { Bot, AuthLevel, BotOptions, Deployment, IBot } from './bot/bot';
export { ITask, TaskTypes } from './bot/interfaces/ITask';
export { ICategory } from './bot/interfaces/ICategory';
export { ICommand } from './bot/interfaces/ICommand';
export { createAuthorEmbed, createBasicEmbed, createErrorEmbed, createFieldsEmbed, createThumbnailEmbed, createTitleEmbed, replyWithEmbed as reply } from './bot/modules/embeds';
