const SHELL = "zikr-ok-v1";
const COPIES = [
  "https://cdn.jsdelivr.net/gh/AslanYusupov/zikr@release",
  "https://fastly.jsdelivr.net/gh/AslanYusupov/zikr@release",
  "https://gcore.jsdelivr.net/gh/AslanYusupov/zikr@release",
];

function clean(html) {
  return html.replace(/<script\b[^>]*\bsrc\s*=\s*["'][^"']*(?:grok\.com|grok-app-builder\/extensions\.js)[^"']*["'][^>]*>\s*<\/script>/gi, "");
}

function page(html) {
  return new Response(clean(html), { status: 200, headers: { "content-type": "text/html; charset=utf-8" } });
}

function stamp(html) {
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

function paths(html) {
  const out = [];
  const re = /\/assets\/[A-Za-z0-9._-]+\.(?:js|css)/g;
  let match;
  while ((match = re.exec(html))) {
    if (!out.includes(match[0])) out.push(match[0]);
  }
  return out;
}

async function textFrom(url, ms) {
  try {
    const res = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(ms) });
    if (!res.ok) return "";
    const html = await res.text();
    return html.includes("<html") && html.includes("/assets/") && html.includes("zikr-build") ? html : "";
  } catch {
    return "";
  }
}

async function fileFrom(url, ms) {
  try {
    const res = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(ms) });
    if (!res.ok) return null;
    const body = await res.arrayBuffer();
    if (body.byteLength < 50) return null;
    const headers = new Headers();
    const type = res.headers.get("content-type");
    if (type) headers.set("content-type", type);
    return new Response(body, { status: 200, headers });
  } catch {
    return null;
  }
}

async function ready(cache, html, base, alt) {
  const needed = paths(html);
  if (!needed.length) return "";
  await Promise.all(
    needed.map(async (src) => {
      if (await cache.match(src)) return;
      const file = (await fileFrom(base + src, 8000)) || (alt ? await fileFrom(alt + src, 8000) : null);
      if (file) await cache.put(src, file);
    }),
  );
  for (const src of needed) {
    if (!(await cache.match(src))) return "";
  }
  return clean(html);
}

async function fresh(cache) {
  const found = await Promise.all([
    textFrom(self.location.origin + "/?open=" + Date.now(), 2500).then((html) => ({ html, base: self.location.origin })),
    ...COPIES.map((base) => textFrom(base + "/index.html?v=" + Date.now(), 2500).then((html) => ({ html, base }))),
  ]);
  let best = { html: "", base: self.location.origin };
  for (const item of found) {
    if (!item.html) continue;
    if (!best.html || newer(stamp(item.html), stamp(best.html))) best = item;
  }
  if (!best.html) return "";
  const alt = best.base === self.location.origin ? COPIES[1] : self.location.origin;
  return ready(cache, best.html, best.base, alt);
}

let busy = false;
let audioOn = false;

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "zikr-audio") audioOn = Boolean(event.data.on);
});

async function offer(currentHtml, pending) {
  if (busy || !currentHtml) return;
  busy = true;
  try {
    const cache = await caches.open(SHELL);
    const next = pending || (await fresh(cache));
    const mark = stamp(next);
    if (!next || !mark || !newer(mark, stamp(currentHtml))) return;
    await cache.put("/index.html", page(next));
    await cache.put("/update-mark", new Response(mark));
    if (audioOn) return;
    const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    const nextUrl = new URL("/", self.location.origin);
    nextUrl.searchParams.set("v", mark);
    await Promise.all(
      windows.map((client) => {
        try {
          const here = new URL(client.url);
          if (here.searchParams.get("v") === mark) return Promise.resolve();
          return client.navigate(nextUrl.href).catch(() => undefined);
        } catch {
          return Promise.resolve();
        }
      }),
    );
  } catch {
    /* the open page stays */
  } finally {
    busy = false;
  }
}

function offline() {
  const html =
    "<!doctype html><html lang=\"ru\"><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>Зикр</title><body style=\"margin:0;background:#000;color:#f7f3ea;font:600 1rem/1.45 sans-serif;display:grid;min-height:100vh;place-items:center;text-align:center;padding:1.5rem\"><p>Откройте Зикр один раз, когда интернет есть. После этого он откроется и без VPN, и без сети.</p></body></html>";
  return page(html);
}

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith("zikr-shell-")).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
      .then(async () => {
        const cache = await caches.open(SHELL);
        const saved = await cache.match("/index.html");
        if (!saved) return;
        let html = "";
        try {
          html = await saved.text();
        } catch {
          html = "";
        }
        if (html) await offer(html);
      }),
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
        const saved = await cache.match("/index.html");
        if (saved) {
          let html = "";
          try {
            html = await saved.clone().text();
          } catch {
            html = "";
          }
          const needed = paths(html);
          let ok = needed.length > 0 && html.includes("zikr-build");
          for (const src of needed) {
            if (!(await cache.match(src))) ok = false;
          }
          if (ok) {
            const pending = fresh(cache);
            let quick = "";
            try {
              quick = await Promise.race([
                pending,
                new Promise((resolve) => setTimeout(() => resolve(""), 700)),
              ]);
            } catch {
              quick = "";
            }
            if (quick && newer(stamp(quick), stamp(html))) {
              await cache.put("/index.html", page(quick));
              await cache.put("/update-shown", new Response(stamp(quick)));
              return page(quick);
            }
            event.waitUntil(offer(html, pending));
            return page(html);
          }
        }
        const html = await fresh(cache);
        if (html) {
          const res = page(html);
          await cache.put("/index.html", res.clone());
          return res;
        }
        if (saved) return saved;
        return offline();
      }
      const hit = await cache.match(url.pathname);
      if (hit) return hit;
      const own = await fileFrom(url.pathname, 4000);
      const file = own || (await fileFrom(COPIES[1] + url.pathname, 6000)) || (await fileFrom(COPIES[0] + url.pathname, 6000));
      if (!file) return new Response("", { status: 504 });
      await cache.put(url.pathname, file.clone());
      return file;
    })(),
  );
});
