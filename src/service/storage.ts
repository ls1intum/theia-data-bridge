import logger from "./logger";

interface Storage {
    environment: Record<string, string>;
}

class DataStorage {
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
        logger.debug(`Environment variable set: ${key}`);
    }
}

const dataStorage = new DataStorage();

export default dataStorage;
