import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { DHIKR, MILESTONES, dhikrById } from "./content";
import { todayKey } from "./format";
import { levelFromXp } from "./levels";
import { ALLAH_NAMES } from "./names";
import { sunnahQuestById } from "./quests";
import type { DayArchive, DayLog, FontId, LangId, OrbId, RewardArchive, SoundId, TapResult, TapVoice, ThemeId, ZikrState } from "./types";

const THEMES: ThemeId[] = ["firdaus", "rayyan", "salat", "sadaqa", "jihad", "kazimin", "tawba", "ayman", "black", "wine", "ivory", "roses", "sea", "desert", "cosmos", "peaks", "lake", "jungle", "subhah", "amethyst", "amber", "jade"];
const FONTS: FontId[] = ["clear", "crimson", "wide", "soft", "book", "even"];
const FONT_SCALES = [94, 97, 100, 103, 106, 109, 112];
const LANGS: LangId[] = ["ru", "en", "ar", "id", "tr", "ur"];
const ORBS: OrbId[] = ["plain", "glow", "pearl", "line", "double", "soft", "dot", "crescent", "kaaba", "shahada"];
const COUNTRIES = new Set(["", "RU", "SA", "TR", "ID", "PK", "AE", "QA", "EG", "PS", "HL", "MA", "DZ", "MY", "GB", "US", "DE", "FR", "KZ", "UZ", "AZ", "TJ"]);

const CAP = 2_000_000_000;

const VOICES: TapVoice[] = ["soft", "wood", "drop", "stone", "glass", "bead", "clay", "breath", "sand", "water"];

function asVoice(value: unknown): TapVoice {
  return VOICES.includes(value as TapVoice) ? (value as TapVoice) : "soft";
}

function asSound(value: unknown): SoundId {
  return value === "off" ? "off" : "on";
}

function knownIds(): Set<string> {
  return new Set([...DHIKR.map((d) => d.id), ...ALLAH_NAMES.map((n) => n.id)]);
}

function emptyCounts(): Record<string, number> {
  return Object.fromEntries(DHIKR.map((d) => [d.id, 0]));
}

function makePublicId(): string {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return String(10_000_000 + (buf[0]! % 90_000_000));
}

export function initialData(): ZikrState {
  return {
    total: 0,
    quranLetters: 0,
    xp: 0,
    byDhikr: emptyCounts(),
    days: {},
    goal: 100,
    mode: "subhanallah",
    pool: DHIKR.filter((d) => d.primary).map((d) => d.id),
    sound: "on",
    voice: "soft",
    volume: 0.7,
    vibrate: true,
    showWisdom: true,
    arabicOptIn: false,
    theme: "cosmos",
    themeChosen: false,
    font: "crimson",
    fontChosen: false,
    fontScale: 100,
    lang: "ru",
    country: "",
    orb: "plain",
    questUnder: false,
    screenTap: true,
    starFlow: true,
    orbit: true,
    galaxy: false,
    rain: false,
    achievements: [],
    celebrated: [],
    chainIndex: 0,
    chainProgress: 0,
    activeQuestId: null,
    questStep: 0,
    questStepProgress: 0,
    questBonus: 0,
    doneToday: {},
    displayName: "",
    publicId: "",
    publicBoard: true,
    wisdomStep: 0,
    bestDay: 0,
    lastDhikrId: "subhanallah",
    countGen: 0,
    dayCut: false,
    dayArchive: null,
    rewardArchive: null,
  };
}

function clampInt(n: unknown, max: number): number {
  if (typeof n !== "number" || !Number.isFinite(n) || n <= 0) return 0;
  return Math.min(max, Math.floor(n));
}

function trimDays(days: Record<string, DayLog>): Record<string, DayLog> {
  const keys = Object.keys(days);
  if (keys.length <= 420) return days;
  keys.sort();
  const next = { ...days };
  for (const k of keys.slice(0, keys.length - 400)) delete next[k];
  return next;
}

function readDayLog(value: unknown): DayLog | null {
  if (!value || typeof value !== "object") return null;
  const src = value as Partial<DayLog>;
  const by: Record<string, number> = {};
  if (src.by && typeof src.by === "object") {
    for (const [id, n] of Object.entries(src.by)) {
      if (id.length > 0 && id.length < 40) by[id] = clampInt(n, CAP);
    }
  }
  return { total: clampInt(src.total, CAP), by };
}

function readDays(value: unknown): Record<string, DayLog> {
  const days: Record<string, DayLog> = {};
  if (!value || typeof value !== "object") return days;
  for (const [key, item] of Object.entries(value)) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) continue;
    const log = readDayLog(item);
    if (log) days[key] = log;
  }
  return trimDays(days);
}

function addLog(a: DayLog | undefined, b: DayLog | undefined): DayLog {
  const by = { ...(a?.by ?? {}) };
  for (const [id, n] of Object.entries(b?.by ?? {})) by[id] = (by[id] ?? 0) + n;
  return { total: (a?.total ?? 0) + (b?.total ?? 0), by };
}

function addMaps(a: Record<string, number>, b: Record<string, number>): Record<string, number> {
  const next = { ...a };
  for (const [id, n] of Object.entries(b)) next[id] = (next[id] ?? 0) + n;
  return next;
}

function readDayArchive(value: unknown): DayArchive | null {
  if (!value || typeof value !== "object") return null;
  const src = value as Partial<DayArchive>;
  const log = readDayLog(src.log);
  if (!log || log.total <= 0 || typeof src.key !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(src.key)) return null;
  return { at: clampInt(src.at, 10_000_000_000_000), key: src.key, log };
}

