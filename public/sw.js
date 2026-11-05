const SHELL = "zikr-shell-v3";
const MIRRORS = [
  "https://cdn.jsdelivr.net/gh/AslanYusupov/zikr@release",
  "https://fastly.jsdelivr.net/gh/AslanYusupov/zikr@release",
];

function clean(html) {
  return html.replace(/<script\b[^>]*\bsrc\s*=\s*["'][^"']*(?:grok\.com|grok-app-builder\/extensions\.js)[^"']*["'][^>]*>\s*<\/script>/gi, "");
}

function pageFrom(html) {
  return new Response(clean(html), { status: 200, headers: { "content-type": "text/html; charset=utf-8" } });
}

function stampOf(html) {
  const named = html.match(/name="zikr-build"[^>]*content="([^"]+)"/);
  if (named) return named[1];
  const flipped = html.match(/content="([^"]+)"[^>]*name="zikr-build"/);
  return flipped ? flipped[1] : "";
}

function newer(next, prev) {
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

function pathsIn(html) {
  const out = [];
  const re = /\/assets\/[A-Za-z0-9._-]+\.(?:js|css)/g;
  let match;
  while ((match = re.exec(html))) {
    if (!out.includes(match[0])) out.push(match[0]);
  }
  return out;
}

function firstOk(urls, ms) {
  return new Promise((resolve) => {
    let left = urls.length;
    let done = false;
    const finish = (res) => {
      if (done) return;
      if (res) {
        done = true;
        resolve(res);
        return;
      }
      left -= 1;
      if (left <= 0) {
        done = true;
        resolve(null);
      }
    };
    setTimeout(() => finish(null), ms + 300);
    for (const url of urls) {
      fetch(url, { cache: "no-store", signal: AbortSignal.timeout(ms) })
        .then((res) => finish(res.ok ? res : null))
        .catch(() => finish(null));
    }
  });
}

async function readHtml(res) {
  if (!res) return "";
  try {
    const html = await res.text();
    return html.includes("<html") && html.includes("/assets/") ? html : "";
  } catch {
    return "";
  }
}

async function freshPage() {
  const hour = Math.floor(Date.now() / 3600000);
  const urls = ["/?open=" + Date.now(), ...MIRRORS.map((base) => base + "/index.html?v=" + hour)];
  const jobs = urls.map(async (url) => readHtml(await firstOk([url], 4000).catch(() => null)));
  const pages = (await Promise.all(jobs)).filter(Boolean);
  let best = "";
  let bestStamp = "";
  for (const html of pages) {
    const mark = stampOf(html);
    if (!best || newer(mark, bestStamp)) {
      best = html;
      bestStamp = mark;
    }
  }
  return best;
}

async function saveShell(cache, html) {
  const needed = pathsIn(html);
  if (!needed.length) return;
  await Promise.all(
    needed.map(async (src) => {
      if (await cache.match(src)) return;
      const file = await firstOk([src, ...MIRRORS.map((base) => base + src)], 5000);
      if (!file) return;
      const headers = new Headers();
      const type = file.headers.get("content-type");
      if (type) headers.set("content-type", type);
      await cache.put(src, new Response(await file.blob(), { status: 200, headers }));
    }),
  );
  for (const src of needed) {
    if (!(await cache.match(src))) return;
  }
  await cache.put("/", pageFrom(html));
}

function offlinePage() {
  const html = "<!doctype html><html lang=\"ru\"><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>Зикр</title><body style=\"margin:0;background:#000;color:#f7f3ea;font:600 1rem/1.45 sans-serif;display:grid;min-height:100vh;place-items:center;text-align:center;padding:1.5rem\"><p>Нет связи. Откройте Зикр один раз, когда интернет есть. Дальше он откроется и без сети.</p></body></html>";
  return new Response(html, { status: 200, headers: { "content-type": "text/html; charset=utf-8" } });
}

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith("zikr-shell-") && key !== SHELL).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

function keep(url) {
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/_server") || url.pathname.startsWith("/auth/")) return false;
  return (
    url.pathname === "/" ||
    url.pathname.startsWith("/assets/") ||
    url.pathname.startsWith("/fonts/") ||
    url.pathname.startsWith("/quran-mean/") ||
    /\.(?:js|css|woff2|webp|svg|png|jpg|jpeg|json|webmanifest|mp3)$/.test(url.pathname)
  );
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  let url;
  try {
    url = new URL(req.url);
  } catch {
    return;
  }
  if (url.origin !== self.location.origin) return;
  if (url.pathname === "/sw.js") return;
  if (url.searchParams.has("open") || url.searchParams.has("warm") || url.searchParams.has("probe")) return;
  const navigation = req.mode === "navigate" || req.destination === "document";
  if (!keep(url) && !navigation) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(SHELL);
      if (navigation) {
        const saved = await cache.match("/");
        if (saved) {
          let html = "";
          try {
            html = await saved.clone().text();
          } catch {
            html = "";
          }
          if (html.includes("/assets/") && html.includes("zikr-build")) {
          const current = html;
          event.waitUntil(
            freshPage().then(async (next) => {
              if (!next || !newer(stampOf(next), stampOf(current))) return;
              await saveShell(cache, next);
            }),
          );
          return pageFrom(current);
        }
        }
        const html = await freshPage();
        if (html) {
          event.waitUntil(saveShell(cache, html));
          return pageFrom(html);
        }
        if (saved) return saved;
        return offlinePage();
      }
      const hit = await cache.match(req, { ignoreSearch: true });
      if (hit) return hit;
      const file = await firstOk([url.pathname, ...MIRRORS.map((base) => base + url.pathname)], 5000);
      if (!file) return new Response("", { status: 504 });
      const headers = new Headers();
      const type = file.headers.get("content-type");
      if (type) headers.set("content-type", type);
      const copy = new Response(await file.blob(), { status: 200, headers });
      event.waitUntil(cache.put(url.pathname, copy.clone()).catch(() => {}));
      return copy;
    })(),
  );
});
