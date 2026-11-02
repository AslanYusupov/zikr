import { useEffect, useRef, useState } from "react";
import { Pause, Play, Repeat, SkipBack, SkipForward, X } from "lucide-react";
import { ayahCount } from "@/lib/zikr/ayah-audio";
import { loadQuran, type QuranBook } from "@/lib/zikr/quran";
import { RECITERS, reciterById } from "@/lib/zikr/reciters";
import { surahSpoken } from "@/lib/zikr/surah-name";
import type { LangId } from "@/lib/zikr/types";
import { useZikr } from "@/lib/zikr/store";
import {
  playListen,
  seekListen,
  setListenLoop,
  setListenMode,
  setListenScreen,
  stopListen,
  toggleListen,
  useListen,
  type ListenMode,
} from "@/lib/zikr/quran-listen";
import { cn } from "@/lib/cn";

const UI: Record<LangId, { title: string; ayah: string; whole: string; again: string; fail: string; pick: string; ayahNo: string; hafs: string; surahs: string }> = {
  ru: { title: "Слушать Коран", ayah: "По аяту", whole: "Сура целиком", again: "Повтор", fail: "Это чтение не открылось. Проверь связь или выбери другого чтеца.", pick: "Чтение", ayahNo: "аят", hafs: "Все чтения — риваят Хафс от Асима, как в мусхафе Медины.", surahs: "Суры" },
  en: { title: "Listen to the Quran", ayah: "By ayah", whole: "Whole surah", again: "Repeat", fail: "This recitation did not open. Check the connection or choose another reciter.", pick: "Recitation", ayahNo: "ayah", hafs: "Every recitation is the riwayah of Hafs from Asim, as in the Madinah mushaf.", surahs: "Surahs" },
  ar: { title: "استماع القرآن", ayah: "آية آية", whole: "السورة", again: "تكرار", fail: "لم تُفتح هذه التلاوة. تحقق من الاتصال أو اختر قارئًا آخر.", pick: "التلاوة", ayahNo: "آية", hafs: "هذه التلاوات برواية حفص عن عاصم، كما في مصحف المدينة.", surahs: "السور" },
  id: { title: "Dengarkan Quran", ayah: "Per ayat", whole: "Surah utuh", again: "Ulangi", fail: "Bacaan ini tidak terbuka. Periksa sambungan atau pilih qari lain.", pick: "Bacaan", ayahNo: "ayat", hafs: "Semua bacaan adalah riwayat Hafs dari Asim, seperti mushaf Madinah.", surahs: "Surah" },
  tr: { title: "Kur’an dinle", ayah: "Ayet ayet", whole: "Sure bütün", again: "Tekrar", fail: "Bu kıraat açılmadı. Bağlantıyı kontrol et veya başka bir kari seç.", pick: "Kıraat", ayahNo: "ayet", hafs: "Bütün kıraatler, Medine mushafındaki gibi Hafs rivayetidir.", surahs: "Sureler" },
  ur: { title: "قرآن سنیں", ayah: "آیت وار", whole: "پوری سورت", again: "دہراؤ", fail: "یہ تلاوت نہیں کھلی۔ رابطہ دیکھیں یا دوسرا قاری چنیں۔", pick: "تلاوت", ayahNo: "آیت", hafs: "یہ تمام تلاوتیں روایت حفص عن عاصم ہیں، جیسے مصحف مدینہ۔", surahs: "سورتیں" },
};