function readRewardArchive(value: unknown): RewardArchive | null {
  if (!value || typeof value !== "object") return null;
  const src = value as Partial<RewardArchive>;
  const days = readDays(src.days);
  const byDhikr: Record<string, number> = {};
  if (src.byDhikr && typeof src.byDhikr === "object") {
    for (const [id, n] of Object.entries(src.byDhikr)) {
      if (id.length > 0 && id.length < 40) byDhikr[id] = clampInt(n, CAP);
    }
  }
  const total = clampInt(src.total, CAP);
  const xp = clampInt(src.xp, CAP);
  const quranLetters = clampInt(src.quranLetters, CAP);
  const bestDay = clampInt(src.bestDay, CAP);
  const celebrated = Array.isArray(src.celebrated) ? src.celebrated.filter((n) => typeof n === "number").slice(0, 80) : [];
  if (total <= 0 && xp <= 0 && quranLetters <= 0 && Object.keys(days).length === 0) return null;
  return { at: clampInt(src.at, 10_000_000_000_000), total, xp, quranLetters, byDhikr, days, bestDay, celebrated };
}

function clearedCounts(): Record<string, number> {
  const next = emptyCounts();
  for (const name of ALLAH_NAMES) next[name.id] = 0;
  return next;
}

function laterStamp<T extends { at: number } | null>(a: T, b: T): T {
  if (!a) return b;
  if (!b) return a;
  return a.at >= b.at ? a : b;
}

function canonicalPublicId(id: string): string {
  if (id === "88880455") return "96995742";
  if (id === "62012303") return "87278839";
  if (id === "25574036" || id === "50170262" || id === "79475757") return "52812946";
  return id;
}

export function normalize(raw: unknown): ZikrState {
  const base = initialData();
  if (!raw || typeof raw !== "object") return base;
  const r = raw as Partial<ZikrState>;
  const byDhikr = emptyCounts();
  if (r.byDhikr && typeof r.byDhikr === "object") {
    for (const d of DHIKR) byDhikr[d.id] = clampInt(r.byDhikr[d.id], CAP);
  }
  const days: Record<string, DayLog> = {};
  if (r.days && typeof r.days === "object") {
    for (const [k, v] of Object.entries(r.days)) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(k) || !v || typeof v !== "object") continue;
      const by: Record<string, number> = {};
      const src = (v as DayLog).by;
      if (src && typeof src === "object") {
        for (const d of DHIKR) by[d.id] = clampInt(src[d.id], CAP);
      }
      days[k] = { total: clampInt((v as DayLog).total, CAP), by };
    }
  }
  const fromDays = emptyCounts();
  for (const day of Object.values(days)) {
    for (const d of DHIKR) fromDays[d.id] = (fromDays[d.id] ?? 0) + (day.by[d.id] ?? 0);
  }
  for (const d of DHIKR) byDhikr[d.id] = Math.max(byDhikr[d.id] ?? 0, fromDays[d.id] ?? 0);
  const known = knownIds();
  const azkar = new Set(DHIKR.filter((item) => item.azkar).map((item) => item.id));
  const savedQuest = sunnahQuestById(typeof r.activeQuestId === "string" ? r.activeQuestId : null);
  const questLive = savedQuest && clampInt(r.questStep, 20) < savedQuest.steps.length ? savedQuest : null;
  const questDhikr = new Set(questLive?.steps.map((step) => step.dhikrId) ?? []);
  const pool = Array.isArray(r.pool) ? r.pool.filter((id) => known.has(id) && !azkar.has(id)) : base.pool;
  const savedMode = r.mode === "random" || (typeof r.mode === "string" && known.has(r.mode)) ? r.mode : base.mode;
  const mode = savedMode !== "random" && azkar.has(savedMode) && !questDhikr.has(savedMode) ? base.mode : savedMode;
  const totalFromParts = Object.values(byDhikr).reduce((a, b) => a + b, 0);
  const total = Math.max(clampInt(r.total, CAP), totalFromParts);
  for (const n of ALLAH_NAMES) {
    byDhikr[n.id] = clampInt(r.byDhikr && typeof r.byDhikr === "object" ? r.byDhikr[n.id] : 0, CAP);
  }
  const earned = MILESTONES.map((m) => m.at).filter((at) => total >= at);
  const earnedSet = new Set<number>(earned);
  const achievements = earned;
  const celebrated = Array.isArray(r.celebrated) ? r.celebrated.filter((n) => earnedSet.has(n)) : [];
  const questBonus = clampInt(r.questBonus, CAP);
  const xp = typeof r.xp === "number" ? clampInt(r.xp, CAP) : total * 10 + questBonus;
  const doneToday: Record<string, string> = {};
  const today = todayKey();
  if (r.doneToday && typeof r.doneToday === "object") {
    for (const [k, v] of Object.entries(r.doneToday)) {
      if (typeof v === "string" && v === today) doneToday[k.slice(0, 40)] = v;
    }
  }
  return {
    total,
    quranLetters: clampInt(r.quranLetters, CAP),
    xp,
    byDhikr,
    days: trimDays(days),
    goal: (() => {
      const n = Math.round(Number(r.goal));
      return Number.isFinite(n) && n >= 1 && n <= 1_000_000 ? n : base.goal;
    })(),
    mode,
    pool: pool.length ? pool : base.pool,
    sound: asSound(r.sound),
    voice: asVoice(r.voice),
    volume: typeof r.volume === "number" ? Math.min(1, Math.max(0, r.volume)) : base.volume,
    vibrate: r.vibrate !== false,
    showWisdom: r.showWisdom !== false,
    arabicOptIn: r.arabicOptIn === true,
    theme: r.themeChosen === true && THEMES.includes(r.theme as ThemeId)
      ? (r.theme as ThemeId)
      : THEMES.includes(r.theme as ThemeId) && r.theme !== "black"
        ? (r.theme as ThemeId)
        : "cosmos",
    themeChosen: r.themeChosen === true || (THEMES.includes(r.theme as ThemeId) && r.theme !== "black"),
    font: r.fontChosen === true && FONTS.includes(r.font as FontId) ? (r.font as FontId) : "crimson",
    fontChosen: r.fontChosen === true,
    fontScale: FONT_SCALES.includes(Number(r.fontScale)) ? Number(r.fontScale) : 100,
    lang: LANGS.includes(r.lang as LangId) ? (r.lang as LangId) : "ru",
    country: typeof r.country === "string" && COUNTRIES.has(r.country) ? r.country : "",
    orb: "plain",
    questUnder: r.questUnder === true,
    screenTap: r.screenTap !== false,
    starFlow: r.starFlow !== false,
    orbit: r.orbit === true,
    galaxy: r.galaxy === true,
    rain: r.rain === true,
    achievements,
    celebrated,
    chainIndex: Math.min(1000, clampInt(r.chainIndex, 1000)),
    chainProgress: clampInt(r.chainProgress, 100_000),
    activeQuestId: (() => {
      const id = sunnahQuestById(typeof r.activeQuestId === "string" ? r.activeQuestId : null)?.id ?? null;
      const quest = sunnahQuestById(id);
      return quest && clampInt(r.questStep, 20) < quest.steps.length ? id : null;
    })(),
    questStep: (() => {
      const quest = sunnahQuestById(typeof r.activeQuestId === "string" ? r.activeQuestId : null);
      const step = clampInt(r.questStep, 20);
      return quest && step < quest.steps.length ? step : 0;
    })(),
    questStepProgress: (() => {
      const quest = sunnahQuestById(typeof r.activeQuestId === "string" ? r.activeQuestId : null);
      const stepIndex = clampInt(r.questStep, 20);
      const step = quest?.steps[stepIndex];
      const progress = clampInt(r.questStepProgress, 100_000);
      return step && stepIndex < quest.steps.length ? Math.min(progress, step.count) : 0;
    })(),
    questBonus,
    doneToday,
    displayName: typeof r.displayName === "string" ? r.displayName.replace(/\s+/g, " ").trim().slice(0, 24) : "",
    publicId: canonicalPublicId(typeof r.publicId === "string" && /^\d{8}$/.test(r.publicId) ? r.publicId : ""),
    publicBoard: r.publicBoard !== false,
    wisdomStep: clampInt(r.wisdomStep, 1_000_000),
    bestDay: clampInt(r.bestDay, CAP),
    lastDhikrId: typeof r.lastDhikrId === "string" && known.has(r.lastDhikrId) && (!azkar.has(r.lastDhikrId) || questDhikr.has(r.lastDhikrId)) ? r.lastDhikrId : base.lastDhikrId,
    countGen: clampInt(r.countGen, 1_000_000),
    dayCut: r.dayCut === true,
    dayArchive: readDayArchive(r.dayArchive),
    rewardArchive: readRewardArchive(r.rewardArchive),
  };
}

