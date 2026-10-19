import { milestoneBoard } from "@/lib/zikr/api";

const CACHE_KEY = "zikr-reach-counts";
const SENT_KEY = "zikr-reach-sent";

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

function readSent(): number[] {
  try {
    const raw = localStorage.getItem(SENT_KEY);
    const v = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(v) ? v.filter((n) => typeof n === "number") : [];
  } catch {
    return [];
  }
}

let flight: Promise<void> | null = null;

/** Remember who reached each tap mark, then refresh the public counts. */
export function syncReach(publicId: string, earned: number[], force = false): Promise<void> {
  if (flight) return flight;
  const job = (async () => {
    if (typeof navigator !== "undefined" && !navigator.onLine) return;
    const sent = new Set(readSent());
    const pending = earned.filter((at) => Number.isFinite(at) && at >= 0 && !sent.has(at)).slice(0, 80);
    const idOk = /^\d{8}$/.test(publicId);
    if (!force && pending.length === 0) return;
    const res = await milestoneBoard({
      data: {
        ...(idOk ? { publicId } : {}),
        ats: idOk ? pending : [],
      },
    });
    if (!res.ok) return;
    const rows: Record<string, number> = {};
    for (const row of res.rows) rows[String(row.at)] = Math.max(0, Math.floor(Number(row.n) || 0));
    localStorage.setItem(CACHE_KEY, JSON.stringify({ rows }));
    if (idOk) {
      for (const at of res.accepted) sent.add(at);
      localStorage.setItem(SENT_KEY, JSON.stringify([...sent].slice(-80)));
    }
    window.dispatchEvent(new Event("zikr-reach"));
  })()
    .catch(() => {})
    .finally(() => {
      if (flight === job) flight = null;
    });
  flight = job;
  return job;
}
