import { type } from "arktype";

// HTTP request schema for crednetial injection
export const dataInjectRequestSchema = type({
    environment: "Record<string, string>",
});

export type DataInjectRequest = typeof dataInjectRequestSchema.infer;

// VSCode command schema for getEnv
export const getEnvSchema = type("string[]");

export type getEnvCommandRequest = typeof getEnvSchema.infer;
