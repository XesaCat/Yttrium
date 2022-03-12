import { env, exit } from "process";
import type { ConfigEntry } from "@xesacat/enver";
import { Enver } from "@xesacat/enver";
import { Logger } from "./Logger";
import { existsSync } from "fs";
const earlyLogger = new Logger("silly");

const config: ConfigEntry[] = [
    {
        default: "Y!",
        description: "The prefix of the bot listens to if not overwritten by guild prefix",
        importance: "error",
        name: "DEFAULT_PREFIX",
        options: "<string>",
        title: "Default prefix",
    },
    {
        description: "The token used to login at discord",
        importance: "error",
        name: "DISCORD_TOKEN",
        options: "<discord token>",
        title: "Discord token",
    },
    {
        default: "true",
        description: "Whether the bot should print the configuration on start (excluding tokens)",
        importance: "ignore",
        name: "DUMP_CONFIG_ON_START",
        options: "<boolean>",
        title: "Dump config on start",
    },
    // TODO: IGNORE_MISSING here
    {
        default: "info",
        description: "The required level for a message to be logged",
        importance: "error",
        name: "LOGLEVEL",
        options: "silly | trace | debug | info | warn | error | fatal",
        title: "Log level",
    },
    {
        description: "The ID(s) of the owner(s), separated by comma. e.g. 1234,5678,9876",
        importance: "error",
        name: "OWNER_IDS",
        options: "<discord user id(s)>",
        title: "Owner IDs",
    },
    {
        default: "true",
        description: "Whether the bot should call setPresence with a random message every x milliseconds",
        importance: "ignore",
        name: "SETPRESENCE",
        options: "<boolean>",
        title: "Set presence",
    },
    {
        default: "30000",
        description: "description: Time in milliseconds to wait before updating presence",
        importance: "ignore",
        name: "SETPRESENCE_INTERVAL",
        options: "<number above or equal to 30,000>",
        title: "Set presence interval timer",
    },
    {
        description: "The token used to login at top.gg",
        importance: "ignore",
        name: "TOPGG_TOKEN",
        options: "<top.gg token>",
        title: "Top.gg token",
    },
    {
        default: "true",
        description: "Whether the bot should login at discord bot lists like top.gg",
        importance: "warn",
        name: "USE_BOTLISTS",
        options: "<boolean>",
        title: "Use botlists",
    },
];

export function initConfig(): void {
    const file = env.NODE_ENV ? `${env.NODE_ENV}.env` : "development.env";
    const fallback = env.NODE_ENV !== "production" ? "production.env" : undefined;
    const enver = new Enver({
        configEntries: config,
        fallback,
        file,
        logger: {
            error: (message: string) => earlyLogger.fatal(message),
            info: (message: string) => earlyLogger.info(message),
            warn: (message: string) => earlyLogger.warn(message),
        },
    });

    if (!existsSync(`config/${file}`) && !existsSync(`config/${fallback}`)) {
        enver.initConfig();
        earlyLogger.info("Initialized config. Make sure to change before running again");
        exit();
    }

    if (enver.loadConfig().errors > 0) exit(1);
}
