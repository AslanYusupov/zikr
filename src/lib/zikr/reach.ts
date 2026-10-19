import { milestoneBoard } from "@/lib/zikr/api";

const CACHE_KEY = "zikr-reach-counts";

export function cachedReach(): { ready: boolean; rows: Record<string, number> } {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return { ready: false, rows: {} };
    const v = JSON.parse(raw) as { rows?: Record<string, unknown> };
    const rows: Record<string, number> = {};
    for (const [k, n] of Object.entries(v.rows ?? {})) {
      const num = Math.floor(Number(n));
      if (/^\d+$/.test(k) && num >= 0) rows[k] = num;
    }
    return { ready: true, rows };
  } catch {
    return { ready: false, rows: {} };
  }
}

let flight: Promise<void> | null = null;

/** Refresh how many people have reached each tap mark. */
export function syncReach(publicId: string, total: number): Promise<void> {
  if (flight) return flight;
  const job = (async () => {
    if (typeof navigator !== "undefined" && !navigator.onLine) return;
    const idOk = /^\d{8}$/.test(publicId);
    const taps = Math.max(0, Math.floor(total));
    const res = await milestoneBoard({
      data: idOk ? { publicId, total: taps } : {},
    });
    if (!res.ok) return;
    const rows: Record<string, number> = {};
    for (const row of res.rows) rows[String(row.at)] = Math.max(0, Math.floor(Number(row.n) || 0));
    localStorage.setItem(CACHE_KEY, JSON.stringify({ rows }));
    window.dispatchEvent(new Event("zikr-reach"));
  })()
    .catch(() => {})
    .finally(() => {
      if (flight === job) flight = null;
    });
  flight = job;
  return job;
}
