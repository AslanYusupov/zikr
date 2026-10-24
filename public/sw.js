const SHELL = "zikr-shell-v2";

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
    url.pathname.startsWith("/__grok/") ||
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
      const update = fetch(req, { cache: "no-store" })
        .then((res) => {
          if (res.ok && !navigation) {
            stored(res.clone())
              .then((copy) => cache.put(new Request(url.pathname), copy))
              .catch(() => {});
          }
          return res;
        })
        .catch(() => null);
      if (hit) return hit;
      const fresh = await update;
      if (fresh) return fresh;
      if (navigation) {
        const page = await cache.match("/", { ignoreSearch: true });
        if (page) return page;
      }
      return new Response("", { status: 503 });
    })(),
  );
});
