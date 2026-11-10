import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { levelFromXp } from "@/lib/zikr/levels";
import { MILESTONES } from "@/lib/zikr/content";

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
    if (typeof id === "string" && /^\d{8}$/.test(id)) return realPublicId(id);
  } catch {
    /* the saved copy can be old */
  }
  return "";
}

function keptScore(payload: string, column = 0): number {
  let total = Math.max(0, Math.floor(Number(column) || 0));
  try {
    const parsed = JSON.parse(payload) as { total?: unknown; rewardArchive?: { total?: unknown } };
    total = Math.max(total, Math.floor(Number(parsed.total) || 0), Math.floor(Number(parsed.rewardArchive?.total) || 0));
  } catch {
    /* a broken copy does not count */
  }
  return total;
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
const DROPPED_RATING_IDS = ["89020984", "389020984", "31549154", "88880455", "62012303", "60912327", "18532226", "95498997", "25574036", "50170262", "79475757", "39309698"];
/** A second number made on the same account. Counts stay on the first number. */
const FOLDED_IDS: Record<string, string> = { "88880455": "96995742", "62012303": "87278839", "25574036": "52812946", "50170262": "52812946", "79475757": "52812946", "82261249": "52812946" };

/** Copies and removed numbers. They are not a second person on the board. */
export const RATING_SKIP_IDS = [...new Set([...DROPPED_RATING_IDS, ...Object.keys(FOLDED_IDS)])];
export const RATING_FOLDS: Readonly<Record<string, string>> = FOLDED_IDS;

function realPublicId(id: string): string {
  return FOLDED_IDS[id] ?? id;
}

/** Where a tap is stored. Null means the number is removed and must not be written. */
export function ratingWriteId(raw: string): string | null {
  const id = realPublicId(raw);
  if (!/^\d{8}$/.test(id)) return null;
  if (DROPPED_RATING_IDS.includes(id)) return null;
  if (Object.prototype.hasOwnProperty.call(FOLDED_IDS, id)) return null;
  return id;
}

async function aliasTable(sql: Awaited<ReturnType<typeof getSql>>) {
  await sql.query(`create table if not exists zikr_alias (
    alias text primary key,
    public_id text not null
  )`);
}

async function aliasOf(sql: Awaited<ReturnType<typeof getSql>>, id: string): Promise<string> {
  const first = realPublicId(id);
  if (!/^\d{8}$/.test(first)) return first;
  try {
    await aliasTable(sql);
    const rows = await sql.query<{ public_id: string }>(`select public_id from zikr_alias where alias = $1`, [first]);
    const next = rows[0]?.public_id;
    if (typeof next === "string" && /^\d{8}$/.test(next) && next !== first) return realPublicId(next);
  } catch (err) {
    console.error("[zikr] alias", err);
  }
  return first;
}

/** The same phone or account keeps its first number. The extra number is not a second person. */
async function absorbAlias(sql: Awaited<ReturnType<typeof getSql>>, keepRaw: string, dropRaw: string) {
  const keep = await aliasOf(sql, keepRaw);
  const drop = realPublicId(dropRaw);
  if (!/^\d{8}$/.test(keep) || !/^\d{8}$/.test(drop) || keep === drop || DROPPED_RATING_IDS.includes(keep)) return keep;
  const from = `"publicId":"${drop}"`;
  const to = `"publicId":"${keep}"`;
  try {
    await aliasTable(sql);
    await sql.query(
      `insert into zikr_alias (alias, public_id) values ($1, $2)
       on conflict (alias) do update set public_id = excluded.public_id`,
      [drop, keep],
    );
    await sql.query(`update zikr_alias set public_id = $1 where public_id = $2 and alias <> $1`, [keep, drop]);
    await sql.query(
      `insert into zikr_world (public_id, total)
       select $1, total from zikr_world where public_id = $2
       on conflict (public_id) do update
       set total = greatest(zikr_world.total, excluded.total), updated_at = now()`,
      [keep, drop],
    );
    await sql.query(`delete from zikr_world where public_id = $1`, [drop]);
    await sql.query(`delete from zikr_presence where public_id = $1`, [drop]);
    await sql.query(`delete from zikr_invites where guest_id = $1`, [drop]);
    await sql.query(`update zikr_invites set host_id = $1 where host_id = $2`, [keep, drop]);
    await sql.query(
      `update zikr_device
       set public_id = case when public_id = $1 then $2 else public_id end,
           payload = replace(payload, $3, $4)
       where public_id = $1 or payload like $5`,
      [drop, keep, from, to, `%${from}%`],
    );
    await sql.query(`update zikr_saves set payload = replace(payload, $1, $2) where payload like $3`, [from, to, `%${from}%`]);
  } catch (err) {
    console.error("[zikr] absorb", err);
  }
  return keep;
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
      [
        `insert into zikr_presence (public_id, country, day_key, day_total, xp, total, seen_at)
       select $1, country, day_key, day_total, xp, total, seen_at from zikr_presence where public_id = $2
       on conflict (public_id) do update set
         day_key = case when excluded.day_total > zikr_presence.day_total then excluded.day_key else zikr_presence.day_key end,
         day_total = greatest(zikr_presence.day_total, excluded.day_total),
         total = greatest(zikr_presence.total, excluded.total),
         xp = greatest(zikr_presence.xp, excluded.xp)`,
        [real, clone],
      ],
      [`delete from zikr_world where public_id = $1`, [clone]],
      [`update zikr_invites set host_id = $1 where host_id = $2`, [real, clone]],
      [
        `insert into zikr_reach (public_id, at)
       select $1, at from zikr_reach where public_id = $2
       on conflict do nothing`,
        [real, clone],
      ],
      [`delete from zikr_reach where public_id = $1`, [clone]],
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

/** Father's number keeps the higher saved count. The extra number is not a second person. */
async function keepFatherScore(sql: Awaited<ReturnType<typeof getSql>>) {
  const real = "52812946";
  const clone = "25574036";
  try {
    let best = 0;
    const take = (value: unknown) => {
      const n = Math.floor(Number(value));
      if (Number.isFinite(n) && n > best) best = n;
    };
    try {
      const totals = await sql.query<{ total: number }>(
        `select total from zikr_world where public_id = $1 or public_id = $2
         union all select total from zikr_presence where public_id = $1 or public_id = $2
         union all select total from zikr_invites where guest_id = $1 or guest_id = $2`,
        [real, clone],
      );
      for (const row of totals) take(row.total);
    } catch (err) {
      console.error("[zikr] father lists", err);
    }
    try {
      const copies = await sql.query<{ payload: string; total: number }>(
        `select payload, total from zikr_device where public_id = $1 or public_id = $2 or payload like $3 or payload like $4
         union all
         select payload, total from zikr_saves where payload like $3 or payload like $4 or display_name = $2`,
        [real, clone, `%"publicId":"${real}"%`, `%"publicId":"${clone}"%`],
      );
      for (const row of copies) {
        take(row.total);
        try {
          take((JSON.parse(row.payload) as { total?: unknown }).total);
        } catch {
          /* a broken copy must not lower the score */
        }
      }
    } catch (err) {
      console.error("[zikr] father copies", err);
    }
    if (best <= 0) return;
    await sql.query(
      `insert into zikr_world (public_id, total) values ($1, $2)
       on conflict (public_id) do update
       set total = greatest(zikr_world.total, excluded.total), updated_at = now()`,
      [real, best],
    );
    await sql.query(
      `update zikr_presence set total = greatest(total, $2), xp = greatest(xp, $2) where public_id = $1`,
      [real, best],
    );
  } catch (err) {
    console.error("[zikr] father score", err);
  }
}

export type SavedScore = { total: number; quranLetters: number; today: number; days: Record<string, { total: number; by: Record<string, number> }> };

export const savedScore = createServerFn({ method: "POST" })
  .validator((raw: unknown) => z.object({ publicId: z.string().regex(/^\d{8}$/), dayKey: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) }).parse(raw))
  .handler(async ({ data }): Promise<SavedScore> => {
    const empty: SavedScore = { total: 0, quranLetters: 0, today: 0, days: {} };
    try {
      const sql = await getSql();
      await creditFatherToday(sql);
      const id = await aliasOf(sql, data.publicId);
      if (id !== "52812946") return empty;
      await keepFatherScore(sql);
      let total = 0;
      let quranLetters = 0;
      let today = 0;
      let days: SavedScore["days"] = {};
      const take = (value: unknown) => {
        const n = Math.floor(Number(value));
        if (Number.isFinite(n) && n > total) total = n;
      };
      for (const text of [
        `select total from zikr_world where public_id = $1`,
        `select total from zikr_presence where public_id = $1`,
        `select total from zikr_device where public_id = $1`,
        `select total from zikr_saves where payload like $2`,
      ]) {
        try {
          const rows = await sql.query<{ total: number }>(text, [id, `%"publicId":"${id}"%`]);
          for (const row of rows) take(row.total);
        } catch (err) {
          console.error("[zikr] saved total", err);
        }
      }
      try {
        const day = await sql.query<{ day_total: number; day_key: string }>(
          `select day_total, day_key from zikr_presence where public_id = $1`,
          [id],
        );
        if (day[0]?.day_key === data.dayKey) today = Math.max(0, Math.floor(Number(day[0].day_total) || 0));
      } catch (err) {
        console.error("[zikr] saved day", err);
      }
      for (const text of [
        `select payload from zikr_device where public_id = $1 or payload like $2`,
        `select payload from zikr_saves where payload like $2`,
      ]) {
        try {
          const copies = await sql.query<{ payload: string }>(text, [id, `%"publicId":"${id}"%`]);
          for (const row of copies) {
            try {
              const parsed = JSON.parse(row.payload) as {
                total?: unknown;
                quranLetters?: unknown;
                days?: Record<string, { total?: unknown; by?: Record<string, number> }>;
                rewardArchive?: { total?: unknown; quranLetters?: unknown; days?: Record<string, { total?: unknown; by?: Record<string, number> }> };
              };
              take(parsed.total);
              take(parsed.rewardArchive?.total);
              const letters = Math.floor(Number(parsed.quranLetters) || 0) + Math.floor(Number(parsed.rewardArchive?.quranLetters) || 0);
              if (letters > quranLetters) quranLetters = letters;
              for (const source of [parsed.days, parsed.rewardArchive?.days]) {
                if (!source) continue;
                for (const [key, log] of Object.entries(source)) {
                  if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) continue;
                  const n = Math.floor(Number(log?.total) || 0);
                  if (n <= 0) continue;
                  if (n > (days[key]?.total ?? 0)) days[key] = { total: n, by: log?.by && typeof log.by === "object" ? log.by : {} };
                  if (key === data.dayKey && n > today) today = n;
                }
              }
            } catch {
              /* a broken copy is skipped */
            }
          }
        } catch (err) {
          console.error("[zikr] saved copy", err);
        }
      }
      return { total, quranLetters, today, days };
    } catch (err) {
      console.error("[zikr] saved score", err);
      return empty;
    }
  });

