import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { levelFromXp } from "@/lib/zikr/levels";

const SaveInput = z.object({
  displayName: z.string().max(24),
  publicBoard: z.boolean(),
  total: z.number().int().min(0).max(5_000_000),
  bestDay: z.number().int().min(0).max(1_000_000),
  inviteCodeToApply: z.string().max(12).optional(),
  payload: z.string().max(180_000).refine((s) => {
    try {
      const v = JSON.parse(s) as unknown;
      return !!v && typeof v === "object";
    } catch {
      return false;
    }
  }),
});

export type BoardRow = { name: string; total: number; level: number; mine: boolean };

export type CloudMeta = {
  inviteCode: string;
  displayName: string;
  chainPeople: number;
  chainDhikr: number;
  rank: number | null;
  total: number;
  level: number;
  publicBoard: boolean;
};

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function makeCode(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
}

function boardNumber(payload: string): string {
  try {
    const id = (JSON.parse(payload) as { publicId?: unknown }).publicId;
    if (typeof id === "string" && /^\d{8}$/.test(id)) return id;
  } catch {
    /* the saved copy can be old */
  }
  return "";
}

async function metaFor(userId: string): Promise<CloudMeta | null> {
  const sql = await getSql();
  const rows = await sql<{
    display_name: string;
    invite_code: string;
    total: number;
    level: number;
    public_board: boolean;
  }>`select display_name, invite_code, total, level, public_board from zikr_saves where user_id = ${userId}`;
  const row = rows[0];
  if (!row) return null;
  const chain = await sql<{ people: number; dhikr: number }>`
    select count(*)::int as people, coalesce(sum(total), 0)::int as dhikr
    from zikr_saves where invited_by = ${userId}`;
  const ahead = await sql<{ n: number }>`
    select count(*)::int as n from zikr_saves
    where public_board = true and total > ${row.total}`;
  const rank = row.public_board && row.total > 0 ? (ahead[0]?.n ?? 0) + 1 : null;
  return {
    inviteCode: row.invite_code,
    displayName: row.display_name,
    chainPeople: chain[0]?.people ?? 0,
    chainDhikr: chain[0]?.dhikr ?? 0,
    rank,
    total: row.total,
    level: row.level,
    publicBoard: row.public_board,
  };
}

/** Keep the previous public rating. Mistaken numbers are removed and not written back. */
const DROPPED_RATING_IDS = ["89020984", "389020984", "31549154", "88880455", "62012303", "60912327"];
/** A second number made on the same account. Counts stay on the first number. */
const FOLDED_IDS: Record<string, string> = { "88880455": "96995742", "62012303": "87278839" };

function realPublicId(id: string): string {
  return FOLDED_IDS[id] ?? id;
}

async function foldCloneNumbers(sql: Awaited<ReturnType<typeof getSql>>) {
  for (const [clone, real] of Object.entries(FOLDED_IDS)) {
    const from = `"publicId":"${clone}"`;
    const to = `"publicId":"${real}"`;
    const like = `%${from}%`;
    const steps: [string, unknown[]][] = [
      [
        `insert into zikr_world (public_id, total)
       select $1, total from zikr_world where public_id = $2
       on conflict (public_id) do update
       set total = greatest(zikr_world.total, excluded.total), updated_at = now()`,
        [real, clone],
      ],
      [`update zikr_invites set host_id = $1 where host_id = $2`, [real, clone]],
      [
        `update zikr_invites set guest_id = $1 where guest_id = $2
       and not exists (select 1 from zikr_invites kept where kept.guest_id = $1)`,
        [real, clone],
      ],
      [
        `update zikr_device
       set public_id = case when public_id = $1 then $2 else public_id end,
           payload = replace(payload, $3, $4)
       where public_id = $1 or payload like $5`,
        [clone, real, from, to, like],
      ],
      [
        `update zikr_saves
       set display_name = case when display_name = $1 then $2 else display_name end,
           payload = replace(payload, $3, $4)
       where display_name = $1 or payload like $5`,
        [clone, real, from, to, like],
      ],
    ];
    for (const [text, params] of steps) {
      try {
        await sql.query(text, params);
      } catch (err) {
        console.error("[zikr] fold rating", err);
      }
    }
  }
}

