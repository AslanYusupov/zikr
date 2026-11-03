/** Same files as the site, served from a network that opens without a VPN. */
const MIRROR = "https://cdn.jsdelivr.net/gh/AslanYusupov/zikr@release";

function clean(html: string): string {
  return html.replace(
    /<script\b[^>]*\bsrc\s*=\s*["'][^"']*(?:grok\.com|grok-app-builder\/extensions\.js)[^"']*["'][^>]*>\s*<\/script>/gi,
    "",
  );
}

async function pull(url: string, ms: number): Promise<Response | null> {
  try {
    const res = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(ms) });
    return res.ok ? res : null;
  } catch {
    return null;
  }
}

/** The published page. The site itself is tried first, then the GitHub copy. */
export async function fetchShellHtml(): Promise<string | null> {
  const local = await pull(`/?warm=${Date.now()}`, 12000);
  if (local) {
    const html = clean(await local.text());
    if (html.includes("<html") && html.includes("/assets/")) return html;
  }
  const remote = await pull(`${MIRROR}/index.html`, 15000);
  if (!remote) return null;
  const html = clean(await remote.text());
  if (!html.includes("<html") || !html.includes("/assets/")) return null;
  return html;
}

/** One published file, from the site or from the GitHub copy. */
export async function fetchShellFile(path: string): Promise<Response | null> {
  const local = await pull(`${path}?warm=${Date.now()}`, 12000);
  if (local) return local;
  return pull(`${MIRROR}${path}`, 20000);
}
