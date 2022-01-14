import type { PieceContext, PieceOptions, PreconditionResult } from "@sapphire/framework";
import type { Message } from "discord.js";
import { Precondition } from "@sapphire/framework";

export default class OwnerOnlyPrecondition extends Precondition {
    public constructor(context: PieceContext, options: PieceOptions) {
        super(context, {
            ...options,
            name: "OwnerOnly",
        });
    }

    public run(message: Message): PreconditionResult {
        return process.env.OWNER_IDS?.split(",").includes(message.author.id)
            ? this.ok()
            : this.error({ message: "Only the bot owner can use this command!" });
    }
}

declare module "@sapphire/framework" {
    interface Preconditions {
        OwnerOnly: never;
    }
}
