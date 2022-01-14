import { Command } from "@sapphire/framework";
import { Logger } from "../../Logger";
import type { Message } from "discord.js";
import { MessageEmbed } from "discord.js";
import type { TLogLevelName } from "tslog";

const logger = new Logger(process.env.LOGLEVEL as TLogLevelName);

export default class StatusCommand extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            aliases: ["stats"],
            cooldownDelay: 5000,
            description: "Shows Yttrium's status",
            name: "status",
        });
    }

    public onLoad(): void {
        logger.debug(`Loaded command '${this.category ? `${this.category}/` : ""}${this.name}'`);
    }

    public onUnload(): void {
        logger.debug(`Unloaded command '${this.category ? `${this.category}/` : ""}${this.name}'`);
    }

    public messageRun(message: Message): void {
        logger.silly(
            `Command '${this.category ? `${this.category}/` : ""}${this.name}' triggered by ${message.author.tag} (${
                message.author.id
            })`,
        );

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        let totalSeconds = this.container.client.uptime! / 1000;
        const days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        const hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60);
        const uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;

        const embed = new MessageEmbed({
            color: "AQUA",
            fields: [
                {
                    inline: true,
                    name: `Yttriums's Latency`,
                    value: `${Date.now() - message.createdTimestamp}ms.`,
                },
                {
                    inline: true,
                    name: `API Latency`,
                    value: `${this.container.client.ws.ping}ms.`,
                },
                {
                    inline: true,
                    name: "Uptime",
                    value: uptime,
                },
            ],
            thumbnail: { url: this.container.client.user?.displayAvatarURL() },
            timestamp: Date.now(),
            title: "Status",
        });

        message.channel.send({
            embeds: [embed],
        });
    }
}
