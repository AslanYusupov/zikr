import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { MILESTONES, QUOTES, REMEMBRANCE, dhikrById, rewardPoints } from "@/lib/zikr/content";
import { ALLAH_NAMES } from "@/lib/zikr/names";
import { sunnahQuestById } from "@/lib/zikr/quests";
import { addDays, formatNum, todayKey, zikrWord } from "@/lib/zikr/format";
import { t, tx, degreeName } from "@/lib/zikr/i18n";
import { levelFromXp } from "@/lib/zikr/levels";
import { noteTap } from "@/lib/zikr/live";
import { playAchievement, playTap } from "@/lib/zikr/sound";
import { triggerHaptic } from "@/lib/zikr/haptic";
import { useZikr } from "@/lib/zikr/store";
import { quranCopy } from "@/lib/zikr/quran";
import { cite, localQuote, nameText, phraseOf } from "@/lib/zikr/tr";
import { cn } from "@/lib/cn";
import { Crescent } from "./pattern";

const C = 2 * Math.PI * 44;

type Rise = { id: number; dx: number; kind: "plus" | "moon" | "mote" | "word"; lag: string; text?: string; path: number };

function floatWord(arabic: string) {
  const first = arabic.split(/[،,]/)[0]?.trim() || arabic;
  return first.length > 22 ? `${first.slice(0, 20).trim()}…` : first;
}

function RiseItem({ item }: { item: Rise }) {
  const [go, setGo] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setGo(true));
    return () => cancelAnimationFrame(frame);
  }, []);
  return (
    <span
      className={cn(
        "rise",
        go && "is-go",
        item.kind === "word" && "is-word",
        item.kind === "plus" && "is-plus",
        item.kind !== "word" && item.kind !== "plus" && `path-${item.path}`,
      )}
      style={{ ["--dx" as string]: `${item.dx}px`, ["--lag" as string]: item.lag }}
    >
      {item.kind === "word" && (
        <>
          <span className="rise-word" dir="rtl" lang="ar">
            {item.text}
          </span>
          <span className="rise-plus">
            +10
            <span className="rise-sawab" dir="rtl" lang="ar">
              حسنات
            </span>
          </span>
        </>
      )}
      {item.kind === "moon" && <Crescent className="h-5 w-5 text-fg" />}
      {item.kind === "mote" && <span className="rise-mote" />}
    </span>
  );
}

function RiseLayer({
  rises,
  wordTop,
  layerRef,
}: {
  rises: Rise[];
  wordTop: string;
  layerRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div ref={layerRef} className="rise-layer" style={{ ["--word-top" as string]: wordTop }}>
      {rises.map((item) => (
        <RiseItem key={item.id} item={item} />
      ))}
    </div>
  );
}

function burst(id: number, word: string): Rise[] {
  return [
    { id: id * 10 + 1, dx: 0, kind: "word", lag: "0ms", text: word, path: 0 },
  ];
}

export function ModeStrip({
  quranOn,
  listOn,
  namesOn,
  onQuran,
  onList,
  onNames,
  onLeave,
}: {
  quranOn: boolean;
  listOn: boolean;
  namesOn: boolean;
  onQuran: () => void;
  onList: () => void;
  onNames: () => void;
  onLeave: () => void;
}) {
  const s = useZikr();
  const copy = quranCopy(s.lang);
  const scroller = useRef<HTMLDivElement>(null);
  const busy = quranOn || listOn || namesOn;

  useEffect(() => {
    const root = scroller.current;
    const active = root?.querySelector("[data-active='true']");
    if (!(active instanceof HTMLElement)) return;
    active.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
  }, [s.mode, quranOn, listOn, namesOn]);

  return (
    <div ref={scroller} dir="rtl" className="mode-strip scroll-x shrink-0 px-3 pt-1">
      <div className="flex w-max gap-1.5 pb-1">
        <Chip active={s.mode === "random" && !busy} onClick={() => { onLeave(); s.setMode("random"); }}>
          {t(s.lang, "random")}
        </Chip>
        <Chip active={quranOn} onClick={onQuran}>
          <span className="block max-w-36 truncate font-arabic text-sm leading-none" dir="rtl" lang="ar">الْقُرْآنُ الْكَرِيمُ</span>
          <span className="block max-w-32 truncate text-[0.65rem] leading-tight">{copy.quran}</span>
        </Chip>
        <Chip active={listOn} onClick={onList}>
          <span className="block max-w-36 truncate font-arabic text-sm leading-none" dir="rtl" lang="ar">ذِكْرُ اللَّهِ</span>
          <span className="block max-w-32 truncate text-[0.65rem] leading-tight">{t(s.lang, "dhikrTitle")}</span>
        </Chip>
        <Chip active={namesOn} onClick={onNames}>
          <span className="block max-w-36 truncate font-arabic text-sm leading-none" dir="rtl" lang="ar">أَسْمَاءُ اللَّهِ</span>
          <span className="block max-w-32 truncate text-[0.65rem] leading-tight">{t(s.lang, "names")}</span>
        </Chip>
        {REMEMBRANCE.map((d) => (
          <Chip
            key={d.id}
            active={s.mode === d.id && !busy}
            onClick={() => {
              onLeave();
              s.setMode(d.id);
            }}
          >
            <span className="block max-w-36 truncate font-arabic text-sm leading-none" dir="rtl" lang="ar">
              {d.arabic}
            </span>
            <span className="block max-w-32 truncate text-[0.65rem] leading-tight">{phraseOf(d, s.lang).short}</span>
          </Chip>
        ))}
      </div>
    </div>
  );
}

