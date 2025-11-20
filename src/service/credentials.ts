import type { CredentialInjectRequest, getEnvCommandRequest } from "../schema.ts";
import credentialStorage from "./storage.ts";

class CredentialService {
    constructor() {}

    public inject(request: CredentialInjectRequest): void {
        for (const [key, value] of Object.entries(request.environment)) {
            credentialStorage.setEnv(key, value);
        }
    }

    public getEnvVars(request: getEnvCommandRequest): Record<string, string> {
        return Object.fromEntries(
            request
                .map((key) => [key, credentialStorage.getEnv(key)])
                .filter(([_, value]) => value !== undefined),
        );
    }
}

const credentialService = new CredentialService();

export default credentialService;
