import { Hono } from 'hono'
import { AppVariables, Env } from './types'
import { cors } from 'hono/cors'
import { authMiddleware } from './middleware/auth';

const app = new Hono<{Bindings: Env, Variables: AppVariables}>();

app.get("*", async (c, next) => {
    const allowedOrigins = c.env.FRONTEND_URL || "http://localhost:3000";
    const middleware = cors({
        origin: [allowedOrigins],
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowHeaders: ["Content-Type", "Authorization"],
        maxAge: 600,
        credentials: true,
    });
    return middleware(c, next);
})

app.get("/health", (c) => {
    return c.json({ status: "ok", timestamp: new Date().toISOString() });
})

app.get("/api/*", authMiddleware);

export default app;