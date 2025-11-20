import { type } from "arktype";


// HTTP request schema for crednetial injection
export const credentialInjectRequestSchema = type({
    environment: "Record<string, string>",
});

export type CredentialInjectRequest = typeof credentialInjectRequestSchema.infer;

// VSCode command schema for getEnv
export const getEnvSchema = type("string[]");

export type getEnvCommandRequest = typeof getEnvSchema.infer;