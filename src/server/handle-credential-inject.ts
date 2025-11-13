import type {
    ArtemisCredentials,
    CredentialInjectRequest,
    CredentialInjectResponse,
    GitCredentials,
} from "./schema.ts";
import * as vscode from "vscode";
import { exec } from "node:child_process";

export async function handleCredentialInject(
    request: CredentialInjectRequest,
): Promise<CredentialInjectResponse> {
    const credentials = request.credentials;
    let success = true;
    let artemisSuccess = false;
    let gitSuccess = false;
    if (credentials.artemis) {
        artemisSuccess = await handleArtemisCredentials(credentials.artemis);
        if (!artemisSuccess) {
            success = false;
        }
    }
    if (credentials.git) {
        gitSuccess = await handleGitCredentials(credentials.git);
        if (!gitSuccess) {
            success = false;
        }
    }
    return {
        status: success ? "success" : "error",
        timestamp: new Date().toISOString(),
        actions: {
            // only provide status if an action was performed
            ...(credentials.artemis ? { artemisConfigured: artemisSuccess } : {}),
            ...(credentials.git ? { gitConfigured: gitSuccess } : {}),
        },
    };
}

async function handleArtemisCredentials(credentials: ArtemisCredentials) {
    try {
        const result = await vscode.commands.executeCommand(
            "scorpio.updateCredentials",
            credentials,
        );
        console.info("[theia-credential-bridge] Updated scorpio credentials", result);
        return true;
    } catch (error) {
        console.error("[theia-credential-bridge] Failed to update scorpio credentials", error);
        return false;
    }
}
async function handleGitCredentials(credentials: GitCredentials) {
    try {
        // TODO: what to do with password?
        await new Promise((resolve, reject) => {
            exec(
                `git config --global user.name "${credentials.username}" && ` +
                `git config --global user.email "${credentials.email}"`,
                (error, stdout, stderr) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve({ stdout, stderr });
                    }
                },
            );
        });
        console.info("[theia-credential-bridge] Updated git credentials");
        return true;
    } catch (error) {
        console.error("[theia-credential-bridge] Failed to update git credentials", error);
        return false;
    }
}
