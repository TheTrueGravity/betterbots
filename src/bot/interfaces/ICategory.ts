import { Client, Message, Role } from 'discord.js'
import { AuthLevel } from '../bot'

/**
 * Category interface
 *
 * @param {string} name - The name if the category
 * @param {string} description - The description of the category
 * @param {AuthLevel} authLevel - The authority level of the category
 */
export interface ICategory {
    name: string
    description: string
    authLevel: AuthLevel
}
