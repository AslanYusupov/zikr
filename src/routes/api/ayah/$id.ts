import { createFileRoute } from "@tanstack/react-router";
import { parseAyahFile, remoteAyahUrls } from "@/lib/zikr/ayah-audio";

async function pull(url: string) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000), redirect: "follow" });
    if (!res.ok || !res.body) return null;
    const type = res.headers.get("content-type") ?? "";
    if (type && !/audio|mpeg|octet-stream/i.test(type)) return null;
    return res;
  } catch {
    return null;
  }
}

export const Route = createFileRoute("/api/ayah/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const parsed = parseAyahFile(params.id);
        if (!parsed) return new Response("Not found", { status: 404 });
        for (const url of remoteAyahUrls(parsed.surah, parsed.ayah)) {
          const upstream = await pull(url);
          if (!upstream) continue;
          return new Response(upstream.body, {
            headers: {
              "Content-Type": "audio/mpeg",
              "Cache-Control": "public, max-age=31536000, immutable",
            },
          });
        }
        return new Response("Not found", { status: 404 });
      },
    },
  },
});
