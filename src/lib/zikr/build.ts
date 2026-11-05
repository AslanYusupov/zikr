import { fetchShellFile, fetchShellHtml } from "./mirror";
export const APP_BUILD = "20261105-21";

const TRIED_KEY = "zikr-update-tried";

function assetScriptsIn(html: string): string[] {
  return [...new Set([...html.matchAll(/\/assets\/[A-Za-z0-9._-]+\.js/g)].map((match) => match[0]))];
}

function loadedScripts(): string[] {
  return [...document.querySelectorAll("script[src]")].flatMap((node) => {
    const src = node.getAttribute("src") ?? "";
    const at = src.indexOf("/assets/");
    if (at < 0 || !src.slice(at).includes(".js")) return [];
    return [src.slice(at).split("?")[0]];
  });
}

export function buildStamp(html: string): string {
  return (
    html.match(/name="zikr-build"[^>]*content="([^"]+)"/)?.[1] ??
    html.match(/content="([^"]+)"[^>]*name="zikr-build"/)?.[1] ??
    ""
  );
}

/** A later date, or a higher number on the same date. An empty stamp is never newer. */
export function buildIsNewer(next: string, current: string): boolean {
  if (!next) return false;
  if (!current) return true;
  const [ad, an = "0"] = next.split("-");
  const [bd, bn = "0"] = current.split("-");
  if (ad !== bd) return ad > bd;
  const ai = Number(an);
  const bi = Number(bn);
  if (Number.isFinite(ai) && Number.isFinite(bi)) return ai > bi;
  return next > current;
}

export function pageBuild(): string {
  if (typeof document === "undefined") return "";
  return document.querySelector('meta[name="zikr-build"]')?.getAttribute("content") ?? "";
}

export function audioBusy(): boolean {
  if (typeof document === "undefined") return false;
  const el = document.querySelector("audio");
  return !!el && !el.paused && !el.ended;
}

/**
 * The open page is old when one of its script files is no longer in the published HTML.
 * Extra files in the HTML do not count, so a matching page never reloads itself.
 */
export function publishedIsNewer(html: string): boolean {
  const live = assetScriptsIn(html);
  const here = loadedScripts();
  if (live.length === 0 || here.length === 0) return false;
  return here.some((src) => !live.includes(src));
}

/** `fresh` means a newer publish is on the server and its files can be saved. */
export async function checkUpdate(): Promise<"same" | "fresh" | "stuck" | "unknown"> {
  if (typeof navigator !== "undefined" && navigator.onLine === false) return "unknown";
  const html = await fetchShellHtml();
  if (!html) return "unknown";
  if (!buildIsNewer(buildStamp(html), pageBuild())) return "same";
  if (!publishedIsNewer(html)) return "same";
  const marker = assetScriptsIn(html).sort().join(",");
  try {
    if (sessionStorage.getItem(TRIED_KEY) === marker) return "stuck";
  } catch {
    /* private mode */
  }
  return "fresh";
}

export async function takeUpdate(): Promise<void> {
  const cacheName = "zikr-shell-v2";
  try {
    const html = await fetchShellHtml();
    if (!html) return;
    if (!buildIsNewer(buildStamp(html), pageBuild())) return;
    const cache = await caches.open(cacheName);
    const assets = [...new Set([...html.matchAll(/\/assets\/[A-Za-z0-9._-]+\.(?:js|css)/g)].map((match) => match[0]))];
    if (assets.length === 0) return;
    const saved = await Promise.all(
      assets.map(async (src) => {
        const file = await fetchShellFile(src);
        if (!file) return false;
        await cache.put(src, file);
        return true;
      }),
    );
    if (saved.some((ok) => !ok)) return;
    await cache.put("/", new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } }));
  } catch {
    return;
  }
  if (audioBusy()) return;
  window.location.reload();
}
