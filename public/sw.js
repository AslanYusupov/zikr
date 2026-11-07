const SHELL = "zikr-ok-v1";

function clean(html) {
  return html.replace(/<script\b[^>]*\bsrc\s*=\s*["'][^"']*(?:grok\.com|grok-app-builder\/extensions\.js)[^"']*["'][^>]*>\s*<\/script>/gi, "");
}

function page(html) {
  return new Response(clean(html), { status: 200, headers: { "content-type": "text/html; charset=utf-8" } });
}

async function siteHtml() {
  try {
    const res = await fetch(self.location.origin + "/?open=" + Date.now(), {
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return "";
    const html = await res.text();
    return html.includes("<html") && html.includes("/assets/") && html.includes("zikr-build") ? clean(html) : "";
  } catch {
    return "";
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
  event.waitUntil(self.clients.claim());
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
  if (url.pathname === "/sw.js" || url.pathname.startsWith("/api/") || url.pathname.startsWith("/_server") || url.pathname.startsWith("/auth/")) return;
  if (url.searchParams.has("open") || url.searchParams.has("warm") || url.searchParams.has("probe")) return;
  const navigation = req.mode === "navigate" || req.destination === "document";
  if (!keep(url) && !navigation) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(SHELL);
      if (navigation) {
        const saved = await cache.match("/index.html");
        const refresh = siteHtml().then(async (html) => {
          if (!html) return;
          const next = (html.match(/name="zikr-build"[^>]*content="([^"]+)"/) || html.match(/content="([^"]+)"[^>]*name="zikr-build"/) || [])[1] || "";
          const prev = saved ? ((await saved.clone().text()).match(/name="zikr-build"[^>]*content="([^"]+)"/) || [])[1] || "" : "";
          if (!next || next === prev) return;
          await cache.put("/index.html", page(html));
          const open = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
          for (const client of open) client.postMessage({ type: "zikr-reload", build: next });
        }).catch(() => undefined);
        try {
          event.waitUntil(refresh);
        } catch {
          /* the saved page still opens */
        }
        if (saved) return saved;
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
        const res = await fetch(url.pathname, { cache: "no-store", signal: AbortSignal.timeout(8000) });
        if (!res.ok) return hit || new Response("", { status: 504 });
        await cache.put(url.pathname, res.clone());
        return res;
      } catch {
        return hit || new Response("", { status: 504 });
      }
    })(),
  );
});
