import { useCallback, useEffect, useRef, useState } from "react";
import { BarChart3, ChevronLeft, ListChecks, Maximize2, Minimize2, Moon, Settings, Volume2, VolumeX } from "lucide-react";
import { useZikr } from "@/lib/zikr/store";
import { cn } from "@/lib/cn";
import { Celebrate } from "./celebrate";
import { Counter, ModeStrip } from "./counter";
import { QuranView } from "./quran-view";
import { Backdrop, randomStarPass } from "./pattern";
import { isRtl, headLabel, t, tx } from "@/lib/zikr/i18n";
import { applyUpdate, audioBusy, buildIsNewer, pageBuild, pullUpdate } from "@/lib/zikr/build";
import { fetchOnline, msUntilLiveTick, readSavedOnline, saveOnline } from "@/lib/zikr/online-count";
import { formatNum, todayKey } from "@/lib/zikr/format";
import { useCloud, useHydrated, useWorldSync } from "./use-cloud";
import { DuaView } from "./dua-view";
import { QuestsView } from "./quests-view";
import { RatingView } from "./rating-view";
import { syncReach } from "@/lib/zikr/reach";
import { SettingsView } from "./settings-view";
import { Library } from "./library";

type Tab = "zikr" | "quests" | "dua" | "quran" | "rating";

const TABS: { id: Tab; icon?: typeof Moon }[] = [
  { id: "zikr", icon: Moon },
  { id: "quests", icon: ListChecks },
  { id: "dua" },
  { id: "quran" },
  { id: "rating", icon: BarChart3 },
];

function QuranMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 4.6C10 2.8 7.2 2.2 3.8 2.6H2.2v15.6h2.2c2.8 0 5.2.7 7.6 2.2" />
      <path d="M12 4.6C14 2.8 16.8 2.2 20.2 2.6h1.6v15.6h-2.2c-2.8 0-5.2.7-7.6 2.2" />
      <path d="M12 4.6v16" />
    </svg>
  );
}

