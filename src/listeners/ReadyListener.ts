// import type { Client } from "discord.js";
import { Listener } from "@sapphire/framework";
import { Logger } from "../Logger";
import type { TLogLevelName } from "tslog";

const logger = new Logger(process.env.LOGLEVEL as TLogLevelName);

export class ReadyListener extends Listener {
    public constructor(context: Listener.Context, options: Listener.Options) {
        super(context, {
            ...options,
            event: "ready",
            name: "ready",
        });
    }

    public override onLoad(): void {
        logger.debug(`Loaded listener '${this.name}'`);
        super.onLoad();
    }

    public override onUnload(): void {
        logger.debug(`Unloaded listener '${this.name}'`);
        super.onUnload();
    }

    public override run(/* client: Client */): void {
        logger.silly(`Listener '${this.name}' triggered`);
        this.container.client.user?.setPresence({
            activities: [{ name: "XesaCat debugging", type: "WATCHING" }],
            status: "dnd",
        });
    }
}
