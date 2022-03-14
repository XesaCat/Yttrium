import { Command } from "@sapphire/framework";
import { Logger } from "../../Logger";
import type { Message } from "discord.js";
import { MessageEmbed } from "discord.js";
import type { TLogLevelName } from "tslog";

const logger = new Logger(process.env.LOGLEVEL as TLogLevelName);

export default class EvalCommand extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            aliases: ["ev"],
            description: "executes commands",
            name: "eval",
            preconditions: ["OwnerOnly"],
        });
    }

    public override onLoad(): void {
        logger.debug(`Loaded command '${this.category ? `${this.category}/` : ""}${this.name}'`);
    }

    public override onUnload(): void {
        logger.debug(`Unloaded command '${this.category ? `${this.category}/` : ""}${this.name}'`);
    }

    private secureOutput(x: string): string {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        x = x.replace(process.env.DISCORD_TOKEN!, "<secret>");
        if (process.env.TOPGG_TOKEN) x = x.replace(process.env.TOPGG_TOKEN, "<secret>");
        return x;
    }

    private format(x: unknown): string {
        if (typeof x === "object") return `\`\`\`json\n${JSON.stringify(x, null, 4)}\n\`\`\``;
        else return `\`\`\`ts\n${x}\n\`\`\``;
    }

    public override async messageRun(message: Message): Promise<void> {
        logger.silly(
            `Command '${this.category ? `${this.category}/` : ""}${this.name}' triggered by ${message.author.tag} (${
                message.author.id
            })`,
        );

        const args = message.content.split(" ").slice(1);
        const embed = new MessageEmbed({ color: "AQUA", timestamp: Date.now(), title: "Eval" });
        const ts = Date.now();

        try {
            // eslint-disable-next-line no-eval
            let x = eval(args.join(" "));

            if (typeof x === "string") x = this.secureOutput(x);
            else if (typeof x === "object") {
                x = JSON.parse(this.secureOutput(JSON.stringify(await x)));
            }

            const output = this.format(await x) as string;
            embed.addFields([
                {
                    name: "Output",
                    value: output.length <= 1024 ? output : "```<output limit exceeded>```",
                },
                { name: "Type", value: `\`\`\`ts\n${typeof (await x)}\n\`\`\`` },
            ]);
        } catch (e) {
            embed.addField("Error", `\`\`\`${e}\`\`\``);
        }

        embed.setDescription(`:stopwatch: ${Date.now() - ts}ms.`);
        message.channel.send({ embeds: [embed] });
    }
}
