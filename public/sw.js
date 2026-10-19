const SHELL = "zikr-shell-v1";

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

function timed(ms) {
  const control = new AbortController();
  const timer = setTimeout(() => control.abort(), ms);
  return { signal: control.signal, clear: () => clearTimeout(timer) };
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
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/_server")) return;
  if (url.searchParams.has("probe")) return;

  const navigation = req.mode === "navigate" || req.destination === "document";
  const asset =
    url.pathname.startsWith("/assets/") ||
    url.pathname.startsWith("/fonts/") ||
    url.pathname.startsWith("/quran") ||
    /\.(?:js|css|woff2|webp|svg|png|jpe?g|json)$/.test(url.pathname);

  if (!navigation && !asset && url.pathname !== "/") return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(SHELL);
      if (!navigation) {
        const hit = await cache.match(req);
        const net = fetch(req)
          .then((res) => {
            if (res.ok) cache.put(req, res.clone()).catch(() => {});
            return res;
          })
          .catch(() => null);
        if (hit) return hit;
        const fresh = await net;
        if (fresh) return fresh;
        return new Response("", { status: 504 });
      }
      const wait = timed(8000);
      try {
        const fresh = await fetch(req, { signal: wait.signal });
        wait.clear();
        if (fresh.ok) cache.put("/", fresh.clone()).catch(() => {});
        return fresh;
      } catch {
        wait.clear();
        const hit = (await cache.match(req)) || (await cache.match("/"));
        if (hit) return hit;
        return fetch(req);
      }
    })(),
  );
});
