import { Command } from "@sapphire/framework";
import { Logger } from "../../Logger";
import type { Message } from "discord.js";
import { MessageEmbed } from "discord.js";
import type { TLogLevelName } from "tslog";
import { join } from "path";
import { readFileSync } from "fs";

const logger = new Logger(process.env.LOGLEVEL as TLogLevelName);

export default class FunFactCommand extends Command {
    private facts: string[];

    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            description: "Sends a random fun fact",
            name: "funfact",
        });

        this.facts = readFileSync(join(__dirname, "../../../assets/facts.txt")).toString().split("\n");
    }

    public override onLoad(): void {
        logger.debug(`Loaded command '${this.category ? `${this.category}/` : ""}${this.name}'`);
    }

    public override onUnload(): void {
        logger.debug(`Unloaded command '${this.category ? `${this.category}/` : ""}${this.name}'`);
    }

    public override messageRun(message: Message): void {
        const chosenFact = Math.floor(Math.random() * (this.facts.length - 1) + 1);
        const embed = new MessageEmbed({
            color: "YELLOW",
            description: this.facts[chosenFact],
            title: `Fact #${chosenFact}`,
        });
        message.channel.send({ embeds: [embed] });
    }
}
