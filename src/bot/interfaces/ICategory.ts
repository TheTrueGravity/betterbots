import { Client, Message, Role } from 'discord.js'
import { AuthLevel } from '../bot'

export default interface ICategory {
    name: string
    description: string
    authLevel: AuthLevel
}
