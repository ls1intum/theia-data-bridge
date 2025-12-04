import * as vscode from "vscode";

export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
}

class Logger {
    private outputChannel: vscode.OutputChannel;
    private logLevel: LogLevel = LogLevel.INFO;

    constructor(channelName: string = "Data Bridge") {
        this.outputChannel = vscode.window.createOutputChannel(channelName);
        this.loadLogLevelFromConfig();
        this.watchConfigChanges();
    }

    private loadLogLevelFromConfig(): void {
        const config = vscode.workspace.getConfiguration("dataBridge");
        const levelString = config.get<string>("logLevel", "INFO");
        this.logLevel = LogLevel[levelString as keyof typeof LogLevel] ?? LogLevel.INFO;
    }

    private watchConfigChanges(): void {
        vscode.workspace.onDidChangeConfiguration((e) => {
            if (e.affectsConfiguration("dataBridge.logLevel")) {
                this.loadLogLevelFromConfig();
                this.info("Log level changed to: " + LogLevel[this.logLevel]);
            }
        });
    }

    public setLogLevel(level: LogLevel): void {
        this.logLevel = level;
    }

    public show(): void {
        this.outputChannel.show();
    }

    public debug(message: string, ...args: unknown[]): void {
        this.log(LogLevel.DEBUG, message, ...args);
    }

    public info(message: string, ...args: unknown[]): void {
        this.log(LogLevel.INFO, message, ...args);
    }

    public warn(message: string, ...args: unknown[]): void {
        this.log(LogLevel.WARN, message, ...args);
    }

    public error(message: string, error?: unknown): void {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const fullMessage = error ? `${message}: ${errorMessage}` : message;
        this.log(LogLevel.ERROR, fullMessage);
        if (error instanceof Error && error.stack) {
            this.log(LogLevel.ERROR, error.stack);
        }
    }

    private log(level: LogLevel, message: string, ...args: unknown[]): void {
        if (level < this.logLevel) {
            return;
        }

        const timestamp = new Date().toISOString();
        const levelName = LogLevel[level];
        const formattedArgs = args.length > 0 ? ` ${JSON.stringify(args)}` : "";
        const logMessage = `[${levelName}] [${timestamp}] ${message}${formattedArgs}`;

        this.outputChannel.appendLine(logMessage);
    }

    public dispose(): void {
        this.outputChannel.dispose();
    }
}

// Singleton instance
const logger = new Logger();

export default logger;