export function mergeState(local: ZikrState, remoteRaw: unknown): ZikrState {
  const remote = normalize(remoteRaw);
  const localGen = local.countGen ?? 0;
  const remoteGen = remote.countGen ?? 0;
  if (localGen !== remoteGen) {
    const winner = localGen > remoteGen ? local : remote;
    const other = winner === local ? remote : local;
    const archived = winner.rewardArchive?.total ?? 0;
    const intentional = archived > 0 && winner.total + archived >= other.total;
    if (winner.total >= other.total || intentional) {
      return normalize({
        ...local,
        total: winner.total,
        xp: winner.xp,
        quranLetters: winner.quranLetters,
        byDhikr: winner.byDhikr,
        days: winner.days,
        bestDay: winner.bestDay,
        achievements: winner.achievements,
        celebrated: winner.celebrated,
        countGen: Math.max(localGen, remoteGen),
        dayCut: winner.dayCut,
        dayArchive: winner.dayArchive,
        rewardArchive: winner.rewardArchive,
        publicId: /^\d{8}$/.test(canonicalPublicId(winner.publicId))
          ? canonicalPublicId(winner.publicId)
          : canonicalPublicId(other.publicId),
      });
    }
  }
  const base = local.total >= remote.total ? local : remote;
  const days = { ...remote.days };
  for (const [k, v] of Object.entries(local.total >= remote.total ? local.days : remote.days)) {
    const other = (local.total >= remote.total ? remote.days : local.days)[k];
    if (!other || v.total >= other.total) days[k] = v;
  }
  for (const [k, v] of Object.entries(local.total >= remote.total ? remote.days : local.days)) {
    if (!days[k]) days[k] = v;
  }
  const achievements = Array.from(new Set([...local.achievements, ...remote.achievements])).sort((a, b) => a - b);
  const celebrated = Array.from(new Set([...local.celebrated, ...remote.celebrated]));
  const localChain = local.chainIndex > remote.chainIndex || (local.chainIndex === remote.chainIndex && local.chainProgress >= remote.chainProgress);
  const chain = localChain ? local : remote;
  const byDhikr: Record<string, number> = { ...remote.byDhikr };
  for (const [id, count] of Object.entries(local.byDhikr)) {
    byDhikr[id] = Math.max(byDhikr[id] ?? 0, count);
  }
  let best = Math.max(local.bestDay, remote.bestDay);
  for (const v of Object.values(days)) if (v.total > best) best = v.total;
  return normalize({
    ...base,
    byDhikr,
    total: Math.max(local.total, remote.total),
    quranLetters: Math.max(local.quranLetters, remote.quranLetters),
    days,
    achievements,
    celebrated,
    chainIndex: chain.chainIndex,
    chainProgress: chain.chainProgress,
    activeQuestId: base.activeQuestId,
    questStep: base.questStep,
    questStepProgress: base.questStepProgress,
    questBonus: Math.max(local.questBonus, remote.questBonus),
    xp: Math.max(local.xp, remote.xp),
    doneToday: { ...remote.doneToday, ...local.doneToday },
    bestDay: best,
    theme: local.themeChosen || local.theme !== "black" ? local.theme : "cosmos",
    themeChosen: local.themeChosen || local.theme !== "black",
    font: local.fontChosen ? local.font : "crimson",
    fontChosen: local.fontChosen,
    fontScale: FONT_SCALES.includes(local.fontScale) ? local.fontScale : 100,
    lang: local.lang,
    country: local.country,
    orb: local.orb,
    questUnder: local.questUnder,
    screenTap: local.screenTap,
    starFlow: local.starFlow,
    orbit: local.orbit,
    galaxy: local.galaxy,
    rain: local.rain,
    sound: local.sound,
    voice: local.voice,
    volume: local.volume,
    vibrate: local.vibrate,
    showWisdom: local.showWisdom,
    arabicOptIn: local.arabicOptIn,
    goal: local.goal,
    mode: local.mode,
    pool: local.pool,
    displayName: local.displayName || remote.displayName,
    publicId: (() => {
      const localId = canonicalPublicId(local.publicId);
      const remoteId = canonicalPublicId(remote.publicId);
      const localOk = /^\d{8}$/.test(localId);
      const remoteOk = /^\d{8}$/.test(remoteId);
      if (localOk && remoteOk && localId !== remoteId) return local.total >= remote.total ? localId : remoteId;
      return remoteOk ? remoteId : localId;
    })(),
    publicBoard: local.publicBoard,
    wisdomStep: Math.max(local.wisdomStep, remote.wisdomStep),
    lastDhikrId: local.lastDhikrId,
    countGen: Math.max(localGen, remoteGen),
    dayCut: local.dayCut || remote.dayCut,
    dayArchive: laterStamp(local.dayArchive, remote.dayArchive),
    rewardArchive: laterStamp(local.rewardArchive, remote.rewardArchive),
  });
}

