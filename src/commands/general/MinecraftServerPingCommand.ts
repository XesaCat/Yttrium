import { Command } from "@sapphire/framework";
import type { IChat } from "node-minecraft-status";
import { Logger } from "../../Logger";
import type { Message } from "discord.js";
import { MessageEmbed } from "discord.js";
import { PingContext } from "node-minecraft-status";
import type { TLogLevelName } from "tslog";

const logger = new Logger(process.env.LOGLEVEL as TLogLevelName);

export default class MinecraftServerPingCommand extends Command {
    private pingClient = new PingContext().setTimeout(2000);
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            cooldownDelay: 60000,
            cooldownFilteredUsers: process.env.OWNER_IDS?.split(","),
            description: "ping a minecraft server",
            name: "msp",
            typing: true,
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

        const args = message.content.split(" ").slice(1);
        const embed = new MessageEmbed({ color: "AQUA", timestamp: Date.now(), title: "Minecraft Server Ping" });

        if (args.length)
            this.pingClient.ping(args[0]).subscribe({
                complete() {
                    message.channel.send({ embeds: [embed] });
                },
                error(e: Error) {
                    embed.addField("Error", `\`\`\`${e.message}\`\`\``);
                    embed.setDescription(args[0]);
                    message.channel.send({ embeds: [embed] });
                },
                next(response) {
                    embed.addFields([
                        { name: "Server version", value: response.version?.name || "unknown" },
                        {
                            name: "Description",
                            value: (response.description as IChat).text.replace(/§./g, ""),
                        },
                        { name: "Raw Description", value: (response.description as IChat).text },
                    ]);
                    embed.setDescription(args[0]);
                },
            });
        else {
            embed.addField("Error", "Please give server ip");
            message.channel.send({ embeds: [embed] });
        }
    }
}