export function Splash({ onEnter }: { onEnter: () => void }) {
  const done = useRef(false);
  const close = useCallback(() => {
    if (done.current) return;
    done.current = true;
    onEnter();
  }, [onEnter]);

  const [star, setStar] = useState<ReturnType<typeof randomStarPass> | null>(null);

  useEffect(() => {
    setStar(randomStarPass());
    const timer = window.setTimeout(onEnter, 500);
    return () => window.clearTimeout(timer);
  }, [onEnter]);

  return (
    <div className="bismillah-splash" onClick={close} suppressHydrationWarning>
      <span className="bismillah-glow" aria-hidden />
      <span className="bismillah-sky" aria-hidden />
      {star ? (
        <span
          className="comet comet-live tap-star"
          style={{
            ["--x" as string]: star.pass.x,
            ["--y" as string]: star.pass.y,
            ["--x2" as string]: star.pass.x2,
            ["--y2" as string]: star.pass.y2,
            ["--rot" as string]: star.rot,
            ["--dur" as string]: star.pass.dur,
            ["--len" as string]: "11rem",
            ["--bright" as string]: "0.9",
          }}
          aria-hidden
        >
          <span className="comet-tail" />
          <span className="comet-head" />
        </span>
      ) : null}
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
  const font = useZikr((s) => s.font);
  const fontScale = useZikr((s) => s.fontScale);
  const lang = useZikr((s) => s.lang);
  const publicId = useZikr((s) => s.publicId);
  const sound = useZikr((s) => s.sound);
  const setSound = useZikr((s) => s.setSound);
  const achievements = useZikr((s) => s.achievements);
  const reached = achievements.length;
  const celebrated = useZikr((s) => s.celebrated);
  const [tab, setTab] = useState<Tab>("zikr");
  const [dhikrList, setDhikrList] = useState(false);
  const [namesOpen, setNamesOpen] = useState(false);
  const [settings, setSettings] = useState(false);
  const [library, setLibrary] = useState<number | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [full, setFull] = useState(false);
  const [online, setOnline] = useState<number | null>(null);
  const [updateMark, setUpdateMark] = useState<string | null>(null);
  const [entered, setEntered] = useState(false);
  const [dayStamp, setDayStamp] = useState(todayKey);
  const noticeId = useRef(0);
  const pull = useRef<number | null>(null);

  useEffect(() => {
    if (!import.meta.env.PROD || !("serviceWorker" in navigator) || !("caches" in window)) return;
    let stop = false;
    const offer = (mark: string) => {
      if (!mark || !buildIsNewer(mark, pageBuild())) return;
      setUpdateMark(mark);
    };
    const look = () => {
      if (stop || document.hidden) return;
      void pullUpdate().then((mark) => {
        if (!stop && mark) offer(mark);
      });
    };
    const kick = () => {
      void navigator.serviceWorker.getRegistration().then((next) => next?.update());
    };
    const onShow = () => {
      if (document.visibilityState !== "visible") return;
      kick();
      look();
    };
    const keep = async () => {
      try {
        await navigator.serviceWorker.register("/sw.js", { updateViaCache: "none" });
        kick();
      } catch {
        return;
      }
      if (stop) return;
      navigator.serviceWorker.addEventListener("message", (event) => {
        const data = event.data;
        if (!data || (data.type !== "zikr-update" && data.type !== "zikr-reload")) return;
        offer(String(data.build || ""));
      });
      look();
      if (stop) return;
      try {
        const cache = await caches.open("zikr-ok-v1");
        if (await cache.match("/index.html")) return;
        const res = await fetch("/?open=" + Date.now(), { cache: "no-store" });
        const html = await res.text();
        if (!res.ok || !html.includes("/assets/") || !html.includes("zikr-build")) return;
        const needed = [...new Set([...html.matchAll(/\/assets\/[A-Za-z0-9._-]+\.(?:js|css)/g)].map((match) => match[0]))];
        if (!needed.length) return;
        await Promise.all(
          needed.map(async (src) => {
            if (stop || (await cache.match(src))) return;
            const file = await fetch(src, { cache: "no-store" });
            if (!file.ok) throw new Error("asset");
            await cache.put(src, file.clone());
          }),
        );
        if (stop) return;
        await cache.put("/index.html", new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } }));
      } catch {
        /* the next open can still take the saved copy */
      }
    };
    const timer = window.setTimeout(() => void keep(), 200);
    const poll = window.setInterval(look, 15000);
    document.addEventListener("visibilitychange", onShow);
    window.addEventListener("online", look);
    window.addEventListener("focus", look);
    const tell = () => {
      navigator.serviceWorker.controller?.postMessage({ type: "zikr-audio", on: audioBusy() });
    };
    const beat = window.setInterval(tell, 2000);
    return () => {
      stop = true;
      window.clearTimeout(timer);
      window.clearInterval(poll);
      window.clearInterval(beat);
      document.removeEventListener("visibilitychange", onShow);
      window.removeEventListener("online", look);
      window.removeEventListener("focus", look);
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
    document.documentElement.dataset.font = font || "clear";
  }, [font]);

  useEffect(() => {
    const scale = fontScale === 100 ? "" : `${(16 * fontScale) / 100}px`;
    document.documentElement.style.fontSize = scale;
    return () => {
      document.documentElement.style.fontSize = "";
    };
  }, [fontScale]);

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
      const known = readSavedOnline();
      if (known) setOnline((prev) => prev ?? known);
      const id = useZikr.getState().publicId;
      void fetchOnline(/^\d{8}$/.test(id) ? id : undefined).then((n) => {
        if (stop || n === null) return;
        setOnline(n);
        saveOnline(n);
      });
    };
    load();
    let timer = 0;
    const arm = () => {
      timer = window.setTimeout(() => {
        if (stop) return;
        load();
        arm();
      }, msUntilLiveTick());
    };
    arm();
    const onLive = () => load();
    const onNum = (event: Event) => {
      const n = (event as CustomEvent<number>).detail;
      if (stop || typeof n !== "number" || !Number.isFinite(n)) return;
      setOnline(n);
      saveOnline(n);
    };
    const onWake = () => {
      if (document.visibilityState === "visible") load();
    };
    window.addEventListener("zikr-live", onLive);
    window.addEventListener("zikr-online", onNum);
    window.addEventListener("online", onWake);
    window.addEventListener("focus", onWake);
    window.addEventListener("pageshow", onWake);
    document.addEventListener("visibilitychange", onWake);
    const link = (navigator as Navigator & { connection?: EventTarget }).connection;
    link?.addEventListener?.("change", onWake);
    return () => {
      stop = true;
      window.clearTimeout(timer);
      window.removeEventListener("zikr-live", onLive);
      window.removeEventListener("zikr-online", onNum);
      window.removeEventListener("online", onWake);
      window.removeEventListener("focus", onWake);
      window.removeEventListener("pageshow", onWake);
      document.removeEventListener("visibilitychange", onWake);
      link?.removeEventListener?.("change", onWake);
    };
  }, [hydrated, publicId]);

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
    window.location.reload();
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
  const head =
    tab !== "zikr"
      ? { ar: "", title: t(lang, tab) }
      : namesOpen
          ? { ar: "أَسْمَاءُ اللَّهِ الْحُسْنَى", title: headLabel(lang, "names") }
          : dhikrList
            ? { ar: "ذِكْرُ اللَّهِ", title: t(lang, "zikr") }
            : { ar: "ذِكْر", title: t(lang, "zikr") };
  const showHeadAr = head.ar !== "";
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
          <div className="min-w-0 flex-1 text-center">
            {showHeadAr ? <p className="truncate font-arabic text-xl leading-none text-gold" dir="rtl" lang="ar">{head.ar}</p> : null}
            <p className="flex items-center justify-center gap-1.5 text-sm text-fg">
              <span className="truncate">{head.title}</span>
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

        <div className="shell-main relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden">
          {tab === "zikr" && (
            <ModeStrip
              listOn={dhikrList}
              namesOn={namesOpen}
              onList={() => {
                setNamesOpen(false);
                setDhikrList((open) => !open);
              }}
              onNames={() => {
                setDhikrList(false);
                setNamesOpen((open) => !open);
              }}
              onLeave={() => {
                setDhikrList(false);
                setNamesOpen(false);
              }}
            />
          )}
          {tab === "zikr" && (
            <Counter
              onNotice={pushNotice}
              onOpenLibrary={openLibrary}
              listOpen={dhikrList}
              onListClose={() => setDhikrList(false)}
              namesOpen={namesOpen}
              onNamesClose={() => setNamesOpen(false)}
            />
          )}
          {tab === "quran" && <QuranView />}
          {tab === "quests" && <QuestsView onBegin={() => selectTab("zikr")} />}
          {tab === "dua" && <DuaView />}
          {tab === "rating" && <RatingView />}
        </div>

        {notice && (
          <div className="pointer-events-none absolute inset-x-4 bottom-24 z-20">
            <p className="notice-in rounded-2xl border border-line bg-surface px-3 py-2 text-center text-sm text-fg">{notice}</p>
          </div>
        )}

        {updateMark ? (
          <button
            type="button"
            onClick={() => applyUpdate(updateMark)}
            className="z-40 mx-3 mb-2 h-12 shrink-0 rounded-full bg-gold text-sm text-ink"
          >
            {tx(lang, "updateHere")}
          </button>
        ) : null}

        <nav className="app-nav safe-bottom z-30 grid shrink-0 grid-cols-5 border-t border-line bg-bg">
          <span className="nav-pill" style={{ transform: `translateX(${Math.max(0, TABS.findIndex((item) => item.id === tab)) * 100}%)` }} aria-hidden>
            <i />
          </span>
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
                  active ? "on text-gold" : "text-muted",
                )}
              >
                <span className="relative">
                  {item.id === "dua" ? (
                    <span className="nav-dua" aria-hidden />
                  ) : item.id === "quran" ? (
                    <QuranMark className="size-5" />
                  ) : Icon ? (
                    <Icon className="size-5" strokeWidth={1.5} />
                  ) : null}
                  {item.id === "rating" && unseen && <span className="absolute -top-0.5 -right-1 h-1.5 w-1.5 rounded-full bg-gold" />}
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