async function dropRemovedRating(sql: Awaited<ReturnType<typeof getSql>>) {
  await foldCloneNumbers(sql);
  const steps = [
    "delete from zikr_world where public_id = $1",
    "delete from zikr_presence where public_id = $1",
    "delete from zikr_invites where guest_id = $1 or host_id = $1",
  ];
  for (const id of DROPPED_RATING_IDS) {
    for (const text of steps) {
      try {
        await sql.query(text, [id]);
      } catch (err) {
        console.error("[zikr] drop rating", err);
      }
    }
  }
}

async function keepOldRating(sql: Awaited<ReturnType<typeof getSql>>) {
  const steps = [
    `create table if not exists zikr_world (
      public_id text primary key,
      total integer not null default 0,
      updated_at timestamptz not null default now()
    )`,
    `create table if not exists zikr_presence (
      public_id text primary key,
      country text not null default '',
      day_key text not null default '',
      day_total integer not null default 0,
      xp integer not null default 0,
      total integer not null default 0,
      seen_at timestamptz not null default now()
    )`,
    `alter table zikr_presence add column if not exists tap_since timestamptz`,
    `alter table zikr_presence add column if not exists last_tap_at timestamptz`,
    `create table if not exists zikr_invites (
      guest_id text primary key,
      host_id text not null,
      total integer not null default 0,
      updated_at timestamptz not null default now()
    )`,
    `insert into zikr_presence (public_id, country, day_key, day_total, xp, total, seen_at)
     select public_id, '', '', 0, total, total, updated_at from zikr_world
     on conflict (public_id) do update set
       total = greatest(zikr_presence.total, excluded.total),
       xp = greatest(zikr_presence.xp, excluded.xp)`,
  ];
  for (const text of steps) {
    try {
      await sql.query(text);
    } catch (err) {
      console.error("[zikr] keep rating", err);
    }
  }
  await dropRemovedRating(sql);
}

/** Grok rating showed these hasanat. Stored count is that number divided by 10. */
const GROK_RATING_BONUS: Record<string, number> = {
  "87278839": 55853,
  "94477029": 104373,
};

function withGrokBonus(id: string, taps: number): number {
  return taps + (GROK_RATING_BONUS[id] ?? 0);
}

async function liftGrokBonus(sql: Awaited<ReturnType<typeof getSql>>) {
  for (const [id, extra] of Object.entries(GROK_RATING_BONUS)) {
    try {
      await sql`
        insert into zikr_world (public_id, total)
        values (${id}, ${extra})
        on conflict (public_id) do update
        set total = zikr_world.total + ${extra}, updated_at = now()
        where zikr_world.total < ${extra}`;
    } catch (err) {
      console.error("[zikr] grok bonus", err);
    }
  }
}
async function tapsOnlyBoard(sql: Awaited<ReturnType<typeof getSql>>) {
  const id = "94477029";
  try {
    const rows = await sql<{ payload: string }>`
      select payload from zikr_device where public_id = ${id} and payload like '{%'`;
    let taps = -1;
    for (const row of rows) {
      try {
        const n = Math.floor(Number((JSON.parse(row.payload) as { total?: unknown }).total));
        if (Number.isFinite(n) && n > taps) taps = n;
      } catch {
        /* a broken copy must not change her place */
      }
    }
    if (taps < 0) return;
    const shown = withGrokBonus(id, taps);
    await sql`update zikr_world set total = ${shown}, updated_at = now() where public_id = ${id}`;
    await sql`
      update zikr_presence
      set total = ${taps}, xp = ${taps * 10}
      where public_id = ${id}`;
  } catch (err) {
    console.error("[zikr] taps only", err);
  }
}

/** Mom opened the invite. Keep her under that code even if the first visit missed it. */
async function keepKnownInvites(sql: Awaited<ReturnType<typeof getSql>>) {
  const guest = "94477029";
  const host = "87278839";
  try {
    const world = await sql<{ total: number }>`select total from zikr_world where public_id = ${guest}`;
    const total = world[0]?.total ?? 0;
    await sql`
      insert into zikr_invites (guest_id, host_id, total)
      values (${guest}, ${host}, ${total})
      on conflict (guest_id) do update
      set host_id = ${host},
          total = greatest(zikr_invites.total, ${total}),
          updated_at = now()`;
  } catch (err) {
    console.error("[zikr] known invite", err);
  }
}

export const onlineNow = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const sql = await getSql();
    await keepOldRating(sql);
    const online = await sql<{ n: number }>`
      select count(*)::int as n from zikr_presence where seen_at > now() - interval '90 seconds'`;
    return { online: online[0]?.n ?? 0 };
  } catch (err) {
    console.error("[zikr] online", err);
    return { online: 0 };
  }
});

