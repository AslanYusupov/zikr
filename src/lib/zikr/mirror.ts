/** Same files as the site. Several networks, so one closed road is not the only road. */
export const SHELL_HOSTS = [
  "https://cdn.jsdelivr.net/gh/AslanYusupov/zikr@release",
  "https://fastly.jsdelivr.net/gh/AslanYusupov/zikr@release",
  "https://gcore.jsdelivr.net/gh/AslanYusupov/zikr@release",
  "https://cdn.statically.io/gh/AslanYusupov/zikr/release",
];

function clean(html: string): string {
  return html.replace(
    /<script\b[^>]*\bsrc\s*=\s*["'][^"']*(?:grok\.com|grok-app-builder\/extensions\.js)[^"']*["'][^>]*>\s*<\/script>/gi,
    "",
  );
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
  const ai = Number(an);
  const bi = Number(bn);
  if (Number.isFinite(ai) && Number.isFinite(bi)) return ai > bi;
  return next > prev;
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

/** The newest published page. The site and the GitHub copies are asked together. */
export async function fetchShellHtml(): Promise<string | null> {
  const hour = Math.floor(Date.now() / 3_600_000);
  const pages = await Promise.all([
    pull(`/?warm=${Date.now()}`, 4000),
    ...SHELL_HOSTS.map((base) => pull(`${base}/index.html?v=${hour}`, 8000)),
  ]);
  let best = "";
  let bestStamp = "";
  for (const html of pages) {
    if (!html) continue;
    const mark = stampOf(html);
    if (!best || newerStamp(mark, bestStamp)) {
      best = html;
      bestStamp = mark;
    }
  }
  return best || null;
}

/** One published file, from the site or from a GitHub copy. */
export async function fetchShellFile(path: string): Promise<Response | null> {
  const hour = Math.floor(Date.now() / 3_600_000);
  const urls = [`${path}?warm=${Date.now()}`, ...SHELL_HOSTS.map((base) => `${base}${path}?v=${hour}`)];
  let left = urls.length;
  return new Promise((resolve) => {
    let settled = false;
    const finish = (res: Response | null) => {
      if (settled) return;
      if (res) {
        settled = true;
        resolve(res);
        return;
      }
      left -= 1;
      if (left <= 0) {
        settled = true;
        resolve(null);
      }
    };
    for (const url of urls) {
      fetch(url, { cache: "no-store", signal: AbortSignal.timeout(12000) })
        .then((res) => finish(res.ok ? res : null))
        .catch(() => finish(null));
    }
  });
}