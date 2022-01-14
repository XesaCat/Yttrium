import type { TLogLevelName } from "tslog";

declare namespace NodeJS {
    export interface ProcessEnv {
        DISCORD_TOKEN: string;
        LOGLEVEL: TLogLevelName;
        OWNER_IDS: string;
        SETPRESENCE: boolean;
        SETPRECENSE_INTERVAL: number;
        TOPGG_TOKEN: string;
    }
}
