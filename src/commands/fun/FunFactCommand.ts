import { Command } from "@sapphire/framework";
import type { Message } from "discord.js";
import { MessageEmbed } from "discord.js";
import { join } from "path";
import { readFileSync } from "fs";

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

    public messageRun(message: Message): void {
        const chosenFact = Math.floor(Math.random() * (this.facts.length - 1) + 1);
        const embed = new MessageEmbed({
            color: "YELLOW",
            description: this.facts[chosenFact],
            title: `Fact #${chosenFact}`,
        });
        message.channel.send({ embeds: [embed] });
    }
}
