import { useEffect, useState } from "react";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { loadSave, pullDevice, pushDevice, pushSave, savedScore, type CloudMeta, type DeviceSave } from "@/lib/zikr/api";
import { todayKey } from "@/lib/zikr/format";
import { bindTapPulse, currentTapSince } from "@/lib/zikr/live";
import { mergeState, snapshot, useZikr } from "@/lib/zikr/store";

const INVITE_KEY = "nur-zikr-invite";

export function rememberInviteFromUrl() {
  const code = new URLSearchParams(window.location.search).get("i")?.trim() ?? "";
  if (!code) return;
  let next = "";
  if (/^\d{8}$/.test(code)) next = code;
  else if (/^[A-Za-z0-9]{6}$/.test(code)) next = code.toUpperCase();
  if (!next) return;
  try {
    const own = useZikr.getState().publicId;
    if (next === own) return;
    const prev = localStorage.getItem(INVITE_KEY) ?? "";
    if (/^\d{8}$/.test(prev)) return;
    localStorage.setItem(INVITE_KEY, next);
  } catch {
    /* private mode */
  }
}

export function storedInvite(): string | undefined {
  try {
    const v = localStorage.getItem(INVITE_KEY) ?? "";
    if (/^\d{8}$/.test(v)) return v;
    return /^[A-Z0-9]{6}$/.test(v) ? v : undefined;
  } catch {
    return undefined;
  }
}

export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    let stop = false;
    const done = () => {
      if (!stop) setHydrated(true);
    };
    if (useZikr.persist.hasHydrated()) done();
    const unsub = useZikr.persist.onFinishHydration(done);
    return () => {
      stop = true;
      unsub();
    };
  }, []);
  return hydrated;
}

export function useCloud(hydrated: boolean) {
  const { user, isPending } = useCurrentUserState();
  const [meta, setMeta] = useState<CloudMeta | null>(null);
  const [status, setStatus] = useState<"local" | "saving" | "saved" | "error">("local");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    rememberInviteFromUrl();
  }, []);

  useEffect(() => {
    if (!hydrated || !user?.id) return;
    let stop = false;
    let unsub = () => {};
    let timer: ReturnType<typeof setTimeout> | null = null;
    setReady(false);

    const send = async () => {
      const s = snapshot(useZikr.getState());
      const next = await pushSave({
        data: {
          displayName: s.displayName,
          publicBoard: s.publicBoard,
          total: s.total,
          bestDay: s.bestDay,
          inviteCodeToApply: storedInvite(),
          payload: JSON.stringify(s),
        },
      });
      if (stop) return next;
      setMeta(next);
      setStatus("saved");
      if (next.displayName && !useZikr.getState().displayName) {
        useZikr.getState().setDisplayName(next.displayName);
      }
      return next;
    };

    const pull = async () => {
      setStatus("saving");
      try {
        const remote = await loadSave();
        if (stop) return;
        if (remote.payload) {
          try {
            const local = snapshot(useZikr.getState());
            const parsed = JSON.parse(remote.payload) as { publicId?: string };
            const savedId = /^\d{8}$/.test(parsed.publicId ?? "") ? parsed.publicId ?? "" : "";
            const merged = mergeState(local, parsed as unknown);
            useZikr.getState().apply(savedId ? { ...merged, publicId: savedId } : merged);
          } catch {
            /* a broken cloud copy must not erase the phone */
          }
        }
        if (remote.meta) setMeta(remote.meta);
        await send();
      } catch {
        if (!stop) setStatus(navigator.onLine ? "error" : "local");
      } finally {
        if (!stop) setReady(true);
      }
    };

    void pull();
    const onOnline = () => {
      void pull();
    };
    window.addEventListener("online", onOnline);
    unsub = useZikr.subscribe(() => {
      setStatus(navigator.onLine ? "saving" : "local");
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        void send().catch(() => {
          if (!stop) setStatus(navigator.onLine ? "error" : "local");
        });
      }, 20_000);
    });

    return () => {
      stop = true;
      unsub();
      window.removeEventListener("online", onOnline);
      if (timer) clearTimeout(timer);
    };
  }, [hydrated, user?.id]);

  useEffect(() => {
    if (!hydrated || isPending) return;
    if (!user) setReady(true);
  }, [hydrated, isPending, user]);

  return { user, isPending, meta, status, ready };
}

const SYNC_KEY = "zikr-sync-key";

function validKey(value: string | null | undefined): string {
  return value && /^[A-Za-z0-9_-]{16,48}$/.test(value) ? value : "";
}