/** Father's extra number from 6 Nov 2026. Add that day's 1000 once, then forget the extra number. */
async function creditFatherToday(sql: Awaited<ReturnType<typeof getSql>>) {
  const real = "52812946";
  const clone = "79475757";
  const day = "2026-11-06";
  const add = 1000;
  try {
    await sql.query(`create table if not exists zikr_fix (id text primary key, done_at timestamptz not null default now())`);
    const claimed = await sql.query<{ id: string }>(
      `with claim as (
         insert into zikr_fix (id) values ($1) on conflict do nothing returning id
       ), world as (
         update zikr_world set total = total + $2, updated_at = now()
         where public_id = $3 and exists (select 1 from claim)
         returning public_id
       ), presence as (
         update zikr_presence set
           total = total + $2,
           xp = greatest(xp, (total + $2) * 10),
           day_total = case when day_key = $4 then day_total + $2 else $2 end,
           day_key = $4
         where public_id = $3 and exists (select 1 from claim)
         returning public_id
       )
       select id from claim`,
      ["father-2026-11-06-1000", add, real, day],
    );
    if (!claimed.length) return;
    await sql.query(
      `insert into zikr_world (public_id, total) values ($1, $2) on conflict (public_id) do nothing`,
      [real, add],
    );
    await sql.query(
      `insert into zikr_presence (public_id, country, day_key, day_total, xp, total)
       values ($1, '', $2, $3, $4, $3) on conflict (public_id) do nothing`,
      [real, day, add, add * 10],
    );
    await sql.query(`delete from zikr_world where public_id = $1`, [clone]);
    await sql.query(`delete from zikr_presence where public_id = $1`, [clone]);
    await sql.query(`delete from zikr_invites where guest_id = $1`, [clone]);
    await sql.query(`delete from zikr_reach where public_id = $1`, [clone]);
    await aliasTable(sql);
    await sql.query(
      `insert into zikr_alias (alias, public_id) values ($1, $2)
       on conflict (alias) do update set public_id = excluded.public_id`,
      [clone, real],
    );
    const bump = (payload: string) => {
      try {
        const parsed = JSON.parse(payload) as {
          state?: { total?: unknown; xp?: unknown; bestDay?: unknown; days?: Record<string, { total?: unknown; by?: Record<string, number> }> };
          total?: unknown;
          xp?: unknown;
          bestDay?: unknown;
          days?: Record<string, { total?: unknown; by?: Record<string, number> }>;
        };
        const state = parsed.state && typeof parsed.state === "object" ? parsed.state : parsed;
        const total = Math.floor(Number(state.total) || 0) + add;
        state.total = total;
        if (typeof state.xp === "number") state.xp = Math.max(state.xp, total * 10);
        if (!state.days || typeof state.days !== "object") state.days = {};
        const prev = state.days[day];
        const dayTotal = Math.floor(Number(prev?.total) || 0) + add;
        state.days[day] = { total: dayTotal, by: prev?.by && typeof prev.by === "object" ? prev.by : {} };
        if (typeof state.bestDay === "number") state.bestDay = Math.max(state.bestDay, dayTotal);
        return JSON.stringify(parsed);
      } catch {
        return "";
      }
    };
    const devices = await sql.query<{ sync_key: string; payload: string; total: number }>(
      `select sync_key, payload, total from zikr_device where public_id = $1 or payload like $2`,
      [real, `%"publicId":"${real}"%`],
    );
    for (const row of devices) {
      const next = bump(row.payload);
      if (!next) continue;
      await sql.query(`update zikr_device set payload = $2, total = total + $3, updated_at = now() where sync_key = $1`, [row.sync_key, next, add]);
    }
    const saves = await sql.query<{ user_id: string; payload: string }>(
      `select user_id, payload from zikr_saves where payload like $1 or display_name = $2`,
      [`%"publicId":"${real}"%`, real],
    );
    for (const row of saves) {
      const next = bump(row.payload);
      if (!next) continue;
      await sql.query(`update zikr_saves set payload = $2, total = total + $3, updated_at = now() where user_id = $1`, [row.user_id, next, add]);
    }
  } catch (err) {
    console.error("[zikr] father today", err);
  }
}

