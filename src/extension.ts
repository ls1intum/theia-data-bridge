// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { serve } from "@hono/node-server";
import app from "./server/index.ts";

let server: ReturnType<typeof serve> | undefined;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log("Activating theia-credential-bridge");

    try {
        const port = 16281;
        const hostname = "0.0.0.0";

        server = serve({
            ...app,
            port,
            hostname,
        });

        console.log(`[theia-credential-bridge] HTTP server started on http://${hostname}:${port}`);
        vscode.window.showInformationMessage(
            `Credential Bridge server running on http://${hostname}:${port}`,
        );
    } catch (error) {
        console.error("[theia-credential-bridge] Failed to start server:", error);
        vscode.window.showErrorMessage(`Failed to start Credential Bridge server: ${error}`);
    }

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    const disposable = vscode.commands.registerCommand("theia-credential-bridge.helloWorld", () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        vscode.window.showInformationMessage("Hello World from theia-credential-bridge!");
    });

    context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {
    if (server) {
        console.log("[theia-credential-bridge] Shutting down HTTP server...");
        server.close();
    }
}
