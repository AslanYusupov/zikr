export const APP_BUILD = "20261105-8";

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

/** The open page stays. A newer copy must not replace it and break the app. */
export async function checkUpdate(): Promise<"same" | "fresh" | "stuck" | "unknown"> {
  return "same";
}

export async function takeUpdate(): Promise<void> {
  return;
}
