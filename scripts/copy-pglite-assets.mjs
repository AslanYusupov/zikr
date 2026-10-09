#!/usr/bin/env node
/**
 * Nitro bundles PGLite into the server function but leaves the wasm/data
 * siblings behind. The published server then crashes on startup looking for
 * pglite.data next to the bundle. Copy them into the function output.
 */
import { copyFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "node_modules/@electric-sql/pglite/dist");
const dest = join(root, ".vercel/output/functions/__server.func/_libs");

if (!existsSync(dest)) {
  console.log("[pglite] no server bundle yet — skip");
  process.exit(0);
}

for (const name of ["pglite.data", "pglite.wasm", "initdb.wasm"]) {
  const from = join(src, name);
  if (!existsSync(from)) {
    console.error(`[pglite] missing ${from} — publish continues`);
    continue;
  }
  copyFileSync(from, join(dest, name));
  console.log(`[pglite] copied ${name}`);
}