function clock(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const total = Math.floor(seconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const mm = String(m).padStart(h ? 2 : 1, "0");
  const ss = String(s).padStart(2, "0");
  return h ? `${h}:${mm}:${ss}` : `${m}:${ss}`;
}

export function ListenView() {
  const lang = useZikr((s) => s.lang);
  const copy = UI[lang];
  const [book, setBook] = useState<QuranBook | null>(null);
  const reciterId = useListen((s) => s.reciterId);
  const mode = useListen((s) => s.mode);
  const surah = useListen((s) => s.surah);
  const ayah = useListen((s) => s.ayah);
  const playing = useListen((s) => s.playing);
  const fail = useListen((s) => s.fail);
  const loop = useListen((s) => s.loop);
  const now = useListen((s) => s.now);
  const dur = useListen((s) => s.dur);
  const list = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setListenScreen(true);
    return () => setListenScreen(false);
  }, []);

  useEffect(() => {
    void loadQuran().then(setBook).catch(() => setBook(null));
  }, []);

  function chooseMode(next: ListenMode) {
    if (next === mode) return;
    if (playing) playListen(reciterId, surah, 1, next);
    else setListenMode(next);
  }

  useEffect(() => {
    list.current?.querySelector(`[data-n="${surah}"]`)?.scrollIntoView({ block: "nearest" });
  }, [surah]);

  const current = book?.surahs[surah - 1];
  const label = current
    ? lang === "ar"
      ? current.name
      : lang === "ru"
        ? current.ru
        : surahSpoken(lang, current.n, current.en)
    : "";
  const place = dur > 0 ? Math.min(1, now / dur) : 0;
  const reciter = reciterById(reciterId);

  return (
    <div className="listen">
      <div className="listen-head">
        <p className="font-arabic text-xl leading-none text-gold" dir="rtl" lang="ar">اسْتَمِعْ لِلْقُرْآنِ</p>
        <h2 className="mt-1 text-base text-fg">{copy.title}</h2>
        <p className="listen-hafs">{copy.hafs}</p>
        <div className="listen-mode">
          <button type="button" className={mode === "ayah" ? "on" : ""} onClick={() => chooseMode("ayah")}>{copy.ayah}</button>
          <button type="button" className={mode === "whole" ? "on" : ""} onClick={() => chooseMode("whole")}>{copy.whole}</button>
        </div>
      </div>
      <p className="listen-kicker">{copy.pick}</p>
      <div className="listen-reciters scroll-x">
        {RECITERS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={cn("listen-card", item.id === reciterId && "on")}
            onClick={() => playListen(item.id, surah, mode === "ayah" ? ayah : 1, mode)}
          >
            <span className="listen-name">{item.name[lang]}</span>
            <span className="listen-form">{item.form[lang]}</span>
          </button>
        ))}
      </div>
      <p className="listen-about">{reciter.style[lang]}</p>
      <p className="listen-kicker">{copy.surahs}</p>
      <div ref={list} className="listen-list">
        {book?.surahs.map((item) => {
          const name = lang === "ar" ? item.name : lang === "ru" ? item.ru : surahSpoken(lang, item.n, item.en);
          const on = item.n === surah;
          return (
            <button
              key={item.n}
              type="button"
              className={cn("listen-surah", on && "on")}
              onClick={() => {
                playListen(reciterId, item.n, 1, mode);
                list.current?.querySelector(`[data-n="${item.n}"]`)?.scrollIntoView({ block: "nearest" });
              }}
              data-n={item.n}
            >
              <span className="listen-no">{item.n}</span>
              <span className="min-w-0 flex-1 text-start">
                <span className="block truncate font-arabic text-lg leading-none text-fg" dir="rtl" lang="ar">{item.name}</span>
                {lang !== "ar" ? <span className="mt-1 block truncate text-xs text-muted">{name}</span> : null}
              </span>
              <span className="listen-count">{ayahCount(item.n)}</span>
            </button>
          );
        })}
      </div>
      <div className="listen-player">
        <div className="flex items-baseline justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm text-fg">{label}</p>
          <p className="truncate text-xs text-muted">{reciter.name[lang]} · {reciter.form[lang]}</p>
        </div>
          <p className="shrink-0 text-xs tabular-nums text-muted">
            {mode === "ayah" ? `${copy.ayahNo} ${ayah} / ${ayahCount(surah)} · ` : ""}
            {clock(now)} / {clock(dur)}
          </p>
        </div>
        <input
          className="listen-seek"
          type="range"
          min={0}
          max={1000}
          value={Math.round(place * 1000)}
          onChange={(event) => seekListen(Number(event.target.value) / 1000)}
          aria-label={label}
        />
        {fail ? <p className="mt-1 text-xs text-gold">{copy.fail}</p> : null}
        <div className="listen-controls">
          <button type="button" className="listen-side" onClick={() => mode === "ayah" ? playListen(reciterId, surah, ayah - 1, mode) : playListen(reciterId, surah - 1, 1, mode)} aria-label="prev">
            <SkipBack className="size-5" strokeWidth={1.6} />
          </button>
          <button type="button" className="listen-play" onClick={toggleListen} aria-label={playing ? "pause" : "play"}>
            {playing ? <Pause className="size-6" strokeWidth={1.7} /> : <Play className="size-6" strokeWidth={1.7} />}
          </button>
          <button type="button" className="listen-side" onClick={() => mode === "ayah" ? playListen(reciterId, surah, ayah + 1, mode) : playListen(reciterId, surah + 1, 1, mode)} aria-label="next">
            <SkipForward className="size-5" strokeWidth={1.6} />
          </button>
          <button type="button" className={cn("listen-side", loop && "on")} onClick={() => setListenLoop(!loop)} aria-label={copy.again} aria-pressed={loop}>
            <Repeat className="size-5" strokeWidth={1.6} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function ListenDock() {
  const lang = useZikr((s) => s.lang);
  const onScreen = useListen((s) => s.onScreen);
  const started = useListen((s) => s.started);
  const playing = useListen((s) => s.playing);
  const surah = useListen((s) => s.surah);
  const now = useListen((s) => s.now);
  const [name, setName] = useState("");

  useEffect(() => {
    if (!started) return;
    let stop = false;
    void loadQuran().then((book) => {
      if (stop) return;
      const item = book.surahs[surah - 1];
      if (!item) return;
      setName(lang === "ar" ? item.name : lang === "ru" ? item.ru : surahSpoken(lang, item.n, item.en));
    }).catch(() => {});
    return () => {
      stop = true;
    };
  }, [started, surah, lang]);

  if (!started || onScreen || (!playing && now <= 0)) return null;

  function step(dir: number) {
    const here = useListen.getState();
    const next = here.surah + dir;
    if (next < 1 || next > 114) return;
    playListen(here.reciterId, next, 1, here.mode);
  }

  return (
    <div className="listen-dock">
      <button type="button" className="listen-x" onClick={stopListen} aria-label="close">
        <X className="size-3.5" strokeWidth={2} />
      </button>
      <p className="truncate" dir={lang === "ar" ? "rtl" : "auto"}>{name}</p>
      <div className="listen-row">
        <button type="button" className="listen-skip" onClick={() => step(-1)} aria-label="prev">
          <SkipBack className="size-3.5" strokeWidth={1.8} />
        </button>
        <button type="button" onClick={toggleListen} aria-label={playing ? "pause" : "play"}>
          {playing ? <Pause className="size-4" strokeWidth={1.8} /> : <Play className="size-4" strokeWidth={1.8} />}
        </button>
        <button type="button" className="listen-skip" onClick={() => step(1)} aria-label="next">
          <SkipForward className="size-3.5" strokeWidth={1.8} />
        </button>
      </div>
    </div>
  );
}
