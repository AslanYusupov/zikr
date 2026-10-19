import { useCallback, useEffect, useRef, useState } from "react";
import { Award, BarChart3, ChevronLeft, ListChecks, Maximize2, Minimize2, Moon, Settings, Volume2, VolumeX } from "lucide-react";
import { useZikr } from "@/lib/zikr/store";
import { cn } from "@/lib/cn";
import { Celebrate } from "./celebrate";
import { Counter, ModeStrip } from "./counter";
import { QuranView } from "./quran-view";
import { Backdrop } from "./pattern";
import { isRtl, t, tx } from "@/lib/zikr/i18n";
import { checkUpdate, takeUpdate } from "@/lib/zikr/build";
import { onlineNow } from "@/lib/zikr/api";
import { formatNum, todayKey } from "@/lib/zikr/format";
import { useCloud, useHydrated, useWorldSync } from "./use-cloud";
import { DuaView } from "./dua-view";
import { QuestsView } from "./quests-view";
import { RewardsView } from "./rewards-view";
import { RatingView } from "./rating-view";
import { syncReach } from "@/lib/zikr/reach";
import { SettingsView } from "./settings-view";
import { Library } from "./library";

type Tab = "zikr" | "quests" | "dua" | "rewards" | "rating";

const TABS: { id: Tab; icon?: typeof Award }[] = [
  { id: "zikr", icon: Moon },
  { id: "quests", icon: ListChecks },
  { id: "dua" },
  { id: "rewards", icon: Award },
  { id: "rating", icon: BarChart3 },
];

export function Splash({ onEnter }: { onEnter: () => void }) {
  const done = useRef(false);
  const close = useCallback(() => {
    if (done.current) return;
    done.current = true;
    onEnter();
  }, [onEnter]);

  useEffect(() => {
    if (document.documentElement.classList.contains("app-go")) {
      onEnter();
      return;
    }
    const timer = window.setTimeout(onEnter, 1500);
    return () => window.clearTimeout(timer);
  }, [onEnter]);

  return (
    <div className="bismillah-splash" onClick={close} suppressHydrationWarning>
      <span className="bismillah-glow" aria-hidden />
      <span className="bismillah-sky" aria-hidden />
      <span
        className="comet comet-live splash-pass"
        aria-hidden
        style={{
          ["--x" as string]: "104vw",
          ["--y" as string]: "-6vh",
          ["--mx" as string]: "46vw",
          ["--my" as string]: "16vh",
          ["--x2" as string]: "-32vw",
          ["--y2" as string]: "30vh",
          ["--rot" as string]: "-18deg",
          ["--flip" as string]: "1",
          ["--dur" as string]: "1.2s",
          ["--len" as string]: "9rem",
          ["--bright" as string]: "0.82",
        }}
      >
        <span className="comet-tail" />
        <span className="comet-head" />
      </span>
      <p className="bismillah-words" dir="rtl" lang="ar">
        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
      </p>
    </div>
  );
}

