import { useEffect, useRef, useState } from "react";
import { Pause, Play, Repeat, SkipBack, SkipForward } from "lucide-react";
import { ayahCount } from "@/lib/zikr/ayah-audio";
import { loadQuran, type QuranBook } from "@/lib/zikr/quran";
import { RECITERS, reciterById } from "@/lib/zikr/reciters";
import { surahSpoken } from "@/lib/zikr/surah-name";
import type { LangId } from "@/lib/zikr/types";
import { useZikr } from "@/lib/zikr/store";
import { cn } from "@/lib/cn";

const UI: Record<LangId, { title: string; ayah: string; whole: string; again: string; fail: string; pick: string; ayahNo: string; hafs: string; surahs: string }> = {
  ru: { title: "Слушать Коран", ayah: "По аяту", whole: "Сура целиком", again: "Повтор", fail: "Это чтение не открылось. Проверь связь или выбери другого чтеца.", pick: "Чтение", ayahNo: "аят", hafs: "Все чтения — риваят Хафс от Асима, как в мусхафе Медины.", surahs: "Суры" },
  en: { title: "Listen to the Quran", ayah: "By ayah", whole: "Whole surah", again: "Repeat", fail: "This recitation did not open. Check the connection or choose another reciter.", pick: "Recitation", ayahNo: "ayah", hafs: "Every recitation is the riwayah of Hafs from Asim, as in the Madinah mushaf.", surahs: "Surahs" },
  ar: { title: "استماع القرآن", ayah: "آية آية", whole: "السورة", again: "تكرار", fail: "لم تُفتح هذه التلاوة. تحقق من الاتصال أو اختر قارئًا آخر.", pick: "التلاوة", ayahNo: "آية", hafs: "هذه التلاوات برواية حفص عن عاصم، كما في مصحف المدينة.", surahs: "السور" },
  id: { title: "Dengarkan Quran", ayah: "Per ayat", whole: "Surah utuh", again: "Ulangi", fail: "Bacaan ini tidak terbuka. Periksa sambungan atau pilih qari lain.", pick: "Bacaan", ayahNo: "ayat", hafs: "Semua bacaan adalah riwayat Hafs dari Asim, seperti mushaf Madinah.", surahs: "Surah" },
  tr: { title: "Kur’an dinle", ayah: "Ayet ayet", whole: "Sure bütün", again: "Tekrar", fail: "Bu kıraat açılmadı. Bağlantıyı kontrol et veya başka bir kari seç.", pick: "Kıraat", ayahNo: "ayet", hafs: "Bütün kıraatler, Medine mushafındaki gibi Hafs rivayetidir.", surahs: "Sureler" },
  ur: { title: "قرآن سنیں", ayah: "آیت وار", whole: "پوری سورت", again: "دہراؤ", fail: "یہ تلاوت نہیں کھلی۔ رابطہ دیکھیں یا دوسرا قاری چنیں۔", pick: "تلاوت", ayahNo: "آیت", hafs: "یہ تمام تلاوتیں روایت حفص عن عاصم ہیں، جیسے مصحف مدینہ۔", surahs: "سورتیں" },
};