export const loadSave = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<{ payload: string }>`select payload from zikr_saves where user_id = ${context.userId}`;
    const meta = await metaFor(context.userId);
    return { payload: rows[0]?.payload ?? null, meta };
  });

export const pushSave = createServerFn({ method: "POST" })
  .validator((raw: unknown) => SaveInput.parse(raw))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const userId = context.userId;
    const number = boardNumber(data.payload);
    const level = levelFromXp(data.total).level;
    const existing = await sql<{ invite_code: string; display_name: string }>`
      select invite_code, display_name from zikr_saves where user_id = ${userId}`;
    if (existing[0]) {
      const shown = number || existing[0].display_name.replace(/\D/g, "").slice(0, 8);
      await sql`
        update zikr_saves set
          display_name = ${shown},
          total = ${data.total},
          level = ${level},
          best_day = ${data.bestDay},
          public_board = ${data.publicBoard},
          payload = ${data.payload},
          updated_at = now()
        where user_id = ${userId}`;
    } else {
      let saved = false;
      for (let i = 0; i < 5 && !saved; i++) {
        const code = makeCode();
        const shown = number || String(Math.floor(10000000 + Math.random() * 89999999));
        try {
          await sql`
            insert into zikr_saves (user_id, display_name, invite_code, total, level, best_day, public_board, payload)
            values (${userId}, ${shown}, ${code}, ${data.total}, ${level}, ${data.bestDay}, ${data.publicBoard}, ${data.payload})`;
          saved = true;
        } catch (err) {
          const message = err instanceof Error ? err.message : "";
          if (!/invite_code|unique/i.test(message) || i === 4) throw err;
        }
      }
    }
    const code = (data.inviteCodeToApply ?? "").trim().toUpperCase();
    if (/^[A-Z0-9]{6}$/.test(code)) {
      const inviter = await sql<{ user_id: string }>`select user_id from zikr_saves where invite_code = ${code}`;
      const inviterId = inviter[0]?.user_id;
      if (inviterId && inviterId !== userId) {
        await sql`
          update zikr_saves set invited_by = ${inviterId}
          where user_id = ${userId} and invited_by is null`;
      }
    }
    const meta = await metaFor(userId);
    if (!meta) throw new Error("Не удалось сохранить");
    return meta;
  });

export const leaderboard = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<{ payload: string; total: number; level: number; mine: boolean | string }>`
      select payload, total, level, (user_id = ${context.userId}) as mine
      from zikr_saves
      where public_board = true and total > 0
      order by total desc, level desc
      limit 30`;
    const meta = await metaFor(context.userId);
    return {
      rows: rows.map((r) => ({
        name: boardNumber(r.payload) || "--------",
        total: r.total,
        level: r.level,
        mine: r.mine === true || r.mine === "t" || r.mine === "true",
      })),
      meta,
    };
  });

const WorldInput = z.object({
  publicId: z.string().regex(/^\d{8}$/),
  total: z.number().int().min(0).max(100_000_000),
  invitedBy: z.string().regex(/^\d{8}$/).optional(),
});

export type WorldRow = { id: string; total: number; rank: number };

export const publishWorld = createServerFn({ method: "POST" })
  .validator((raw: unknown) => WorldInput.parse(raw))
  .handler(async ({ data }) => {
    try {
      const sql = await getSql();
      await keepOldRating(sql);
      const publicId = realPublicId(data.publicId);
      if (DROPPED_RATING_IDS.includes(publicId)) return { ok: true as const };
      const stored = withGrokBonus(publicId, data.total);
      await sql`
        insert into zikr_world (public_id, total)
        values (${publicId}, ${stored})
        on conflict (public_id) do update
        set total = excluded.total,
            updated_at = now()`;
      const host = data.invitedBy ? realPublicId(data.invitedBy) : undefined;
      if (host && host !== publicId) {
        await sql`
          insert into zikr_invites (guest_id, host_id, total)
          values (${publicId}, ${host}, ${data.total})
          on conflict (guest_id) do update
          set total = greatest(zikr_invites.total, excluded.total),
              updated_at = now()
          where zikr_invites.host_id = excluded.host_id`;
      }
      await sql`
        update zikr_invites
        set total = greatest(total, ${data.total}), updated_at = now()
        where guest_id = ${publicId}`;
      await tapsOnlyBoard(sql);
      return { ok: true as const };
    } catch (err) {
      console.error("[zikr] world", err);
      return { ok: false as const };
    }
  });

