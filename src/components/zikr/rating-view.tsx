import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { TooltipProps } from "recharts";
import { invitees, presenceBoard, worldBoard, type Invitee, type PresenceRow, type WorldRow } from "@/lib/zikr/api";
import { formatNum, bestWeek, goalStreak, recentDays, recordToBeat, thisWeek, todayKey, zikrWord } from "@/lib/zikr/format";
import { InviteButtons } from "./settings-view";
import { RewardsView } from "./rewards-view";
import { t, tx, degreeName } from "@/lib/zikr/i18n";
import type { LangId } from "@/lib/zikr/types";
import { useZikr } from "@/lib/zikr/store";
import { levelFromXp } from "@/lib/zikr/levels";
import { cn } from "@/lib/cn";

const HIDDEN_RATING_IDS = new Set(["89020984", "389020984", "31549154", "88880455", "62012303", "60912327", "18532226", "95498997", "25574036", "50170262"]);

const FLAGS: Record<string, string> = {
  RU: "🇷🇺",
  SA: "🇸🇦",
  TR: "🇹🇷",
  ID: "🇮🇩",
  PK: "🇵🇰",
  AE: "🇦🇪",
  QA: "🇶🇦",
  EG: "🇪🇬",
  PS: "🇵🇸",
  MA: "🇲🇦",
  DZ: "🇩🇿",
  MY: "🇲🇾",
  KZ: "🇰🇿",
  UZ: "🇺🇿",
  AZ: "🇦🇿",
  TJ: "🇹🇯",
  GB: "🇬🇧",
  US: "🇺🇸",
  DE: "🇩🇪",
  FR: "🇫🇷",
};

const RATING_CACHE = "zikr-rating-v1";

type RatingCache = {
  at: number;
  ownTotal: number;
  world: WorldRow[];
  worldRank: number | null;
  online: number | null;
  allTaps: number | null;
  live: PresenceRow[];
  daily: PresenceRow[];
  dailyRank: number | null;
  guests: Invitee[];
};

function readRatingCache(): RatingCache | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(RATING_CACHE);
    if (!raw) return null;
    const data = JSON.parse(raw) as Partial<RatingCache>;
    if (!data || typeof data.at !== "number" || !Array.isArray(data.world)) return null;
    return {
      at: data.at,
      ownTotal: typeof data.ownTotal === "number" ? data.ownTotal : 0,
      world: data.world,
      worldRank: typeof data.worldRank === "number" ? data.worldRank : null,
      online: typeof data.online === "number" ? data.online : null,
      allTaps: typeof data.allTaps === "number" ? data.allTaps : null,
      live: Array.isArray(data.live) ? data.live : [],
      daily: Array.isArray(data.daily) ? data.daily : [],
      dailyRank: typeof data.dailyRank === "number" ? data.dailyRank : null,
      guests: Array.isArray(data.guests) ? data.guests : [],
    };
  } catch {
    return null;
  }
}

function writeRatingCache(cache: RatingCache) {
  try {
    localStorage.setItem(RATING_CACHE, JSON.stringify(cache));
  } catch {
    /* private mode */
  }
}

function clockOf(at: number, lang: LangId) {
  const locale = lang === "ru" ? "ru-RU" : lang === "ar" ? "ar" : lang === "id" ? "id-ID" : lang === "tr" ? "tr-TR" : lang === "ur" ? "ur-PK" : "en-GB";
  try {
    return new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit" }).format(at);
  } catch {
    return "";
  }
}

function liftRows<T extends { id: string; rank: number; hidden?: boolean }>(
  rows: T[] | null,
  id: string,
  read: (row: T) => number,
  write: (row: T, value: number) => T,
  local: number,
  listed: boolean,
): T[] | null {
  if (!rows || !listed || local <= 0 || !/^\d{8}$/.test(id)) return rows;
  if (!rows.some((row) => row.id === id && !row.hidden)) return rows;
  const next = rows.map((row) => (row.id === id && !row.hidden ? write(row, Math.max(read(row), local)) : row));
  const open = next.filter((row) => !row.hidden).sort((a, b) => read(b) - read(a) || a.rank - b.rank);
  let openAt = 0;
  return next.map((row) => (row.hidden ? row : open[openAt++]));
}

