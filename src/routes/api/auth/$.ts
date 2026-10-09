import { createFileRoute } from "@tanstack/react-router";
import authSql from "../../../../migrations/0001_auth.sql?raw";
import { auth, authPool, lastAuthError } from "@/lib/auth/server";

let ready: Promise<void> | null = null;

function statements(sql: string) {
  return sql
    .split(";")
    .map((part) => part.replace(/--[^\n]*/g, "").trim())
    .filter(Boolean);
}

async function ensureAuthTables() {
  if (!authPool) return;
  if (!ready) {
    ready = (async () => {
      const client = await authPool.connect();
      try {
        for (const statement of statements(authSql)) {
          await client.query(statement);
        }
      } finally {
        client.release();
      }
    })().catch((err) => {
      ready = null;
      throw err;
    });
  }
  await ready;
}

async function handle(request: Request) {
  try {
    await ensureAuthTables();
    const res = await auth.handler(request);
    if (res.status < 500) return res;
    const text = await res.clone().text();
    if (text.trim()) return res;
    return Response.json({ message: lastAuthError || "Сервер входа не ответил" }, { status: 500 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Сервер входа не ответил";
    return Response.json({ message }, { status: 500 });
  }
}

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: ({ request }) => handle(request),
      POST: ({ request }) => handle(request),
    },
  },
});
