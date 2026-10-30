import { onlineNow } from "@/lib/zikr/api";

const KEY = "zikr-online-n";

export function readSavedOnline(): number | null {
  if (typeof window === "undefined") return null;
  try {
    const direct = Number(localStorage.getItem(KEY));
    if (Number.isFinite(direct) && direct > 0) return direct;
    const bag = JSON.parse(localStorage.getItem("zikr-rating-v1") || "null") as { online?: unknown } | null;
    return typeof bag?.online === "number" && bag.online > 0 ? bag.online : null;
  } catch {
    return null;
  }
}

export function saveOnline(n: number) {
  if (typeof window === "undefined" || !Number.isFinite(n) || n < 0) return;
  try {
    localStorage.setItem(KEY, String(n));
  } catch {
    /* the number still shows for this visit */
  }
}

function within<T>(work: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), ms);
    work.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

/** A short same-origin request. The last saved number stays if this cannot get through. */
export async function fetchOnline(publicId?: string): Promise<number | null> {
  const id = publicId && /^\d{8}$/.test(publicId) ? publicId : "";
  try {
    const res = await within(fetch(id ? `/api/online?id=${id}` : "/api/online", { cache: "no-store" }), 4000);
    if (res.ok) {
      const data = (await res.json()) as { online?: unknown };
      if (typeof data.online === "number") return data.online;
    }
  } catch {
    /* try the other door */
  }
  try {
    const res = await within(onlineNow({ data: { publicId: id || undefined } }), 5000);
    return typeof res.online === "number" ? res.online : null;
  } catch {
    return null;
  }
}
