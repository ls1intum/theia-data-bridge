import { Hono } from "hono";
import { validator } from "hono/validator";
import { credentialInjectRequestSchema } from "./schema.ts";
import { type } from "arktype";
import { handleCredentialInject } from "./handle-credential-inject.ts";

const app = new Hono();

// Health check endpoint
app.post(
    "/credentials/inject",
    validator("form", (value, c) => {
        const parsed = credentialInjectRequestSchema(value);
        if (parsed instanceof type.errors) {
            return c.json(
                {
                    error: parsed.summary,
                },
                401,
            );
        }
        return parsed;
    }),
    async (c) => {
        const body = c.req.valid("form");
        const response = await handleCredentialInject(body);
        return c.json(response);
    },
);

// Health endpoint
// Can be used as a measure of readiness for the extensions environment
app.get("/health", (c) => {
    console.log("[theia-credential-bridge] GET /health");
    return c.text("OK", 200);
});

// 404 handler
app.notFound((c) => {
    console.log(`[theia-credential-bridge] 404 - Not found: ${c.req.path}`);
    return c.json(
        {
            error: "Not found",
            path: c.req.path,
        },
        404,
    );
});

// Error handler
app.onError((err, c) => {
    console.error("[theia-credential-bridge] Error:", err);
    return c.json(
        {
            error: "Internal server error",
            message: err.message,
        },
        500,
    );
});

export default app;