function quoteHold(text: string): number {
  const ms = 8000 + (text.length / 10) * 1000;
  return Math.round(Math.min(50000, Math.max(12000, ms)));
}

export function Counter({
  onNotice,
  onOpenLibrary,
  listOpen,
  onListClose,
  namesOpen,
  onNamesClose,
}: {
  onNotice: (text: string) => void;
  onOpenLibrary: (quoteIndex: number) => void;
  listOpen: boolean;
  onListClose: () => void;
  namesOpen: boolean;
  onNamesClose: () => void;
}) {
  const s = useZikr();
  const day = todayKey();
  const today = s.days[day]?.total ?? 0;
  const phrase = dhikrById(s.lastDhikrId);
  const level = levelFromXp(s.xp);
  const levelPct = level.need === 0 ? 1 : Math.min(1, level.into / level.need);
  const goalPct = s.goal > 0 ? Math.min(1, today / s.goal) : 0;
  const quest = sunnahQuestById(s.activeQuestId);
  const step = quest?.steps[s.questStep];
  const [pulse, setPulse] = useState(0);
  const [rises, setRises] = useState<Rise[]>([]);
  const [ripples, setRipples] = useState<number[]>([]);
  const seq = useRef(0);
  const orbRef = useRef<HTMLButtonElement>(null);
  const riseRef = useRef<HTMLDivElement>(null);
  const pressRef = useRef<() => void>(() => {});
  const [quoteAt, setQuoteAt] = useState(0);
  const quoteLive = useRef(false);
  const [virtue, setVirtue] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [wordTop, setWordTop] = useState("42%");
  const lastTap = useRef(0);
  const dragY = useRef<number | null>(null);

  useEffect(() => {
    quoteLive.current = true;
    setQuoteAt(Math.floor(Math.random() * QUOTES.length));
  }, []);

  useEffect(() => {
    if (!s.showWisdom || !quoteLive.current) return;
    const current = QUOTES[(Math.floor(s.wisdomStep / 360) + quoteAt) % QUOTES.length];
    const wait = quoteHold(current?.text ?? "");
    const timer = window.setTimeout(() => setQuoteAt((value) => value + 1), wait);
    return () => window.clearTimeout(timer);
  }, [s.showWisdom, quoteAt, s.wisdomStep]);

  function press(event?: { type?: string }) {
    triggerHaptic(event?.type === "click" ? "click" : "down");
    if (document.querySelector(".sheet, .names-sheet, .celebrate")) return;
    const now = Date.now();
    const since = now - lastTap.current;
    const ios = document.documentElement.dataset.os === "ios";
    if (since < 300) return;
    if (ios && event?.type === "click" && since < 800) return;
    lastTap.current = now;
    const orb = orbRef.current;
    const layer = riseRef.current;
    if (orb && layer) {
      const o = orb.getBoundingClientRect();
      const l = layer.getBoundingClientRect();
      if (l.height > 1) setWordTop(`${((o.top - l.top) / l.height) * 100}%`);
    }
    const result = useZikr.getState().tap();
    noteTap();
    const state = useZikr.getState();
    playTap(state.sound === "on" ? state.voice : "off", state.volume);
    const id = ++seq.current;
    setPulse(id);
    const spokenNow = dhikrById(result.dhikrId);
    setRises(burst(id, floatWord(spokenNow.arabic)));
    setRipples((list) => [...list.slice(-3), id]);
    window.setTimeout(() => {
      setRises((list) => list.filter((item) => Math.floor(item.id / 10) !== id));
      setRipples((list) => list.filter((item) => item !== id));
    }, 3400);
    window.setTimeout(() => {
      if (result.questDoneTitle) {
        if (state.sound === "on") playAchievement(state.volume);
        onNotice(`«${result.questDoneTitle}» ${t(state.lang, "noticeDone")}`);
      } else if (result.questAdvanced) onNotice(t(state.lang, "noticeNext"));
      else if (result.levelUp) onNotice(`${t(state.lang, "degree")} ${result.levelUp}. ${degreeName(state.lang, result.levelUp)}.`);
      else if (result.beatRecord) onNotice(t(state.lang, "noticeRecord"));
    }, 640);
  }

  pressRef.current = press;

  useEffect(() => {
    const w = window as Window & { __zikrEarly?: number; __zikrLive?: boolean; __zikrPress?: () => void };
    let done = false;
    const flush = () => {
      if (done) return;
      done = true;
      const extra = w.__zikrEarly || 0;
      w.__zikrEarly = 0;
      w.__zikrLive = true;
      w.__zikrPress = () => pressRef.current();
      for (let i = 0; i < extra; i += 1) useZikr.getState().tap();
    };
    if (useZikr.persist.hasHydrated()) flush();
    const unsub = useZikr.persist.onFinishHydration(flush);
    return () => {
      unsub();
      w.__zikrLive = false;
    };
  }, []);

  const spoken = phraseOf(phrase, s.lang);
  const showPhrase = !(s.mode === "random" && pulse === 0);
  const arabic = showPhrase ? phrase.arabic : "ذِكْر";
  const name = showPhrase ? spoken.name : t(s.lang, "random");
  const totalReward = rewardPoints(s.total + s.quranLetters);
  const yesterday = s.days[addDays(day, -1)]?.total ?? 0;
  const quoteIndex = (Math.floor(s.wisdomStep / 360) + quoteAt) % QUOTES.length;
  const quote = QUOTES[quoteIndex] ?? QUOTES[0];
  const shownQuote = localQuote(quote, s.lang);
  const rewardRing = totalReward <= 0 ? 0 : 1 - 1 / (1 + totalReward / 800);

  return (
    <div className="stage-wrap">
      <div
        className="stage stage-scroll"
        onClick={(event) => {
          if (!s.screenTap) return;
          const node = event.target;
          if (!(node instanceof Element)) return;
          if (node.closest("button, a, input, textarea, .scroll-x, .history-screen")) return;
          triggerHaptic();
          press(event);
        }}
      >
        <div className="main-screen">
          <div className="shrink-0 px-4 pt-1">
            <div className="flex items-baseline justify-between gap-3 text-[0.7rem] text-muted">
              <span className="truncate">
                {t(s.lang, "degree")} {level.level} · {degreeName(s.lang, level.level)}
              </span>
              <span className="shrink-0 tabular-nums">
                {formatNum(level.into)} / {formatNum(level.need)}
              </span>
            </div>
            <div className="mt-1 h-1 overflow-hidden rounded-full bg-surface">
              <div className="h-full rounded-full bg-gold" style={{ width: `${levelPct * 100}%` }} />
            </div>
          </div>
          <button
            type="button"
            className={cn("phrase-read shrink-0 overflow-y-auto px-4 pt-2 text-center", virtue && "phrase-open")}
            onClick={() => setVirtue((v) => !v)}
          >
            <p
              className={cn(
                "phrase-arabic mx-auto max-w-sm font-arabic leading-snug font-bold text-fg",
                arabic.length > 110 ? "text-sm" : arabic.length > 70 ? "text-base" : arabic.length > 36 ? "text-lg" : "text-2xl",
              )}
              dir="rtl"
              lang="ar"
            >
              {arabic}
            </p>
            <p className={cn("mt-0.5 font-extrabold leading-snug text-fg", name.length > 90 ? "text-[0.68rem]" : name.length > 42 ? "text-xs" : "text-sm")}>{name}</p>
            {virtue && showPhrase ? (
              <div className="mt-1 text-xs leading-snug text-muted">
                {phrase.full && s.lang === "ru" ? <p className="text-fg">{phrase.full}</p> : null}
                <p className="mt-1">{spoken.reward}</p>
                <p className="mt-1 text-[0.65rem]">{cite(phrase.source, s.lang)}</p>
              </div>
            ) : (
              <p className="mt-0.5 text-xs leading-snug text-muted">{showPhrase ? spoken.meaning : ""}</p>
            )}
          </button>
          <div className="orb-slot">
            <div className="relative grid place-items-center">
              <div className="halo" />
              <div className="halo halo-2" />
              {s.orbit && (
                <div className="orbit" aria-hidden>
                  <span className="orbit-sun">
                    <img className="sun-body" src="/orbit-sun.webp" alt="" draggable={false} />
                  </span>
                  <span className="orbit-moon">
                    <img className="moon-body" src="/orbit-moon.webp" alt="" draggable={false} />
                  </span>
                </div>
              )}
              <button
                ref={orbRef}
                type="button"
                className={cn("orb", today >= s.goal && s.goal > 0 && "orb-met")}
                onTouchStart={() => triggerHaptic("down")}
                onPointerDown={() => triggerHaptic("down")}
                onClick={(event) => {
                  triggerHaptic("click");
                  press(event);
                }}
                aria-label={`${tx(s.lang, "rememberAria")}: ${phrase.name}. ${t(s.lang, "today")} ${today}. ${t(s.lang, "total")} ${s.total}`}
              >
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" aria-hidden>
                  <circle cx="50" cy="50" r="48" fill="none" stroke="var(--line)" strokeWidth="0.6" />
                  <circle
                    cx="50"
                    cy="50"
                    r="48"
                    fill="none"
                    stroke="var(--gold)"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 48}
                    strokeDashoffset={2 * Math.PI * 48 * (1 - rewardRing)}
                    transform="rotate(-90 50 50)"
                    style={{ transition: "stroke-dashoffset 700ms cubic-bezier(0.2, 0.7, 0.2, 1)" }}
                  />
                  <circle cx="50" cy="50" r="44" fill="none" stroke="var(--line)" strokeWidth="1.2" />
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    fill="none"
                    stroke="var(--fg)"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeDasharray={C}
                    strokeDashoffset={C * (1 - goalPct)}
                    transform="rotate(-90 50 50)"
                    style={{ transition: "stroke-dashoffset 700ms cubic-bezier(0.2, 0.7, 0.2, 1)" }}
                  />
                </svg>
                {ripples.map((id) => (
                  <span key={id} className="ripple" />
                ))}
              </button>
              {quest && step && s.questUnder ? (
                <button
                  type="button"
                  className="quest-under"
                  onClick={() => s.setMode(step.dhikrId)}
                  onPointerDown={(e) => {
                    dragY.current = e.clientY;
                  }}
                  onPointerUp={(e) => {
                    if (dragY.current !== null && dragY.current - e.clientY > 36) s.setQuestUnder(false);
                    dragY.current = null;
                  }}
                >
                  <span className="flex items-center justify-between gap-3 text-xs text-fg">
                    <span className="min-w-0 truncate">{quest.title}</span>
                    <span className="shrink-0 tabular-nums">
                      {formatNum(s.questStepProgress)} / {formatNum(step.count)}
                    </span>
                  </span>
                </button>
              ) : null}
            </div>
          </div>
          <RiseLayer rises={rises} wordTop={wordTop} layerRef={riseRef} />
          <div className="stats-dock shrink-0">
            {s.showWisdom ? (
              <button
                type="button"
                key={`${quote.text}-${quoteAt}`}
                onClick={() => onOpenLibrary(quoteIndex)}
                className="reminder reminder-in mx-3 mb-1.5 block w-[calc(100%-1.5rem)] text-center"
              >
                {shownQuote.arabic && s.lang !== "ar" && s.lang !== "ur" ? (
                  <p className="reminder-ar font-arabic text-sm leading-relaxed text-fg" dir="rtl" lang="ar">{shownQuote.arabic}</p>
                ) : null}
                <p className="mt-0.5 text-xs leading-snug text-fg">{shownQuote.text}</p>
                <p className="mt-0.5 text-[0.65rem] text-muted">{shownQuote.source}</p>
              </button>
            ) : null}
            {quest && step && !s.questUnder ? (
              <button
                type="button"
                className="mx-3 mb-1.5 rounded-2xl border border-line bg-surface/80 px-3 py-1.5 text-start"
                onClick={() => s.setMode(step.dhikrId)}
                onPointerDown={(e) => {
                  dragY.current = e.clientY;
                }}
                onPointerUp={(e) => {
                  if (dragY.current !== null && e.clientY - dragY.current > 36) s.setQuestUnder(true);
                  dragY.current = null;
                }}
              >
                <span className="flex items-center justify-between gap-3 text-xs text-fg">
                  <span className="min-w-0 truncate">
                    {quest.title}
                    {step.label ? ` · ${step.label}` : ""} · {phraseOf(dhikrById(step.dhikrId), s.lang).short}
                  </span>
                  <span className="shrink-0 tabular-nums">
                    {formatNum(s.questStepProgress)} / {formatNum(step.count)}
                  </span>
                </span>
              </button>
            ) : null}
            <div className="grid grid-cols-3 gap-1.5 px-3">
              <Stat label={t(s.lang, "today")} value={formatNum(today)} hint={`${formatNum(today)} / ${formatNum(s.goal)}`} />
              <Stat label={t(s.lang, "total")} value={formatNum(s.total)} hint={zikrWord(s.total, s.lang)} />
              <Stat label={t(s.lang, "rewards")} value={formatNum(totalReward)} hint={t(s.lang, "sawabHint")} reward />
            </div>
            <button
              type="button"
              className="day-line px-3 pt-1 text-center text-[0.7rem] text-muted"
              onClick={() => setStatsOpen(true)}
            >
              {t(s.lang, "today")} {formatNum(today)} · {tx(s.lang, "yesterday")} {formatNum(yesterday)} · {tx(s.lang, "record")} {formatNum(Math.max(s.bestDay, today))}
            </button>
          </div>
        </div>
        <section className="history-screen" aria-label={tx(s.lang, "statsTitle")}>
          <h2 className="text-sm font-extrabold text-fg">{tx(s.lang, "statsTitle")}</h2>
          <p className="mt-1 text-xs text-muted">{tx(s.lang, "statsLead")}</p>
          <div className="mt-3 grid gap-1.5">
            {REMEMBRANCE.map((item) => {
              const count = s.byDhikr[item.id] ?? 0;
              const todayCount = s.days[day]?.by?.[item.id] ?? 0;
              const line = phraseOf(item, s.lang);
              return (
                <div key={item.id} className="history-row rounded-2xl border border-line bg-surface/80 px-2 py-2">
                  <div className="history-count">
                    <p className="text-base leading-none font-extrabold tabular-nums text-fg">{formatNum(count)}</p>
                    <p className="mt-0.5 text-[0.6rem] text-muted">{tx(s.lang, "allTime")}</p>
                  </div>
                  <div className="history-name">
                    <p className="truncate font-arabic text-base leading-none text-fg" dir="rtl" lang="ar">
                      {item.arabic}
                    </p>
                    <p className="mt-1 truncate text-xs text-muted">{line.short}</p>
                    <p className="mt-0.5 text-[0.65rem] text-gold">{tx(s.lang, "todayWord")} {formatNum(todayCount)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
      {statsOpen ? (
        <div className="names-sheet">
          <div className="flex items-center justify-between gap-2 pb-2">
            <h2 className="text-sm font-extrabold text-fg">{tx(s.lang, "achievements")}</h2>
            <button type="button" className="tap-btn" onClick={() => setStatsOpen(false)}>
              {t(s.lang, "close")}
            </button>
          </div>
          <div className="names-list">
          <p className="text-xs text-muted">{tx(s.lang, "achieveLead")}</p>
          <div className="mt-3 grid gap-1.5">
            {MILESTONES.map((item) => {
              const open = s.total >= item.at;
              const left = Math.max(0, item.at - s.total);
              return (
                <article key={item.at} className="rounded-2xl border border-line bg-surface/80 px-3 py-2.5">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className={cn("text-sm font-extrabold", open ? "text-fg" : "text-muted")}>{s.lang === "ru" ? item.title : formatNum(item.at)}</h3>
                    <p className="shrink-0 text-xs tabular-nums text-gold">{formatNum(item.at)}</p>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-muted">
                    {open ? (s.lang === "ru" ? item.text : tx(s.lang, "milestoneOpen").replace("{n}", formatNum(item.at))) : `${t(s.lang, "moreLeft")} ${formatNum(left)} ${zikrWord(left, s.lang)}.`}
                  </p>
                </article>
              );
            })}
          </div>
          </div>
        </div>
        ) : null}
      {listOpen ? (
        <div className="names-sheet">
          <div className="flex items-center justify-between gap-2 pb-2">
          <div className="min-w-0">
            <p className="font-arabic text-lg leading-none text-gold" dir="rtl" lang="ar">ذِكْرُ اللَّهِ</p>
            <h2 className="text-base font-bold text-fg">{t(s.lang, "dhikrTitle")}</h2>
          </div>
            <button type="button" className="tap-btn" onClick={onListClose}>
              {t(s.lang, "close")}
            </button>
          </div>
          <p className="text-xs leading-relaxed text-muted">
            {t(s.lang, "dhikrLead")}
          </p>
          <div className="names-list">
            {REMEMBRANCE.map((d, index) => {
              const line = phraseOf(d, s.lang);
              return (
                <button
                  key={d.id}
                  type="button"
                  className="name-card"
                  onClick={() => {
                    s.setMode(d.id);
                    setVirtue(false);
                    onListClose();
                  }}
                >
                  <span className="name-head">
                    <span className="name-no">{index + 1}</span>
                    <span className="name-ar" dir="rtl" lang="ar">
                      {d.arabic}
                    </span>
                  </span>
                  <span className="name-ru">{line.name}</span>
                  <span className="name-mean">{line.meaning}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
      {namesOpen ? (
        <div className="names-sheet">
          <div className="flex items-center justify-between gap-2 pb-2">
          <div className="min-w-0">
            <p className="font-arabic text-lg leading-none text-gold" dir="rtl" lang="ar">أَسْمَاءُ اللَّهِ الْحُسْنَى</p>
            <h2 className="text-base font-bold text-fg">{t(s.lang, "names")}</h2>
          </div>
            <button type="button" className="tap-btn" onClick={onNamesClose}>
              {t(s.lang, "close")}
            </button>
          </div>
          <p className="text-xs leading-relaxed text-muted">
            {t(s.lang, "namesLead")}
          </p>
          <div className="names-list">
            {ALLAH_NAMES.map((n, index) => {
              const label = nameText(n, s.lang);
              return (
                <button
                  key={n.id}
                  type="button"
                  className="name-card"
                  onClick={() => {
                    s.setMode(n.id);
                    onNamesClose();
                    setVirtue(false);
                  }}
                >
                  <span className="name-head">
                    <span className="name-no">{index + 1}</span>
                    <span className="name-ar" dir="rtl" lang="ar">
                      {n.arabic}
                    </span>
                  </span>
                  <span className="name-ru">{label.name}</span>
                  <span className="name-mean">{label.meaning}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      data-active={active ? "true" : "false"}
      onClick={onClick}
      className={cn(
        "flex h-9 shrink-0 flex-col items-center justify-center rounded-2xl px-2.5 text-xs transition-colors",
        active ? "bg-gold text-ink" : "border border-line bg-chip text-fg",
      )}
    >
      {children}
    </button>
  );
}

function Stat({ label, value, hint, reward }: { label: string; value: string; hint?: string; reward?: boolean }) {
  if (reward) {
    return (
      <div className="rounded-2xl border border-line bg-surface px-1.5 py-1.5 text-center">
        <p className="truncate text-[0.68rem] font-bold text-muted">{label}</p>
        <p className="stat-value mt-0.5 text-base leading-none text-fg tabular-nums" suppressHydrationWarning>
          {value}
        </p>
        <p className="mt-0.5 flex items-baseline justify-center gap-1 leading-none" dir="ltr">
          <span className="text-[0.62rem] font-bold text-muted">×10</span>
          <span className="font-arabic text-[0.72rem] font-bold text-muted" dir="rtl" lang="ar">
            حسنات
          </span>
        </p>
      </div>
    );
  }
  return (
    <div className="rounded-2xl border border-line bg-surface px-1.5 py-1.5 text-center">
      <p className="truncate text-[0.68rem] font-bold text-muted">{label}</p>
      <p className="stat-value mt-0.5 text-base leading-none text-fg tabular-nums" suppressHydrationWarning>
        {value}
      </p>
      <p className="mt-0.5 line-clamp-2 text-[0.62rem] leading-snug text-muted">{hint}</p>
    </div>
  );
}
