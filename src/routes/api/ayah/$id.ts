import { createFileRoute } from "@tanstack/react-router";
import { parseAyahFile, remoteAyahUrls } from "@/lib/zikr/ayah-audio";
import { QURAN_AUDIO_PACK, QURAN_AUDIO_SPAN } from "@/lib/zikr/quran-audio-pack";

function audioResponse(body: ReadableStream<Uint8Array> | null, size: number) {
  const headers = new Headers({
    "Content-Type": "audio/mpeg",
    "Cache-Control": "public, max-age=31536000, immutable",
    "Accept-Ranges": "bytes",
  });
  if (size > 0) headers.set("Content-Length", String(size));
  return new Response(body, { headers });
}

async function fromPack(file: string) {
  const span = QURAN_AUDIO_SPAN[file];
  if (!span) return null;
  const [start, size] = span;
  const end = start + size - 1;
  try {
    const res = await fetch(QURAN_AUDIO_PACK, {
      headers: { Range: `bytes=${start}-${end}`, "User-Agent": "Zikr" },
      signal: AbortSignal.timeout(12000),
      redirect: "follow",
    });
    if (!res.ok && res.status !== 206) return null;
    const got = Number(res.headers.get("content-length") || 0);
    if (!res.body || got <= 0 || got > size + 64) {
      await res.body?.cancel();
      return null;
    }
    return audioResponse(res.body, got);
  } catch {
    return null;
  }
}

async function fromRemote(surah: number, ayah: number) {
  for (const url of remoteAyahUrls(surah, ayah)) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(8000), redirect: "follow" });
      if (!res.ok || !res.body) continue;
      const type = res.headers.get("content-type") ?? "";
      if (type && !/audio|mpeg|octet-stream/i.test(type)) continue;
      const size = Number(res.headers.get("content-length") || 0);
      return audioResponse(res.body, size || 0);
    } catch {
      /* try the next copy */
    }
  }
  return null;
}

export const Route = createFileRoute("/api/ayah/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const parsed = parseAyahFile(params.id);
        if (!parsed) return new Response("Not found", { status: 404 });
        const own = await fromPack(params.id);
        if (own) return own;
        const remote = await fromRemote(parsed.surah, parsed.ayah);
        if (remote) return remote;
        return new Response("Not found", { status: 404 });
      },
    },
  },
});