export function Shell() {
  const hydrated = useHydrated();
  const cloud = useCloud(hydrated);
  useWorldSync(hydrated && cloud.ready);
  const theme = useZikr((s) => s.theme);
  const lang = useZikr((s) => s.lang);
  const sound = useZikr((s) => s.sound);
  const setSound = useZikr((s) => s.setSound);
  const achievements = useZikr((s) => s.achievements);
  const reached = achievements.length;
  const publicId = useZikr((s) => s.publicId);
  const celebrated = useZikr((s) => s.celebrated);
  const [tab, setTab] = useState<Tab>("zikr");
  const [home, setHome] = useState<"dhikr" | "quran">("dhikr");
  const [dhikrList, setDhikrList] = useState(false);
  const [namesOpen, setNamesOpen] = useState(false);
  const [settings, setSettings] = useState(false);
  const [library, setLibrary] = useState<number | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [full, setFull] = useState(false);
  const [updateReady, setUpdateReady] = useState(false);
  const [online, setOnline] = useState<number | null>(null);
  const [entered, setEntered] = useState(false);
  const [dayStamp, setDayStamp] = useState(todayKey);
  const noticeId = useRef(0);
  const pull = useRef<number | null>(null);

  useEffect(() => {
    if (!import.meta.env.PROD || !("serviceWorker" in navigator) || !("caches" in window)) return;
    let stop = false;
    const keep = async () => {
      try {
        await navigator.storage?.persist?.();
      } catch {
        /* the phone may refuse */
      }
      try {
        try {
          await navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" });
        } catch {
          await navigator.serviceWorker.register("/sw.js");
        }
        if (stop) return;
        const cache = await caches.open("zikr-shell-v1");
        const urls = new Set(["/favicon.svg", "/orbit-sun.webp", "/orbit-moon.webp"]);
        document.querySelectorAll("script[src], link[rel='stylesheet']").forEach((node) => {
          const src = node.getAttribute("src") || node.getAttribute("href") || "";
          const path = src.startsWith("/") ? src.split("?")[0] : "";
          if (path.startsWith("/assets/") || path.endsWith(".css")) urls.add(path);
        });
        for (const face of ["inter-cyr", "inter-latin", "inter-latinext"]) {
          for (const weight of [500, 600, 700, 800]) urls.add(`/fonts/${face}-${weight}.woff2`);
        }
        for (const weight of [400, 700]) urls.add(`/fonts/amiri-${weight}.woff2`);
        urls.add("/fonts/amiri-400i.woff2");
        await Promise.all(
          [...urls].map(async (url) => {
            try {
              const res = await fetch(`${url}${url.includes("?") ? "&" : "?"}warm=1`, { cache: "no-store" });
              if (res.ok) {
                const headers = new Headers();
                const type = res.headers.get("content-type");
                if (type) headers.set("content-type", type);
                await cache.put(url, new Response(await res.blob(), { status: 200, headers }));
              }
            } catch {
              /* keep the copy already saved */
            }
          }),
        );
        let savedPage = false;
        try {
          const page = await fetch(`/?warm=${Date.now()}`, { cache: "no-store", signal: AbortSignal.timeout(8000) });
          if (page.ok) {
            const html = await page.text();
            const scripts = [...urls].filter((url) => url.startsWith("/assets/") && url.endsWith(".js"));
            if (html.includes("<html") && scripts.every((src) => html.includes(src))) {
              await cache.put("/", new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } }));
              savedPage = true;
            }
          }
        } catch {
          /* the phone keeps the page it already stored */
        }
        if (!savedPage && !(await cache.match("/"))) {
          const html = `<!DOCTYPE html>${document.documentElement.outerHTML}`;
          await cache.put("/", new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } }));
        }
      } catch {
        /* opening must not wait on this */
      }
    };
    void keep();
    let warmed = Date.now();
    const again = () => {
      if (document.visibilityState !== "visible") return;
      const now = Date.now();
      if (now - warmed < 60_000) return;
      warmed = now;
      void keep();
    };
    window.addEventListener("online", again);
    document.addEventListener("visibilitychange", again);
    const link = (navigator as Navigator & { connection?: EventTarget }).connection;
    link?.addEventListener?.("change", again);
    return () => {
      stop = true;
      window.removeEventListener("online", again);
      document.removeEventListener("visibilitychange", again);
      link?.removeEventListener?.("change", again);
    };
  }, []);

  useEffect(() => {
    if (!hydrated || !/^\d{8}$/.test(publicId) || reached < 1) return;
    let stop = false;
    const run = () => {
      if (stop) return;
      const s = useZikr.getState();
      void syncReach(s.publicId, s.total);
    };
    const soon = window.setTimeout(run, 2500);
    const later = window.setTimeout(run, 25000);
    return () => {
      stop = true;
      window.clearTimeout(soon);
      window.clearTimeout(later);
    };
  }, [hydrated, publicId, reached]);

  useEffect(() => {
    const syncDay = () => {
      const next = todayKey();
      setDayStamp((cur) => (cur === next ? cur : next));
      useZikr.getState().rollDay();
    };
    const id = window.setInterval(syncDay, 30000);
    document.addEventListener("visibilitychange", syncDay);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", syncDay);
    };
  }, []);

  useEffect(() => {
    const sync = () => setFull(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    const bg = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim();
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", bg || "#050505");
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isRtl(lang) ? "rtl" : "ltr";
  }, [lang]);

  useEffect(() => {
    const apply = () => {
      document.documentElement.dataset.rest = document.hidden ? "1" : "";
    };
    apply();
    document.addEventListener("visibilitychange", apply);
    return () => document.removeEventListener("visibilitychange", apply);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    let stop = false;
    const load = () => {
      if (document.hidden) return;
      const id = useZikr.getState().publicId;
      void onlineNow({ data: { publicId: /^\d{8}$/.test(id) ? id : undefined } })
        .then((res) => {
          if (!stop) setOnline(res.online);
        })
        .catch(() => {});
    };
    const start = window.setTimeout(load, 800);
    const id = window.setInterval(load, 4000);
    const onLive = () => load();
    const onWake = () => {
      if (document.visibilityState === "visible") load();
    };
    window.addEventListener("zikr-live", onLive);
    window.addEventListener("online", onWake);
    document.addEventListener("visibilitychange", onWake);
    const link = (navigator as Navigator & { connection?: EventTarget }).connection;
    link?.addEventListener?.("change", onWake);
    return () => {
      stop = true;
      window.clearTimeout(start);
      window.clearInterval(id);
      window.removeEventListener("zikr-live", onLive);
      window.removeEventListener("online", onWake);
      document.removeEventListener("visibilitychange", onWake);
      link?.removeEventListener?.("change", onWake);
    };
  }, [hydrated]);

  useEffect(() => {
    let stop = false;
    const probe = async () => {
      if (document.hidden) return;
      try {
        const state = await checkUpdate();
        if (stop || state === "same" || state === "unknown") return;
        setUpdateReady(true);
      } catch {
        /* offline */
      }
    };
    const start = window.setTimeout(() => void probe(), 1500);
    const onVis = () => {
      if (document.visibilityState === "visible") void probe();
    };
    document.addEventListener("visibilitychange", onVis);
    const id = window.setInterval(() => void probe(), 120_000);
    return () => {
      stop = true;
      window.clearTimeout(start);
      document.removeEventListener("visibilitychange", onVis);
      window.clearInterval(id);
    };
  }, []);

  function closeOverlays() {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    setSettings(false);
    setLibrary(null);
    setTab("zikr");
  }

  function openSettings() {
    setSettings(true);
  }

  function openLibrary(quoteIndex: number) {
    setLibrary(quoteIndex);
  }

  function selectTab(next: Tab) {
    setSettings(false);
    setLibrary(null);
    if (next === tab) {
      setHome("dhikr");
      setDhikrList(false);
      if (next !== "zikr") setTab("zikr");
      return;
    }
    setTab(next);
  }

  function pushNotice(text: string) {
    const id = ++noticeId.current;
    setNotice(text);
    window.setTimeout(() => {
      if (noticeId.current === id) setNotice(null);
    }, 3200);
  }

  function toggleSound() {
    setSound(sound === "off" ? "on" : "off");
  }

  function refreshApp() {
    void takeUpdate();
  }

  async function toggleFullscreen() {
    const root = document.documentElement;
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        setFull(false);
        return;
      }
      await root.requestFullscreen();
      setFull(true);
    } catch {
      pushNotice(tx(lang, "installNotice"));
    }
  }

  const unseen = achievements.some((at) => !celebrated.includes(at));
  const title = t(lang, tab);
  const enter = useCallback(() => {
    setEntered(true);
    document.documentElement.classList.add("app-go");
  }, []);

  return (
    <div className="app-frame" data-day={dayStamp}>
      <div className="app-column">
        <Backdrop />
        <header
          className="safe-top relative z-20 flex shrink-0 items-center justify-between gap-2 px-3 pb-1"
          onTouchStart={(event) => {
            pull.current = event.touches[0]?.clientY ?? null;
          }}
          onTouchEnd={(event) => {
            const start = pull.current;
            pull.current = null;
            const end = event.changedTouches[0]?.clientY ?? 0;
            if (start !== null && end - start > 64) refreshApp();
          }}
        >
          <div className="flex shrink-0 items-center gap-2">
            {tab === "zikr" ? (
              <button
                type="button"
                onClick={toggleSound}
                className="grid h-11 w-11 place-items-center rounded-full border border-line bg-chip text-gold"
                aria-label={sound === "off" ? tx(lang, "soundOnAria") : tx(lang, "soundOffAria")}
              >
                {sound === "off" ? <VolumeX className="size-5" strokeWidth={1.5} /> : <Volume2 className="size-5" strokeWidth={1.5} />}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => selectTab("zikr")}
                className="flex h-11 items-center gap-1 rounded-full border border-line bg-chip px-3 text-sm text-gold"
              >
                <ChevronLeft className="size-5 shrink-0" strokeWidth={1.6} />
                <span className="back-label">{t(lang, "zikr")}</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => void toggleFullscreen()}
              className="grid h-11 w-11 place-items-center rounded-full border border-line bg-chip text-gold"
              aria-label={full ? tx(lang, "fullOn") : tx(lang, "fullOff")}
            >
              {full ? <Minimize2 className="size-5" strokeWidth={1.5} /> : <Maximize2 className="size-5" strokeWidth={1.5} />}
            </button>
          </div>
          <div className="min-w-0 text-center">
            {tab === "zikr" && <p className="font-arabic text-2xl leading-none text-gold">ذِكْر</p>}
            <p className="flex items-center justify-center gap-1.5 text-sm text-fg">
              <span className="truncate">{title}</span>
              {tab === "zikr" ? (
                <span
                  className="inline-flex shrink-0 items-center gap-1 text-muted"
                  aria-label={online === null ? tx(lang, "onlineAria") : `${tx(lang, "onlineAria")} ${formatNum(online)}`}
                >
                  <svg className="live-moon" viewBox="0 0 24 24" aria-hidden>
                    <path
                      fill="currentColor"
                      d="M14.6 2.1A9.4 9.4 0 1 0 22 16.4 7.5 7.5 0 1 1 14.6 2.1z"
                    />
                  </svg>
                  <span className="text-xs tabular-nums">{online === null ? "…" : formatNum(online)}</span>
                </span>
              ) : null}
            </p>
          </div>
          <button
            type="button"
            onClick={openSettings}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line bg-chip text-gold"
            aria-label={tx(lang, "settingsAria")}
          >
            <Settings className="size-5" strokeWidth={1.5} />
          </button>
        </header>

        {updateReady ? (
          <button
            type="button"
            onClick={refreshApp}
            className="relative z-20 mx-3 mb-1 rounded-2xl border border-line bg-surface px-3 py-2 text-left"
          >
            <span className="block text-sm font-bold text-fg">{tx(lang, "updateHere")}</span>
          </button>
        ) : null}

        <div className="shell-main relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden">
          {tab === "zikr" && (
            <ModeStrip
              quranOn={home === "quran"}
              listOn={home === "dhikr" && dhikrList}
              namesOn={home === "dhikr" && namesOpen}
              onQuran={() => {
                setDhikrList(false);
                setNamesOpen(false);
                setHome((current) => (current === "quran" ? "dhikr" : "quran"));
              }}
              onList={() => {
                setNamesOpen(false);
                setHome("dhikr");
                setDhikrList((open) => (home === "quran" ? true : !open));
              }}
              onNames={() => {
                setDhikrList(false);
                setHome("dhikr");
                setNamesOpen((open) => (home === "quran" ? true : !open));
              }}
              onLeave={() => {
                setHome("dhikr");
                setDhikrList(false);
                setNamesOpen(false);
              }}
            />
          )}
          {tab === "zikr" && home === "dhikr" && (
            <Counter
              onNotice={pushNotice}
              onOpenLibrary={openLibrary}
              listOpen={dhikrList}
              onListClose={() => setDhikrList(false)}
              namesOpen={namesOpen}
              onNamesClose={() => setNamesOpen(false)}
            />
          )}
          {tab === "zikr" && home === "quran" && <QuranView />}
          {tab === "quests" && <QuestsView onBegin={() => selectTab("zikr")} />}
          {tab === "dua" && <DuaView />}
          {tab === "rewards" && <RewardsView />}
          {tab === "rating" && <RatingView />}
        </div>

        {notice && (
          <div className="pointer-events-none absolute inset-x-4 bottom-24 z-20">
            <p className="notice-in rounded-2xl border border-line bg-surface px-3 py-2 text-center text-sm text-fg">{notice}</p>
          </div>
        )}

        <nav className="app-nav safe-bottom z-30 grid shrink-0 grid-cols-5 border-t border-line bg-bg">
          {TABS.map((item) => {
            const active = tab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => selectTab(item.id)}
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-0.5 px-1 text-[0.7rem] leading-tight",
                  active ? "text-gold" : "text-muted",
                )}
              >
                <span className="relative">
                  {item.id === "dua" ? (
                    <span className="nav-dua" aria-hidden />
                  ) : Icon ? (
                    <Icon className="size-5" strokeWidth={1.5} />
                  ) : null}
                  {item.id === "rewards" && unseen && <span className="absolute -top-0.5 -right-1 h-1.5 w-1.5 rounded-full bg-gold" />}
                </span>
                {t(lang, item.id)}
              </button>
            );
          })}
        </nav>

        <Celebrate armed={hydrated} />
        {library !== null && <Library focus={library} onClose={closeOverlays} />}
        {settings && <SettingsView onClose={closeOverlays} meta={cloud.meta} status={cloud.user ? cloud.status : "local"} />}
      </div>
      {!entered && <Splash onEnter={enter} />}
    </div>
  );
}
