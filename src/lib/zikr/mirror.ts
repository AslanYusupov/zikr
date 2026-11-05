/** The site first. If it does not answer, the one GitHub copy. */
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
    return html.includes("<html") && html.includes("/assets/") ? html : null;
  } catch {
    return null;
  }
}

/** The live page, or the GitHub copy when the site does not answer. */
export async function fetchShellHtml(): Promise<string | null> {
  const hour = Math.floor(Date.now() / 3_600_000);
  return (await pull(`/?warm=${Date.now()}`, 4000)) || (await pull(`${GITHUB}/index.html?v=${hour}`, 6000));
}

/** One file from the site, then from GitHub. */
export async function fetchShellFile(path: string): Promise<Response | null> {
  const hour = Math.floor(Date.now() / 3_600_000);
  const urls = [`${path}?warm=${Date.now()}`, `${GITHUB}${path}?v=${hour}`];
  for (const url of urls) {
    try {
      const res = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(6000) });
      if (res.ok) return res;
    } catch {
      /* try the GitHub copy */
    }
  }
  return null;
}
