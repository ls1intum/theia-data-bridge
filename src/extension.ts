// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import type * as vscode from "vscode";
import { execSync } from "child_process";

let server: ReturnType<(typeof import("./app.ts"))["startServer"]>;

// This method is called when your extension is activated
export async function activate(context: vscode.ExtensionContext) {
    // bailout if the data bridge is not enabled
    const dataBridgeEnvVar = execSync("echo $DATA_BRIDGE_ENABLED").toString().trim();
    if (!["1", "true"].includes(dataBridgeEnvVar)) {
        return;
    }

    // import only if the extension should be activated
    const [
        { startServer },
        { default: logger },
        { default: CommandRegistry },
        { default: DataStorage },
        { default: DataService },
        { default: SecretStoragePersistence },
    ] = await Promise.all([
        import("./app.ts"),
        import("./service/logger.ts"),
        import("./service/commands.ts"),
        import("./service/storage.ts"),
        import("./service/data.ts"),
        import("./service/persistence.ts"),
    ]);

    try {
        const persistence = new SecretStoragePersistence(context.secrets);
        const dataStorage = await DataStorage.withPersistence(persistence);

        const dataService = new DataService(dataStorage);
        const commandRegistry = new CommandRegistry(context, dataService);
        commandRegistry.registerCommands();

        server = startServer(dataService);
        logger.info("Data Bridge extension activated and server started");

        context.subscriptions.push(logger);
    } catch (error) {
        logger.error("Failed to activate Data Bridge extension", error);
    }
}

// This method is called when your extension is deactivated
export async function deactivate() {
    if (server) {
        const logger = await import("./service/logger.ts").then((module) => module.default);
        logger.info("Shutting down HTTP server");
        server.close();
    }
}
