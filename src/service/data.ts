import type { DataInjectRequest, getEnvCommandRequest } from "../schema.ts";
import dataStorage from "./storage.ts";
import logger from "./logger.ts";

class DataService {
    constructor() {}

    public inject(request: DataInjectRequest): void {
        const keys = Object.keys(request.environment).length;
        logger.debug(`Injecting ${keys} environment variable(s)`);
        for (const [key, value] of Object.entries(request.environment)) {
            dataStorage.setEnv(key, value);
        }
    }

    public getEnvVars(request: getEnvCommandRequest): Record<string, string> {
        logger.debug(`Retrieving ${request.length} environment variable(s)`);
        return Object.fromEntries(
            request
                .map((key) => [key, dataStorage.getEnv(key)])
                .filter(([_, value]) => value !== undefined),
        );
    }
}

const dataService = new DataService();

export default dataService;