const SAVE_KEY = "nur-zikr-v1";
const BACKUP_KEY = "nur-zikr-v1-bak";
const SNAP_KEY = "zikr-stats-snap";

function savedDetail(raw: string | null): number {
  if (!raw) return 0;
  try {
    const state = (JSON.parse(raw) as { state?: { byDhikr?: Record<string, number>; days?: Record<string, unknown> } }).state;
    const by = state?.byDhikr ? Object.values(state.byDhikr).filter((n) => typeof n === "number" && n > 0).length : 0;
    const days = state?.days ? Object.keys(state.days).length : 0;
    return by + days;
  } catch {
    return 0;
  }
}

function readSnap(): { total: number; bestDay: number; xp: number; by: Record<string, number>; days: Record<string, { total: number; by: Record<string, number> }> } | null {
  try {
    const raw = localStorage.getItem(SNAP_KEY);
    if (!raw) return null;
    const snap = JSON.parse(raw) as { total?: number; bestDay?: number; xp?: number; by?: Record<string, number>; days?: Record<string, { total?: number; by?: Record<string, number> }> };
    if (!snap || typeof snap !== "object") return null;
    const days: Record<string, { total: number; by: Record<string, number> }> = {};
    if (snap.days && typeof snap.days === "object") {
      for (const [key, log] of Object.entries(snap.days)) {
        if (!log || typeof log.total !== "number") continue;
        days[key] = { total: log.total, by: log.by && typeof log.by === "object" ? log.by : {} };
      }
    }
    return {
      total: typeof snap.total === "number" ? snap.total : 0,
      bestDay: typeof snap.bestDay === "number" ? snap.bestDay : 0,
      xp: typeof snap.xp === "number" ? snap.xp : 0,
      by: snap.by && typeof snap.by === "object" ? snap.by : {},
      days,
    };
  } catch {
    return null;
  }
}

function writeSnap(value: string) {
  try {
    const state = (JSON.parse(value) as { state?: { total?: number; bestDay?: number; xp?: number; byDhikr?: Record<string, number>; days?: Record<string, { total?: number; by?: Record<string, number> }> } }).state;
    if (!state) return;
    const by: Record<string, number> = {};
    for (const [id, n] of Object.entries(state.byDhikr ?? {})) if (typeof n === "number" && n > 0) by[id] = n;
    const days: Record<string, { total: number; by: Record<string, number> }> = {};
    for (const key of Object.keys(state.days ?? {}).sort().slice(-60)) {
      const log = state.days?.[key];
      if (!log || typeof log.total !== "number" || log.total <= 0) continue;
      const dayBy: Record<string, number> = {};
      for (const [id, n] of Object.entries(log.by ?? {})) if (typeof n === "number" && n > 0) dayBy[id] = n;
      days[key] = { total: log.total, by: dayBy };
    }
    if (Object.keys(by).length === 0 && Object.keys(days).length === 0) return;
    const prev = readSnap();
    const prevScore = prev ? Math.max(prev.total, Object.values(prev.by).reduce((sum, n) => sum + n, 0)) : -1;
    const nextScore = Math.max(state.total ?? 0, Object.values(by).reduce((sum, n) => sum + n, 0));
    if (prev && prevScore > nextScore && Object.keys(by).length < Object.keys(prev.by).length) return;
    localStorage.setItem(SNAP_KEY, JSON.stringify({ total: state.total ?? 0, bestDay: state.bestDay ?? 0, xp: state.xp ?? 0, by, days }));
  } catch {
    /* the main copy remains */
  }
}

