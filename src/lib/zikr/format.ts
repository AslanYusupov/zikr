import type { DayLog, LangId } from "./types";

export function plural(n: number, one: string, few: string, many: string): string {
  const abs = Math.abs(Math.floor(n)) % 100;
  const d = abs % 10;
  if (abs > 10 && abs < 20) return many;
  if (d > 1 && d < 5) return few;
  if (d === 1) return one;
  return many;
}

export function formatNum(n: number): string {
  return new Intl.NumberFormat("ru-RU").format(Math.floor(n));
}

const ZIKR: Record<LangId, [string, string, string]> = {
  ru: ["зикр", "зикра", "зикров"],
  en: ["dhikr", "dhikr", "dhikr"],
  ar: ["ذكر", "ذكران", "أذكار"],
  id: ["zikir", "zikir", "zikir"],
  tr: ["zikir", "zikir", "zikir"],
  ur: ["ذکر", "ذکر", "اذکار"],
};

export function zikrWord(n: number, lang: LangId = "ru"): string {
  const [one, few, many] = ZIKR[lang] ?? ZIKR.ru;
  if (lang === "ru") return plural(n, one, few, many);
  if (lang === "ar") {
    const abs = Math.abs(Math.floor(n));
    if (abs === 1) return one;
    if (abs === 2) return few;
    if (abs >= 3 && abs <= 10) return many;
    return one;
  }
  return one;
}

export function rewardWord(n: number): string {
  return plural(n, "награда", "награды", "наград");
}

const SITE = "https://zikr-five.vercel.app";

export function inviteLink(code?: string | null): string {
  const clean = (code ?? "").trim();
  if (/^\d{8}$/.test(clean)) return `${SITE}/?i=${clean}`;
  const up = clean.toUpperCase();
  if (/^[A-Z0-9]{6}$/.test(up)) return `${SITE}/?i=${up}`;
  return SITE;
}

export function inviteText(link: string): string {
  const short = link.replace(/^https?:\/\//, "");
  return `Давай поминать Аллах1а вместе.\nسُبْحَانَ اللَّهِ وَبِحَمْدِهِ\nСубхьаналлах1и ва бихьамдихи\nСахих аль-Бухари и Сахих Муслим.\n${short}`;
}

export function whatsappHref(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export function telegramHref(link: string, text: string): string {
  return `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`;
}

export function todayKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function addDays(key: string, delta: number): string {
  const [y, m, d] = key.split("-").map(Number);
  const dt = new Date(y || 2000, (m || 1) - 1, d || 1);
  dt.setDate(dt.getDate() + delta);
  return todayKey(dt);
}

const WEEKDAYS = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];

export function recentDays(days: Record<string, DayLog>, n = 14, today = todayKey()) {
  const out: { key: string; total: number; label: string }[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const key = addDays(today, -i);
    const [y, m, d] = key.split("-").map(Number);
    const dt = new Date(y || 2000, (m || 1) - 1, d || 1);
    out.push({
      key,
      total: days[key]?.total ?? 0,
      label: `${d} ${WEEKDAYS[dt.getDay()]}`,
    });
  }
  return out;
}

function weekStart(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  const dt = new Date(y || 2000, (m || 1) - 1, d || 1);
  dt.setDate(dt.getDate() - ((dt.getDay() + 6) % 7));
  return todayKey(dt);
}

export function bestWeek(days: Record<string, DayLog>): number {
  const map = new Map<string, number>();
  for (const [k, v] of Object.entries(days)) {
    const w = weekStart(k);
    map.set(w, (map.get(w) ?? 0) + v.total);
  }
  let best = 0;
  for (const n of map.values()) if (n > best) best = n;
  return best;
}

export function thisWeek(days: Record<string, DayLog>, today = todayKey()): number {
  const start = weekStart(today);
  let sum = 0;
  for (const [k, v] of Object.entries(days)) {
    if (weekStart(k) === start) sum += v.total;
  }
  return sum;
}

/** Sum of the last n days, including today. */
export function sumRecent(days: Record<string, DayLog>, n = 7, today = todayKey()): number {
  let sum = 0;
  for (let i = 0; i < n; i++) sum += days[addDays(today, -i)]?.total ?? 0;
  return sum;
}

/** Best day that is not the one still being counted, so the challenge stays honest. */
export function recordToBeat(days: Record<string, DayLog>, bestDay: number, today = todayKey()): number {
  let others = 0;
  for (const [k, v] of Object.entries(days)) {
    if (k !== today && v.total > others) others = v.total;
  }
  const todayN = days[today]?.total ?? 0;
  if (bestDay > todayN && bestDay > others) return bestDay;
  return others;
}

export function goalStreak(days: Record<string, DayLog>, goal: number, today = todayKey()): number {
  if (goal <= 0) return 0;
  let cursor = (days[today]?.total ?? 0) >= goal ? today : addDays(today, -1);
  let n = 0;
  while ((days[cursor]?.total ?? 0) >= goal) {
    n += 1;
    if (n > 5000) break;
    cursor = addDays(cursor, -1);
  }
  return n;
}
