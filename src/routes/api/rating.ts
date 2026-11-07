import { createFileRoute } from "@tanstack/react-router";
import { beatPresence, presenceBoard, publishWorld, worldBoard } from "@/lib/zikr/api";

const noStore = { "cache-control": "no-store" };

export const Route = createFileRoute("/api/rating")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const publicId = url.searchParams.get("id") ?? "";
        const dayKey = url.searchParams.get("day") ?? "";
        if (!/^\d{8}$/.test(publicId) || !/^\d{4}-\d{2}-\d{2}$/.test(dayKey)) {
          return Response.json({ ok: false }, { status: 400, headers: noStore });
        }
        try {
          const [world, live] = await Promise.all([
            worldBoard({ data: { publicId, dayKey } }),
            presenceBoard({ data: { publicId, dayKey } }),
          ]);
          return Response.json(
            {
              ok: true,
              rows: world.rows,
              mine: world.mine,
              live: live.live,
              daily: live.daily,
              remembering: live.remembering,
              allTaps: live.allTaps,
              dailyRank: live.dailyRank,
            },
            { headers: noStore },
          );
        } catch (err) {
          const message = err instanceof Error ? err.message : "rating";
          return Response.json({ ok: false, error: message }, { status: 500, headers: noStore });
        }
      },
      POST: async ({ request }) => {
        let raw: unknown;
        try {
          raw = await request.json();
        } catch {
          return Response.json({ ok: false }, { status: 400, headers: noStore });
        }
        const body = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
        const publicId = typeof body.publicId === "string" ? body.publicId : "";
        const dayKey = typeof body.dayKey === "string" ? body.dayKey : "";
        const total = typeof body.total === "number" ? Math.floor(body.total) : -1;
        const dayTotal = typeof body.dayTotal === "number" ? Math.floor(body.dayTotal) : -1;
        const xp = typeof body.xp === "number" ? Math.floor(body.xp) : -1;
        const country = typeof body.country === "string" ? body.country.slice(0, 4) : "";
        if (!/^\d{8}$/.test(publicId) || !/^\d{4}-\d{2}-\d{2}$/.test(dayKey) || total < 0 || dayTotal < 0 || xp < 0) {
          return Response.json({ ok: false }, { status: 400, headers: noStore });
        }
        try {
          const invitedBy = typeof body.invitedBy === "string" && /^\d{8}$/.test(body.invitedBy) ? body.invitedBy : undefined;
          const saved = await publishWorld({
            data: { publicId, total, listed: body.listed !== false, ...(invitedBy ? { invitedBy } : {}) },
          });
          const beat = await beatPresence({
            data: {
              publicId,
              country,
              dayKey,
              dayTotal,
              xp,
              total,
              tapSince: typeof body.tapSince === "number" ? Math.floor(body.tapSince) : 0,
              listed: body.listed !== false,
              replaceDay: body.replaceDay === true,
            },
          });
          if (!saved.ok || !beat.ok) return Response.json({ ok: false }, { status: 500, headers: noStore });
          return Response.json({ ok: true }, { headers: noStore });
        } catch (err) {
          const message = err instanceof Error ? err.message : "rating";
          return Response.json({ ok: false, error: message }, { status: 500, headers: noStore });
        }
      },
    },
  },
});