function withSnap(raw: string | null): string | null {
  const snap = readSnap();
  if (!snap) return raw;
  if (!raw) return JSON.stringify({ state: { total: snap.total, bestDay: snap.bestDay, xp: snap.xp, byDhikr: snap.by, days: snap.days }, version: 5 });
  try {
    const parsed = JSON.parse(raw) as { state?: Record<string, unknown> };
    if (!parsed.state) return raw;
    const state = parsed.state;
    const by = { ...snap.by };
    const current = state.byDhikr && typeof state.byDhikr === "object" ? (state.byDhikr as Record<string, number>) : {};
    for (const [id, n] of Object.entries(current)) if (typeof n === "number") by[id] = Math.max(by[id] ?? 0, n);
    const days = { ...snap.days } as Record<string, { total: number; by: Record<string, number> }>;
    const currentDays = state.days && typeof state.days === "object" ? (state.days as Record<string, { total?: number; by?: Record<string, number> }>) : {};
    for (const [key, log] of Object.entries(currentDays)) {
      const prev = days[key];
      if (!prev || (log?.total ?? 0) >= prev.total) days[key] = { total: log?.total ?? 0, by: { ...(prev?.by ?? {}), ...(log?.by ?? {}) } };
    }
    state.byDhikr = by;
    state.days = days;
    const total = typeof state.total === "number" ? state.total : 0;
    const best = typeof state.bestDay === "number" ? state.bestDay : 0;
    if (total < snap.total) state.total = snap.total;
    if (best < snap.bestDay) state.bestDay = snap.bestDay;
    return JSON.stringify(parsed);
  } catch {
    return raw;
  }
}

function readRaw(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function readLocal(key: string): string | null {
  const primary = readRaw(key);
  if (key !== SAVE_KEY) return primary;
  const backup = readRaw(BACKUP_KEY);
  if (!primary) return backup;
  if (!backup) return primary;
  return savedScore(backup) > savedScore(primary) ? backup : primary;
}

function writeLocal(key: string, value: string) {
  const write = (k: string) => localStorage.setItem(k, value);
  try {
    write(key);
  } catch {
    try {
      localStorage.removeItem(BACKUP_KEY);
      write(key);
    } catch {
      /* the count stays in memory and in IndexedDB */
    }
  }
  if (key !== SAVE_KEY) return;
  try {
    write(BACKUP_KEY);
  } catch {
    /* the main copy is already stored */
  }
}

function savedScore(raw: string | null): number {
  if (!raw) return -1;
  try {
    const parsed = JSON.parse(raw) as { state?: { total?: number; byDhikr?: Record<string, number> } };
    const state = parsed.state;
    if (!state) return -1;
    const parts =
      state.byDhikr && typeof state.byDhikr === "object"
        ? Object.values(state.byDhikr).reduce((sum, n) => sum + (typeof n === "number" ? n : 0), 0)
        : 0;
    const total = typeof state.total === "number" ? state.total : 0;
    return Math.max(total, parts);
  } catch {
    return -1;
  }
}

let dbPromise: Promise<IDBDatabase | null> | null = null;

function openDb(): Promise<IDBDatabase | null> {
  if (typeof indexedDB === "undefined") return Promise.resolve(null);
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve) => {
    let settled = false;
    const finish = (db: IDBDatabase | null) => {
      if (settled) return;
      settled = true;
      resolve(db);
    };
    const timer = setTimeout(() => {
      dbPromise = null;
      finish(null);
    }, 2500);
    try {
      const req = indexedDB.open("nur-zikr", 1);
      req.onupgradeneeded = () => {
        if (!req.result.objectStoreNames.contains("kv")) req.result.createObjectStore("kv");
      };
      req.onsuccess = () => {
        clearTimeout(timer);
        req.result.onclose = () => {
          dbPromise = null;
        };
        finish(req.result);
      };
      req.onerror = () => {
        clearTimeout(timer);
        dbPromise = null;
        finish(null);
      };
      req.onblocked = () => {
        clearTimeout(timer);
        dbPromise = null;
        finish(null);
      };
    } catch {
      clearTimeout(timer);
      dbPromise = null;
      finish(null);
    }
  });
  return dbPromise;
}

async function idbGet(key: string): Promise<string | null> {
  const db = await openDb();
  if (!db) return null;
  return new Promise((resolve) => {
    const tx = db.transaction("kv", "readonly");
    const q = tx.objectStore("kv").get(key);
    q.onsuccess = () => resolve(typeof q.result === "string" ? q.result : null);
    q.onerror = () => resolve(null);
  });
}

async function idbSet(key: string, value: string) {
  const db = await openDb();
  if (!db) return;
  await new Promise<void>((resolve) => {
    const tx = db.transaction("kv", "readwrite");
    tx.objectStore("kv").put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => resolve();
  });
}

let idbQueue: Promise<void> = Promise.resolve();
let allowLowerSave = false;

