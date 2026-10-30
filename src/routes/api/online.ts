import { createFileRoute } from "@tanstack/react-router";
import { rememberingNow } from "@/lib/zikr/api";

export const Route = createFileRoute("/api/online")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const id = new URL(request.url).searchParams.get("id") ?? "";
        const headers = { "cache-control": "no-store" };
        try {
          const online = await rememberingNow(/^\d{8}$/.test(id) ? id : undefined);
          return Response.json({ online }, { headers });
        } catch {
          return Response.json({ online: null }, { status: 200, headers });
        }
      },
    },
  },
});
