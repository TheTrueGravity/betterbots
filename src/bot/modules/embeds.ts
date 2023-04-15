import {
    ImageURLOptions,
    Message,
    User,
    EmbedBuilder,
    ColorResolvable,
    Embed,
    EmbedAuthorData,
    EmbedField
} from 'discord.js'

// Return an embed with a given description and colour.
export async function createBasicEmbed(
    description: string,
    colour: ColorResolvable
): Promise<EmbedBuilder> {
    const embed = new EmbedBuilder()
        .setDescription(description)
        .setColor(colour)
    return embed
}

/**
 * Returns an embed with a given title, description, colour and author
 *
 * @param {string} title - The embed title
 * @param {string} description - The embed description
 * @param {ColorResolvable} colour - The embed colour
 * @param {EmbedAuthorData | User} author - The embed author
 * @param {string} thumbnail - The embed thumbnail
 * @returns {Promise<Embed>}
 */
export async function createTitleEmbed(
    title: string,
    description: string,
    colour: ColorResolvable,
    author: EmbedAuthorData | User,
    thumbnail?: string
): Promise<EmbedBuilder> {
    const _author: EmbedAuthorData =
        author instanceof User
            ? { name: author.username, iconURL: author.avatarURL()! }
            : author
    const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(colour)
        .setAuthor(_author)

    if (thumbnail) embed.setThumbnail(thumbnail)
    return embed
}

/**
 * Return an embed with a given description, colour, and author
 *
 * @param {string} description - The embed description
 * @param {ColorResolvable} colour - The embed colour
 * @param {EmbedAuthorData | User} author - The embed author
 * @returns {Promise<Embed>}
 */
export async function createAuthorEmbed(
    description: string,
    colour: ColorResolvable,
    author: EmbedAuthorData | User
): Promise<EmbedBuilder> {
    const _author: EmbedAuthorData =
        author instanceof User
            ? { name: author.username, iconURL: author.avatarURL()! }
            : author
    const embed = new EmbedBuilder()
        .setDescription(description)
        .setColor(colour)
        .setAuthor(_author)
    return embed
}

/**
 * Return an embed with a given description, colour, and thumbnail
 *
 * @param {string} description - The embed description
 * @param {ColorResolvable} colour - The embed colour
 * @param {EmbedAuthorData | User} author - The embed author
 * @param {string} thumbnail - The embed thumbnail
 * @returns {Promise<Embed>}
 */
export async function createThumbnailEmbed(
    description: string,
    colour: ColorResolvable,
    author: EmbedAuthorData | User,
    thumbnail: string
): Promise<EmbedBuilder> {
    const _author: EmbedAuthorData =
        author instanceof User
            ? { name: author.username, iconURL: author.avatarURL()! }
            : author
    const embed = new EmbedBuilder()
        .setDescription(description)
        .setColor(colour)
        .setThumbnail(thumbnail)
        .setAuthor(_author)
    return embed
}

/**
 * Return an error embed with a given description and author
 *
 * @param {string} description - The embed description
 * @param {EmbedAuthorData | User} author - The embed author
 * @param {string} thumbnail - The embed thumbnail
 * @returns {Promise<Embed>}
 */
export async function createErrorEmbed(
    description: string,
    author: EmbedAuthorData | User,
    thumbnail?: string
): Promise<EmbedBuilder> {
    const _author: EmbedAuthorData =
        author instanceof User
            ? { name: author.username, iconURL: author.avatarURL()! }
            : author
    const embed = new EmbedBuilder()
        .setDescription(description)
        .setColor('#ff0000')
        .setAuthor(_author)

    if (thumbnail) embed.setThumbnail(thumbnail)
    return embed
}

/**
 *
 * @param {string} title - The embed title
 * @param {ColorResolvable} colour - The embed colour
 * @param {EmbedAuthorData | User} author - The embed author
 * @param {EmbedField[]} fields - The embed fields
 * @returns {Promise<Embed>}
 */
// Return an embed with a given title, colour, author and fields
export async function createFieldsEmbed(
    title: string,
    colour: ColorResolvable,
    author: EmbedAuthorData | User,
    fields: EmbedField[]
): Promise<EmbedBuilder> {
    const _author: EmbedAuthorData =
        author instanceof User
            ? { name: author.username, iconURL: author.avatarURL()! }
            : author
    const embed = new EmbedBuilder()
        .setTitle(title)
        .setColor(colour)
        .setAuthor(_author)
        .addFields(fields)
    return embed
}

/**
 * Reply to a given message with an embed
 *
 * @param {Message} message - The message to reply to
 * @param {EmbedBuilder} embed - The embed to send
 * @returns {Promise<Message<Boolean>>}
 */
export async function replyWithEmbed(
    message: Message,
    embed: EmbedBuilder
): Promise<Message<boolean>> {
    return message.channel.send({
        embeds: [embed]
    })
}
