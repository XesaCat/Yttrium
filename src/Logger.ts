import type { ICodeFrame, IErrorObject, ILogObject, IStackFrame, TLogLevelName } from "tslog";
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { Logger as TsLog } from "tslog";

export class Logger extends TsLog {
    private static ts = Date.now();
    private static jsonFile = `logs/${Logger.getDate(new Date(Logger.ts)).replace(/ /g, "_").replace(/:/g, "-")}.json`;
    private static logFile = `logs/${Logger.getDate(new Date(Logger.ts)).replace(/ /g, "_").replace(/:/g, "-")}.log`;

    public constructor(minLevel: TLogLevelName) {
        super({
            displayFilePath: "hidden",
            displayFunctionName: false,
            minLevel,
            overwriteConsole: true,
        });

        if (!existsSync("logs/")) mkdirSync("logs/");

        this.attachTransport(
            {
                debug: Logger.logToTransport,
                error: Logger.logToTransport,
                fatal: Logger.logToTransport,
                info: Logger.logToTransport,
                silly: Logger.logToTransport,
                trace: Logger.logToTransport,
                warn: Logger.logToTransport,
            },
            minLevel,
        );
    }

    private static getDate(givenDate: Date): string {
        const year = givenDate.getFullYear();
        const month = `0${givenDate.getMonth() + 1}`.slice(-2);
        const date = `0${givenDate.getDate()}`.slice(-2);
        const hours = `0${givenDate.getHours()}`.slice(-2);
        const minutes = `0${givenDate.getMinutes()}`.slice(-2);
        const seconds = `0${givenDate.getSeconds()}`.slice(-2);
        const milliseconds = `0${givenDate.getMilliseconds()}`.slice(-2);
        return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}.${milliseconds}`;
    }

    private static logToTransport(logObject: ILogObject): void {
        const error = (logObject.argumentsArray[1] as IErrorObject) || undefined;
        appendFileSync(
            Logger.logFile,
            `${Logger.getDate(logObject.date)}  ${logObject.logLevel.toUpperCase()}${
                logObject.logLevel === "info" || logObject.logLevel === "warn" ? "   " : "  "
            }${
                typeof logObject.argumentsArray[0] === "string"
                    ? logObject.argumentsArray[0]
                    : JSON.stringify(logObject.argumentsArray[0], null, 4)
            }\n${error ? `  ${error.name}  ${error.message}\n` : ""}`,
        );
        if (error) Logger.logStackToTranport(error.stack, error.codeFrame, true);

        if (logObject.stack) Logger.logStackToTranport(logObject.stack);

        if (!existsSync(Logger.jsonFile)) writeFileSync(Logger.jsonFile, "[]");
        const object = JSON.parse(String(readFileSync(Logger.jsonFile)));
        object.push(logObject);
        writeFileSync(Logger.jsonFile, `${JSON.stringify(object, null, 4)}\n`);
    }

    private static logStackToTranport(stack: IStackFrame[], codeFrame?: ICodeFrame, isError?: boolean): void {
        const stacks: string[] = [];
        stack.forEach((trace) =>
            stacks.push(
                `- ${trace.fileName}:${trace.lineNumber} ${trace.functionName || "<anonymous>"}\n    ${
                    trace.filePath
                }:${trace.lineNumber}:${trace.columnNumber}\n`,
            ),
        );

        appendFileSync(Logger.logFile, `${isError ? "error stack" : "log stack"}\n${stacks.join("\n")}\n`);

        if (codeFrame) {
            let lineNumber = codeFrame.firstLineNumber;
            const linesBefore: string[] = [];
            const linesAfter: string[] = [];

            codeFrame.linesBefore.forEach((line) => {
                linesBefore.push(`  ${`00${lineNumber}`.slice(-3)} | ${line}`);
                lineNumber++;
            });
            lineNumber++;
            codeFrame.linesAfter.forEach((line) => {
                linesAfter.push(`  ${`00${lineNumber}`.slice(-3)} | ${line}`);
                lineNumber++;
            });

            appendFileSync(
                Logger.logFile,
                `${[
                    "code frame:",
                    linesBefore.join("\n"),
                    `> ${`00${codeFrame.lineNumber}`.slice(-3)} | ${codeFrame.relevantLine}`,
                    `${" ".repeat(
                        `  ${`00${codeFrame.lineNumber}`.slice(-3)} | ${codeFrame.relevantLine.split(" ").shift()} `
                            .length,
                    )}^`,
                    linesAfter.join("\n"),
                ].join("\n")}\n\n`,
            );
        }
    }
}
