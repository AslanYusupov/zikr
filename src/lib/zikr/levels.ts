/**
 * Degrees get a little harder each time: one more tap than the degree before.
 * A tap is 10. The first degree is 5 taps, the next is 6, then 7, and so on.
 */
const MAX_DEGREE = 40_000_000;
const START = 50;
const STEP = 10;

/** How much this degree asks for. Always 10 more than the one before. */
export function xpToAdvance(level: number): number {
  const n = Math.min(MAX_DEGREE, Math.max(1, Math.floor(level)));
  return START + (n - 1) * STEP;
}

/** XP already spent to arrive at this degree. */
export function xpToReach(level: number): number {
  const n = Math.max(0, Math.min(MAX_DEGREE, Math.floor(level)) - 1);
  if (n <= 0) return 0;
  return n * START + (STEP * n * (n - 1)) / 2;
}

export function levelFromXp(xp: number): { level: number; into: number; need: number } {
  const safe = Math.max(0, Math.floor(xp));
  let lo = 1;
  let hi = MAX_DEGREE;
  while (lo < hi) {
    const mid = Math.floor((lo + hi + 1) / 2);
    if (xpToReach(mid) <= safe) lo = mid;
    else hi = mid - 1;
  }
  const base = xpToReach(lo);
  const need = xpToAdvance(lo);
  const into = Math.min(need, Math.max(0, safe - base));
  return { level: lo, into, need };
}

export function levelTitle(level: number): string {
  if (level >= 40000) return "Верность поминанию";
  if (level >= 15000) return "Тяжёлый на Весах";
  if (level >= 6000) return "Страж утра и вечера";
  if (level >= 2500) return "Близость";
  if (level >= 1000) return "Много поминающий";
  if (level >= 400) return "Язык, что помнит";
  if (level >= 150) return "Стремящийся к милости";
  if (level >= 60) return "Смирение";
  if (level >= 25) return "Постоянство";
  if (level >= 8) return "Сердце, что помнит";
  return "Первые шаги";
}
