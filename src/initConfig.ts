import { env, exit } from "process";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { Logger } from "./Logger";
import type { TLogLevelName } from "tslog";
import { config } from "dotenv";
const earlyLogger = new Logger("silly");

function checkConfig(configFile: string): void {
    const ignoreMissing = Number(env.IGNORE_MISSING) || 0;
    let errors = 0;
    let warnings = 0;
    let ignored = 0;

    if (!env.DEFAULT_PREFIX) {
        earlyLogger.fatal(`In config/${configFile}.env: Property 'DEFAULT_PREFIX' is missing`);
        errors++;
    }
    if (!env.DISCORD_TOKEN) {
        earlyLogger.fatal(`In config/${configFile}.env: Property 'DISCORD_TOKEN" is missing`);
        errors++;
    }
    if (!env.DUMP_CONFIG_ON_START) {
        if (ignoreMissing === 0)
            earlyLogger.warn(`In config/${configFile}.env: Property 'DUMP_CONFIG_ON_START' is missing`);
        env.DUMP_CONFIG_ON_START = "true";
        ignored++;
    }
    if (!env.IGNORE_MISSING) {
        if (ignoreMissing <= 1) earlyLogger.warn(`In config/${configFile}.env: Property 'IGNORE_MISSING' is missing`);
        warnings++;
    }
    if (!env.LOGLEVEL) {
        earlyLogger.fatal(`In config/${configFile}.env: Property 'LOGLEVEL' is missing`);
        errors++;
    }
    if (!env.OWNER_IDS) {
        earlyLogger.fatal(`In config/${configFile}.env: Property 'OWNER_IDS' is missing`);
        errors++;
    }
    if (!env.SETPRESENCE) {
        if (ignoreMissing === 0) earlyLogger.warn(`In config/${configFile}.env: Property 'SETPRESENCE' is missing`);
        env.SETPRESENCE = "true";
        ignored++;
    }
    if (!env.SETPRESENCE_INTERVAL) {
        if (ignoreMissing === 0)
            earlyLogger.warn(`In config/${configFile}.env: Property 'SETPRESENCE_INTERVAL' is missing`);
        env.SETPRESENCE_INTERVAL = "30000";
        ignored++;
    }
    if (Number(env.SETPRESENCE_INTERVAL) > 30000 || isNaN(Number(env.SETPRESENCE_INTERVAL))) {
        earlyLogger.fatal(`In config/${configFile}.env: Property 'SETPRESENCE_INTERVAL' is invalid`);
        errors++;
    }
    if (!env.USE_BOTLISTS) {
        if (ignoreMissing <= 1) earlyLogger.warn(`In config/${configFile}.env: Property 'TOPGG_TOKEN' is missing`);
        env.USE_BOTLISTS = "true";
        warnings++;
    }
    if (!env.TOPGG_TOKEN) {
        if (ignoreMissing <= 1) earlyLogger.warn(`In config/${configFile}.env: Property 'TOPGG_TOKEN' is missing`);
        if (env.USE_BOTLISTS === "true") warnings++;
        else ignored++;
    }

    if (errors > 0) {
        earlyLogger.fatal(`Failed to verify config. ${errors} error, ${warnings} warnings, ${ignored} ignored`);
        exit(1);
    } else if (warnings > 0) {
        earlyLogger.warn(`Verified config. ${warnings} warnings, ${ignored} ignored`);
    } else if (ignored > 0) {
        earlyLogger.info(`Verified config. ${ignored} ignored`);
    } else {
        earlyLogger.info("Verified config");
    }
}

export function initConfig(): void {
    if (!env.NODE_ENV) env.NODE_ENV = "development";

    if (!existsSync("config/")) mkdirSync("config/");
    if (!existsSync("config/production.env")) {
        writeFileSync(
            "config/production.env",
            `${[
                "# Title",
                "# description: Description",
                "# required   : no | warn | fatal",
                "# default    : default value",
                "# options    : possible values",
                "# SOME_VARIABLE=some-value",
                "",
                "# Default prefix",
                "# description: The prefix of the bot listens to if not overritten by guild prefix",
                "# required   : fatal",
                "# default    : Y!",
                "# options    : <string>",
                "DEFAULT_PREFIX=Y!",
                "",
                "# Discord token",
                "# description: The token used to login at discord",
                "# required   : fatal",
                "# default    : <none>",
                "# options    : <discord token>",
                "DISCORD_TOKEN=",
                "",
                "# Dump config on start",
                "# description: Whether the bot should print the configuration on start (excluding tokens)",
                "# required   : no",
                "# default    : true",
                "# options    : <boolean>",
                "DUMP_CONFIG_ON_START=true",
                // TODO: IGNORE_MISSING here
                "",
                "# Log level",
                "# description: The required level for a message to be logged",
                "# required   : fatal",
                "# default    : info",
                "# options    : silly | trace | debug | info | warn | error | fatal",
                "LOGLEVEL=info",
                "",
                "# Owner IDs",
                "# description: The ID(s) of the owner(s), seperated by comma. e.g. 1234,5678,9876",
                "# required   : fatal",
                "# default    : <none>",
                "# options    : <discord user id(s)>",
                "OWNER_IDS=",
                "",
                "# Set presence",
                "# description: Whether the bot should call setPresence with a random message every x milliseconds",
                "# required   : no",
                "# default    : true",
                "# options    : <boolean>",
                "SETPRESENCE=true",
                "",
                "# Set presence interval timer",
                "# description: Time in milliseconds to wait before updating presence",
                "# required   : no",
                "# default    : 30000",
                "# options    : <number above or equal to 30,000>",
                "SETPRESENCE_INTERVAL=30000",
                "",
                "# Top.gg token",
                "# url: https://top.gg",
                "# description: The token used to login at top.gg",
                "# required   : USE_BOTLISTS ? warn : no",
                "# default    : <none>",
                "# options    : <top.gg token>",
                "TOPGG_TOKEN=",
                "",
                "# Use botlists",
                "# description: Whether the bot should login at discord bot lists like top.gg",
                "# required   : warn",
                "# default    : true",
                "# options    : <boolean>",
                "USE_BOTLISTS=true",
            ].join("\n")}\n`,
        );
        earlyLogger.info("Initialized config. Make sure to change values before running again");
        exit();
    }

    if (existsSync(`config/${env.NODE_ENV}.env`)) {
        config({ path: `config/${env.NODE_ENV}.env` });
        checkConfig(env.NODE_ENV);
    } else if (existsSync("config/production.env")) {
        earlyLogger.warn(`Couldn't find config/${env.NODE_ENV}.env. Falling back to production.env`);
        config({ path: "config/production.env" });
        checkConfig("production.env");
    } else {
        earlyLogger.fatal("Faild to load config/production.env");
        process.exit(1);
    }

    const logger = new Logger(env.LOGLEVEL as TLogLevelName);
    logger.debug("loaded config");
}
