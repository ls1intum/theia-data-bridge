import { type, type Type } from "arktype";
import * as vscode from "vscode";
import { getEnvSchema } from "../schema";
import dataService from "./data";

// manages VSCode commands
export default class CommandRegistry {
    private context: vscode.ExtensionContext;
    private static readonly COMMAND_PREFIX = "dataBridge";

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
    }

    // registers all VSCode commands in the context
    public registerCommands() {
        this.registerCommand("getEnv", getEnvSchema, (request) => {
            return dataService.getEnvVars(request);
        });
    }

    private registerCommand<T extends Type>(
        name: string,
        schema: T,
        callback: (request: T["infer"]) => void,
    ) {
        const disposable = vscode.commands.registerCommand(
            `${CommandRegistry.COMMAND_PREFIX}.${name}`,
            (args) => {
                // we enforce a single argument for the command
                const request = schema(args);
                if (request instanceof type.errors) {
                    // Temporary error message to ease debugging
                    vscode.window.showErrorMessage(
                        `Invalid request for command ${name}: ${request.summary}`,
                    );
                    return request.summary;
                }
                return callback(request);
            },
        );
        this.context.subscriptions.push(disposable);
    }
}
