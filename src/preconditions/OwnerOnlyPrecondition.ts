import type { PieceContext, PieceOptions, PreconditionResult } from "@sapphire/framework";
import { Logger } from "../Logger";
import type { Message } from "discord.js";
import { Precondition } from "@sapphire/framework";
import type { TLogLevelName } from "tslog";

const logger = new Logger(process.env.LOGLEVEL as TLogLevelName);

export default class OwnerOnlyPrecondition extends Precondition {
    public constructor(context: PieceContext, options: PieceOptions) {
        super(context, {
            ...options,
            name: "OwnerOnly",
        });
    }

    public override onLoad(): void {
        logger.debug(`Loaded precondition '${this.name}'`);
    }

    public override onUnload(): void {
        logger.debug(`Unloaded precondition '${this.name}'`);
    }

    public override run(message: Message): PreconditionResult {
        logger.silly(`Precondition '${this.name}' triggered`);

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