function until<T>(work: Promise<T>, ms = 8000): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error("slow")), ms);
    work.then(
      (value) => {
        window.clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        window.clearTimeout(timer);
        reject(err);
      },
    );
  });
}

function shown<T extends { id: string; total?: number; value?: number; hidden?: boolean }>(rows: T[] | null | undefined): T[] {
  return (rows ?? []).filter((row) => {
    if (HIDDEN_RATING_IDS.has(row.id)) return false;
    if (row.hidden) return true;
    if (typeof row.total === "number" && row.total <= 0) return false;
    if (typeof row.value === "number" && row.value <= 0) return false;
    return true;
  });
}

function useSavedRating(): RatingCache | null {
  const ref = useRef<RatingCache | null | undefined>(undefined);
  if (ref.current === undefined) ref.current = readRatingCache();
  return ref.current;
}

export function RatingView() {
  const days = useZikr((s) => s.days);
  const bestDay = useZikr((s) => s.bestDay);
  const goal = useZikr((s) => s.goal);
  const publicId = useZikr((s) => s.publicId);
  const listed = useZikr((s) => s.publicBoard);
  const total = useZikr((s) => s.total);
  const xp = useZikr((s) => s.xp);
  const lang = useZikr((s) => s.lang);
  const saved = useSavedRating();
  const bag = useRef<RatingCache | null>(saved);
  const [world, setWorld] = useState<WorldRow[] | null>(saved ? shown(saved.world) : null);
  const [worldRank, setWorldRank] = useState<number | null>(saved?.worldRank ?? null);
  const [worldError, setWorldError] = useState(false);
  const [held, setHeld] = useState(Boolean(saved));
  const [updatedAt, setUpdatedAt] = useState<number | null>(saved?.at ?? null);
  const [baseTotal, setBaseTotal] = useState(saved?.ownTotal ?? 0);
  const [online, setOnline] = useState<number | null>(saved?.online ?? null);
  const [allTaps, setAllTaps] = useState<number | null>(saved?.allTaps ?? null);
  const [live, setLive] = useState<PresenceRow[] | null>(saved ? shown(saved.live) : null);
  const [daily, setDaily] = useState<PresenceRow[] | null>(saved ? shown(saved.daily) : null);
  const [dailyRank, setDailyRank] = useState<number | null>(saved?.dailyRank ?? null);
  const [guests, setGuests] = useState<Invitee[] | null>(saved ? shown(saved.guests) : null);
  const [maskMine, setMaskMine] = useState(false);
  const [vpn, setVpn] = useState(false);
  const [rewards, setRewards] = useState(false);
  const miss = useRef({ world: false, live: false });
  const day = todayKey();
  const today = days[day]?.total ?? 0;
  const record = recordToBeat(days, bestDay, day);
  const week = thisWeek(days, day);
  const chart = recentDays(days, 14, day);
  const mark = Math.max(record, today);
  const mine = (n: number) => (maskMine ? "***" : formatNum(n));
  const toggleMine = () => {
    setMaskMine((hidden) => {
      const next = !hidden;
      try {
        localStorage.setItem("zikr-rating-mask", next ? "1" : "0");
      } catch {
        /* keep the hide for this visit */
      }
      return next;
    });
  };

  useEffect(() => {
    setMaskMine(localStorage.getItem("zikr-rating-mask") === "1");
  }, []);

  function remember(patch: Partial<RatingCache>, fresh = false) {
    const prev = bag.current;
    const ownTotal = fresh ? useZikr.getState().total : (prev?.ownTotal ?? useZikr.getState().total);
    const next: RatingCache = {
      at: fresh ? Date.now() : (prev?.at ?? Date.now()),
      ownTotal,
      world: patch.world ?? prev?.world ?? [],
      worldRank: patch.worldRank === undefined ? (prev?.worldRank ?? null) : patch.worldRank,
      online: patch.online === undefined ? (prev?.online ?? null) : patch.online,
      allTaps: patch.allTaps === undefined ? (prev?.allTaps ?? null) : patch.allTaps,
      live: patch.live ?? prev?.live ?? [],
      daily: patch.daily ?? prev?.daily ?? [],
      dailyRank: patch.dailyRank === undefined ? (prev?.dailyRank ?? null) : patch.dailyRank,
      guests: patch.guests ?? prev?.guests ?? [],
    };
    bag.current = next;
    writeRatingCache(next);
    if (!fresh) return;
    setBaseTotal(next.ownTotal);
    setUpdatedAt(next.at);
    setHeld(false);
    setWorldError(false);
  }

  useEffect(() => {
    if (total < 10_000) return;
    if (!/^\d{8}$/.test(publicId)) return;
    let stop = false;
    const load = () => {
      invitees({ data: { publicId } })
        .then((res) => {
          if (!stop) {
            const rows = shown(res.rows);
            setGuests(rows);
            remember({ guests: rows }, false);
          }
        })
        .catch(() => {
          if (!stop) setGuests((prev) => prev ?? bag.current?.guests ?? []);
        });
    };
    load();
    const id = window.setInterval(load, 60_000);
    return () => {
      stop = true;
      window.clearInterval(id);
    };
  }, [publicId, total]);

  useEffect(() => {
    if (total < 10_000) return;
    if (!/^\d{8}$/.test(publicId)) return;
    let stop = false;
    const load = () => {
      if (document.hidden) return;
      const mark = (part: "world" | "live", ok: boolean) => {
        miss.current[part] = !ok;
        setVpn(miss.current.world || miss.current.live);
      };
      until(worldBoard({ data: { publicId, dayKey: day } }))
        .then((res) => {
          if (stop) return;
          const rows = shown(res.rows);
          const rank = HIDDEN_RATING_IDS.has(publicId) ? null : (res.mine?.rank ?? null);
          setWorld(rows);
          setWorldRank(rank);
          remember({ world: rows, worldRank: rank }, true);
          mark("world", true);
        })
        .catch(() => {
          if (stop) return;
          if (bag.current) setHeld(true);
          else setWorldError(true);
          mark("world", false);
        });
      until(presenceBoard({ data: { publicId, dayKey: day } }))
        .then((res) => {
          if (stop) return;
          const liveRows = shown(res.live);
          const dailyRows = shown(res.daily);
          setOnline(res.remembering);
          setAllTaps(res.allTaps);
          setLive(liveRows);
          setDaily(dailyRows);
          setDailyRank(res.dailyRank);
          remember({ online: res.remembering, allTaps: res.allTaps, live: liveRows, daily: dailyRows, dailyRank: res.dailyRank }, true);
          mark("live", true);
        })
        .catch(() => {
          if (stop) return;
          if (bag.current) setHeld(true);
          mark("live", false);
        });
    };
    load();
    const onLive = () => load();
    const onWake = () => {
      if (document.visibilityState === "visible") load();
    };
    const id = window.setInterval(load, 20_000);
    window.addEventListener("zikr-live", onLive);
    window.addEventListener("online", onWake);
    document.addEventListener("visibilitychange", onWake);
    const link = (navigator as Navigator & { connection?: EventTarget }).connection;
    link?.addEventListener?.("change", onWake);
    return () => {
      stop = true;
      window.clearInterval(id);
      window.removeEventListener("zikr-live", onLive);
      window.removeEventListener("online", onWake);
      document.removeEventListener("visibilitychange", onWake);
      link?.removeEventListener?.("change", onWake);
    };
  }, [publicId, day, total]);

  const selfLine =
    record > today
      ? `${t(lang, "selfRecord")} — ${mine(record)}. ${t(lang, "selfToday")} ${mine(today)}. ${t(lang, "selfLeft")} ${mine(record - today)}. ${t(lang, "selfNote")}`
      : today > 0 && today === record
        ? t(lang, "selfEven")
        : today > record
          ? `${t(lang, "selfToday")} ${mine(today)}. ${t(lang, "selfAhead")}`
          : `${t(lang, "selfRecord")} — ${mine(record)}. ${t(lang, "selfToday")} ${mine(today)}. ${t(lang, "selfNote")}`;

  const tapsShown = allTaps == null ? null : allTaps + Math.max(0, total - baseTotal);
  const reveal = listed || today >= 10_000;
  const worldShown = liftRows(world, publicId, (row) => row.total, (row, value) => ({ ...row, total: value }), total, reveal);
  const dailyShown = liftRows(daily, publicId, (row) => row.value, (row, value) => ({ ...row, value }), today, reveal);
  const liveShown = liftRows(live, publicId, (row) => row.value, (row, value) => ({ ...row, value }), today, reveal);
  const myWorldRank = worldShown?.find((row) => row.id === publicId)?.rank ?? worldRank;
  const myDailyRank = dailyShown?.find((row) => row.id === publicId)?.rank ?? dailyRank;
  const clock = updatedAt ? clockOf(updatedAt, lang) : "";
  const ratingNeed = 10_000;
  const onlineOpen = total >= ratingNeed;
  const left = Math.max(0, ratingNeed - total);
  const done = Math.max(0, Math.min(100, (total / ratingNeed) * 100));
  const degree = levelFromXp(xp);

  if (rewards) {
    return (
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <button type="button" onClick={() => setRewards(false)} className="mx-4 mt-2 flex h-10 shrink-0 items-center gap-1 text-sm text-gold">
          <ChevronLeft className="size-4" />
          {t(lang, "rating")}
        </button>
        <RewardsView />
      </div>
    );
  }

  return (
    <div className="pane px-4 pt-2 pb-8">
      <button type="button" onClick={() => setRewards(true)} className="mb-3 flex w-full items-center gap-3 rounded-3xl border border-line bg-surface px-3.5 py-3 text-start">
        <span dir="rtl" lang="ar" className="shrink-0 font-arabic text-[1.7rem] leading-none text-gold">حَسَنَة</span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-fg">{t(lang, "rewards")}</span>
          <span className="mt-0.5 block truncate text-xs text-muted">{t(lang, "degree")} {formatNum(degree.level)} · {degreeName(lang, degree.level)}</span>
        </span>
        <ChevronRight className="size-4 shrink-0 text-gold rtl:rotate-180" />
      </button>
      <article className="rounded-3xl border border-line bg-surface px-4 py-4">
        <p className="text-xs tracking-wide text-gold uppercase">{t(lang, "selfTitle")}</p>
        <h2 className="mt-1 break-words text-2xl leading-tight text-fg" onClick={toggleMine}>
          {mine(mark)} {zikrWord(mark, lang)}
        </h2>
        <p className="mt-2 break-words text-sm leading-relaxed text-muted">{selfLine}</p>
      </article>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Mini label={t(lang, "bestDayLabel")} value={mine(bestDay)} />
        <Mini label={t(lang, "weekLabel")} value={mine(week)} />
        <Mini label={t(lang, "bestWeekLabel")} value={mine(bestWeek(days))} />
        <Mini label={t(lang, "goalDaysLabel")} value={maskMine ? "***" : String(goalStreak(days, goal, day))} />
      </div>
      <h2 className="mt-5 text-xs tracking-wide text-gold uppercase">{t(lang, "days14")}</h2>
      <div className="mt-2 h-28 w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chart} barCategoryGap="28%">
            <XAxis dataKey="label" tick={{ fill: "var(--muted)", fontSize: 10 }} axisLine={false} tickLine={false} minTickGap={18} />
            <YAxis hide />
            <Tooltip cursor={{ fill: "transparent" }} content={<Tip lang={lang} />} />
            <Bar dataKey="total" fill="var(--gold)" radius={[6, 6, 0, 0]} maxBarSize={18} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <InviteButtons />

      {onlineOpen ? (
      <>
      <h2 className="mt-6 text-xs tracking-wide text-gold uppercase">{t(lang, "allDhikr")}</h2>
      <p className="mt-1 max-w-full text-2xl leading-none tabular-nums text-fg">{tapsShown === null ? "…" : formatNum(tapsShown)}</p>
      <h2 className="mt-5 text-xs tracking-wide text-gold uppercase">{t(lang, "online")}</h2>
      <p className="mt-1 text-2xl tabular-nums text-fg">{online === null ? "…" : formatNum(online)}</p>
      {liveShown && liveShown.length > 0 ? <Board rows={liveShown} publicId={publicId} empty="" namesOnly lang={lang} mask={maskMine} onMine={toggleMine} /> : null}
      <h2 className="mt-5 text-xs tracking-wide text-gold uppercase">{t(lang, "daily")}</h2>
      <p className="mt-1 text-sm leading-relaxed text-muted">{t(lang, "ratingDaily")}</p>
      <Board rows={dailyShown} publicId={publicId} empty={t(lang, "dailyQuiet")} lang={lang} mask={maskMine} onMine={toggleMine} />
      {myDailyRank && today > 0 && !HIDDEN_RATING_IDS.has(publicId) ? <p className="mt-2 text-sm text-muted" onClick={toggleMine}>{t(lang, "dailyPlace")}: {maskMine ? "***" : formatNum(myDailyRank)}.</p> : null}

      <h2 className="mt-6 text-xs tracking-wide text-gold uppercase">{t(lang, "world")}</h2>
      {vpn ? <p className="mt-1 text-sm text-gold">{t(lang, "ratingVpn")}</p> : null}
      <p className="mt-1 text-sm leading-relaxed text-muted" onClick={toggleMine}>
        {t(lang, "ratingWorld")}{" "}
        <span className="tabular-nums text-fg">{publicId && !HIDDEN_RATING_IDS.has(publicId) ? (maskMine ? "***" : publicId) : "…"}</span>
      </p>
      {clock ? <p className="mt-1 text-xs text-muted">{(held ? t(lang, "ratingHeld") : t(lang, "ratingAt")).replace("{time}", clock)}</p> : null}
      {worldError && !worldShown?.length ? <p className="mt-3 text-sm text-muted">{t(lang, "worldClosed")}</p> : null}
      {worldShown && worldShown.length === 0 && <p className="mt-3 text-sm text-muted">{t(lang, "worldQuiet")}</p>}
      {worldShown && worldShown.length > 0 && (
        <ol className="mt-3 grid gap-1.5">
          {worldShown.map((row) => {
            const own = row.id === publicId;
            return (
            <li
              key={row.id}
              onClick={own ? toggleMine : undefined}
              className={cn(
                "flex items-center justify-between gap-3 rounded-2xl border px-3 py-2",
                own ? "border-gold bg-surface" : "border-line bg-surface",
              )}
            >
              <span className="min-w-0 truncate text-sm tabular-nums text-fg">
                <span className="mr-2 text-muted">{row.rank}.</span>
                {own && maskMine ? "***" : row.id}
                {own ? ` · ${tx(lang, "you")}` : ""}
              </span>
              <span className="shrink-0 text-sm tabular-nums text-gold">{own && maskMine ? "***" : row.hidden ? "—" : formatNum(row.total)}</span>
            </li>
            );
          })}
        </ol>
      )}
      {worldShown && publicId && !HIDDEN_RATING_IDS.has(publicId) && myWorldRank && !worldShown.some((row) => row.id === publicId) ? (
        <div className="mt-1.5 flex items-center justify-between gap-3 rounded-2xl border border-gold bg-surface px-3 py-2" onClick={toggleMine}>
          <span className="min-w-0 truncate text-sm tabular-nums text-fg">
            <span className="mr-2 text-muted">{maskMine ? "***" : formatNum(myWorldRank)}.</span>
            {maskMine ? "***" : publicId}
            {` · ${tx(lang, "you")}`}
          </span>
          <span className="shrink-0 text-sm tabular-nums text-gold">{maskMine ? "***" : reveal ? formatNum(total) : "—"}</span>
        </div>
      ) : null}
      {myWorldRank && !HIDDEN_RATING_IDS.has(publicId) ? (
        <p className="mt-2 text-sm text-fg" onClick={toggleMine}>
          {t(lang, "yourPlace")}: {maskMine ? "***" : formatNum(myWorldRank)}.
          {publicId ? ` · ${maskMine ? "***" : publicId}` : ""}
          {` · ${tx(lang, "you")}`}
        </p>
      ) : null}

      <article className="mt-5 rounded-3xl border border-line bg-surface px-4 py-4">
        <h2 className="text-lg text-fg">{tx(lang, "pointGood")}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">{tx(lang, "pointLead")}</p>
        {guests == null ? null : guests.length > 0 ? (
          <ol className="mt-3 grid gap-1.5">
            {guests.map((row) => (
              <li key={row.id} className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-bg px-3 py-2">
                <span className="text-sm tabular-nums text-fg">{row.id}</span>
                <span className="text-sm tabular-nums text-gold">{formatNum(row.total)}</span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-3 text-sm text-muted">{tx(lang, "noGuests")}</p>
        )}
        {guests && guests.length > 0 ? (
          <p className="mt-3 text-sm text-fg">
            {tx(lang, "cameBy").replace("{n}", formatNum(guests.length))} {tx(lang, "theirHasanat").replace("{n}", formatNum(guests.reduce((sum, row) => sum + row.total, 0)))}
          </p>
        ) : null}
      </article>
      </>
      ) : (
        <article className="mt-6 min-w-0 overflow-hidden rounded-3xl border border-line bg-surface px-4 py-5">
          <p className="text-xs tracking-wide text-gold uppercase">{t(lang, "online")}</p>
          <h2 className="mt-2 text-base leading-snug break-words text-balance text-fg">{t(lang, "ratingLock")}</h2>
          <div className="mt-5 flex min-w-0 items-baseline justify-between gap-3">
            <p className="min-w-0 truncate text-2xl tabular-nums text-fg">{formatNum(total)}</p>
            <p className="shrink-0 text-sm tabular-nums text-muted">{t(lang, "left")} {formatNum(left)}</p>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-line" aria-hidden>
            <div className="h-full rounded-full bg-gold" style={{ width: `${done}%` }} />
          </div>
          <p className="mt-2 text-xs break-words text-muted">{t(lang, "ratingScale")}</p>
          <button type="button" disabled className="mt-5 h-11 w-full rounded-full bg-gold px-3 text-sm text-ink opacity-45">
            {t(lang, "ratingOpen")}
          </button>
        </article>
      )}
    </div>
  );
}

function Board({
  rows,
  publicId,
  empty,
  namesOnly,
  lang,
  mask,
  onMine,
}: {
  rows: PresenceRow[] | null;
  publicId: string;
  empty: string;
  taps?: boolean;
  namesOnly?: boolean;
  lang: LangId;
  mask?: boolean;
  onMine?: () => void;
}) {
  const list = shown(rows);
  if (rows == null) return null;
  if (list.length === 0) return <p className="mt-2 text-sm text-muted">{empty}</p>;
  return (
    <ol className="mt-2 grid gap-1.5">
      {list.map((row) => {
        const own = row.id === publicId;
        return (
        <li
          key={row.id}
          onClick={own ? onMine : undefined}
          className={cn("flex items-center justify-between gap-3 rounded-2xl border px-3 py-2", own ? "border-gold bg-surface" : "border-line bg-surface")}
        >
          <span className="min-w-0 truncate text-sm tabular-nums text-fg">
            <span className="mr-2 text-muted">{row.rank > 0 ? `${row.rank}.` : ""}</span>
            {row.country === "HL" ? <i className="rayah" /> : FLAGS[row.country] ? `${FLAGS[row.country]} ` : ""}
            {own && mask ? "***" : row.id}
            {own ? ` · ${tx(lang, "you")}` : ""}
          </span>
          {namesOnly || row.hidden ? <span className="shrink-0 text-sm text-muted">{own && mask ? "***" : row.hidden && !namesOnly ? "—" : ""}</span> : <span className="shrink-0 text-sm tabular-nums text-gold">{own && mask ? "***" : formatNum(row.value)}</span>}
        </li>
        );
      })}
    </ol>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 overflow-hidden rounded-2xl border border-line bg-surface px-3 py-3">
      <p className="text-xs break-words text-muted">{label}</p>
      <p className="stat-value mt-1 truncate leading-none text-fg tabular-nums">{value}</p>
    </div>
  );
}

function Tip({ active, payload, lang }: TooltipProps<number, string> & { lang?: LangId }) {
  if (!active || !payload?.length) return null;
  const n = Number(payload[0]?.value ?? 0);
  return (
    <div className="rounded-xl border border-line bg-surface px-2 py-1 text-xs text-fg">
      {formatNum(n)} {zikrWord(n, lang ?? "ru")}
    </div>
  );
}
