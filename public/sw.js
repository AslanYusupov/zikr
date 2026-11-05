const SHELL = "zikr-shell-v4";
const GITHUB = "https://cdn.jsdelivr.net/gh/AslanYusupov/zikr@release";

function clean(html) {
  return html.replace(/<script\b[^>]*\bsrc\s*=\s*["'][^"']*(?:grok\.com|grok-app-builder\/extensions\.js)[^"']*["'][^>]*>\s*<\/script>/gi, "");
}

function page(html) {
  return new Response(html, { status: 200, headers: { "content-type": "text/html; charset=utf-8" } });
}

function fromGithub(html) {
  return clean(html).replace(/(href|src)=("|')\/(?!\/)/g, `$1=$2${GITHUB}/`);
}

async function textFrom(url, ms) {
  try {
    const res = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(ms) });
    if (!res.ok) return "";
    const html = await res.text();
    return html.includes("<html") && html.includes("/assets/") ? html : "";
  } catch {
    return "";
  }
}

async function fileFrom(url, ms) {
  try {
    const res = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(ms) });
    return res.ok ? res : null;
  } catch {
    return null;
  }
}

function stored(res) {
  const headers = new Headers();
  const type = res.headers.get("content-type");
  if (type) headers.set("content-type", type);
  return res.blob().then((body) => new Response(body, { status: 200, headers }));
}

function offlinePage() {
  const html = "<!doctype html><html lang=\"ru\"><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>Зикр</title><body style=\"margin:0;background:#000;color:#f7f3ea;font:600 1rem/1.45 sans-serif;display:grid;min-height:100vh;place-items:center;text-align:center;padding:1.5rem\"><p>Зикр откроется, когда появится связь. Закройте его и откройте ещё раз.</p></body></html>";
  return page(html);
}

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== SHELL).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
      .then(() => self.clients.matchAll({ type: "window", includeUncontrolled: true }))
      .then((windows) => Promise.all(windows.map((client) => client.navigate(client.url).catch(() => undefined)))),
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
        if (saved) return saved;
        const own = await textFrom("/?open=" + Date.now(), 4000);
        if (own) {
          const ready = page(clean(own));
          event.waitUntil(cache.put("/", ready.clone()));
          return ready;
        }
        const copy = await textFrom(GITHUB + "/index.html?v=" + Math.floor(Date.now() / 3600000), 6000);
        if (copy) {
          const ready = page(fromGithub(copy));
          event.waitUntil(cache.put("/", ready.clone()));
          return ready;
        }
        return offlinePage();
      }
      const hit = await cache.match(url.pathname);
      if (hit) return hit;
      const own = await fileFrom(url.pathname, 4000);
      const file = own || (await fileFrom(GITHUB + url.pathname, 6000));
      if (!file) return new Response("", { status: 504 });
      const copy = await stored(file);
      event.waitUntil(cache.put(url.pathname, copy.clone()).catch(() => {}));
      return copy;
    })(),
  );
});