function makeSyncKey(): string {
  const bytes = new Uint8Array(18);
  crypto.getRandomValues(bytes);
  let raw = "";
  for (const byte of bytes) raw += String.fromCharCode(byte);
  return btoa(raw).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function rememberSyncKey(key: string) {
  try {
    localStorage.setItem(SYNC_KEY, key);
  } catch {
    /* private mode */
  }
  document.cookie = `zikr_k=${key}; Max-Age=31536000; Path=/; SameSite=Lax`;
}

function storedSyncKey(): string {
  try {
    const saved = validKey(localStorage.getItem(SYNC_KEY));
    if (saved) return saved;
  } catch {
    /* private mode */
  }
  const cookie = document.cookie.split("; ").find((row) => row.startsWith("zikr_k="))?.slice(7) ?? "";
  return validKey(decodeURIComponent(cookie));
}

function telegramUserId(): string {
  try {
    const fromApp = (window as unknown as { Telegram?: { WebApp?: { initDataUnsafe?: { user?: { id?: number | string } } } } }).Telegram?.WebApp?.initDataUnsafe?.user?.id;
    const direct = String(fromApp ?? "");
    if (/^\d{4,20}$/.test(direct)) return direct;
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const raw = hash.get("tgWebAppData") || new URLSearchParams(window.location.search).get("tgWebAppData") || "";
    if (!raw) return "";
    const user = new URLSearchParams(raw).get("user");
    if (!user) return "";
    const id = String((JSON.parse(user) as { id?: number | string }).id ?? "");
    return /^\d{4,20}$/.test(id) ? id : "";
  } catch {
    return "";
  }
}

function showKey(key: string) {
  const url = new URL(window.location.href);
  if (url.searchParams.get("k") === key) return;
  url.searchParams.set("k", key);
  history.replaceState(history.state, "", `${url.pathname}${url.search}${url.hash}`);
}

function adoptDevice(remote: DeviceSave) {
  if (!remote.payload) return;
  const local = snapshot(useZikr.getState());
  let parsed: unknown;
  try {
    parsed = JSON.parse(remote.payload);
  } catch {
    return;
  }
  const merged = mergeState(local, parsed);
  useZikr.getState().apply(merged);
  if (validKey(remote.syncKey)) rememberSyncKey(remote.syncKey);
}

export function useWorldSync(hydrated: boolean) {
  const publicId = useZikr((s) => s.publicId);
  const publicBoard = useZikr((s) => s.publicBoard);
  const ensurePublicId = useZikr((s) => s.ensurePublicId);
  const [linked, setLinked] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    let stop = false;
    const urlKey = validKey(new URLSearchParams(window.location.search).get("k"));
    let key = urlKey || storedSyncKey() || makeSyncKey();
    rememberSyncKey(key);
    const tgId = telegramUserId();

    const pull = async () => {
      const remote = await pullDevice({ data: { key, ...(tgId ? { tgId } : {}) } });
      if (stop || !remote) return;
      const local = useZikr.getState();
      const empty = local.total === 0 && !/^\d{8}$/.test(local.publicId);
      if (empty || remote.syncKey === key) adoptDevice(remote);
      if (validKey(remote.syncKey) && empty) key = remote.syncKey;
    };

    const push = async () => {
      const id = useZikr.getState().ensurePublicId();
      const state = snapshot(useZikr.getState());
      const saved = await pushDevice({
        data: { key, publicId: id, total: state.total, payload: JSON.stringify(state), ...(tgId ? { tgId } : {}) },
      });
      if (stop || !saved) return;
      const current = useZikr.getState().publicId;
      if (/^\d{8}$/.test(saved.publicId) && !/^\d{8}$/.test(current)) {
        useZikr.setState({ publicId: saved.publicId });
      }
      const local = useZikr.getState();
      if (saved.syncKey !== key && local.total === 0) adoptDevice(saved);
    };

    void (async () => {
      try {
        await pull();
        if (!stop) await push();
      } catch {
        if (!stop) ensurePublicId();
      } finally {
        if (!stop) {
          showKey(storedSyncKey() || key);
          setLinked(true);
        }
      }
    })();

    return () => {
      stop = true;
    };
  }, [hydrated, ensurePublicId]);

  useEffect(() => {
    if (!hydrated || !linked || (publicId !== "52812946" && publicId !== "25574036" && publicId !== "50170262" && publicId !== "79475757")) return;
    let stop = false;
    const day = todayKey();
    void savedScore({ data: { publicId, dayKey: day } })
      .then((saved) => {
        if (stop || !saved) return;
        const s = snapshot(useZikr.getState());
        const days = { ...s.days };
        const put = (key: string, total: number, by: Record<string, number>) => {
          if (!/^\d{4}-\d{2}-\d{2}$/.test(key) || total <= (days[key]?.total ?? 0)) return;
          days[key] = { total, by };
        };
        for (const [key, log] of Object.entries(s.rewardArchive?.days ?? {})) put(key, log.total, log.by);
        for (const [key, log] of Object.entries(saved.days ?? {})) put(key, log.total, log.by ?? {});
        if (saved.today > (days[day]?.total ?? 0)) put(day, saved.today, days[day]?.by ?? {});
        const total = Math.max(s.total, s.rewardArchive?.total ?? 0, saved.total);
        const quranLetters = Math.max(s.quranLetters, s.rewardArchive?.quranLetters ?? 0, saved.quranLetters);
        if (total === s.total && quranLetters === s.quranLetters && (days[day]?.total ?? 0) === (s.days[day]?.total ?? 0)) return;
        const byDhikr = { ...s.byDhikr };
        for (const [key, n] of Object.entries(s.rewardArchive?.byDhikr ?? {})) byDhikr[key] = Math.max(byDhikr[key] ?? 0, n);
        let bestDay = Math.max(s.bestDay, s.rewardArchive?.bestDay ?? 0);
        for (const log of Object.values(days)) if (log.total > bestDay) bestDay = log.total;
        useZikr.getState().apply({
          ...s,
          publicId: "52812946",
          total,
          xp: Math.max(s.xp, s.rewardArchive?.xp ?? 0, total * 10),
          quranLetters,
          days,
          byDhikr,
          bestDay,
          rewardArchive: null,
        });
      })
      .catch(() => {});
    return () => {
      stop = true;
    };
  }, [hydrated, linked, publicId]);

  useEffect(() => {
    if (!hydrated || !linked || !/^\d{8}$/.test(publicId)) return;
    const key = storedSyncKey();
    const tgId = telegramUserId();
    let sentSig = "";
    let lastBeat = 0;
    let lastNumbers = 0;
    let lastSnap = 0;
    let wait: number | null = null;
    const send = () => {
      const state = useZikr.getState();
      const day = todayKey();
      const dayTotal = state.days[day]?.total ?? 0;
      if (state.total <= 0 && dayTotal <= 0) return;
      const host = storedInvite();
      if (host && host === publicId) {
        try {
          localStorage.removeItem(INVITE_KEY);
        } catch {
          /* private mode */
        }
      }
      const invitedBy = host && /^\d{8}$/.test(host) && host !== publicId ? host : undefined;
      const listed = state.publicBoard;
      const replaceDay = state.dayCut;
      const sig = `${publicId}|${state.total}|${dayTotal}|${state.xp}|${state.quranLetters}|${listed ? 1 : 0}|${replaceDay ? 1 : 0}`;
      const now = Date.now();
      const changed = sig !== sentSig;
      const hiding = document.hidden;
      if (!changed && !hiding && now - lastBeat < 60_000) return;
      if (changed && !hiding && now - lastNumbers < 1_500) {
        if (wait == null) {
          wait = window.setTimeout(() => {
            wait = null;
            send();
          }, 1_500);
        }
        return;
      }
      const beatOnly = !changed;
      const job = fetch(`/api/rating?open=${Date.now()}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(20000),
        body: JSON.stringify({
          publicId,
          total: state.total,
          dayKey: day,
          dayTotal,
          xp: state.xp,
          country: state.country,
          listed,
          replaceDay: Boolean(replaceDay && !beatOnly),
          tapSince: listed && !beatOnly ? currentTapSince() : 0,
          ...(invitedBy && listed && state.total > 0 && !beatOnly ? { invitedBy } : {}),
        }),
      }).then(async (res) => {
        const body = (await res.json().catch(() => null)) as { ok?: boolean } | null;
        if (!res.ok || !body?.ok) throw new Error("rating");
        if (replaceDay && !beatOnly) useZikr.getState().clearDayCut();
      });
      lastBeat = now;
      if (changed) lastNumbers = now;
      void job
        .then(() => {
          if (!changed) return;
          sentSig = sig;
          window.dispatchEvent(new Event("zikr-live"));
          if (key && (hiding || now - lastSnap >= 120_000)) {
            const snap = snapshot(state);
            lastSnap = now;
            void pushDevice({
              data: { key, publicId, total: snap.total, payload: JSON.stringify(snap), ...(tgId ? { tgId } : {}) },
            }).catch(() => {});
          }
        })
        .catch(() => {
          if (changed) lastNumbers = 0;
          lastBeat = 0;
          if (wait == null) {
            wait = window.setTimeout(() => {
              wait = null;
              send();
            }, 8_000);
          }
        });
    };
    const unbind = bindTapPulse(() => {
      if (!document.hidden) send();
    });
    const first = window.setTimeout(send, 800);
    const timer = window.setInterval(() => {
      if (!document.hidden) send();
    }, 60_000);
    const onOnline = () => send();
    const onWake = () => {
      send();
    };
    window.addEventListener("online", onOnline);
    document.addEventListener("visibilitychange", onWake);
    const link = (navigator as Navigator & { connection?: EventTarget }).connection;
    link?.addEventListener?.("change", onOnline);
    return () => {
      unbind();
      if (wait != null) window.clearTimeout(wait);
      window.clearTimeout(first);
      window.clearInterval(timer);
      window.removeEventListener("online", onOnline);
      document.removeEventListener("visibilitychange", onWake);
      link?.removeEventListener?.("change", onOnline);
    };
  }, [hydrated, linked, publicId, publicBoard]);
}
