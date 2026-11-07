/** The published site is the only source. No extra copies. */

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

/** The page that is on the site right now. */
export async function fetchNewest(): Promise<{ html: string; base: string } | null> {
  const html = await pull(`/?open=${Date.now()}`, 12000);
  return html ? { html, base: "" } : null;
}

export async function fetchShellHtml(): Promise<string | null> {
  const found = await fetchNewest();
  return found?.html ?? null;
}

/** One file from this same site. */
export async function fetchShellFile(path: string): Promise<Response | null> {
  try {
    const res = await fetch(path, { signal: AbortSignal.timeout(12000) });
    if (res.ok) return res;
  } catch {
    /* the saved copy stays */
  }
  return null;
}