/** The extra number's taps are added once to the father's number, then the copy is removed. */
export async function addCloneTapsOnce(sql: Awaited<ReturnType<typeof getSql>>) {
  const clone = "82261249";
  const real = "52812946";
  try {
    await sql.query(`create table if not exists zikr_fix (id text primary key, done_at timestamptz not null default now())`);
    await aliasTable(sql);
    await sql.query(
      `with claim as (
         insert into zikr_fix (id) values ($1) on conflict do nothing returning id
       ), world_add as (
         update zikr_world w
         set total = w.total + coalesce((select c.total from zikr_world c where c.public_id = $2), 0),
             updated_at = now()
         where w.public_id = $3 and exists (select 1 from claim)
         returning w.public_id
       ), presence_add as (
         update zikr_presence p
         set total = p.total + coalesce((select c.total from zikr_presence c where c.public_id = $2), 0),
             xp = greatest(p.xp, coalesce((select c.xp from zikr_presence c where c.public_id = $2), 0)),
             day_total = case
               when p.day_key = (select c.day_key from zikr_presence c where c.public_id = $2)
                 then p.day_total + coalesce((select c.day_total from zikr_presence c where c.public_id = $2), 0)
               when coalesce((select c.day_key from zikr_presence c where c.public_id = $2), '') <> ''
                 and (p.day_key is null or p.day_key < (select c.day_key from zikr_presence c where c.public_id = $2))
                 then coalesce((select c.day_total from zikr_presence c where c.public_id = $2), 0)
               else p.day_total
             end,
             day_key = case
               when coalesce((select c.day_key from zikr_presence c where c.public_id = $2), '') <> ''
                 and (p.day_key is null or p.day_key < (select c.day_key from zikr_presence c where c.public_id = $2))
                 then (select c.day_key from zikr_presence c where c.public_id = $2)
               else p.day_key
             end,
             seen_at = now()
         where p.public_id = $3 and exists (select 1 from claim)
         returning p.public_id
       ), presence_insert as (
         insert into zikr_presence (public_id, country, day_key, day_total, xp, total, seen_at, concealed)
         select $3, country, day_key, day_total, xp, total, now(), false
         from zikr_presence
         where public_id = $2
           and exists (select 1 from claim)
           and not exists (select 1 from zikr_presence where public_id = $3)
         returning public_id
       ), drop_world as (
         delete from zikr_world where public_id = $2 and exists (select 1 from claim) returning public_id
       )
       delete from zikr_presence where public_id = $2 and exists (select 1 from claim)`,
      ["add-82261249-to-52812946", clone, real],
    );
    await sql.query(
      `insert into zikr_alias (alias, public_id) values ($1, $2)
       on conflict (alias) do update set public_id = excluded.public_id`,
      [clone, real],
    );
  } catch (err) {
    console.error("[zikr] add clone taps", err);
  }
}