export type Invitee = { id: string; total: number };

export const invitees = createServerFn({ method: "POST" })
  .validator((raw: unknown) => z.object({ publicId: z.string().regex(/^\d{8}$/) }).parse(raw))
  .handler(async ({ data }) => {
    try {
      const sql = await getSql();
      await keepOldRating(sql);
      await tapsOnlyBoard(sql);
      await liftGrokBonus(sql);
      await keepKnownInvites(sql);
      const host = realPublicId(data.publicId);
      const rows = await sql<{ guest_id: string; total: number }>`
        select guest_id, total from zikr_invites
        where (host_id = ${host} or host_id = ${data.publicId}) and guest_id <> ${host}
        order by total desc, guest_id asc
        limit 40`;
      return { rows: rows.map((row) => ({ id: row.guest_id, total: row.total })) };
    } catch (err) {
      console.error("[zikr] invitees", err);
      return { rows: [] as Invitee[] };
    }
  });

export const worldBoard = createServerFn({ method: "POST" })
  .validator((raw: unknown) => z.object({ publicId: z.string().regex(/^\d{8}$/) }).parse(raw))
  .handler(async ({ data }) => {
    try {
      const sql = await getSql();
      await keepOldRating(sql);
      await tapsOnlyBoard(sql);
      await liftGrokBonus(sql);
      const rows = await sql<{ public_id: string; total: number }>`
        select public_id, total from zikr_world
        where total > 0
        order by total desc, public_id asc
        limit 40`;
      const self = await sql<{ total: number }>`select total from zikr_world where public_id = ${data.publicId}`;
      let mine: { total: number; rank: number } | null = null;
      if (self[0]) {
        const ahead = await sql<{ n: number }>`select count(*)::int as n from zikr_world where total > ${self[0].total}`;
        mine = { total: self[0].total, rank: (ahead[0]?.n ?? 0) + 1 };
      }
      return {
        rows: rows.map((row, index) => ({ id: row.public_id, total: row.total, rank: index + 1 })),
        mine,
      };
    } catch (err) {
      console.error("[zikr] world board", err);
      return { rows: [], mine: null };
    }
  });

const BeatInput = z.object({
  publicId: z.string().regex(/^\d{8}$/),
  country: z.string().max(4),
  dayKey: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  dayTotal: z.number().int().min(0).max(100_000_000),
  xp: z.number().int().min(0).max(2_000_000_000),
  total: z.number().int().min(0).max(2_000_000_000),
  tapSince: z.number().int().min(0).max(10_000_000_000_000),
});

export type PresenceRow = { id: string; country: string; value: number; rank: number };

export const beatPresence = createServerFn({ method: "POST" })
  .validator((raw: unknown) => BeatInput.parse(raw))
  .handler(async ({ data }) => {
    try {
      const sql = await getSql();
      await keepOldRating(sql);
      const publicId = realPublicId(data.publicId);
      if (DROPPED_RATING_IDS.includes(publicId)) return { ok: true as const };
      const tapping = data.tapSince > 0 ? 1 : 0;
      const tapSec = tapping ? Math.floor(data.tapSince / 1000) : 0;
      await sql`
      insert into zikr_presence (public_id, country, day_key, day_total, xp, total, seen_at, tap_since, last_tap_at)
      values (
        ${publicId},
        ${data.country},
        ${data.dayKey},
        ${data.dayTotal},
        ${data.xp},
        ${data.total},
        now(),
        case when ${tapping} = 1 then to_timestamp(${tapSec}) else null end,
        case when ${tapping} = 1 then now() else null end
      )
      on conflict (public_id) do update set
        country = excluded.country,
        day_key = excluded.day_key,
        day_total = greatest(case when zikr_presence.day_key = excluded.day_key then zikr_presence.day_total else 0 end, excluded.day_total),
        xp = greatest(zikr_presence.xp, excluded.xp),
        total = greatest(zikr_presence.total, excluded.total),
        seen_at = now(),
        tap_since = case when ${tapping} = 1 then to_timestamp(${tapSec}) else zikr_presence.tap_since end,
        last_tap_at = case when ${tapping} = 1 then now() else zikr_presence.last_tap_at end`;
      return { ok: true as const };
    } catch (err) {
      console.error("[zikr] presence", err);
      return { ok: false as const };
    }
  });

