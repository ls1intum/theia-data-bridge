// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { startServer } from "./app.ts";
import CommandRegistry from "./service/commands.ts";

let server: ReturnType<typeof startServer>;

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
    const commandRegistry = new CommandRegistry(context);
    commandRegistry.registerCommands();

    server = startServer();

    // Temporary debugging message to confirm successful start
    vscode.window.showInformationMessage("Credential Bridge server started");
}

// This method is called when your extension is deactivated
export function deactivate() {
    if (server) {
        console.log("[theia-credential-bridge] Shutting down HTTP server...");
        server.close();
    }
}
