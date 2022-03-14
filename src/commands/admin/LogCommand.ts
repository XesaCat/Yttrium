import { Command } from "@sapphire/framework";
import { Logger } from "../../Logger";
import type { Message } from "discord.js";
import { MessageEmbed } from "discord.js";
import type { TLogLevelName } from "tslog";

const logger = new Logger(process.env.LOGLEVEL as TLogLevelName);

export default class LogCommand extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            aliases: ["l"],
            description: "Logs to console",
            name: "log",
            preconditions: ["OwnerOnly"],
        });
    }

    public override onLoad(): void {
        logger.debug(`Loaded command '${this.category ? `${this.category}/` : ""}${this.name}'`);
    }

    public override onUnload(): void {
        logger.debug(`Unloaded command '${this.category ? `${this.category}/` : ""}${this.name}'`);
    }

    public override async messageRun(message: Message): Promise<void> {
        logger.silly(
            `Command '${this.category ? `${this.category}/` : ""}${this.name}' triggered by ${message.author.tag} (${
                message.author.id
            })`,
        );

        const embed = new MessageEmbed({
            color: "AQUA",
            description: "Successfully logged",
            timestamp: Date.now(),
            title: "Log",
        });

        const text = message.content.split(" ").slice(1).join(" ");

        if (text) logger.info(`${message.author.tag}: ${text}`);
        else embed.setColor("RED").setDescription("Cannot log an empty message.");

        message.channel.send({ embeds: [embed] });
    }
}
