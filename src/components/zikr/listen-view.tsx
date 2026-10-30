import { useEffect, useRef, useState } from "react";
import { Pause, Play, Repeat, SkipBack, SkipForward } from "lucide-react";
import { ayahCount } from "@/lib/zikr/ayah-audio";
import { loadQuran, type QuranBook } from "@/lib/zikr/quran";
import { RECITERS, reciterById } from "@/lib/zikr/reciters";
import { surahSpoken } from "@/lib/zikr/surah-name";
import type { LangId } from "@/lib/zikr/types";
import { useZikr } from "@/lib/zikr/store";
import { cn } from "@/lib/cn";

const UI: Record<LangId, { title: string; ayah: string; again: string; fail: string; pick: string }> = {
  ru: { title: "Слушать Коран", ayah: "аят", again: "Сначала", fail: "Это чтение не открылось. Проверь связь или выбери другого чтеца.", pick: "Чтецы" },
  en: { title: "Listen to the Quran", ayah: "ayah", again: "Again", fail: "This recitation did not open. Check the connection or choose another reciter.", pick: "Reciters" },
  ar: { title: "استماع القرآن", ayah: "آية", again: "من الأول", fail: "لم تُفتح هذه التلاوة. تحقق من الاتصال أو اختر قارئًا آخر.", pick: "القرّاء" },
  id: { title: "Dengarkan Quran", ayah: "ayat", again: "Dari awal", fail: "Bacaan ini tidak terbuka. Periksa sambungan atau pilih qari lain.", pick: "Qari" },
  tr: { title: "Kur’an dinle", ayah: "ayet", again: "Baştan", fail: "Bu kıraat açılmadı. Bağlantıyı kontrol et veya başka bir kari seç.", pick: "Kariler" },
  ur: { title: "قرآن سنیں", ayah: "آیت", again: "شروع سے", fail: "یہ تلاوت نہیں کھلی۔ رابطہ دیکھیں یا دوسرا قاری چنیں۔", pick: "قاری" },
};

