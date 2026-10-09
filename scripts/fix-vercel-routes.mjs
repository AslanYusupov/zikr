#!/usr/bin/env node
/**
 * Nitro writes a header-only route for /assets without `continue`.
 * On Vercel that match stops routing, so the JavaScript never reaches the
 * browser and the published app stays blank. Keep the cache header and
 * continue to the filesystem.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const configPath = join(dirname(fileURLToPath(import.meta.url)), "..", ".vercel", "output", "config.json");

let config;
try {
  config = JSON.parse(readFileSync(configPath, "utf8"));
} catch {
  console.log("[vercel-routes] no build config — skip");
  process.exit(0);
}

let changed = 0;
for (const route of config.routes ?? []) {
  if (!route || route.dest || route.handle || route.status) continue;
  if (!route.headers) continue;
  if (route.continue === true) continue;
  route.continue = true;
  changed += 1;
}

if (changed === 0) {
  console.log("[vercel-routes] already continues");
  process.exit(0);
}

writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n");
console.log(`[vercel-routes] fixed ${changed} route(s)`);
