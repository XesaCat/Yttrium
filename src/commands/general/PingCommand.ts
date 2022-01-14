import { Command } from "@sapphire/framework";
import { Logger } from "../../Logger";
import type { Message } from "discord.js";
import type { TLogLevelName } from "tslog";

const logger = new Logger(process.env.LOGLEVEL as TLogLevelName);

export default class PingCommand extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            aliases: ["pong"],
            cooldownDelay: 5000,
            description: "ping pong",
            enabled: false,
            name: "ping",
        });
    }

    public onLoad(): void {
        logger.debug(`Loaded command '${this.category ? `${this.category}/` : ""}${this.name}'`);
    }

    public onUnload(): void {
        logger.debug(`Unloaded command '${this.category ? `${this.category}/` : ""}${this.name}'`);
    }

    public async messageRun(message: Message): Promise<Message<boolean>> {
        logger.silly(
            `Command '${this.category ? `${this.category}/` : ""}${this.name}' triggered by ${message.author.tag} (${
                message.author.id
            })`,
        );

        const msg = await message.channel.send("Pong?");

        const content = `Pong from JavaScript! Bot latency ${Math.round(
            this.container.client.ws.ping,
        )}ms. API latency ${msg.createdTimestamp - message.createdTimestamp}ms.`;

        return msg.edit(content);
    }
}
