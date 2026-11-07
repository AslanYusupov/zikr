import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";
import { addCloneTapsOnce } from "@/lib/zikr/api";

const noStore = { "cache-control": "no-store" };
const FOLDED: Record<string, string> = {
  "88880455": "96995742",
  "62012303": "87278839",
  "25574036": "52812946",
  "50170262": "52812946",
  "79475757": "52812946",
  "82261249": "52812946",
};

function realId(id: string) {
  return FOLDED[id] ?? id;
}

export const Route = createFileRoute("/api/rating")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const rawId = url.searchParams.get("id") ?? "";
        const dayKey = url.searchParams.get("day") ?? "";
        if (!/^\d{8}$/.test(rawId) || !/^\d{4}-\d{2}-\d{2}$/.test(dayKey)) {
          return Response.json({ ok: false }, { status: 400, headers: noStore });
        }
        try {
          const sql = await getSql();
          await addCloneTapsOnce(sql);
          const publicId = realId(rawId);
          const [rows, self, live, daily, together, online, dailyAhead, worldAhead] = await Promise.all([
            sql<{ public_id: string; total: number; concealed: boolean | null; day_key: string | null; day_total: number | null }>`
              select w.public_id, w.total,
                p.concealed, p.day_key, p.day_total
              from zikr_world w
              left join zikr_presence p on p.public_id = w.public_id
              where w.total > 0
              order by w.total desc, w.public_id asc
              limit 100`,
            sql<{ total: number; concealed: boolean | null; day_key: string | null; day_total: number | null }>`
              select w.total, p.concealed, p.day_key, p.day_total
              from zikr_world w
              left join zikr_presence p on p.public_id = w.public_id
              where w.public_id = ${publicId}`,
            sql<{ public_id: string; country: string; day_total: number; concealed: boolean | null }>`
              select public_id, country, day_total, concealed
              from zikr_presence
              where last_tap_at > now() - interval '30 seconds' and day_total > 0
              order by day_total desc, public_id asc
              limit 20`,
            sql<{ public_id: string; country: string; day_total: number; concealed: boolean | null }>`
              select public_id, country, day_total, concealed
              from zikr_presence
              where day_key = ${dayKey} and day_total > 0
              order by day_total desc, public_id asc
              limit 10`,
            sql<{ n: string | number }>`select coalesce(sum(total), 0) as n from zikr_world`,
            sql<{ n: number }>`select count(*)::int as n from zikr_presence where seen_at > now() - interval '2 minutes'`,
            sql<{ n: number }>`
              select count(*)::int as n from zikr_presence
              where day_key = ${dayKey} and day_total > coalesce((select day_total from zikr_presence where public_id = ${publicId} and day_key = ${dayKey}), 0)`,
            sql<{ n: number }>`
              select count(*)::int as n from zikr_world
              where total > coalesce((select total from zikr_world where public_id = ${publicId}), 0)`,
          ]);
          const open = (concealed: boolean | null, day: string | null, dayTotal: number | null) =>
            !concealed || (day === dayKey && (dayTotal ?? 0) >= 10000);
          const me = self[0];
          const mineOpen = me ? open(me.concealed, me.day_key, me.day_total) : false;
          const meDaily = daily.find((row) => row.public_id === publicId);
          return Response.json(
            {
              ok: true,
              rows: rows.map((row, index) => {
                const shown = open(row.concealed, row.day_key, row.day_total);
                return { id: row.public_id, total: shown ? row.total : 0, rank: index + 1, ...(shown ? {} : { hidden: true }) };
              }),
              mine: me ? { total: mineOpen ? me.total : 0, rank: (worldAhead[0]?.n ?? 0) + 1, ...(mineOpen ? {} : { hidden: true }) } : null,
              live: live.map((row, index) => {
                const shown = open(row.concealed, dayKey, row.day_total);
                return { id: row.public_id, country: row.country, value: shown ? row.day_total : 0, rank: index + 1, ...(shown ? {} : { hidden: true }) };
              }),
              daily: daily.map((row, index) => {
                const shown = open(row.concealed, dayKey, row.day_total);
                return { id: row.public_id, country: row.country, value: shown ? row.day_total : 0, rank: index + 1, ...(shown ? {} : { hidden: true }) };
              }),
              remembering: online[0]?.n ?? 0,
              allTaps: Math.max(0, Math.floor(Number(together[0]?.n ?? 0))),
              dailyRank: meDaily && meDaily.day_total > 0 ? (dailyAhead[0]?.n ?? 0) + 1 : null,
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
        const publicId = realId(typeof body.publicId === "string" ? body.publicId : "");
        const dayKey = typeof body.dayKey === "string" ? body.dayKey : "";
        const total = typeof body.total === "number" ? Math.floor(body.total) : -1;
        const dayTotal = typeof body.dayTotal === "number" ? Math.floor(body.dayTotal) : -1;
        const xp = typeof body.xp === "number" ? Math.floor(body.xp) : -1;
        const country = typeof body.country === "string" ? body.country.slice(0, 4) : "";
        if (!/^\d{8}$/.test(publicId) || !/^\d{4}-\d{2}-\d{2}$/.test(dayKey) || total < 0 || dayTotal < 0 || xp < 0) {
          return Response.json({ ok: false }, { status: 400, headers: noStore });
        }
        try {
          const sql = await getSql();
          const concealed = body.listed === false;
          const replaceDay = body.replaceDay === true;
          if (total > 0) {
            await sql`
              insert into zikr_world (public_id, total)
              values (${publicId}, ${total})
              on conflict (public_id) do update
              set total = greatest(zikr_world.total, excluded.total),
                  updated_at = now()`;
          }
          await sql`
            insert into zikr_presence (public_id, country, day_key, day_total, xp, total, seen_at, last_tap_at, concealed)
            values (${publicId}, ${country}, ${dayKey}, ${dayTotal}, ${xp}, ${total}, now(), now(), ${concealed})
            on conflict (public_id) do update set
              country = excluded.country,
              day_key = excluded.day_key,
              day_total = case
                when ${replaceDay} then excluded.day_total
                else greatest(case when zikr_presence.day_key = excluded.day_key then zikr_presence.day_total else 0 end, excluded.day_total)
              end,
              xp = greatest(zikr_presence.xp, excluded.xp),
              total = greatest(zikr_presence.total, excluded.total),
              seen_at = now(),
              last_tap_at = now(),
              concealed = excluded.concealed`;
          const invitedBy = typeof body.invitedBy === "string" ? realId(body.invitedBy) : "";
          if (/^\d{8}$/.test(invitedBy) && invitedBy !== publicId && total > 0) {
            await sql`
              insert into zikr_invites (guest_id, host_id, total)
              values (${publicId}, ${invitedBy}, ${total})
              on conflict (guest_id) do update
              set total = greatest(zikr_invites.total, excluded.total),
                  updated_at = now()
              where zikr_invites.host_id = excluded.host_id`;
          }
          return Response.json({ ok: true }, { headers: noStore });
        } catch (err) {
          const message = err instanceof Error ? err.message : "rating";
          return Response.json({ ok: false, error: message }, { status: 500, headers: noStore });
        }
      },
    },
  },
});