export const presenceBoard = createServerFn({ method: "POST" })
  .validator((raw: unknown) => z.object({ publicId: z.string().regex(/^\d{8}$/), dayKey: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) }).parse(raw))
  .handler(async ({ data }) => {
    try {
      const sql = await getSql();
      await keepOldRating(sql);
      const online = await sql<{ n: number }>`
      select count(*)::int as n from zikr_presence where last_tap_at > now() - interval '30 seconds'`;
    const remembering = await sql<{ n: number }>`
      select count(*)::int as n from zikr_presence where last_tap_at > now() - interval '30 seconds'`;
    const live = await sql<{ public_id: string; country: string; day_total: number }>`
      select public_id, country, day_total from zikr_presence
      where last_tap_at > now() - interval '30 seconds'
      order by day_total desc, public_id asc
      limit 20`;
    const daily = await sql<{ public_id: string; country: string; day_total: number }>`
      select public_id, country, day_total from zikr_presence
      where day_key = ${data.dayKey} and day_total > 0
      order by day_total desc, public_id asc
      limit 10`;
    const world = await sql<{ public_id: string; country: string; xp: number }>`
      select public_id, country, xp from zikr_presence
      where xp > 0
      order by xp desc, public_id asc
      limit 10`;
    const self = await sql<{ day_total: number; xp: number; day_key: string }>`
      select day_total, xp, day_key from zikr_presence where public_id = ${data.publicId}`;
    const together = await sql<{ n: string | number }>`
      select coalesce(sum(total), 0) as n from zikr_presence`;
    let dailyRank: number | null = null;
    let worldRank: number | null = null;
    if (self[0] && self[0].day_key === data.dayKey) {
      const ahead = await sql<{ n: number }>`
        select count(*)::int as n from zikr_presence where day_key = ${data.dayKey} and day_total > ${self[0].day_total}`;
      dailyRank = (ahead[0]?.n ?? 0) + 1;
    }
    if (self[0]) {
      const ahead = await sql<{ n: number }>`select count(*)::int as n from zikr_presence where xp > ${self[0].xp}`;
      worldRank = (ahead[0]?.n ?? 0) + 1;
    }
    return {
      online: online[0]?.n ?? 0,
      remembering: remembering[0]?.n ?? 0,
      allTaps: Math.max(0, Math.floor(Number(together[0]?.n ?? 0))),
      live: live.map((row, index) => ({ id: row.public_id, country: row.country, value: row.day_total, rank: index + 1 })),
      daily: daily.map((row, index) => ({ id: row.public_id, country: row.country, value: row.day_total, rank: index + 1 })),
      world: world.map((row, index) => ({ id: row.public_id, country: row.country, value: row.xp, rank: index + 1 })),
      dailyRank,
      worldRank,
    };
    } catch (err) {
      console.error("[zikr] presence board", err);
      return {
        online: 0,
        remembering: 0,
        allTaps: 0,
        live: [] as PresenceRow[],
        daily: [],
        world: [],
        dailyRank: null,
        worldRank: null,
      };
    }
  });

const DeviceInput = z.object({
  key: z.string().regex(/^[A-Za-z0-9_-]{16,48}$/),
  tgId: z.string().regex(/^\d{4,20}$/).optional(),
  publicId: z.string().regex(/^\d{8}$/).optional(),
  total: z.number().int().min(0).max(5_000_000).optional(),
  payload: z.string().max(180_000).optional(),
});

export type DeviceSave = { syncKey: string; publicId: string; payload: string; total: number };

async function deviceTable(sql: Awaited<ReturnType<typeof getSql>>) {
  const steps = [
    `create table if not exists zikr_device (
      sync_key text primary key,
      public_id text not null default '',
      tg_id text,
      payload text not null default '',
      total integer not null default 0,
      updated_at timestamptz not null default now()
    )`,
    `create unique index if not exists zikr_device_tg_idx on zikr_device (tg_id) where tg_id is not null`,
  ];
  for (const text of steps) {
    try {
      await sql.query(text);
    } catch (err) {
      console.error("[zikr] device table", err);
    }
  }
}

function savedDevice(row: DeviceSave): DeviceSave {
  const publicId = realPublicId(row.publicId);
  const payload = row.payload.replaceAll('"publicId":"88880455"', '"publicId":"96995742"');
  return publicId === row.publicId && payload === row.payload ? row : { ...row, publicId, payload };
}