export function ListenView() {
  const lang = useZikr((s) => s.lang);
  const copy = UI[lang];
  const [book, setBook] = useState<QuranBook | null>(null);
  const [reciterId, setReciterId] = useState(RECITERS[0]!.id);
  const [surah, setSurah] = useState(1);
  const [ayah, setAyah] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [fail, setFail] = useState(false);
  const [place, setPlace] = useState(0);
  const audio = useRef<HTMLAudioElement | null>(null);
  const spot = useRef({ reciterId, surah, ayah });
  const list = useRef<HTMLDivElement | null>(null);
  const token = useRef(0);
  const want = useRef(false);
  spot.current = { reciterId, surah, ayah };

  useEffect(() => {
    const el = document.createElement("audio");
    el.preload = "auto";
    audio.current = el;
    const onTime = () => {
      const dur = el.duration;
      setPlace(Number.isFinite(dur) && dur > 0 ? el.currentTime / dur : 0);
    };
    const onEnd = () => {
      const now = spot.current;
      const count = ayahCount(now.surah);
      if (now.ayah < count) playAt(now.reciterId, now.surah, now.ayah + 1);
      else {
        setPlaying(false);
        setAyah(1);
        setPlace(0);
      }
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

  function playAt(id: string, nextSurah: number, nextAyah: number) {
    const el = audio.current;
    const reciter = reciterById(id);
    if (!el) return;
    const urls = reciter.urls(nextSurah, nextAyah);
    const mine = ++token.current;
    let step = 0;
    want.current = true;
    setReciterId(id);
    setSurah(nextSurah);
    setAyah(nextAyah);
    setFail(false);
    setPlace(0);
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
      el.onerror = move;
      el.src = url;
      void el.play().then(() => {
        if (mine !== token.current) return;
        el.onerror = null;
        if (!want.current) el.pause();
      }).catch(move);
    };
    attempt();
  }

  function toggle() {
    const el = audio.current;
    if (playing && el && !el.paused) {
      want.current = false;
      el.pause();
      setPlaying(false);
      return;
    }
    if (el && el.src && el.paused && el.currentTime > 0 && !fail) {
      void el.play().then(() => setPlaying(true)).catch(() => playAt(reciterId, surah, ayah));
      return;
    }
    playAt(reciterId, surah, ayah);
  }

  function seek(value: number) {
    const el = audio.current;
    if (!el || !Number.isFinite(el.duration) || el.duration <= 0) return;
    el.currentTime = Math.min(el.duration, Math.max(0, value * el.duration));
  }

  const count = ayahCount(surah);
  const current = book?.surahs[surah - 1];
  const label = current
    ? lang === "ar"
      ? current.name
      : lang === "ru"
        ? current.ru
        : surahSpoken(lang, current.n, current.en)
    : "";
  const whole = count > 0 ? ((ayah - 1) + place) / count : 0;

  return (
    <div className="listen">
      <div className="listen-head">
        <p className="font-arabic text-xl leading-none text-gold" dir="rtl" lang="ar">اسْتَمِعْ لِلْقُرْآنِ</p>
        <h2 className="mt-1 text-base text-fg">{copy.title}</h2>
      </div>
      <p className="listen-kicker">{copy.pick}</p>
      <div className="listen-reciters scroll-x">
        {RECITERS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={cn("listen-card", item.id === reciterId && "on")}
            onClick={() => playAt(item.id, surah, ayah)}
          >
            <span className="block truncate text-sm text-fg">{item.name[lang]}</span>
            <span className="mt-1 block text-[0.68rem] leading-snug text-muted">{item.style[lang]}</span>
          </button>
        ))}
      </div>
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
                playAt(reciterId, item.n, 1);
                list.current?.querySelector(`[data-n="${item.n}"]`)?.scrollIntoView({ block: "nearest" });
              }}
              data-n={item.n}
            >
              <span className="listen-no">{item.n}</span>
              <span className="min-w-0 flex-1 text-start">
                <span className="block truncate font-arabic text-lg leading-none text-fg" dir="rtl" lang="ar">{item.name}</span>
                {lang !== "ar" ? <span className="mt-1 block truncate text-xs text-muted">{name}</span> : null}
              </span>
              <span className="shrink-0 text-xs tabular-nums text-muted">{ayahCount(item.n)}</span>
            </button>
          );
        })}
      </div>
      <div className="listen-player">
        <div className="flex items-baseline justify-between gap-3">
          <p className="min-w-0 truncate text-sm text-fg">{label}</p>
          <p className="shrink-0 text-xs tabular-nums text-muted">{copy.ayah} {ayah} / {count}</p>
        </div>
        <input
          className="listen-seek"
          type="range"
          min={0}
          max={1000}
          value={Math.round(place * 1000)}
          onChange={(event) => seek(Number(event.target.value) / 1000)}
          aria-label={copy.ayah}
        />
        <div className="listen-bar" aria-hidden>
          <i style={{ width: `${Math.min(100, whole * 100)}%` }} />
        </div>
        {fail ? <p className="mt-1 text-xs text-gold">{copy.fail}</p> : null}
        <div className="listen-controls">
          <button type="button" className="listen-side" onClick={() => playAt(reciterId, surah, Math.max(1, ayah - 1))} aria-label="prev">
            <SkipBack className="size-5" strokeWidth={1.6} />
          </button>
          <button type="button" className="listen-play" onClick={toggle} aria-label={playing ? "pause" : "play"}>
            {playing ? <Pause className="size-6" strokeWidth={1.7} /> : <Play className="size-6" strokeWidth={1.7} />}
          </button>
          <button type="button" className="listen-side" onClick={() => playAt(reciterId, surah, ayah < count ? ayah + 1 : 1)} aria-label="next">
            <SkipForward className="size-5" strokeWidth={1.6} />
          </button>
          <button type="button" className="listen-side" onClick={() => playAt(reciterId, surah, 1)} aria-label={copy.again}>
            <Repeat className="size-5" strokeWidth={1.6} />
          </button>
        </div>
      </div>
    </div>
  );
}
