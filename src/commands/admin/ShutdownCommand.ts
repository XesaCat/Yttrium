import { Command } from "@sapphire/framework";
import { Logger } from "../../Logger";
import type { Message } from "discord.js";
import { MessageEmbed } from "discord.js";
import type { TLogLevelName } from "tslog";

const logger = new Logger(process.env.LOGLEVEL as TLogLevelName);

export default class ShutdownCommand extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            aliases: ["poweroff", "stop"],
            description: "Shuts down the bot",
            name: "shutdown",
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
            description: `${this.container.client.user?.username} is shut down on request from ${message.author.tag}`,
            title: "Shutting down...",
        });

        await message.channel.send({ embeds: [embed] });
        logger.info(
            `${this.container.client.user?.username} is shut down on request from ${message.author.tag} (${message.author.id})`,
        );
        process.exit();
    }
}
