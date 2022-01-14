import type { Message, User } from "discord.js";
import { Command } from "@sapphire/framework";
import { Logger } from "../../Logger";
import { MessageEmbed } from "discord.js";
import type { TLogLevelName } from "tslog";

const logger = new Logger(process.env.LOGLEVEL as TLogLevelName);

export default class UserinfoCommand extends Command {
    private getUserBannerUrl(userId: string): string | null {
        const user = this.container.client.users.cache.get(userId);
        return user?.banner ? `https://cdn.discordapp.com/banners/${userId}/${user.banner}?size=512` : null;
    }

    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            aliases: ["i", "info"],
            cooldownDelay: 1000,
            cooldownFilteredUsers: process.env.OWNER_IDS?.split(","),
            description: "displays informations about a user",
            name: "userinfo",
        });
    }

    public onLoad(): void {
        logger.debug(`Loaded command '${this.category ? `${this.category}/` : ""}${this.name}'`);
    }

    public onUnload(): void {
        logger.debug(`Unloaded command '${this.category ? `${this.category}/` : ""}${this.name}'`);
    }

    public async messageRun(message: Message): Promise<void> {
        logger.silly(
            `Command '${this.category ? `${this.category}/` : ""}${this.name}' triggered by ${message.author.tag} (${
                message.author.id
            })`,
        );

        const args = message.content.split(" ").slice(1);
        let user: User | undefined = await this.container.client.users
            .fetch(`${message.mentions.users.first()?.id}`, { force: true })
            .catch(() => undefined);
        if (!user) user = await this.container.client.users.fetch(args[0], { force: true }).catch(() => undefined);
        if (!args[0]) user = await this.container.client.users.fetch(message.author.id, { force: true });

        const embed = new MessageEmbed({
            color: "AQUA",
            timestamp: Date.now(),
            title: "User info",
        });

        if (user) {
            embed
                .addFields([
                    { inline: true, name: "Tag", value: `${user.tag}` },
                    { inline: true, name: "ID", value: user.id || "123" },
                    { inline: true, name: "Is a bot", value: user.bot ? "yes" : "no" },
                    { name: "Created at", value: `${user.createdAt}` },
                ])
                .setAuthor({ iconURL: `${user.avatarURL()}`, name: user.tag })
                .setThumbnail(user.avatarURL() || user.defaultAvatarURL);
            if (user?.hexAccentColor) embed.addField("Accent colour", user.hexAccentColor);
            if (user?.banner)
                embed
                    .addField("Banner url", `${this.getUserBannerUrl(user.id)}`)
                    .setImage(`${this.getUserBannerUrl(user.id)}`);
        } else embed.setDescription("User not found");

        message.channel.send({ embeds: [embed] });
    }
}