async function dropRemovedRating(sql: Awaited<ReturnType<typeof getSql>>) {
  await creditFatherToday(sql);
  await addCloneTapsOnce(sql);
  await foldCloneNumbers(sql);
  await keepFatherScore(sql);
  const steps = [
    "delete from zikr_world where public_id = $1",
    "delete from zikr_presence where public_id = $1",
    "delete from zikr_invites where guest_id = $1 or host_id = $1",
    "delete from zikr_reach where public_id = $1",
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

let tablesReady = false;
let tidyAt = 0;

async function keepOldRating(sql: Awaited<ReturnType<typeof getSql>>) {
  const now = Date.now();
  if (tablesReady && now - tidyAt < 10 * 60 * 1000) return;
  const schema = [
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
    `alter table zikr_presence add column if not exists concealed boolean not null default false`,
    `create table if not exists zikr_invites (
      guest_id text primary key,
      host_id text not null,
      total integer not null default 0,
      updated_at timestamptz not null default now()
    )`,
  ];
  if (!tablesReady) {
    for (const text of schema) {
      try {
        await sql.query(text);
      } catch (err) {
        console.error("[zikr] keep rating", err);
      }
    }
    tablesReady = true;
  }
  if (now - tidyAt < 10 * 60 * 1000) return;
  tidyAt = now;
  try {
    await sql.query(
      `insert into zikr_presence (public_id, country, day_key, day_total, xp, total, seen_at)
       select public_id, '', '', 0, total, total, updated_at from zikr_world
       on conflict (public_id) do update set
         total = greatest(zikr_presence.total, excluded.total),
         xp = greatest(zikr_presence.xp, excluded.xp)
       where zikr_presence.total < excluded.total or zikr_presence.xp < excluded.xp`,
    );
  } catch (err) {
    console.error("[zikr] keep rating", err);
  }
  await dropRemovedRating(sql);
  await tapsOnlyBoard(sql);
  await liftGrokBonus(sql);
  await keepKnownInvites(sql);
}

/** Drop imported Grok totals. Keep only taps saved on this site. */
async function liftGrokBonus(sql: Awaited<ReturnType<typeof getSql>>) {
  for (const id of ["87278839", "94477029"]) {
    try {
      const rows = await sql<{ payload: string }>`
        select payload from zikr_device where public_id = ${id} and payload like '{%'`;
      let taps = -1;
      for (const row of rows) {
        try {
          const n = Math.floor(Number((JSON.parse(row.payload) as { total?: unknown }).total));
          if (Number.isFinite(n) && n >= 0 && n > taps) taps = n;
        } catch {
          /* skip */
        }
      }
      const total = taps < 0 ? 0 : taps;
      await sql`update zikr_world set total = ${total}, updated_at = now() where public_id = ${id}`;
      await sql`update zikr_invites set total = ${total}, updated_at = now() where guest_id = ${id}`;
      await sql`update zikr_presence set total = ${total}, xp = ${total * 10} where public_id = ${id}`;
    } catch (err) {
      console.error("[zikr] clear grok", err);
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
    await sql`update zikr_world set total = ${taps}, updated_at = now() where public_id = ${id}`;
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
          total = ${total},
          updated_at = now()`;
  } catch (err) {
    console.error("[zikr] known invite", err);
  }
}

export async function noteSeen(sql: Awaited<ReturnType<typeof getSql>>, publicId?: string) {
  const id = ratingWriteId(publicId ?? "");
  if (!id) return;
  try {
    await sql`
      insert into zikr_presence (public_id, country, day_key, day_total, xp, total, seen_at, last_tap_at, concealed)
      values (${id}, '', '1970-01-01', 0, 0, 0, now(), timestamptz '1970-01-01', false)
      on conflict (public_id) do update set seen_at = now()`;
  } catch (err) {
    console.error("[zikr] seen", err);
    try {
      await sql`update zikr_presence set seen_at = now() where public_id = ${id}`;
    } catch {
      /* the count still uses whoever was already marked */
    }
  }
}

async function openNow(sql: Awaited<ReturnType<typeof getSql>>, _publicId?: string) {
  return countRemembering(sql);
}

/** Same number on every phone: people seen in the last two minutes, copies counted once. */
export async function countRemembering(sql: Awaited<ReturnType<typeof getSql>>): Promise<number> {
  const skip = RATING_SKIP_IDS;
  try {
    await aliasTable(sql);
    const rows = await sql<{ n: number }>`
      select count(distinct coalesce(a.public_id, p.public_id))::int as n
      from zikr_presence p
      left join zikr_alias a on a.alias = p.public_id
      where p.seen_at > now() - interval '2 minutes'
        and not (coalesce(a.public_id, p.public_id) = any(${skip}::text[]))`;
    return rows[0]?.n ?? 0;
  } catch (err) {
    console.error("[zikr] online", err);
    const rows = await sql<{ n: number }>`
      select count(*)::int as n from zikr_presence
      where seen_at > now() - interval '2 minutes'
        and not (public_id = any(${skip}::text[]))`;
    return rows[0]?.n ?? 0;
  }
}

export async function rememberingNow(publicId?: string) {
  const sql = await getSql();
  await noteSeen(sql, publicId);
  return openNow(sql, publicId);
}

export const onlineNow = createServerFn({ method: "POST" })
  .validator((raw: unknown) => z.object({ publicId: z.string().max(16).optional() }).parse(raw ?? {}))
  .handler(async ({ data }) => {
    return { online: await rememberingNow(data.publicId) };
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
    const level = levelFromXp(data.total).level;
    const existing = await sql<{ invite_code: string; display_name: string; payload: string; total: number }>`
      select invite_code, display_name, payload, total from zikr_saves where user_id = ${userId}`;
    let payload = data.payload;
    let number = boardNumber(payload);
    let savedTotal = data.total;
    if (existing[0]) {
      const previous = boardNumber(existing[0].payload);
      if (/^\d{8}$/.test(previous) && /^\d{8}$/.test(number) && previous !== number) {
        payload = payload.replaceAll(`"publicId":"${number}"`, `"publicId":"${previous}"`);
        number = previous;
      }
      const kept = keptScore(existing[0].payload, existing[0].total);
      const incoming = keptScore(payload, data.total);
      if (incoming < kept) payload = existing[0].payload;
      savedTotal = Math.max(incoming, kept);
      if (payload === existing[0].payload && savedTotal === existing[0].total) {
        const meta = await metaFor(userId);
        if (!meta) throw new Error("Не удалось сохранить");
        return meta;
      }
      const shown = number || existing[0].display_name.replace(/\D/g, "").slice(0, 8);
      await sql`
        update zikr_saves set
          display_name = ${shown},
          total = ${savedTotal},
          level = ${levelFromXp(savedTotal).level},
          best_day = ${data.bestDay},
          public_board = ${data.publicBoard},
          payload = ${payload},
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
  listed: z.boolean().optional(),
});

export type WorldRow = { id: string; total: number; rank: number; hidden?: boolean };

export const publishWorld = createServerFn({ method: "POST" })
  .validator((raw: unknown) => WorldInput.parse(raw))
  .handler(async ({ data }) => {
    try {
      const sql = await getSql();
      const publicId = await aliasOf(sql, data.publicId);
      if (DROPPED_RATING_IDS.includes(publicId)) return { ok: true as const };
      const stored = data.total;
      if (stored <= 0) {
        await sql`delete from zikr_world where public_id = ${publicId}`;
        await sql`update zikr_invites set total = 0, updated_at = now() where guest_id = ${publicId}`;
        return { ok: true as const };
      }
      await sql`
        insert into zikr_world (public_id, total)
        values (${publicId}, ${stored})
        on conflict (public_id) do update
        set total = excluded.total,
            updated_at = now()
        where zikr_world.total < excluded.total`;
      const host = data.invitedBy ? realPublicId(data.invitedBy) : undefined;
      if (host && host !== publicId && data.total > 0) {
        await sql`
          insert into zikr_invites (guest_id, host_id, total)
          values (${publicId}, ${host}, ${data.total})
          on conflict (guest_id) do update
          set total = excluded.total,
              updated_at = now()
          where zikr_invites.host_id = excluded.host_id
            and zikr_invites.total is distinct from excluded.total`;
      }
      await sql`
        update zikr_invites
        set total = ${data.total}, updated_at = now()
        where guest_id = ${publicId} and total is distinct from ${data.total}`;
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
      const host = realPublicId(data.publicId);
      const rows = await sql<{ guest_id: string; total: number }>`
        select guest_id, total from zikr_invites
        where (host_id = ${host} or host_id = ${data.publicId}) and guest_id <> ${host} and total > 0
        order by total desc, guest_id asc
        limit 40`;
      return { rows: rows.map((row) => ({ id: row.guest_id, total: row.total })) };
    } catch (err) {
      console.error("[zikr] invitees", err);
      throw err;
    }
  });

export const worldBoard = createServerFn({ method: "POST" })
  .validator((raw: unknown) => z.object({ publicId: z.string().regex(/^\d{8}$/), dayKey: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional() }).parse(raw))
  .handler(async ({ data }) => {
    try {
      const sql = await getSql();
      const publicId = await aliasOf(sql, data.publicId);
      const day = data.dayKey ?? "";
      const rows = await sql<{ public_id: string; total: number; concealed: boolean; day_key: string; day_total: number }>`
        select w.public_id, w.total,
          coalesce(p.concealed, false) as concealed,
          coalesce(p.day_key, '') as day_key,
          coalesce(p.day_total, 0) as day_total
        from zikr_world w
        left join zikr_presence p on p.public_id = w.public_id
        where w.total > 0
        order by w.total desc, w.public_id asc
        limit 100`;
      const self = await sql<{ total: number; concealed: boolean; day_key: string; day_total: number }>`
        select w.total, coalesce(p.concealed, false) as concealed, coalesce(p.day_key, '') as day_key, coalesce(p.day_total, 0) as day_total
        from zikr_world w
        left join zikr_presence p on p.public_id = w.public_id
        where w.public_id = ${publicId}`;
      const me = self[0];
      const mineOpen = me ? !me.concealed || (me.day_key === day && me.day_total >= 10000) : false;
      let mine: { total: number; rank: number; hidden?: boolean } | null = null;
      if (me) {
        const ahead = await sql<{ n: number }>`select count(*)::int as n from zikr_world where total > ${me.total}`;
        mine = { total: mineOpen ? me.total : 0, rank: (ahead[0]?.n ?? 0) + 1, ...(mineOpen ? {} : { hidden: true }) };
      }
      const list = rows.map((row, index) => {
        const open = !row.concealed || (row.day_key === day && row.day_total >= 10000);
        return { id: row.public_id, total: open ? row.total : 0, rank: index + 1, ...(open ? {} : { hidden: true as const }) };
      });
      return { rows: list, mine };
    } catch (err) {
      console.error("[zikr] world board", err);
      throw err;
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
  listed: z.boolean().optional(),
  replaceDay: z.boolean().optional(),
});

export type PresenceRow = { id: string; country: string; value: number; rank: number; hidden?: boolean };

export const beatPresence = createServerFn({ method: "POST" })
  .validator((raw: unknown) => BeatInput.parse(raw))
  .handler(async ({ data }) => {
    try {
      const sql = await getSql();
      const publicId = await aliasOf(sql, data.publicId);
      if (DROPPED_RATING_IDS.includes(publicId)) return { ok: true as const };
      const tapping = data.tapSince > 0 ? 1 : 0;
      const tapSec = tapping ? Math.floor(data.tapSince / 1000) : 0;
      const replaceDay = data.replaceDay ? 1 : 0;
      const concealed = data.listed === false;
      await sql`
      insert into zikr_presence (public_id, country, day_key, day_total, xp, total, seen_at, tap_since, last_tap_at, concealed)
      values (
        ${publicId},
        ${data.country},
        ${data.dayKey},
        ${data.dayTotal},
        ${data.xp},
        ${data.total},
        now(),
        case when ${tapping} = 1 then to_timestamp(${tapSec}) else null end,
        case when ${tapping} = 1 then now() else null end,
        ${concealed}
      )
      on conflict (public_id) do update set
        country = excluded.country,
        day_key = excluded.day_key,
        day_total = case when ${replaceDay} = 1 then excluded.day_total else greatest(case when zikr_presence.day_key = excluded.day_key then zikr_presence.day_total else 0 end, excluded.day_total) end,
        xp = greatest(zikr_presence.xp, excluded.xp),
        total = greatest(zikr_presence.total, excluded.total),
        seen_at = now(),
        tap_since = case when ${tapping} = 1 then to_timestamp(${tapSec}) else zikr_presence.tap_since end,
        last_tap_at = case when ${tapping} = 1 then now() else zikr_presence.last_tap_at end,
        concealed = excluded.concealed`;
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
      const publicId = await aliasOf(sql, data.publicId);
      const n = await openNow(sql, publicId);
    const live = await sql<{ public_id: string; country: string; day_total: number; concealed: boolean }>`
      select public_id, country, day_total, concealed from zikr_presence
      where last_tap_at > now() - interval '30 seconds' and day_total > 0
      order by day_total desc, public_id asc
      limit 20`;
    const daily = await sql<{ public_id: string; country: string; day_total: number; concealed: boolean }>`
      select public_id, country, day_total, concealed from zikr_presence
      where day_key = ${data.dayKey} and day_total > 0
      order by day_total desc, public_id asc
      limit 10`;
    const world = await sql<{ public_id: string; country: string; xp: number; concealed: boolean; day_key: string; day_total: number }>`
      select public_id, country, xp, concealed, day_key, day_total from zikr_presence
      where xp > 0
      order by xp desc, public_id asc
      limit 10`;
    const self = await sql<{ day_total: number; xp: number; day_key: string; concealed: boolean }>`
      select day_total, xp, day_key, concealed from zikr_presence where public_id = ${publicId}`;
    const together = await sql<{ n: string | number }>`
      select coalesce(sum(total), 0) as n from zikr_world`;
    let dailyRank: number | null = null;
    let worldRank: number | null = null;
    if (self[0] && self[0].day_key === data.dayKey && self[0].day_total > 0) {
      const ahead = await sql<{ n: number }>`
        select count(*)::int as n from zikr_presence
        where day_key = ${data.dayKey} and day_total > ${self[0].day_total}`;
      dailyRank = (ahead[0]?.n ?? 0) + 1;
    }
    if (self[0] && self[0].xp > 0) {
      const ahead = await sql<{ n: number }>`select count(*)::int as n from zikr_presence where xp > ${self[0].xp}`;
      worldRank = (ahead[0]?.n ?? 0) + 1;
    }
    const mask = (concealed: boolean, dayKey: string, dayTotal: number) => concealed && !(dayKey === data.dayKey && dayTotal >= 10000);
    return {
      online: n,
      remembering: n,
      allTaps: Math.max(0, Math.floor(Number(together[0]?.n ?? 0))),
      live: live.map((row, index) => {
        const hidden = mask(row.concealed, data.dayKey, row.day_total);
        return { id: row.public_id, country: row.country, value: hidden ? 0 : row.day_total, rank: index + 1, ...(hidden ? { hidden: true as const } : {}) };
      }),
      daily: daily.map((row, index) => {
        const hidden = mask(row.concealed, data.dayKey, row.day_total);
        return { id: row.public_id, country: row.country, value: hidden ? 0 : row.day_total, rank: index + 1, ...(hidden ? { hidden: true as const } : {}) };
      }),
      world: world.map((row, index) => {
        const hidden = mask(row.concealed, row.day_key, row.day_total);
        return { id: row.public_id, country: row.country, value: hidden ? 0 : row.xp, rank: index + 1, ...(hidden ? { hidden: true as const } : {}) };
      }),
      dailyRank,
      worldRank,
    };
    } catch (err) {
      console.error("[zikr] presence board", err);
      throw err;
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
  const payload = row.payload.replaceAll('"publicId":"88880455"', '"publicId":"96995742"').replaceAll('"publicId":"50170262"', '"publicId":"52812946"').replaceAll('"publicId":"25574036"', '"publicId":"52812946"');
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
      const total = data.total ?? 0;
      const incoming = await aliasOf(sql, data.publicId ?? "");
      let publicId = incoming;
      let payload = (data.payload ?? "").replaceAll(`"publicId":"${data.publicId ?? ""}"`, `"publicId":"${publicId}"`);
      payload = payload.replaceAll('"publicId":"88880455"', '"publicId":"96995742"').replaceAll('"publicId":"62012303"', '"publicId":"87278839"').replaceAll('"publicId":"25574036"', '"publicId":"52812946"').replaceAll('"publicId":"50170262"', '"publicId":"52812946"').replaceAll('"publicId":"79475757"', '"publicId":"52812946"');
      if (data.tgId) {
        const prior = await sql<DeviceSave>`
          select sync_key as "syncKey", public_id as "publicId", payload, total
          from zikr_device where tg_id = ${data.tgId} limit 1`;
        const saved = prior[0];
        if (saved && saved.syncKey !== data.key) {
          const kept = /^\d{8}$/.test(publicId) ? publicId : await aliasOf(sql, saved.publicId);
          const nextPayload = payload.replaceAll(`"publicId":"${publicId}"`, `"publicId":"${kept}"`);
          const nextTotal = Math.max(total, saved.total);
          if (nextTotal > saved.total || saved.publicId !== kept) {
            await sql`
              update zikr_device
              set public_id = ${kept}, payload = ${nextPayload}, total = ${nextTotal}, updated_at = now()
              where sync_key = ${saved.syncKey}`;
          }
          return savedDevice({ ...saved, publicId: kept, payload: nextPayload, total: nextTotal });
        }
      }
      await sql`
        insert into zikr_device (sync_key, public_id, tg_id, payload, total)
        values (${data.key}, ${publicId}, ${data.tgId ?? null}, ${payload}, ${total})
        on conflict (sync_key) do update set
          public_id = excluded.public_id,
          tg_id = coalesce(zikr_device.tg_id, excluded.tg_id),
          payload = case when zikr_device.total > excluded.total then zikr_device.payload else excluded.payload end,
          total = greatest(zikr_device.total, excluded.total),
          updated_at = now()
        where zikr_device.total <= excluded.total
           or zikr_device.public_id !~ '^[0-9]{8}$'`;
      const row = await sql<DeviceSave>`
        select sync_key as "syncKey", public_id as "publicId", payload, total
        from zikr_device where sync_key = ${data.key} limit 1`;
      return row[0] ? savedDevice(row[0]) : null;
    } catch (err) {
      console.error("[zikr] push device", err);
      return null;
    }
  });

const REACH_AT = MILESTONES.map((m) => m.at);

function rememberTotal(map: Map<string, number>, id: unknown, total: unknown) {
  const real = realPublicId(String(id ?? ""));
  if (!/^\d{8}$/.test(real) || DROPPED_RATING_IDS.includes(real)) return;
  const n = Math.floor(Number(total));
  if (!Number.isFinite(n) || n <= 0) return;
  map.set(real, Math.max(map.get(real) ?? 0, n));
}

/** Everyone who already has taps saved, not only phones that opened the new screen. */
async function peopleTotals(sql: Awaited<ReturnType<typeof getSql>>): Promise<Map<string, number>> {
  const map = new Map<string, number>();
  const queries = [
    `select public_id, total from zikr_world where total > 0`,
    `select public_id, total from zikr_presence where total > 0`,
    `select guest_id as public_id, total from zikr_invites where total > 0`,
    `select public_id, total from zikr_device where total > 0`,
    `select public_id, substring(payload from '"total":([0-9]+)')::bigint as total from zikr_device where payload like '%"total":%'`,
    `select substring(payload from '"publicId":"([0-9]{8})"') as public_id, total from zikr_saves where total > 0`,
  ];
  for (const text of queries) {
    try {
      const rows = await sql.query<{ public_id: string; total: number }>(text);
      for (const row of rows) rememberTotal(map, row.public_id, row.total);
    } catch (err) {
      console.error("[zikr] reach source", err);
    }
  }
  return map;
}

export type ReachBoard = { ok: boolean; rows: { at: string; n: number }[]; accepted: number[] };

export const milestoneBoard = createServerFn({ method: "POST" })
  .validator((raw: unknown) =>
    z
      .object({
        publicId: z.string().regex(/^\d{8}$/).optional(),
        total: z.number().int().min(0).max(999_000_000_000).optional(),
        ats: z.array(z.number().int().min(0).max(999_000_000_000)).max(80).optional(),
      })
      .parse(raw),
  )
  .handler(async ({ data }): Promise<ReachBoard> => {
    try {
      const sql = await getSql();
      const map = await peopleTotals(sql);
      const id = data.publicId ? await aliasOf(sql, data.publicId) : "";
      if (/^\d{8}$/.test(id) && !DROPPED_RATING_IDS.includes(id)) {
        const reported = Math.max(0, Math.floor(data.total ?? 0));
        if (map.has(id) || reported > 0) rememberTotal(map, id, Math.max(map.get(id) ?? 0, reported));
      }
      const rows = REACH_AT.map((at) => {
        let n = 0;
        for (const total of map.values()) if (total >= at) n += 1;
        return { at: String(at), n };
      });
      return { ok: true, rows, accepted: [] };
    } catch (err) {
      console.error("[zikr] reach", err);
      return { ok: false, rows: [], accepted: [] };
    }
  });

