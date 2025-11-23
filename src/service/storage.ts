import * as vscode from "vscode";

interface Storage {
    environment: Record<string, string>;
}

class CredentialStorage {
    private storage: Storage;

    constructor() {
        this.storage = {
            environment: {},
        };
    }

    public getEnv(key: string): string | undefined {
        return this.storage.environment[key];
    }

    public setEnv(key: string, value: string): void {
        this.storage.environment[key] = value;
        // Temporary debugging message to confirm successful storage
        vscode.window.showInformationMessage(`Environment variable ${key} set to ${value}`);
    }
}

const credentialStorage = new CredentialStorage();

export default credentialStorage;
