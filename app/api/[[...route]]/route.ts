import { Hono } from "hono";
import { handle } from "hono/vercel";
import { userRoutes } from "@/lib/controllers/user.controller";

const app = new Hono().basePath("/api");

// Health check
app.get("/health", (c) => {
  return c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// User routes → /api/users/*
app.route("/users", userRoutes);

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
