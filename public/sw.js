const SHELL = "zikr-shell-v1";

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

function keep(url) {
  return (
    url.pathname === "/" ||
    url.pathname.startsWith("/assets/") ||
    url.pathname.startsWith("/fonts/") ||
    url.pathname === "/favicon.svg" ||
    url.pathname === "/orbit-sun.webp" ||
    url.pathname === "/orbit-moon.webp" ||
    /\.(?:js|css|woff2)$/.test(url.pathname)
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
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/_server")) return;

  const navigation = req.mode === "navigate" || req.destination === "document";
  if (!navigation && !keep(url)) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(SHELL);
      const hit = navigation ? await cache.match("/") : await cache.match(req);
      const update = fetch(req, { cache: "no-store" })
        .then((res) => {
          if (res.ok) cache.put(navigation ? "/" : req, res.clone()).catch(() => {});
          return res;
        })
        .catch(() => null);
      if (hit) return hit;
      const fresh = await update;
      if (fresh) return fresh;
      return new Response("", { status: 503 });
    })(),
  );
});
