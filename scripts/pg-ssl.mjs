import { parse } from "pg-connection-string";

/**
 * Neon puts `channel_binding` first. Stripping it used to eat the `?`,
 * so the database name became `neondb&sslmode=no-verify` and email
 * sign-in died before it could check the password.
 * @param {string} connectionString
 * @returns {string}
 */
export function deployConnectionString(connectionString) {
  if (!connectionString) return connectionString;
  const hash = connectionString.indexOf("#");
  const base = hash === -1 ? connectionString : connectionString.slice(0, hash);
  const q = base.indexOf("?");
  const prefix = q === -1 ? base : base.slice(0, q);
  const params = new URLSearchParams(q === -1 ? "" : base.slice(q + 1));
  params.delete("channel_binding");
  params.set("sslmode", "no-verify");
  const qs = params.toString();
  return qs ? `${prefix}?${qs}` : prefix;
}

/** @param {string} connectionString */
export function deployPoolConfig(connectionString) {
  const parsed = parse(deployConnectionString(connectionString));
  const database = (parsed.database || "").split(/[&?]/)[0] || undefined;
  return {
    host: parsed.host ?? undefined,
    port: parsed.port ? Number(parsed.port) : undefined,
    user: parsed.user,
    password: parsed.password,
    database,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
  };
}