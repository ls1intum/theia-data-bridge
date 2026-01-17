import type * as vscode from "vscode";
import logger from "./logger";

const SECRET_KEY = "dataBridge.environment";

class SecretStoragePersistence {
    private secrets: vscode.SecretStorage;

    constructor(secrets: vscode.SecretStorage) {
        this.secrets = secrets;
    }

    public async loadAll(): Promise<Record<string, string>> {
        const raw = await this.secrets.get(SECRET_KEY);
        if (!raw) {
            return {};
        }
        try {
            const parsed = JSON.parse(raw) as Record<string, unknown>;
            const entries = Object.entries(parsed).filter(
                ([_, value]) => typeof value === "string",
            ) as Array<[string, string]>;
            return Object.fromEntries(entries);
        } catch (error) {
            logger.warn("Failed to parse persisted environment data, ignoring", error);
            return {};
        }
    }

    public async saveAll(environment: Record<string, string>): Promise<void> {
        await this.secrets.store(SECRET_KEY, JSON.stringify(environment));
    }
}

export default SecretStoragePersistence;
