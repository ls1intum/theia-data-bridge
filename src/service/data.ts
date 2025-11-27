import type { DataInjectRequest, getEnvCommandRequest } from "../schema.ts";
import dataStorage from "./storage.ts";

class DataService {
    constructor() {}

    public inject(request: DataInjectRequest): void {
        for (const [key, value] of Object.entries(request.environment)) {
            dataStorage.setEnv(key, value);
        }
    }

    public getEnvVars(request: getEnvCommandRequest): Record<string, string> {
        return Object.fromEntries(
            request
                .map((key) => [key, dataStorage.getEnv(key)])
                .filter(([_, value]) => value !== undefined),
        );
    }
}

const dataService = new DataService();

export default dataService;