export const pullDevice = createServerFn({ method: "POST" })
  .validator((raw: unknown) => DeviceInput.pick({ key: true, tgId: true }).parse(raw))
  .handler(async ({ data }): Promise<DeviceSave | null> => {
    try {
      const sql = await getSql();
      await deviceTable(sql);
      if (data.tgId) {
        const byTg = await sql<DeviceSave>`
          select sync_key as "syncKey", public_id as "publicId", payload, total
          from zikr_device where tg_id = ${data.tgId} limit 1`;
        if (byTg[0]?.payload) return savedDevice(byTg[0]);
      }
      const byKey = await sql<DeviceSave>`
        select sync_key as "syncKey", public_id as "publicId", payload, total
        from zikr_device where sync_key = ${data.key} limit 1`;
      return byKey[0]?.payload ? savedDevice(byKey[0]) : null;
    } catch (err) {
      console.error("[zikr] pull device", err);
      return null;
    }
  });

export const pushDevice = createServerFn({ method: "POST" })
  .validator((raw: unknown) => DeviceInput.required({ publicId: true, total: true, payload: true }).parse(raw))
  .handler(async ({ data }): Promise<DeviceSave | null> => {
    try {
      const sql = await getSql();
      await deviceTable(sql);
      await foldCloneNumbers(sql);
      const total = data.total ?? 0;
      const payload = (data.payload ?? "").replaceAll('"publicId":"88880455"', '"publicId":"96995742"');
      const publicId = realPublicId(data.publicId ?? "");
      const sameDevice = await sql<{ publicId: string }>`
        select public_id as "publicId" from zikr_device where sync_key = ${data.key} limit 1`;
      const previousId = sameDevice[0]?.publicId ?? "";
      if (data.tgId) {
        const prior = await sql<DeviceSave>`
          select sync_key as "syncKey", public_id as "publicId", payload, total
          from zikr_device where tg_id = ${data.tgId} limit 1`;
        const saved = prior[0];
        if (saved && saved.syncKey !== data.key) {
          if (total >= saved.total && /^\d{8}$/.test(publicId) && publicId !== saved.publicId) {
            await sql`
              update zikr_device
              set public_id = ${publicId}, payload = ${payload}, total = ${total}, updated_at = now()
              where sync_key = ${saved.syncKey}`;
            await dropRemovedRating(sql);
            for (const text of [
              "delete from zikr_world where public_id = $1",
              "delete from zikr_presence where public_id = $1",
              "delete from zikr_invites where guest_id = $1 or host_id = $1",
            ]) {
              try {
                await sql.query(text, [saved.publicId]);
              } catch (err) {
                console.error("[zikr] retire rating", err);
              }
            }
            return savedDevice({ ...saved, publicId, payload, total });
          }
          if (total > saved.total) {
            await sql`
              update zikr_device
              set payload = ${payload}, total = ${total}, updated_at = now()
              where sync_key = ${saved.syncKey}`;
            return savedDevice({ ...saved, payload, total });
          }
          return savedDevice(saved);
        }
      }
      await sql`
        insert into zikr_device (sync_key, public_id, tg_id, payload, total)
        values (${data.key}, ${publicId}, ${data.tgId ?? null}, ${payload}, ${total})
        on conflict (sync_key) do update set
          public_id = case
            when excluded.total >= zikr_device.total and excluded.public_id ~ '^[0-9]{8}$' then excluded.public_id
            when zikr_device.public_id ~ '^[0-9]{8}$' then zikr_device.public_id
            else excluded.public_id
          end,
          tg_id = coalesce(zikr_device.tg_id, excluded.tg_id),
          payload = case when excluded.total >= zikr_device.total then excluded.payload else zikr_device.payload end,
          total = greatest(zikr_device.total, excluded.total),
          updated_at = now()`;
      const row = await sql<DeviceSave>`
        select sync_key as "syncKey", public_id as "publicId", payload, total
        from zikr_device where sync_key = ${data.key} limit 1`;
      const nextId = row[0]?.publicId ?? "";
      if (previousId && nextId && previousId !== nextId) {
        for (const text of [
          "delete from zikr_world where public_id = $1",
          "delete from zikr_presence where public_id = $1",
          "delete from zikr_invites where guest_id = $1 or host_id = $1",
        ]) {
          try {
            await sql.query(text, [previousId]);
          } catch (err) {
            console.error("[zikr] retire rating", err);
          }
        }
      }
      return row[0] ? savedDevice(row[0]) : null;
    } catch (err) {
      console.error("[zikr] push device", err);
      return null;
    }
  });
