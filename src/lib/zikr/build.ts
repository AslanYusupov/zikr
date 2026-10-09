/** Shown in the document. Detection uses the script file names, which change on every publish. */
export const APP_BUILD = "20261002-4";

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

/** `fresh` means a newer publish is on the server. */
export async function checkUpdate(): Promise<"same" | "fresh" | "stuck" | "unknown"> {
  if (typeof navigator !== "undefined" && navigator.onLine === false) return "unknown";
  const res = await fetch(`${window.location.pathname}?probe=${Date.now()}`, {
    cache: "no-store",
    signal: AbortSignal.timeout(4000),
    headers: { "cache-control": "no-cache", pragma: "no-cache" },
  });
  if (!res.ok) return "unknown";
  const html = await res.text();
  if (!publishedIsNewer(html)) return "same";
  const marker = assetScriptsIn(html).sort().join(",");
  try {
    if (sessionStorage.getItem(TRIED_KEY) === marker) return "stuck";
  } catch {
    /* private mode */
  }
  return "fresh";
}

export async function hardRefresh() {
  try {
    if ("caches" in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
    }
  } catch {
    /* private mode */
  }
  try {
    if ("serviceWorker" in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((reg) => reg.unregister()));
    }
  } catch {
    /* ignore */
  }
  const url = new URL(window.location.href);
  url.searchParams.set("v", String(Date.now()));
  window.location.replace(url.toString());
}

export async function takeUpdate(): Promise<void> {
  try {
    const res = await fetch(`${window.location.pathname}?probe=${Date.now()}`, { cache: "no-store" });
    const html = await res.text();
    const marker = assetScriptsIn(html).sort().join(",");
    if (marker) sessionStorage.setItem(TRIED_KEY, marker);
  } catch {
    /* still reload */
  }
  await hardRefresh();
}
