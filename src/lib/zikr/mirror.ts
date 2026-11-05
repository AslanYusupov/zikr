/** The site first. If it does not answer, the exact latest GitHub copy. */
export const GITHUB = "https://cdn.jsdelivr.net/gh/AslanYusupov/zikr@release";

function clean(html: string): string {
  return html.replace(
    /<script\b[^>]*\bsrc\s*=\s*["'][^"']*(?:grok\.com|grok-app-builder\/extensions\.js)[^"']*["'][^>]*>\s*<\/script>/gi,
    "",
  );
}

async function pull(url: string, ms: number): Promise<string | null> {
  try {
    const res = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(ms) });
    if (!res.ok) return null;
    const html = clean(await res.text());
    return html.includes("<html") && html.includes("/assets/") && html.includes("zikr-build") ? html : null;
  } catch {
    return null;
  }
}

async function exactCopy(): Promise<{ html: string; base: string } | null> {
  try {
    const res = await fetch("https://api.github.com/repos/AslanYusupov/zikr/commits/release", {
      headers: { Accept: "application/vnd.github.sha" },
      cache: "no-store",
      signal: AbortSignal.timeout(2500),
    });
    const sha = (await res.text()).trim();
    if (!res.ok || !/^[0-9a-f]{40}$/.test(sha)) return null;
    const base = `https://cdn.jsdelivr.net/gh/AslanYusupov/zikr@${sha}`;
    const html = await pull(`${base}/index.html?v=${Date.now()}`, 4000);
    return html ? { html, base } : null;
  } catch {
    return null;
  }
}

function stampOf(html: string): string {
  return (
    html.match(/name="zikr-build"[^>]*content="([^"]+)"/)?.[1] ??
    html.match(/content="([^"]+)"[^>]*name="zikr-build"/)?.[1] ??
    ""
  );
}

function newerStamp(next: string, prev: string): boolean {
  if (!next) return false;
  if (!prev) return true;
  const [ad, an = "0"] = next.split("-");
  const [bd, bn = "0"] = prev.split("-");
  if (ad !== bd) return ad > bd;
  return Number(an) > Number(bn);
}

/** The newest page, and the address its files come from. */
export async function fetchNewest(): Promise<{ html: string; base: string } | null> {
  const [own, exact, raw] = await Promise.all([
    pull(`/?warm=${Date.now()}`, 4000).then((html) => (html ? { html, base: "" } : null)),
    exactCopy(),
    pull(`https://raw.githubusercontent.com/AslanYusupov/zikr/release/index.html?v=${Date.now()}`, 4000).then((html) =>
      html ? { html, base: "https://raw.githubusercontent.com/AslanYusupov/zikr/release" } : null,
    ),
  ]);
  let best: { html: string; base: string } | null = null;
  for (const item of [own, exact, raw]) {
    if (!item) continue;
    if (!best || newerStamp(stampOf(item.html), stampOf(best.html))) best = item;
  }
  return best;
}

/** The live page, or the GitHub copy when the site does not answer. */
export async function fetchShellHtml(): Promise<string | null> {
  const found = await fetchNewest();
  return found?.html ?? null;
}

/** One file from the site, then from GitHub. */
export async function fetchShellFile(path: string): Promise<Response | null> {
  const newest = await fetchNewest();
  const urls = [`${path}?warm=${Date.now()}`];
  if (newest?.base) urls.push(`${newest.base}${path}?v=${Date.now()}`);
  urls.push(`${GITHUB}${path}?v=${Date.now()}`);
  for (const url of urls) {
    try {
      const res = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(6000) });
      if (res.ok) return res;
    } catch {
      /* try the next copy */
    }
  }
  return null;
}