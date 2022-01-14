import type { Client } from "discord.js";
import { Listener } from "@sapphire/framework";
import { Logger } from "../Logger";
import type { TLogLevelName } from "tslog";

const logger = new Logger(process.env.LOGLEVEL as TLogLevelName);

export class ReadyOnceListener extends Listener {
    private currentIndex!: number;

    private rollIndex(activities: string[]): number {
        return Math.floor(Math.random() * (activities.length - 1) + 1);
    }

    private setPresence(activities: string[]): void {
        let index = this.rollIndex(activities);
        while (index === this.currentIndex) index = this.rollIndex(activities);
        this.currentIndex = index;
        this.container.client.user?.setPresence({ activities: [{ name: activities[index], type: "PLAYING" }] });
    }

    public constructor(context: Listener.Context, options: Listener.Options) {
        super(context, {
            ...options,
            event: "ready",
            name: "readyOnce",
            once: true,
        });
    }

    public onLoad(): void {
        logger.debug(`Loaded listener '${this.name}'`);
        super.onLoad();
    }

    public onUnload(): void {
        logger.debug(`Unloaded listener '${this.name}'`);
        super.onUnload();
    }

    public run(client: Client): void {
        logger.silly(`Listener '${this.name}' triggered`);

        logger.info(`Logged in as ${client.user?.username} (${client.user?.id})`);
        // logger.info(`Commands loaded: ${this.}`) //TODO: print listener count

        if (process.env.SETPRESENCE === "true") {
            logger.silly("Setting setPresence interval");
            const activities = [
                "Alone.",
                "with their imaginary frineds",
                "with nobody",
                "with knifes",
                `on ${this.container.client.guilds.cache.size} servers`,
            ];

            this.setPresence(activities);
            setInterval(() => this.setPresence(activities), process.env.SETPRESENCE_INTERVAL as unknown as number);
        } else logger.silly("Not setting setPresence interval");
    }
}
