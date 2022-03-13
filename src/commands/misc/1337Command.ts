import { Command } from "@sapphire/framework";
import { Leet } from "../../lib/1337";
import { Logger } from "../../Logger";
import type { Message } from "discord.js";
import { MessageEmbed } from "discord.js";
import type { TLogLevelName } from "tslog";

const logger = new Logger(process.env.LOGLEVEL as TLogLevelName);

export default class LeetCommand extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            aliases: ["leet"],
            description: "G473w4y 70 pr070c01 F213ND5H1P",
            detailedDescription: "", //TODO
            name: "1337",
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

        const args = message.content.split(" ").slice(1);
        const action = args[0];
        const mode = args[1];
        const msg = args.slice(2).join(" ");
        const embed = new MessageEmbed({
            color: "AQUA",
            title: "P2070C0L F213ND5H1P",
        });

        if (!action) {
            embed.setFields({ name: "Error", value: "No action" });
            message.channel.send({ embeds: [embed] });
            return;
        }

        if (action !== "reverse" && action !== "translate") {
            embed.setFields({ name: "Error", value: "Invalid action" });
            message.channel.send({ embeds: [embed] });
            return;
        }

        if (!mode) {
            embed.setFields({ name: "Error", value: "No mode" });
            message.channel.send({ embeds: [embed] });
            return;
        }

        if (mode !== "hard" && mode !== "soft") {
            embed.setFields({ name: "Error", value: "Invalid mode" });
            message.channel.send({ embeds: [embed] });
            return;
        }

        if (!msg) {
            embed.setFields({ name: "Error", value: "No message" });
            message.channel.send({ embeds: [embed] });
            return;
        }

        if (action === "reverse") embed.setDescription(new Leet({ mode }).reverse(msg));
        if (action === "translate") embed.setDescription(new Leet({ mode }).translate(msg));

        embed.setFields([
            { name: "mode", value: mode },
            { name: "action", value: action },
        ]);

        message.channel.send({
            embeds: [embed],
        });
    }
}
