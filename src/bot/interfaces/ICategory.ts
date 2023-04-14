import { Client, Message, Role } from 'discord.js'
import { AuthLevel } from '../bot'

export interface ICategory {
    name: string
    description: string
    authLevel: AuthLevel
}
