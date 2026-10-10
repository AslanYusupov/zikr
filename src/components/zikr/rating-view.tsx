import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { TooltipProps } from "recharts";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { invitees, leaderboard, presenceBoard, worldBoard, type BoardRow, type CloudMeta, type Invitee, type PresenceRow, type WorldRow } from "@/lib/zikr/api";
import { formatNum, bestWeek, goalStreak, inviteLink, recentDays, recordToBeat, thisWeek, todayKey, zikrWord } from "@/lib/zikr/format";
import { InviteButtons } from "./settings-view";
import { t, tx } from "@/lib/zikr/i18n";
import type { LangId } from "@/lib/zikr/types";
import { useZikr } from "@/lib/zikr/store";
import { cn } from "@/lib/cn";

const HIDDEN_RATING_IDS = new Set(["89020984", "389020984", "31549154", "88880455", "62012303", "60912327"]);

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

function shown<T extends { id: string }>(rows: T[] | null | undefined): T[] {
  return (rows ?? []).filter((row) => !HIDDEN_RATING_IDS.has(row.id));
}

export function RatingView({ meta }: { meta: CloudMeta | null }) {
  const days = useZikr((s) => s.days);
  const bestDay = useZikr((s) => s.bestDay);
  const goal = useZikr((s) => s.goal);
  const { user, isPending } = useCurrentUserState();
  const publicId = useZikr((s) => s.publicId);
  const lang = useZikr((s) => s.lang);
  const [world, setWorld] = useState<WorldRow[] | null>(null);
  const [worldRank, setWorldRank] = useState<number | null>(null);
  const [worldError, setWorldError] = useState(false);
  const [online, setOnline] = useState<number | null>(null);
  const [allTaps, setAllTaps] = useState<number | null>(null);
  const [live, setLive] = useState<PresenceRow[] | null>(null);
  const [daily, setDaily] = useState<PresenceRow[] | null>(null);
  const [dailyRank, setDailyRank] = useState<number | null>(null);
  const [rows, setRows] = useState<BoardRow[] | null>(null);
  const [boardMeta, setBoardMeta] = useState(meta);
  const [error, setError] = useState(false);
  const [guests, setGuests] = useState<Invitee[] | null>(null);
  const [copied, setCopied] = useState(false);
  const day = todayKey();
  const today = days[day]?.total ?? 0;
  const record = recordToBeat(days, bestDay, day);
  const week = thisWeek(days, day);
  const chart = recentDays(days, 14, day);
  const mark = Math.max(record, today);

  useEffect(() => {
    setBoardMeta(meta);
  }, [meta]);

  useEffect(() => {
    if (!/^\d{8}$/.test(publicId)) return;
    let stop = false;
    const load = () => {
      invitees({ data: { publicId } })
        .then((res) => {
          if (!stop) setGuests(shown(res.rows));
        })
        .catch(() => {
          if (!stop) setGuests([]);
        });
    };
    load();
    const id = window.setInterval(load, 20000);
    return () => {
      stop = true;
      window.clearInterval(id);
    };
  }, [publicId]);

  useEffect(() => {
    if (!/^\d{8}$/.test(publicId)) return;
    let stop = false;
    const load = () => {
      if (document.hidden) return;
      worldBoard({ data: { publicId } })
        .then((res) => {
          if (stop) return;
          setWorld(shown(res.rows));
          setWorldRank(HIDDEN_RATING_IDS.has(publicId) ? null : (res.mine?.rank ?? null));
          setWorldError(false);
        })
        .catch(() => {
          if (!stop) setWorldError(true);
        });
      presenceBoard({ data: { publicId, dayKey: day } })
        .then((res) => {
          if (stop) return;
          setOnline(res.remembering);
          setAllTaps(res.allTaps);
          setLive(shown(res.live));
          setDaily(shown(res.daily));
          setDailyRank(res.dailyRank);
        })
        .catch(() => {});
    };
    load();
    const onLive = () => load();
    const id = window.setInterval(load, 4000);
    window.addEventListener("zikr-live", onLive);
    return () => {
      stop = true;
      window.clearInterval(id);
      window.removeEventListener("zikr-live", onLive);
    };
  }, [publicId, day]);

  useEffect(() => {
    if (!user?.id) return;
    let stop = false;
    leaderboard()
      .then((res) => {
        if (stop) return;
        setRows(res.rows);
        if (res.meta) setBoardMeta(res.meta);
      })
      .catch(() => {
        if (!stop) setError(true);
      });
    return () => {
      stop = true;
    };
  }, [user?.id]);

  async function share() {
    const code = /^\d{8}$/.test(publicId) ? publicId : useZikr.getState().ensurePublicId();
    const link = inviteLink(code);
    const text = `${t(lang, "inviteShare")}\n${link}`;
    try {
      if (navigator.share) await navigator.share({ title: t(lang, "zikr"), text });
      else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
      } catch {
        /* the button stays */
      }
    }
  }

  const selfLine =
    record > today
      ? `${t(lang, "selfRecord")} — ${formatNum(record)}. ${t(lang, "selfToday")} ${formatNum(today)}. ${t(lang, "selfLeft")} ${formatNum(record - today)}. ${t(lang, "selfNote")}`
      : today > 0 && today === record
        ? t(lang, "selfEven")
        : today > record
          ? `${t(lang, "selfToday")} ${formatNum(today)}. ${t(lang, "selfAhead")}`
          : `${t(lang, "selfRecord")} — ${formatNum(record)}. ${t(lang, "selfToday")} ${formatNum(today)}. ${t(lang, "selfNote")}`;

  return (
    <div className="pane px-4 pt-2 pb-8">
      <article className="rounded-3xl border border-line bg-surface px-4 py-4">
        <p className="text-xs tracking-wide text-gold uppercase">{t(lang, "selfTitle")}</p>
        <h2 className="mt-1 text-2xl text-fg">
          {formatNum(mark)} {zikrWord(mark, lang)}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">{selfLine}</p>
      </article>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Mini label={t(lang, "bestDayLabel")} value={formatNum(bestDay)} />
        <Mini label={t(lang, "weekLabel")} value={formatNum(week)} />
        <Mini label={t(lang, "bestWeekLabel")} value={formatNum(bestWeek(days))} />
        <Mini label={t(lang, "goalDaysLabel")} value={String(goalStreak(days, goal, day))} />
      </div>
      <h2 className="mt-5 text-xs tracking-wide text-gold uppercase">{t(lang, "days14")}</h2>
      <div className="mt-2 h-28 w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chart} barCategoryGap="28%">
            <XAxis dataKey="label" tick={{ fill: "var(--muted)", fontSize: 10 }} axisLine={false} tickLine={false} interval={1} />
            <YAxis hide />
            <Tooltip cursor={{ fill: "transparent" }} content={<Tip lang={lang} />} />
            <Bar dataKey="total" fill="var(--gold)" radius={[6, 6, 0, 0]} maxBarSize={18} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <button type="button" onClick={() => void share()} className="mt-2 h-11 w-full rounded-full bg-gold text-sm text-ink">
        {copied ? t(lang, "shareCopied") : t(lang, "shareResult")}
      </button>
      <InviteButtons />

      <h2 className="mt-6 text-xs tracking-wide text-gold uppercase">{t(lang, "allDhikr")}</h2>
      <p className="mt-1 max-w-full text-2xl leading-none tabular-nums break-all text-fg">{allTaps === null ? "…" : formatNum(allTaps * 10)}</p>
      <h2 className="mt-5 text-xs tracking-wide text-gold uppercase">{t(lang, "online")}</h2>
      <p className="mt-1 text-2xl tabular-nums text-fg">{online === null ? "…" : formatNum(online)}</p>
      {live && live.length > 0 ? <Board rows={live} publicId={publicId} empty="" namesOnly lang={lang} /> : null}
      <h2 className="mt-5 text-xs tracking-wide text-gold uppercase">{t(lang, "daily")}</h2>
      <p className="mt-1 text-sm leading-relaxed text-muted">{t(lang, "ratingDaily")}</p>
      <Board rows={daily} publicId={publicId} empty={t(lang, "dailyQuiet")} lang={lang} />
      {dailyRank ? <p className="mt-2 text-sm text-muted">{t(lang, "dailyPlace")}: {formatNum(dailyRank)}.</p> : null}

      <h2 className="mt-6 text-xs tracking-wide text-gold uppercase">{t(lang, "world")}</h2>
      <p className="mt-1 text-sm leading-relaxed text-muted">
        {t(lang, "ratingWorld")}{" "}
        <span className="tabular-nums text-fg">{publicId && !HIDDEN_RATING_IDS.has(publicId) ? publicId : "…"}</span>
      </p>
      {worldError && <p className="mt-3 text-sm text-muted">{t(lang, "worldClosed")}</p>}
      {world && world.length === 0 && <p className="mt-3 text-sm text-muted">{t(lang, "worldQuiet")}</p>}
      {world && world.length > 0 && (
        <ol className="mt-3 grid gap-1.5">
          {world.map((row) => (
            <li
              key={row.id}
              className={cn(
                "flex items-center justify-between gap-3 rounded-2xl border px-3 py-2",
                row.id === publicId ? "border-gold bg-surface" : "border-line bg-surface",
              )}
            >
              <span className="min-w-0 truncate text-sm tabular-nums text-fg">
                <span className="mr-2 text-muted">{row.rank}.</span>
                {row.id}
                {row.id === publicId ? ` · ${tx(lang, "you")}` : ""}
              </span>
              <span className="shrink-0 text-sm tabular-nums text-gold">{formatNum(row.total * 10)}</span>
            </li>
          ))}
        </ol>
      )}
      {worldRank && !HIDDEN_RATING_IDS.has(publicId) ? <p className="mt-2 text-sm text-muted">{t(lang, "yourPlace")}: {formatNum(worldRank)}.</p> : null}

      <h2 className="mt-6 text-xs tracking-wide text-gold uppercase">{tx(lang, "namedList")}</h2>
      <p className="mt-1 text-sm leading-relaxed text-muted">{tx(lang, "namedLead")}</p>
      {isPending && <p className="mt-3 text-sm text-muted">{tx(lang, "whoIn")}</p>}
      {user && error && <p className="mt-3 text-sm text-muted">{t(lang, "numbersSafe")}</p>}
      {user && rows && rows.length === 0 && <p className="mt-3 text-sm text-muted">{t(lang, "quietHere")}</p>}
      {user && rows && rows.length > 0 && (
        <ol className="mt-3 grid gap-1.5">
          {rows.map((row, i) => (
            <li
              key={`${row.name}-${i}`}
              className={cn("flex items-center justify-between gap-3 rounded-2xl border px-3 py-2", row.mine ? "border-gold bg-surface" : "border-line bg-surface")}
            >
              <span className="min-w-0 truncate text-sm text-fg">
                <span className="mr-2 text-muted">{i + 1}</span>
                {row.name}
                {row.mine ? ` · ${tx(lang, "you")}` : ""}
              </span>
              <span className="shrink-0 text-sm tabular-nums text-gold">{formatNum(row.total * 10)}</span>
            </li>
          ))}
        </ol>
      )}
      {user && boardMeta?.rank ? <p className="mt-2 text-sm text-muted">{t(lang, "placeAbout")} {formatNum(boardMeta.rank)}.</p> : null}

      <article className="mt-5 rounded-3xl border border-line bg-surface px-4 py-4">
        <h2 className="text-lg text-fg">{tx(lang, "pointGood")}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">{tx(lang, "pointLead")}</p>
        {guests && guests.length > 0 ? (
          <ol className="mt-3 grid gap-1.5">
            {guests.map((row) => (
              <li key={row.id} className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-bg px-3 py-2">
                <span className="text-sm tabular-nums text-fg">{row.id}</span>
                <span className="text-sm tabular-nums text-gold">{formatNum(row.total * 10)} {t(lang, "sawab")}</span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-3 text-sm text-muted">{tx(lang, "noGuests")}</p>
        )}
        {guests && guests.length > 0 ? (
          <p className="mt-3 text-sm text-fg">
            {tx(lang, "cameBy").replace("{n}", formatNum(guests.length))} {tx(lang, "theirHasanat").replace("{n}", formatNum(guests.reduce((sum, row) => sum + row.total * 10, 0)))}
          </p>
        ) : null}
      </article>
    </div>
  );
}

function Board({
  rows,
  publicId,
  empty,
  namesOnly,
  lang,
}: {
  rows: PresenceRow[] | null;
  publicId: string;
  empty: string;
  taps?: boolean;
  namesOnly?: boolean;
  lang: LangId;
}) {
  const list = shown(rows);
  if (list.length === 0) return <p className="mt-2 text-sm text-muted">{empty}</p>;
  return (
    <ol className="mt-2 grid gap-1.5">
      {list.map((row) => (
        <li
          key={row.id}
          className={cn("flex items-center justify-between gap-3 rounded-2xl border px-3 py-2", row.id === publicId ? "border-gold bg-surface" : "border-line bg-surface")}
        >
          <span className="min-w-0 truncate text-sm tabular-nums text-fg">
            <span className="mr-2 text-muted">{row.rank}.</span>
            {row.country === "HL" ? <i className="rayah" /> : FLAGS[row.country] ? `${FLAGS[row.country]} ` : ""}
            {row.id}
            {row.id === publicId ? ` · ${tx(lang, "you")}` : ""}
          </span>
          {namesOnly ? null : <span className="shrink-0 text-sm tabular-nums text-gold">{formatNum(row.value * 10)}</span>}
        </li>
      ))}
    </ol>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-surface px-3 py-3">
      <p className="text-xs text-muted">{label}</p>
      <p className="stat-value mt-1 leading-none text-fg tabular-nums">{value}</p>
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
