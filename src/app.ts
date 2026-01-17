import { Hono } from "hono";
import { validator } from "hono/validator";
import { dataInjectRequestSchema } from "./schema.ts";
import { type } from "arktype";
import type DataService from "./service/data.ts";
import { serve, type ServerType } from "@hono/node-server";
import logger from "./service/logger.ts";

const DEFAULT_PORT = 16281;

function createApp(dataService: DataService) {
    const app = new Hono();

    // Request logging middleware
    app.use("*", async (c, next) => {
        const start = Date.now();
        await next();
        const duration = Date.now() - start;
        logger.debug(`${c.req.method} ${c.req.path} ${c.res.status} (${duration}ms)`);
    });

    // Data injection endpoint
    app.post(
        "/data",
        validator("json", (value, c) => {
            const parsed = dataInjectRequestSchema(value);
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
            const response = await dataService.inject(body);
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
        logger.warn(`404 - Not found: ${c.req.path}`);
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
        logger.error("Internal server error", err);
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
    const portFromEnv = process.env.DATA_BRIDGE_PORT;
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

export function startServer(dataService: DataService): ServerType | undefined {
    try {
        const app = createApp(dataService);
        const hostname = "0.0.0.0";
        const port = getPort();
        const server = serve({
            ...app,
            port,
            hostname,
        });

        logger.info(`HTTP server started on http://${hostname}:${port}`);

        return server;
    } catch (error) {
        logger.error("Failed to start server", error);
        return undefined;
    }
}
