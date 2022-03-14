import { Logger } from "./Logger";
import { SapphireClient } from "@sapphire/framework";
import type { TLogLevelName } from "tslog";
import { initConfig } from "./initConfig";

initConfig();

const client = new SapphireClient({
    caseInsensitivePrefixes: true,
    defaultPrefix: process.env.DEFAULT_PREFIX,
    intents: ["GUILDS", "GUILD_MESSAGES"],
});
const logger = new Logger(process.env.LOGLEVEL as TLogLevelName);

process.on("uncaughtException", function (e) {
    logger.fatal(e.message, e);
    process.exit(1);
});

process.on("SIGQUIT", function () {
    logger.info("Received SIGQUIT, shutting down");
    process.exit();
});

process.on("SIGINT", function () {
    process.stdout.write("\b\b");
    logger.info("Received SIGINT, shutting down");
    process.exit();
});

process.on("SIGTERM", function () {
    logger.info("Received SIGTERM, shutting down");
    process.exit(129);
});

process.on("exit", function () {
    client.removeAllListeners();
    client.destroy();
});

if (process.env.NODE_ENV === "production") logger.info("Running in production mode");
else logger.info("Running in development mode");
logger.info(`Log level: ${process.env.LOGLEVEL}`);
if (process.env.DUMP_CONFIG_ON_START === "true") {
    logger.info(`Owner IDs: ${process.env.OWNER_IDS?.split(",").join(", ")}`);
    logger.info(`SetPresence: ${process.env.SETPRESENCE}`);
    logger.info(`SetPresence interval: ${process.env.SETPRESENCE_INTERVAL}`);
    logger.info(`Use botlists: ${process.env.USE_BOTLISTS}`);
}

client.login().catch((e: Error) => {
    logger.fatal(e.message);
    process.exit(1);
});
