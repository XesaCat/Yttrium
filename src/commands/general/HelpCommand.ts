import { Command } from "@sapphire/framework";
import { Logger } from "../../Logger";
import type { Message } from "discord.js";
import { MessageEmbed } from "discord.js";
import type { TLogLevelName } from "tslog";

const logger = new Logger(process.env.LOGLEVEL as TLogLevelName);

export default class HelpCommand extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            aliases: ["h", "?"],
            description: "displays the help page",
            name: "help",
        });
    }

    public override onLoad(): void {
        logger.debug(`Loaded command '${this.category ? `${this.category}/` : ""}${this.name}'`);
    }

    public override onUnload(): void {
        logger.debug(`Unloaded command '${this.category ? `${this.category}/` : ""}${this.name}'`);
    }

    public override messageRun(message: Message): void {
        logger.silly(
            `Command '${this.category ? `${this.category}/` : ""}${this.name}' triggered by ${message.author.tag} (${
                message.author.id
            })`,
        );

        const prefix = this.container.client.fetchPrefix(message);

        // const args = message.content.split(" ").slice(1);
        const embed = new MessageEmbed({
            color: "AQUA",
            footer: {
                icon_url: this.container.client.user?.avatarURL() || this.container.client.user?.defaultAvatarURL,
                text: "<> needed, [] optional",
            },
        });

        // if (!args.length)
        embed.addFields([
            {
                name: "Command Help:",
                value: `\`${prefix}help [command]\``,
            },
            {
                name: "List All Commands",
                value: `\`${prefix}commands\``,
            },
        ]);

        message.channel.send({ embeds: [embed] });
    }
}
