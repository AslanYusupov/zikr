#!/usr/bin/env node
/**
 * Copy the published page onto a folder that can be pushed to the `release`
 * branch. jsDelivr then serves it from a network that opens where Vercel does not.
 *
 * Usage: node scripts/publish-mirror.mjs /tmp/zikr-mirror
 */
import { mkdir, writeFile, copyFile, readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { readFileSync } from "node:fs";

const out = process.argv[2];
if (!out) {
  console.error("usage: node scripts/publish-mirror.mjs <dir>");
  process.exit(1);
}

const source = readFileSync(new URL("../src/lib/zikr/build.ts", import.meta.url), "utf8");
const build = source.match(/APP_BUILD = "([^"]+)"/)?.[1] ?? "";
const origin = "https://zikr-five.vercel.app";

async function page() {
  const res = await fetch(`${origin}/?warm=${Date.now()}`, { cache: "no-store" });
  if (!res.ok) return "";
  return res.text();
}

let html = "";
for (let i = 0; i < 20; i += 1) {
  try {
    html = await page();
  } catch {
    html = "";
  }
  if (build && html.includes(build) && html.includes("/assets/")) break;
  html = "";
  await new Promise((resolve) => setTimeout(resolve, 30_000));
}

if (!html) {
  console.log("[mirror] the new page is not public yet");
  process.exit(1);
}

await mkdir(out, { recursive: true });
await writeFile(join(out, "index.html"), html);
const files = [...new Set([...html.matchAll(/\/(?:assets\/[A-Za-z0-9._-]+\.(?:js|css)|sw\.js)/g)].map((match) => match[0]))];
files.push("/sw.js", "/quran.json", "/manifest.webmanifest");
for (const lang of ["ru", "en", "id", "tr", "ur"]) files.push(`/quran-mean/${lang}.json`);
for (const path of [...new Set(files)]) {
  const res = await fetch(`${origin}${path}?warm=${Date.now()}`, { cache: "no-store" });
  if (!res.ok) {
    console.log("[mirror] missing", path);
    continue;
  }
  const dest = join(out, path);
  await mkdir(dirname(dest), { recursive: true });
  await writeFile(dest, Buffer.from(await res.arrayBuffer()));
  console.log("[mirror] saved", path);
}

const publicDir = new URL("../public/", import.meta.url);
const photos = ["roses.jpg", "shore.jpg", "desert.jpg", "cosmos.jpg", "peaks.jpg", "lake.jpg", "jungle.jpg", "favicon.svg", "icon-180.png", "orbit-sun.webp", "orbit-moon.webp"];
for (const name of photos) {
  const dest = join(out, name);
  await copyFile(new URL(name, publicDir), dest);
  console.log("[mirror] saved", name);
}
const fontDir = join(out, "fonts");
await mkdir(fontDir, { recursive: true });
for (const name of await readdir(new URL("fonts/", publicDir))) {
  if (!name.endsWith(".woff2")) continue;
  await copyFile(new URL(`fonts/${name}`, publicDir), join(fontDir, name));
  console.log("[mirror] saved", `fonts/${name}`);
}
console.log("[mirror] ready", build);
