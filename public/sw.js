const SHELL = "zikr-ok-v1";
let audioOn = false;

function clean(html) {
  return html
    .replace(/<script\b[^>]*\bsrc\s*=\s*["'][^"']*(?:grok\.com|grok-app-builder\/extensions\.js)[^"']*["'][^>]*>\s*<\/script>/gi, "")
    .replace(/<link\b[^>]*href=["']\/__grok\/manifest\.webmanifest["'][^>]*>/gi, "")
    .replace(/<link\b[^>]*href=["']\/__grok\/icon-180\.png["'][^>]*>/gi, "");
}

function page(html) {
  return new Response(clean(html), { status: 200, headers: { "content-type": "text/html; charset=utf-8" } });
}

function stampOf(html) {
  return (html.match(/name="zikr-build"[^>]*content="([^"]+)"/) || html.match(/content="([^"]+)"[^>]*name="zikr-build"/) || [])[1] || "";
}

async function siteHtml() {
  try {
    const res = await fetch(self.location.origin + "/?open=" + Date.now(), {
      cache: "no-store",
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) return "";
    const html = await res.text();
    return html.includes("<html") && html.includes("/assets/") && html.includes("zikr-build") ? clean(html) : "";
  } catch {
    return "";
  }
}

async function savedStamp(cache) {
  const saved = await cache.match("/index.html");
  if (!saved) return "";
  try {
    return stampOf(await saved.text());
  } catch {
    return "";
  }
}

/** Save the new page only after its scripts are stored, so Android does not open a blank screen. */
async function storeFresh(html) {
  const next = stampOf(html);
  if (!next) return "";
  const cache = await caches.open(SHELL);
  if ((await savedStamp(cache)) === next) return "";
  const assets = [...new Set([...html.matchAll(/\/assets\/[A-Za-z0-9._-]+\.(?:js|css)/g)].map((match) => match[0]))];
  const missing = [];
  for (const src of assets) {
    if (!(await cache.match(src))) missing.push(src);
  }
  try {
    await Promise.all(
      missing.map(async (src) => {
        const res = await fetch(self.location.origin + src + "?open=" + Date.now(), {
          cache: "no-store",
          signal: AbortSignal.timeout(20000),
        });
        if (!res.ok) throw new Error("miss");
        await cache.put(src, res.clone());
      }),
    );
  } catch {
    return "";
  }
  await cache.put("/index.html", page(html));
  return next;
}

async function openFresh(mark) {
  if (!mark) return;
  const open = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
  for (const client of open) {
    client.postMessage({ type: "zikr-update", build: mark });
  }
}

function offline() {
  const html =
    "<!doctype html><html lang=\"ru\"><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>Зикр</title><body style=\"margin:0;background:#000;color:#f7f3ea;font:600 1rem/1.45 sans-serif;display:grid;min-height:100vh;place-items:center;text-align:center;padding:1.5rem\"><p>Откройте Зикр один раз, когда интернет есть. После этого он откроется и без VPN, и без сети.</p></body></html>";
  return page(html);
}

let lastLook = 0;

async function watch() {
  const now = Date.now();
  if (now - lastLook < 15000) return;
  lastLook = now;
  const html = await siteHtml();
  const mark = html ? await storeFresh(html) : "";
  if (mark) await openFresh(mark);
}

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "zikr-audio") {
    audioOn = !!event.data.on;
    event.waitUntil(watch());
  }
});

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    await self.clients.claim();
    const html = await siteHtml();
    const mark = html ? await storeFresh(html) : "";
    if (mark) await openFresh(mark);
  })());
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

function pass(req) {
  const fail = () => new Response("", { status: 503, headers: { "cache-control": "no-store" } });
  if (req.method === "GET" || req.method === "HEAD") return fetch(req).catch(fail);
  return req
    .text()
    .then((body) =>
      fetch(req.url, {
        method: req.method,
        headers: req.headers,
        body,
        credentials: "same-origin",
        cache: "no-store",
      }),
    )
    .catch(fail);
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  let url;
  try {
    url = new URL(req.url);
  } catch {
    return;
  }
  if (url.origin !== self.location.origin) return;
  const api = url.pathname.startsWith("/api/") || url.pathname.startsWith("/_server") || url.pathname.startsWith("/auth/");
  if (req.method !== "GET") {
    if (api) event.respondWith(pass(req));
    return;
  }
  // Safari leaves the page waiting forever if the worker sees a request and does not answer.
  if (
    url.pathname === "/sw.js" ||
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/_server") ||
    url.pathname.startsWith("/auth/") ||
    url.searchParams.has("open") ||
    url.searchParams.has("warm") ||
    url.searchParams.has("probe")
  ) {
    if (url.pathname !== "/sw.js") event.respondWith(pass(req));
    return;
  }
  const navigation = req.mode === "navigate" || req.destination === "document";
  if (!keep(url) && !navigation) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(SHELL);
      if (navigation) {
        const saved = await cache.match("/index.html");
        const refresh = siteHtml()
          .then(async (html) => {
            const mark = html ? await storeFresh(html) : "";
            if (mark) await openFresh(mark);
          })
          .catch(() => undefined);
        try {
          event.waitUntil(refresh);
        } catch {
          /* the saved page still opens */
        }
        if (saved) {
          try {
            return page(await saved.clone().text());
          } catch {
            return saved;
          }
        }
        const html = await siteHtml();
        if (html) {
          await cache.put("/index.html", page(html));
          return page(html);
        }
        return offline();
      }
      const hit = await cache.match(url.pathname);
      if (hit) return hit;
      try {
        const res = await fetch(url.pathname, { cache: "no-store", signal: AbortSignal.timeout(20000) });
        if (!res.ok) return hit || new Response("", { status: 504 });
        await cache.put(url.pathname, res.clone());
        return res;
      } catch {
        return hit || new Response("", { status: 504 });
      }
    })(),
  );
});