const durableStorage = {
  getItem: async (name: string) => {
    let local = withSnap(readLocal(name));
    if (!local || savedDetail(local) === 0) {
      const disk = await Promise.race<string | null>([
        idbGet(name),
        new Promise((resolve) => setTimeout(() => resolve(null), 8000)),
      ]);
      if (disk && (savedScore(disk) > savedScore(local) || savedDetail(disk) > savedDetail(local))) {
        local = withSnap(disk);
        if (local) writeLocal(name, local);
      }
    }
    void idbGet(name)
      .then((disk) => {
        if (!disk) return;
        const kept = readLocal(name);
        const richer = savedScore(disk) > savedScore(kept) || (savedScore(disk) >= savedScore(kept) && savedDetail(disk) > savedDetail(kept));
        if (!richer) return;
        const next = withSnap(disk);
        if (next) writeLocal(name, next);
        const apply = () => {
          try {
            const parsed = JSON.parse(next || disk) as { state?: Partial<ZikrState> };
            if (!parsed.state) return;
            const live = snapshot(useZikr.getState());
            if (savedScore(disk) < savedScore(JSON.stringify({ state: live })) && savedDetail(disk) <= savedDetail(JSON.stringify({ state: live }))) return;
            useZikr.getState().apply(mergeState(live, parsed.state));
          } catch {
            /* keep the count already on screen */
          }
        };
        if (useZikr.persist.hasHydrated()) apply();
        else {
          const unsub = useZikr.persist.onFinishHydration(() => {
            unsub();
            apply();
          });
        }
      })
      .catch(() => {});
    return local;
  },
  setItem: (name: string, value: string) => {
    const forced = allowLowerSave;
    allowLowerSave = false;
    const next = savedScore(value);
    const kept = readLocal(name);
    if (!forced && next < savedScore(kept)) return Promise.resolve();
    writeLocal(name, value);
    writeSnap(value);
    idbQueue = idbQueue
      .then(async () => {
        const disk = await idbGet(name);
        const latest = readLocal(name) || value;
        if (!forced && savedScore(disk) > savedScore(latest)) {
          if (disk) writeLocal(name, disk);
          return;
        }
        await idbSet(name, latest);
      })
      .catch(() => undefined);
    return idbQueue;
  },
  removeItem: async (name: string) => {
    try {
      localStorage.removeItem(name);
    } catch {
      /* ignore */
    }
    const db = await openDb();
    if (!db) return;
    await new Promise<void>((resolve) => {
      const tx = db.transaction("kv", "readwrite");
      tx.objectStore("kv").delete(name);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  },
};

export function snapshot(s: ZikrState): ZikrState {
  return normalize(s);
}

type Actions = {
  tap: () => TapResult;
  addLetters: (count: number) => { added: number; reward: number; levelUp: number | null };
  setMode: (mode: string) => void;
  togglePool: (id: string) => void;
  setGoal: (n: number) => void;
  setTheme: (t: ThemeId) => void;
  setFont: (f: FontId) => void;
  setFontScale: (n: number) => void;
  setLang: (l: LangId) => void;
  setCountry: (c: string) => void;
  setOrb: (o: OrbId) => void;
  setQuestUnder: (v: boolean) => void;
  setScreenTap: (v: boolean) => void;
  setStarFlow: (v: boolean) => void;
  setOrbit: (v: boolean) => void;
  setGalaxy: (v: boolean) => void;
  setRain: (v: boolean) => void;
  setSound: (s: SoundId) => void;
  setVoice: (v: TapVoice) => void;
  setVolume: (n: number) => void;
  setVibrate: (v: boolean) => void;
  setShowWisdom: (v: boolean) => void;
  setArabicOptIn: (v: boolean) => void;
  setDisplayName: (n: string) => void;
  setPublicBoard: (v: boolean) => void;
  ensurePublicId: () => string;
  resetToday: () => void;
  resetDay: () => boolean;
  restoreDay: () => boolean;
  resetRewards: () => boolean;
  restoreRewards: () => boolean;
  clearDayCut: () => void;
  markCelebrated: (at: number) => void;
  restartChain: () => void;
  startQuest: (id: string) => void;
  leaveQuest: () => void;
  rollDay: () => void;
  apply: (next: ZikrState) => void;
};

export const useZikr = create<ZikrState & Actions>()(
  persist(
    (set, get) => ({
      ...initialData(),
      apply: (next) => set(normalize(next)),
      setMode: (mode) => {
        const known = knownIds();
        if (mode === "random" || known.has(mode)) set({ mode, lastDhikrId: mode === "random" ? get().lastDhikrId : mode });
      },
      togglePool: (id) => {
        if (!DHIKR.some((d) => d.id === id)) return;
        const pool = get().pool;
        if (pool.includes(id)) {
          if (pool.length === 1) return;
          set({ pool: pool.filter((x) => x !== id) });
        } else set({ pool: [...pool, id] });
      },
      setGoal: (n) => {
        const v = Math.round(Number(n));
        if (!Number.isFinite(v) || v < 1 || v > 1_000_000) return;
        set({ goal: v });
      },
      setTheme: (t) => {
        if (THEMES.includes(t)) set({ theme: t, themeChosen: true });
      },
      setFont: (f) => {
        if (FONTS.includes(f)) set({ font: f, fontChosen: true });
      },
      setFontScale: (n) => {
        if (FONT_SCALES.includes(n)) set({ fontScale: n });
      },
      setLang: (l) => {
        if (LANGS.includes(l)) set({ lang: l });
      },
      setCountry: (c) => set({ country: COUNTRIES.has(c) ? c : "" }),
      setOrb: (o) => {
        if (ORBS.includes(o)) set({ orb: o });
      },
      setQuestUnder: (v) => set({ questUnder: v }),
      setScreenTap: (v) => set({ screenTap: v }),
      setStarFlow: (v) => set({ starFlow: v }),
      setOrbit: (v) => set({ orbit: v }),
      setGalaxy: (v) => set({ galaxy: v }),
      setRain: (v) => set({ rain: v }),
      setSound: (s) => set({ sound: s }),
      setVoice: (v) => {
        if (VOICES.includes(v)) set({ voice: v, sound: "on" });
      },
      setVolume: (n) => set({ volume: Math.min(1, Math.max(0, n)) }),
      setVibrate: (v) => set({ vibrate: v }),
      setShowWisdom: (v) => set({ showWisdom: v }),
      setArabicOptIn: (v) => set({ arabicOptIn: v }),
      setDisplayName: (n) => set({ displayName: n.replace(/\s+/g, " ").trim().slice(0, 24) }),
      setPublicBoard: (v) => set({ publicBoard: v }),
      ensurePublicId: () => {
        const current = canonicalPublicId(get().publicId);
        if (/^\d{8}$/.test(current)) {
          if (current !== get().publicId) set({ publicId: current });
          return current;
        }
        const next = makePublicId();
        set({ publicId: next });
        return next;
      },
      resetToday: () => {
        const day = todayKey();
        set((s) => ({ days: { ...s.days, [day]: { total: 0, by: {} } }, dayCut: true, countGen: s.countGen + 1 }));
      },
      resetDay: () => {
        const day = todayKey();
        const s = get();
        const log = s.days[day];
        if (!log || log.total <= 0) return false;
        const prev = s.dayArchive?.key === day ? s.dayArchive.log : undefined;
        set({
          dayArchive: { at: Date.now(), key: day, log: addLog(prev, log) },
          days: { ...s.days, [day]: { total: 0, by: {} } },
          dayCut: true,
          countGen: s.countGen + 1,
        });
        return true;
      },
      restoreDay: () => {
        const s = get();
        const saved = s.dayArchive;
        if (!saved) return false;
        const current = s.days[saved.key];
        set({
          days: { ...s.days, [saved.key]: addLog(current, saved.log) },
          dayArchive: null,
          countGen: s.countGen + 1,
        });
        return true;
      },
      resetRewards: () => {
        const s = get();
        const hasDhikr = Object.values(s.byDhikr).some((n) => n > 0);
        const hasDays = Object.values(s.days).some((day) => day.total > 0);
        if (s.total <= 0 && s.xp <= 0 && s.quranLetters <= 0 && !hasDhikr && !hasDays) return false;
        const prev = s.rewardArchive;
        const days = { ...(prev?.days ?? {}) };
        for (const [key, log] of Object.entries(s.days)) days[key] = addLog(days[key], log);
        allowLowerSave = true;
        set({
          rewardArchive: {
            at: Date.now(),
            total: (prev?.total ?? 0) + s.total,
            xp: (prev?.xp ?? 0) + s.xp,
            quranLetters: (prev?.quranLetters ?? 0) + s.quranLetters,
            byDhikr: addMaps(prev?.byDhikr ?? {}, s.byDhikr),
            days,
            bestDay: Math.max(prev?.bestDay ?? 0, s.bestDay),
            celebrated: Array.from(new Set([...(prev?.celebrated ?? []), ...s.celebrated])),
          },
          total: 0,
          xp: 0,
          quranLetters: 0,
          byDhikr: clearedCounts(),
          days: {},
          bestDay: 0,
          achievements: [],
          celebrated: [],
          countGen: s.countGen + 1,
        });
        return true;
      },
      restoreRewards: () => {
        const s = get();
        const saved = s.rewardArchive;
        if (!saved) return false;
        const days = { ...saved.days };
        for (const [key, log] of Object.entries(s.days)) days[key] = addLog(days[key], log);
        let best = Math.max(s.bestDay, saved.bestDay);
        for (const log of Object.values(days)) if (log.total > best) best = log.total;
        set({
          total: s.total + saved.total,
          xp: s.xp + saved.xp,
          quranLetters: s.quranLetters + saved.quranLetters,
          byDhikr: addMaps(s.byDhikr, saved.byDhikr),
          days,
          bestDay: best,
          celebrated: Array.from(new Set([...s.celebrated, ...saved.celebrated])),
          rewardArchive: null,
          countGen: s.countGen + 1,
        });
        return true;
      },
      clearDayCut: () => {
        if (get().dayCut) set({ dayCut: false });
      },
      markCelebrated: (at) =>
        set((s) => ({ celebrated: s.celebrated.includes(at) ? s.celebrated : [...s.celebrated, at] })),
      restartChain: () => set({ chainIndex: 0, chainProgress: 0 }),
      startQuest: (id) => {
        const quest = sunnahQuestById(id);
        if (!quest || get().activeQuestId) return;
        const first = quest.steps[0];
        if (!first) return;
        set({
          activeQuestId: quest.id,
          questStep: 0,
          questStepProgress: 0,
          mode: first.dhikrId,
          lastDhikrId: first.dhikrId,
        });
      },
      leaveQuest: () => {
        const current = dhikrById(get().mode);
        set({
          activeQuestId: null,
          questStep: 0,
          questStepProgress: 0,
          ...(current.azkar ? { mode: "subhanallah", lastDhikrId: "subhanallah" } : {}),
        });
      },
      rollDay: () => {
        const day = todayKey();
        const current = get().doneToday;
        const next: Record<string, string> = {};
        for (const [id, at] of Object.entries(current)) {
          if (at === day) next[id] = at;
        }
        if (Object.keys(next).length !== Object.keys(current).length) set({ doneToday: next });
      },
      tap: () => {
        const s = get();
        const pool = s.pool.length ? s.pool : DHIKR.filter((d) => d.primary).map((d) => d.id);
        const id = s.mode === "random" ? pool[Math.floor(Math.random() * pool.length)]! : dhikrById(s.mode).id;
        const day = todayKey();
        const log = s.days[day] ?? { total: 0, by: {} };
        const todayBefore = log.total;
        const nextLog: DayLog = {
          total: log.total + 1,
          by: { ...log.by, [id]: (log.by[id] ?? 0) + 1 },
        };
        const total = s.total + 1;
        const xp = s.xp + 10;
        const byDhikr = { ...s.byDhikr, [id]: (s.byDhikr[id] ?? 0) + 1 };
        let othersBest = 0;
        for (const [k, v] of Object.entries(s.days)) {
          if (k !== day && v.total > othersBest) othersBest = v.total;
        }
        const standing = Math.max(othersBest, s.bestDay > todayBefore ? s.bestDay : othersBest);
        const beatRecord = standing > 0 && todayBefore === standing;
        const bestDay = Math.max(s.bestDay, nextLog.total);
        const newAchievements = MILESTONES.map((m) => m.at).filter((at) => total >= at && !s.achievements.includes(at));
        const taken = sunnahQuestById(s.activeQuestId);
        let questStep = s.questStep;
        let questStepProgress = s.questStepProgress;
        let activeQuestId = s.activeQuestId;
        const questBonus = s.questBonus;
        const xpNext = xp;
        let doneToday = s.doneToday;
        let mode = s.mode;
        let lastShown = id;
        let questDoneTitle: string | null = null;
        let questDonePoints = 0;
        let questAdvanced = false;
        if (taken) {
          const step = taken.steps[questStep];
          if (step && step.dhikrId === id) {
            const nextProg = questStepProgress + 1;
            if (nextProg >= step.count) {
              const nextStep = taken.steps[questStep + 1];
              if (nextStep) {
                questStep += 1;
                questStepProgress = 0;
                mode = nextStep.dhikrId;
                lastShown = nextStep.dhikrId;
                questAdvanced = true;
              } else {
                questDoneTitle = taken.title;
                questDonePoints = taken.steps.reduce((sum, step) => sum + step.count, 0) * 10;
                doneToday = { ...doneToday, [taken.id]: day };
                activeQuestId = null;
                questStep = 0;
                questStepProgress = 0;
                if (dhikrById(id).azkar) {
                  mode = "subhanallah";
                  lastShown = "subhanallah";
                }
              }
            } else questStepProgress = nextProg;
          }
        }
        const beforeLevel = levelFromXp(s.xp).level;
        const afterLevel = levelFromXp(xpNext).level;
        set({
          total,
          xp: xpNext,
          byDhikr,
          days: trimDays({ ...s.days, [day]: nextLog }),
          bestDay,
          achievements: newAchievements.length ? [...s.achievements, ...newAchievements] : s.achievements,
          mode,
          lastDhikrId: lastShown,
          activeQuestId,
          questStep,
          questStepProgress,
          questBonus,
          doneToday,
          wisdomStep: s.showWisdom ? s.wisdomStep + 1 : s.wisdomStep,
        });
        return {
          dhikrId: id,
          newAchievements,
          levelUp: afterLevel > beforeLevel ? afterLevel : null,
          chainDone: null,
          chainFinishedAll: false,
          questDoneTitle,
          questDonePoints,
          questAdvanced,
          dailies: [],
          beatRecord,
        };
      },
      addLetters: (count) => {
        const n = Math.max(0, Math.floor(count));
        if (!n) return { added: 0, reward: 0, levelUp: null };
        const s = get();
        const room = Math.max(0, CAP - s.quranLetters);
        const take = Math.min(n, room);
        if (!take) return { added: 0, reward: 0, levelUp: null };
        set({ quranLetters: s.quranLetters + take });
        return { added: take, reward: take * 10, levelUp: null };
      },
    }),
    {
      name: SAVE_KEY,
      storage: createJSONStorage(() => durableStorage),
      version: 5,
      migrate: (persisted, fromVersion) => {
        let next = normalize(persisted);
        if (fromVersion < 3) {
          const pool = fromVersion < 2 ? Array.from(new Set([...next.pool, "adad", "wahdahu"])) : next.pool;
          const earned = MILESTONES.map((m) => m.at).filter((at) => next.total >= at);
          next = { ...next, orbit: true, pool, achievements: earned, celebrated: Array.from(new Set([...next.celebrated, ...earned])) };
        } else if (fromVersion < 4) {
          next = { ...next, orbit: true };
        }
        if (fromVersion < 5) next = { ...next, vibrate: true };
        return next;
      },
      merge: (persisted, current) => ({ ...(current as ZikrState & Actions), ...normalize(persisted) }),
    },
  ),
);

if (typeof window !== "undefined") {
  let armed = false;
  const flush = () => {
    if (!armed) return;
    const raw = JSON.stringify({ state: snapshot(useZikr.getState()), version: 5 });
    void durableStorage.setItem(SAVE_KEY, raw);
  };
  const releaseStuck = () => {
    const s = useZikr.getState();
    const pending = s.achievements.filter((at) => !s.celebrated.includes(at));
    if (pending.length > 1) {
      for (const at of pending) s.markCelebrated(at);
    }
  };
  if (useZikr.persist.hasHydrated()) {
    armed = true;
    releaseStuck();
  }
  useZikr.persist.onFinishHydration(() => {
    armed = true;
    releaseStuck();
  });
  window.addEventListener("pagehide", flush);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flush();
  });
  try {
    void navigator.storage?.persist?.();
  } catch {
    /* the browser decides */
  }
}