type ListenMode = "ayah" | "whole";

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
  const [reciterId, setReciterId] = useState(RECITERS[0]!.id);
  const [mode, setMode] = useState<ListenMode>("whole");
  const [surah, setSurah] = useState(1);
  const [ayah, setAyah] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [fail, setFail] = useState(false);
  const [loop, setLoop] = useState(false);
  const [now, setNow] = useState(0);
  const [dur, setDur] = useState(0);
  const audio = useRef<HTMLAudioElement | null>(null);
  const list = useRef<HTMLDivElement | null>(null);
  const token = useRef(0);
  const want = useRef(false);
  const again = useRef(false);
  const spot = useRef({ mode, reciterId, surah, ayah });
  const go = useRef<(id: string, nextSurah: number, nextAyah: number, nextMode: ListenMode) => void>(() => {});
  spot.current = { mode, reciterId, surah, ayah };
  again.current = loop;

  useEffect(() => {
    const el = document.createElement("audio");
    el.preload = "auto";
    audio.current = el;
    const onTime = () => {
      const length = el.duration;
      setNow(el.currentTime || 0);
      setDur(Number.isFinite(length) ? length : 0);
    };
    const onEnd = () => {
      const here = spot.current;
      if (again.current) {
        go.current(here.reciterId, here.surah, here.mode === "ayah" ? here.ayah : 1, here.mode);
        return;
      }
      if (here.mode === "ayah" && here.ayah < ayahCount(here.surah)) {
        go.current(here.reciterId, here.surah, here.ayah + 1, "ayah");
        return;
      }
      setPlaying(false);
      setNow(0);
      if (here.mode === "ayah") setAyah(1);
      el.currentTime = 0;
    };
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("ended", onEnd);
    return () => {
      el.pause();
      el.removeAttribute("src");
      el.load();
      audio.current = null;
    };
  }, []);

  useEffect(() => {
    void loadQuran().then(setBook).catch(() => setBook(null));
  }, []);

  function play(id: string, nextSurah: number, nextAyah: number, nextMode: ListenMode) {
    const el = audio.current;
    const reciter = reciterById(id);
    const n = Math.min(114, Math.max(1, nextSurah));
    const count = ayahCount(n);
    const a = Math.min(count || 1, Math.max(1, nextAyah));
    if (!el) return;
    const urls = nextMode === "whole" ? reciter.files(n) : reciter.ayahs(n, a);
    const mine = ++token.current;
    let step = 0;
    want.current = true;
    setReciterId(id);
    setMode(nextMode);
    setSurah(n);
    setAyah(a);
    setFail(false);
    setNow(0);
    setDur(0);
    setPlaying(true);
    const attempt = () => {
      if (mine !== token.current || !audio.current) return;
      if (step >= urls.length) {
        setPlaying(false);
        setFail(true);
        return;
      }
      const url = urls[step]!;
      step += 1;
      let moved = false;
      const move = () => {
        if (moved || mine !== token.current) return;
        moved = true;
        attempt();
      };
      el.onerror = () => {
        if (mine !== token.current || el.error?.code === MediaError.MEDIA_ERR_ABORTED) return;
        move();
      };
      el.src = url;
      void el.play().then(() => {
        if (mine !== token.current) return;
        if (!want.current) el.pause();
      }).catch((error: unknown) => {
        const name = error instanceof DOMException ? error.name : "";
        if (mine !== token.current || name === "AbortError") return;
        if (name === "NotAllowedError") {
          setPlaying(false);
          return;
        }
        move();
      });
    };
    attempt();
  }
  go.current = play;

  function toggle() {
    const el = audio.current;
    if (playing && el && !el.paused) {
      want.current = false;
      el.pause();
      setPlaying(false);
      return;
    }
    if (el && el.src && el.paused && el.currentTime > 0 && !fail) {
      void el.play().then(() => setPlaying(true)).catch(() => play(reciterId, surah, ayah, mode));
      return;
    }
    play(reciterId, surah, mode === "ayah" ? ayah : 1, mode);
  }

  function chooseMode(next: ListenMode) {
    if (next === mode) return;
    if (playing || want.current) play(reciterId, surah, 1, next);
    else setMode(next);
  }

  function seek(value: number) {
    const el = audio.current;
    if (!el || !Number.isFinite(el.duration) || el.duration <= 0) return;
    el.currentTime = Math.min(el.duration, Math.max(0, value * el.duration));
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
            onClick={() => play(item.id, surah, mode === "ayah" ? ayah : 1, mode)}
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
                play(reciterId, item.n, 1, mode);
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
          onChange={(event) => seek(Number(event.target.value) / 1000)}
          aria-label={label}
        />
        {fail ? <p className="mt-1 text-xs text-gold">{copy.fail}</p> : null}
        <div className="listen-controls">
          <button type="button" className="listen-side" onClick={() => mode === "ayah" ? play(reciterId, surah, ayah - 1, mode) : play(reciterId, surah - 1, 1, mode)} aria-label="prev">
            <SkipBack className="size-5" strokeWidth={1.6} />
          </button>
          <button type="button" className="listen-play" onClick={toggle} aria-label={playing ? "pause" : "play"}>
            {playing ? <Pause className="size-6" strokeWidth={1.7} /> : <Play className="size-6" strokeWidth={1.7} />}
          </button>
          <button type="button" className="listen-side" onClick={() => mode === "ayah" ? play(reciterId, surah, ayah + 1, mode) : play(reciterId, surah + 1, 1, mode)} aria-label="next">
            <SkipForward className="size-5" strokeWidth={1.6} />
          </button>
          <button type="button" className={cn("listen-side", loop && "on")} onClick={() => setLoop((on) => !on)} aria-label={copy.again} aria-pressed={loop}>
            <Repeat className="size-5" strokeWidth={1.6} />
          </button>
        </div>
      </div>
    </div>
  );
}
