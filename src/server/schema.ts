import { type } from "arktype";

/**
 * Schema for Artemis credentials
 */
const artemisCredentialsSchema = type({
    url: "string",
    token: "string",
});

export type ArtemisCredentials = typeof artemisCredentialsSchema.infer;
/**
 * Schema for Git credentials
 */
const gitCredentialsSchema = type({
    username: "string",
    email: "string",
    "password?": "string",
    repositoryUrl: "string",
});

export type GitCredentials = typeof gitCredentialsSchema.infer;
/**
 * Schema for environment variables
 * Allows arbitrary key-value pairs for flexibility
 */
const environmentSchema = type("Record<string, string>");

/**
 * Schema for the credentials object
 * All sections are optional to allow partial credential injection
 */
const credentialsSchema = type({
    "artemis?": artemisCredentialsSchema,
    "git?": gitCredentialsSchema,
    "environment?": environmentSchema,
});

/**
 * Complete credential injection request schema
 */
export const credentialInjectRequestSchema = type({
    credentials: credentialsSchema,
});

/**
 * Inferred TypeScript type for the credential injection request
 */
export type CredentialInjectRequest = typeof credentialInjectRequestSchema.infer;

/**
 * Response schema for successful injection
 */
export const credentialInjectResponseSchema = type({
    status: "'success'|'error'",
    timestamp: "string",
    "actions": type({
        "gitConfigured?": "boolean",
        "artemisConfigured?": "boolean",
    }),
});

export type CredentialInjectResponse = typeof credentialInjectResponseSchema.infer;
