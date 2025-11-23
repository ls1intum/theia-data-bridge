import { Hono } from "hono";
import { validator } from "hono/validator";
import { credentialInjectRequestSchema } from "./schema.ts";
import { type } from "arktype";
import credentialService from "./service/credentials.ts";
import { serve, type ServerType } from "@hono/node-server";

const DEFAULT_PORT = 16281;

function createApp() {
    const app = new Hono();

    // Health check endpoint
    app.post(
        "/credentials",
        validator("json", (value, c) => {
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
            const body = c.req.valid("json");
            const response = credentialService.inject(body);
            return c.json(response);
        },
    );

    // Health endpoint
    // Can be used as a measure of readiness for the extensions environment
    app.get("/health", (c) => {
        return c.text("OK", 200);
    });

    // 404 handler
    app.notFound((c) => {
        console.log(`[credential-bridge] 404 - Not found: ${c.req.path}`);
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
        console.error("[credential-bridge] Error:", err);
        return c.json(
            {
                error: "Internal server error",
                message: err.message,
            },
            500,
        );
    });

    return app;
}

function getPort(): number {
    const portFromEnv = process.env.CREDENTIAL_BRIDGE_PORT;
    if (portFromEnv) {
        const parsedPortFromEnv = parseInt(portFromEnv);
        // validate the port to be a valid port number
        if (isNaN(parsedPortFromEnv) || parsedPortFromEnv < 1 || parsedPortFromEnv > 65535) {
            return DEFAULT_PORT;
        }
        return parsedPortFromEnv;
    }
    return DEFAULT_PORT;
}

export function startServer(): ServerType | undefined {
    try {
        const app = createApp();
        const hostname = "0.0.0.0";
        const port = getPort();
        const server = serve({
            ...app,
            port,
            hostname,
        });

        console.log(`[credential-bridge] HTTP server started on http://${hostname}:${port}`);

        return server;
    } catch (error) {
        console.error("[credential-bridge] Failed to start server:", error);
        return undefined;
    }
}
