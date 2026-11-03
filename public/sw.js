const SHELL = "zikr-shell-v2";

function buildStamp(html) {
  const named = html.match(/name="zikr-build"[^>]*content="([^"]+)"/);
  if (named) return named[1];
  const flipped = html.match(/content="([^"]+)"[^>]*name="zikr-build"/);
  return flipped ? flipped[1] : "";
}

function newerBuild(next, prev) {
  if (!next) return false;
  if (!prev) return true;
  const nextParts = next.split("-");
  const prevParts = prev.split("-");
  if (nextParts[0] !== prevParts[0]) return nextParts[0] > prevParts[0];
  const nextN = Number(nextParts[1] || 0);
  const prevN = Number(prevParts[1] || 0);
  if (Number.isFinite(nextN) && Number.isFinite(prevN)) return nextN > prevN;
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

const MIRROR = "https://cdn.jsdelivr.net/gh/AslanYusupov/zikr@release";

async function fetchAsset(src) {
  const grab = async (url, ms) => {
    try {
      const file = await fetch(url, { signal: AbortSignal.timeout(ms) });
      return file.ok ? file : null;
    } catch {
      return null;
    }
  };
  return (await grab(src, 8000)) || (await grab(MIRROR + src, 12000));
}

function within(ms, run) {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(null), ms);
    run()
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch(() => {
        clearTimeout(timer);
        resolve(null);
      });
  });
}

async function freshPage() {
  const local = await within(5000, async () => {
    const res = await fetch(new Request("/?warm=" + Date.now(), { cache: "no-store" }));
    return res.ok ? res : null;
  });
  if (local) return local;
  return within(8000, async () => {
    const res = await fetch(MIRROR + "/index.html", { cache: "no-store" });
    return res.ok ? res : null;
  });
}

async function storeFresh(cache) {
  const fresh = await freshPage();
  if (!fresh) return;
  const before = await cache.match("/");
  const previous = before ? await before.text() : "";
  const cleaned = await pageFrom(fresh);
  const html = await cleaned.clone().text();
  if (!newerBuild(buildStamp(html), buildStamp(previous))) return;
  await saveShell(cache, new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } }));
  const saved = await cache.match("/");
  const now = saved ? await saved.text() : "";
  const next = pathsIn(now).join("|");
  const prev = pathsIn(previous).join("|");
  if (!next || next === prev) return;
  const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
  for (const client of windows) client.postMessage({ type: "zikr-reload", sig: next });
}

async function saveShell(cache, res) {
  let html = "";
  try {
    html = await res.text();
  } catch {
    return;
  }
  if (!html.includes("<html")) return;
  const needed = pathsIn(html);
  if (!needed.length) return;
  await Promise.all(
    needed.map(async (src) => {
      if (await cache.match(src)) return;
      try {
        const file = await fetchAsset(src);
        if (!file) return;
        await cache.put(src, await stored(file));
      } catch {
        /* keep what is already stored */
      }
    }),
  );
  for (const src of needed) {
    if (!(await cache.match(src))) return;
  }
  await cache.put("/", new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } }));
}

function cleanPage(html) {
  return html.replace(/<script\b[^>]*\bsrc\s*=\s*["'][^"']*(?:grok\.com|grok-app-builder\/extensions\.js)[^"']*["'][^>]*>\s*<\/script>/gi, "");
}

async function pageFrom(res) {
  try {
    const html = await res.text();
    return new Response(cleanPage(html), { status: 200, headers: { "content-type": "text/html; charset=utf-8" } });
  } catch {
    return res;
  }
}

function stored(res) {
  const headers = new Headers();
  const type = res.headers.get("content-type");
  if (type) headers.set("content-type", type);
  return res.blob().then((body) => new Response(body, { status: 200, headers }));
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
    /\.(?:js|css|woff2|webp|svg|png|jpg|jpeg|json|webmanifest)$/.test(url.pathname)
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
  if (url.searchParams.has("probe") || url.searchParams.has("warm")) return;
  if (!keep(url) && req.mode !== "navigate" && req.destination !== "document") return;

  const navigation = req.mode === "navigate" || req.destination === "document";
  event.respondWith(
    (async () => {
      const cache = await caches.open(SHELL);
      const hit = navigation
        ? (await cache.match("/", { ignoreSearch: true })) || (await cache.match(req, { ignoreSearch: true }))
        : await cache.match(req, { ignoreSearch: true });
      const frozen =
        url.pathname.startsWith("/assets/") ||
        url.pathname.startsWith("/fonts/") ||
        /\.(?:woff2|webp|png|jpg|jpeg|svg)$/.test(url.pathname);
      const update = () =>
        fetch(req)
          .then((res) => {
            if (res.ok && !navigation && !frozen) {
              stored(res.clone())
                .then((copy) => cache.put(new Request(url.pathname), copy))
                .catch(() => {});
            }
            return res;
          })
          .catch(() => null);
      if (hit) {
        if (!navigation) return hit;
        const page = await pageFrom(hit);
        event.waitUntil(storeFresh(cache));
        return page;
      }
      if (navigation) {
        try {
          const fresh = await fetch(req);
          if (fresh && fresh.ok) {
            const page = await pageFrom(fresh.clone());
            event.waitUntil(saveShell(cache, page.clone()));
            return page;
          }
        } catch {
          /* open the saved page */
        }
        const page = await cache.match("/", { ignoreSearch: true });
        if (page) return page;
        return new Response("", { status: 503 });
      }
      const fresh = await update();
      if (fresh) return fresh;
      if (navigation) {
        const page = await cache.match("/", { ignoreSearch: true });
        if (page) return page;
      }
      return new Response("", { status: 503 });
    })(),
  );
});
