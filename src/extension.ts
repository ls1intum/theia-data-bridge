// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { startServer } from "./app.ts";
import CommandRegistry from "./service/commands.ts";
import logger from "./service/logger.ts";

let server: ReturnType<typeof startServer>;

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
    const commandRegistry = new CommandRegistry(context);
    commandRegistry.registerCommands();

    server = startServer();
    logger.info("Data Bridge extension activated and server started");

    context.subscriptions.push(logger);
}

// This method is called when your extension is deactivated
export function deactivate() {
    if (server) {
        logger.info("Shutting down HTTP server");
        server.close();
    }
}
