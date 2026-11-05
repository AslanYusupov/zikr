import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { ChevronDown, ChevronUp, Pause, Play, Repeat1 } from "lucide-react";
import { rewardPoints } from "@/lib/zikr/content";
import { formatNum, plural } from "@/lib/zikr/format";
import { t } from "@/lib/zikr/i18n";
import { ikhlasShare, letterReward, loadMeaning, loadQuran, quranCopy, type QuranAyah, type QuranBook, type QuranMeaning } from "@/lib/zikr/quran";
import { hadithHead, hadithTab, QURAN_HADITHS, thirdWord } from "@/lib/zikr/quran-hadiths";
import { surahSpoken } from "@/lib/zikr/surah-name";
import { transliterate } from "@/lib/zikr/translit";
import { playTap } from "@/lib/zikr/sound";
import { useZikr } from "@/lib/zikr/store";
import { cn } from "@/lib/cn";
import { loadAyahUrl } from "@/lib/zikr/ayah-audio";
import { TajweedView } from "./tajweed-view";
import { ListenView } from "./listen-view";

const DONE_KEY = "zikr-quran-done";
type SurahOrder = "down" | "up";

function readOrder(): SurahOrder {
  if (typeof window === "undefined") return "down";
  return localStorage.getItem("zikr-surah-layout") === "up" ? "up" : "down";
}

function hearWord(lang: string, stop: boolean) {
  const play = {
    ru: "Слушать аят. Мишари Рашид",
    en: "Play this ayah. Mishary Rashid",
    ar: "استمع للآية. مشاري راشد",
    id: "Dengarkan ayat. Mishary Rashid",
    tr: "Ayeti dinle. Mişari Raşid",
    ur: "آیت سنیں۔ مشاری راشد",
  }[lang] ?? "Play this ayah. Mishary Rashid";
  const halt = {
    ru: "Остановить",
    en: "Stop",
    ar: "إيقاف",
    id: "Berhenti",
    tr: "Durdur",
    ur: "روکیں",
  }[lang] ?? "Stop";
  return stop ? halt : play;
}

function loopWord(lang: string, on: boolean) {
  const start = {
    ru: "Снова и снова, для заучивания",
    en: "Repeat this ayah, for memorizing",
    ar: "كرر الآية للحفظ",
    id: "Ulangi ayat, untuk hafalan",
    tr: "Ayeti tekrar et, ezber için",
    ur: "آیت بار بار، حفظ کے لیے",
  }[lang] ?? "Repeat this ayah, for memorizing";
  const halt = {
    ru: "Остановить повтор",
    en: "Stop repeating",
    ar: "إيقاف التكرار",
    id: "Hentikan ulang",
    tr: "Tekrarı durdur",
    ur: "دہرانا روکیں",
  }[lang] ?? "Stop repeating";
  return on ? halt : start;
}

function hearFail(lang: string) {
  return {
    ru: "Чтение не открылось. Проверь связь.",
    en: "The recitation did not open. Check the connection.",
    ar: "لم تُفتح التلاوة. تحقق من الاتصال.",
    id: "Bacaan tidak terbuka. Periksa sambungan.",
    tr: "Kıraat açılmadı. Bağlantıyı kontrol et.",
    ur: "تلاوت نہیں کھلی۔ رابطہ دیکھیں۔",
  }[lang] ?? "The recitation did not open. Check the connection.";
}

type Piece = { key: string; letters: number };
type DoneMap = Record<string, true>;

function readDone(): DoneMap {
  const next: DoneMap = {};
  try {
    const raw = localStorage.getItem(DONE_KEY);
    const parsed = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
    for (const key of Object.keys(parsed)) next[key] = true;
  } catch {
    /* private mode */
  }
  try {
    const raw = sessionStorage.getItem("zikr-quran-claims");
    const parsed = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
    for (const key of Object.keys(parsed)) next[key] = true;
  } catch {
    /* private mode */
  }
  try {
    localStorage.setItem(DONE_KEY, JSON.stringify(next));
  } catch {
    /* private mode */
  }
  return next;
}

function writeDone(done: DoneMap) {
  try {
    localStorage.setItem(DONE_KEY, JSON.stringify(done));
  } catch {
    /* private mode */
  }
}

function ikhlasRead(book: QuranBook, done: DoneMap) {
  const item = book.surahs.find((surah) => surah.n === 112);
  if (!item || !done["112:b"]) return false;
  return item.ayahs.every((ayah) => done[`112:${ayah.n}`]);
}

function unpaid(pieces: Piece[], done: DoneMap): Piece[] {
  return pieces.filter((piece) => !done[piece.key] && piece.letters > 0);
}

function sumLetters(pieces: Piece[]): number {
  return pieces.reduce((sum, piece) => sum + piece.letters, 0);
}

export function QuranView() {
  const lang = useZikr((s) => s.lang);
  const total = useZikr((s) => s.total);
  const quranLetters = useZikr((s) => s.quranLetters);
  const sound = useZikr((s) => s.sound);
  const voice = useZikr((s) => s.voice);
  const volume = useZikr((s) => s.volume);
  const addLetters = useZikr((s) => s.addLetters);
  const copy = quranCopy(lang);
  const [book, setBook] = useState<QuranBook | null>(null);
  const [failed, setFailed] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
  const [done, setDone] = useState(readDone);
  const [note, setNote] = useState("");
  const [part, setPart] = useState<"surahs" | "tajweed" | "listen" | "hadiths">("surahs");
  const [layout, setLayout] = useState<SurahOrder>("down");
  const [glossSurah, setGlossSurah] = useState<number | null>(null);
  const [mean, setMean] = useState<QuranMeaning | null>(null);
  const lastClaim = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const audio = useRef<HTMLAudioElement | null>(null);
  const loopingRef = useRef<string | null>(null);
  const playToken = useRef(0);
  const blobUrl = useRef<string | null>(null);
  const [playing, setPlaying] = useState<string | null>(null);
  const [looping, setLooping] = useState<string | null>(null);

  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    setLayout(readOrder());
  }, []);

  useEffect(() => {
    let stop = false;
    setFailed(false);
    loadQuran()
      .then((data) => {
        if (!stop) setBook(data);
      })
      .catch(() => {
        if (!stop) setFailed(true);
      });
    return () => {
      stop = true;
    };
  }, [attempt]);

  useEffect(() => {
    if (lang === "ar") {
      setMean(null);
      return;
    }
    let stop = false;
    loadMeaning(lang).then((data) => {
      if (!stop) setMean(data);
    });
    return () => {
      stop = true;
    };
  }, [lang]);

  useEffect(() => {
    const el = document.createElement("audio");
    el.preload = "none";
    el.setAttribute("playsinline", "true");
    el.setAttribute("webkit-playsinline", "true");
    el.style.display = "none";
    document.body.appendChild(el);
    audio.current = el;
    const ended = () => {
      if (loopingRef.current) {
        el.currentTime = 0;
        void el.play().catch(() => {
          loopingRef.current = null;
          setPlaying(null);
          setLooping(null);
        });
        return;
      }
      setPlaying(null);
      setLooping(null);
    };
    el.addEventListener("ended", ended);
    return () => {
      el.pause();
      el.removeEventListener("ended", ended);
      el.src = "";
      if (blobUrl.current) URL.revokeObjectURL(blobUrl.current);
      el.remove();
      loopingRef.current = null;
      audio.current = null;
    };
  }, []);

  useEffect(() => {
    const el = audio.current;
    if (!el) return;
    playToken.current += 1;
    el.pause();
    el.loop = false;
    loopingRef.current = null;
    setPlaying(null);
    setLooping(null);
  }, [open]);

  function stopAyah(el: HTMLAudioElement) {
    playToken.current += 1;
    loopingRef.current = null;
    el.pause();
    el.loop = false;
    setPlaying(null);
    setLooping(null);
  }

  function startAyah(el: HTMLAudioElement, key: string, surahNo: number, ayahNo: number, repeat: boolean) {
    const mine = ++playToken.current;
    el.loop = false;
    el.volume = 1;
    loopingRef.current = repeat ? key : null;
    setPlaying(key);
    setLooping(repeat ? key : null);
    setNote("");
    const fail = () => {
      if (mine !== playToken.current) return;
      loopingRef.current = null;
      el.loop = false;
      setPlaying(null);
      setLooping(null);
      setNote(hearFail(lang));
    };
    void loadAyahUrl(surahNo, ayahNo).then((url) => {
      if (mine !== playToken.current) {
        if (url) URL.revokeObjectURL(url);
        return;
      }
      if (!url) {
        fail();
        return;
      }
      if (blobUrl.current) URL.revokeObjectURL(blobUrl.current);
      blobUrl.current = url;
      el.src = url;
      void el.play().catch((err: unknown) => {
        if (mine !== playToken.current) return;
        const name = err && typeof err === "object" && "name" in err ? String((err as { name: string }).name) : "";
        if (name === "AbortError") return;
        fail();
      });
    });
  }

  function toggleAyah(key: string, surahNo: number, ayahNo: number) {
    const el = audio.current;
    if (!el) return;
    if (playing === key) {
      stopAyah(el);
      return;
    }
    startAyah(el, key, surahNo, ayahNo, false);
  }

  function toggleLoop(key: string, surahNo: number, ayahNo: number) {
    const el = audio.current;
    if (!el) return;
    if (looping === key) {
      stopAyah(el);
      return;
    }
    if (playing === key && !el.paused) {
      loopingRef.current = key;
      setLooping(key);
      return;
    }
    startAyah(el, key, surahNo, ayahNo, true);
  }

  const reads = useMemo(() => {
    const out: Record<string, string> = {};
    if (!book || open == null || lang === "ar") return out;
    const current = book.surahs.find((item) => item.n === open);
    if (!current) return out;
    const mode = lang === "ru" ? "ru" : "lat";
    if (current.n !== 1 && current.n !== 9) out[`${current.n}:b`] = transliterate(book.bismillah, mode);
    for (const ayah of current.ayahs) out[`${current.n}:${ayah.n}`] = transliterate(ayah.t, mode);
    return out;
  }, [book, open, lang]);

  const surah = book?.surahs.find((item) => item.n === open) ?? null;
  const groups = useMemo(() => {
    if (!surah) return [];
    const next: { page: number; ayahs: QuranAyah[] }[] = [];
    for (const ayah of surah.ayahs) {
      const last = next[next.length - 1];
      if (!last || last.page !== ayah.p) next.push({ page: ayah.p, ayahs: [ayah] });
      else last.ayahs.push(ayah);
    }
    return next;
  }, [surah]);

  function clearGloss() {
    setGlossSurah(null);
  }
  function onGloss(surahN: number) {
    setGlossSurah((current) => (current === surahN ? null : surahN));
  }

  function claim(pieces: Piece[]) {
    const at = Date.now();
    if (at - lastClaim.current < 380) return;
    const fresh = unpaid(pieces, done);
    if (!fresh.length || !book) return;
    lastClaim.current = at;
    const wasIkhlas = ikhlasRead(book, done);
    const result = addLetters(sumLetters(fresh));
    if (!result.added) return;
    let budget = result.added;
    const nextDone: DoneMap = { ...done };
    for (const piece of fresh) {
      if (budget < piece.letters) break;
      nextDone[piece.key] = true;
      budget -= piece.letters;
    }
    setDone(nextDone);
    writeDone(nextDone);
    let reward = letterReward(result.added);
    let third = false;
    if (!wasIkhlas && ikhlasRead(book, nextDone)) {
      const extra = addLetters(ikhlasShare(book));
      reward += extra.reward;
      third = extra.reward > 0;
    }
    const word = lang === "ru" ? plural(result.added, "буква", "буквы", "букв") : copy.letters;
    setNote(`${formatNum(result.added)} ${word} · +${formatNum(reward)}${third ? ` · ${thirdWord(lang)}` : ""}`);
    if (sound === "on") playTap(voice, volume);
  }

  function reread(pieces: Piece[]) {
    const next: DoneMap = { ...done };
    for (const piece of pieces) delete next[piece.key];
    setDone(next);
    writeDone(next);
    setNote("");
  }

  function goSurah(delta: number) {
    if (!book || open == null) return;
    const index = book.surahs.findIndex((item) => item.n === open);
    const target = book.surahs[index + delta];
    if (!target) return;
    clearGloss();
    setNote("");
    setOpen(target.n);
  }

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [open]);

  const switcher = !surah ? (
    <div className="home-switch cols-4">
      <button type="button" className={part === "surahs" ? "on" : ""} onClick={() => setPart("surahs")}>
        {copy.surahs}
      </button>
      <button type="button" className={part === "listen" ? "on" : ""} onClick={() => setPart("listen")}>
        {copy.listen}
      </button>
      <button type="button" className={part === "hadiths" ? "on" : ""} onClick={() => setPart("hadiths")}>
        {hadithTab(lang)}
      </button>
      <button type="button" className={part === "tajweed" ? "on" : ""} onClick={() => setPart("tajweed")}>
        {copy.tajweed}
      </button>
    </div>
  ) : null;

  if (!surah && part === "listen") {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        {switcher}
        <ListenView />
      </div>
    );
  }

  if (!surah && part === "hadiths") {
    const head = hadithHead(lang);
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        {switcher}
        <div className="quran-scroll">
          <div className="mb-3 text-center">
            <p className="font-arabic text-2xl leading-none text-gold" dir="rtl" lang="ar">{head.ar}</p>
            {lang !== "ar" ? <p className="mt-1 text-sm font-bold text-fg">{head.title}</p> : null}
          </div>
          {QURAN_HADITHS.map((item) => (
            <article key={item.ar} className="quran-hadith">
              <p className="quran-hadith-ar" dir="rtl" lang="ar">{item.ar}</p>
              {lang !== "ar" ? <p className="quran-hadith-text">{item.text[lang]}</p> : null}
              <p className="quran-hadith-src">{item.src[lang]}</p>
            </article>
          ))}
        </div>
      </div>
    );
  }

  if (!surah && part === "tajweed") {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        {switcher}
        <TajweedView />
      </div>
    );
  }

  if (failed) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        {switcher}
        <div className="quran-scroll">
          <p className="text-sm leading-relaxed text-muted">{copy.fail}</p>
          <button type="button" className="tap-btn mt-3" onClick={() => setAttempt((n) => n + 1)}>
            {copy.retry}
          </button>
        </div>
      </div>
    );
  }

  if (!book || !book.surahs.length) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        {switcher}
        <div className="quran-scroll">
          <p className="text-sm text-muted">{copy.loading}</p>
        </div>
      </div>
    );
  }

  if (!surah) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        {switcher}
        <div className="quran-scroll">
        <div className="mb-3 text-center">
          <p className="font-arabic text-2xl leading-none text-gold" dir="rtl" lang="ar">الْقُرْآنُ الْكَرِيمُ</p>
          {lang !== "ar" ? <p className="mt-1 text-sm font-bold text-fg">{copy.quran}</p> : null}
        </div>
        <article className="quran-hadith">
          <p className="quran-hadith-ar" dir="rtl" lang="ar">{copy.hadithAr}</p>
          {lang !== "ar" ? <p className="quran-hadith-text">{copy.hadith}</p> : null}
          <p className="quran-hadith-src">{copy.source}</p>
        </article>
        <div className="surah-rewards">
          <p className="text-center text-xs text-muted">
            {t(lang, "rewards")}: {formatNum(rewardPoints(total + quranLetters))}
          </p>
          <div className="surah-arrows">
            <button type="button" className={layout === "down" ? "on" : ""} aria-label="down" onClick={() => {
              setLayout("down");
              try { localStorage.setItem("zikr-surah-layout", "down"); } catch { /* the choice still applies now */ }
            }}>
              <ChevronDown size={16} />
            </button>
            <button type="button" className={layout === "up" ? "on" : ""} aria-label="up" onClick={() => {
              setLayout("up");
              try { localStorage.setItem("zikr-surah-layout", "up"); } catch { /* the choice still applies now */ }
            }}>
              <ChevronUp size={16} />
            </button>
          </div>
        </div>
        <div className="mt-2 grid gap-1.5">
          {(layout === "up" ? [...book.surahs].reverse() : book.surahs).map((item) => {
            const pieces: Piece[] = item.ayahs.map((ayah) => ({ key: `${item.n}:${ayah.n}`, letters: ayah.l }));
            if (item.n !== 1 && item.n !== 9) pieces.unshift({ key: `${item.n}:b`, letters: book.bismillahLetters });
            const letters = sumLetters(pieces);
            const reward = letterReward(letters) + (item.n === 112 ? letterReward(ikhlasShare(book)) : 0);
            return (
              <button key={item.n} type="button" className="surah-row" dir="ltr" onClick={() => { clearGloss(); setOpen(item.n); }}>
                <span className="surah-no">{item.n}</span>
                <span className="min-w-0 flex-1 text-start">
                  <span className="ar-name block font-arabic text-lg text-fg" dir="rtl" lang="ar">
                    {item.name}
                  </span>
                  {lang !== "ar" ? <span className="block text-xs text-muted">{lang === "ru" ? item.ru : surahSpoken(lang, item.n, item.en)}</span> : null}
                </span>
                <span className="shrink-0 text-right text-[0.65rem] leading-tight text-gold">
                  {formatNum(letters)} {copy.letters}
                  <span className="mt-0.5 block">+{formatNum(reward)}</span>
                  {item.n === 112 ? <span className="mt-0.5 block">{thirdWord(lang)}</span> : null}
                </span>
              </button>
            );
          })}
        </div>
        </div>
      </div>
    );
  }

  const hasBismillah = surah.n !== 1 && surah.n !== 9;
  const bismillahPiece: Piece[] = hasBismillah ? [{ key: `${surah.n}:b`, letters: book.bismillahLetters }] : [];
  const surahPieces: Piece[] = [
    ...bismillahPiece,
    ...surah.ayahs.map((ayah) => ({ key: `${surah.n}:${ayah.n}`, letters: ayah.l })),
  ];
  const surahLeft = sumLetters(unpaid(surahPieces, done));

  const surahIndex = book.surahs.findIndex((item) => item.n === surah.n);
  const prevSurah = surahIndex > 0 ? book.surahs[surahIndex - 1] : null;
  const nextSurah = surahIndex >= 0 ? book.surahs[surahIndex + 1] : null;
  const surahLabel = (item: { n: number; name: string; ru: string; en: string }) =>
    lang === "ar" ? item.name : lang === "ru" ? item.ru : surahSpoken(lang, item.n, item.en);

  return (
    <div ref={scrollRef} className="quran-scroll">
      <button type="button" className="tap-btn" onClick={() => { clearGloss(); setOpen(null); }}>
        {copy.back}
      </button>
      <div className="surah-nav mt-2" dir="ltr">
        <button
          type="button"
          className="surah-side"
          disabled={!nextSurah}
          onClick={() => goSurah(1)}
          aria-label={nextSurah ? surahLabel(nextSurah) : ""}
        >
          <span className="surah-arrow" aria-hidden>‹</span>
          <span className="surah-side-name">{nextSurah ? surahLabel(nextSurah) : ""}</span>
        </button>
        <div className="surah-now">
          <h2 className="ar-name font-arabic text-2xl text-fg" dir="rtl" lang="ar">
            {surah.name}
          </h2>
          {lang !== "ar" ? <p className="truncate text-xs text-muted">{surahLabel(surah)}</p> : null}
        </div>
        <button
          type="button"
          className="surah-side surah-side-next"
          disabled={!prevSurah}
          onClick={() => goSurah(-1)}
          aria-label={prevSurah ? surahLabel(prevSurah) : ""}
        >
          <span className="surah-side-name">{prevSurah ? surahLabel(prevSurah) : ""}</span>
          <span className="surah-arrow" aria-hidden>›</span>
        </button>
      </div>
      <p className="mt-1 text-center text-xs text-gold">{t(lang, "rewards")} {formatNum(rewardPoints(total + quranLetters))}</p>
      <p className="mt-2 text-center text-sm text-gold">{note}</p>
      {surahLeft > 0 ? (
        <button type="button" className="quran-claim" onClick={() => claim(surahPieces)}>
          {copy.surahBtn}
          <span className="mt-0.5 block text-[0.7rem] font-bold text-gold">
            {formatNum(surahLeft)} {copy.letters} · +{formatNum(letterReward(surahLeft) + (surah.n === 112 ? letterReward(ikhlasShare(book)) : 0))}
          </span>
        </button>
      ) : (
        <button type="button" className="quran-claim" onClick={() => reread(surahPieces)}>
          {copy.again}
        </button>
      )}
      {hasBismillah ? (
        <div className={cn("ayah-btn", done[`${surah.n}:b`] && "is-read")}>
          <div className="ayah-top">
            <button
              type="button"
              className={cn("ayah-play", playing === `${surah.n}:b` && "on")}
              aria-label={hearWord(lang, playing === `${surah.n}:b`)}
              onClick={() => toggleAyah(`${surah.n}:b`, 1, 1)}
            >
              {playing === `${surah.n}:b` ? <Pause size={13} /> : <Play size={13} />}
            </button>
            <button
              type="button"
              className={cn("ayah-play", looping === `${surah.n}:b` && "on")}
              aria-label={loopWord(lang, looping === `${surah.n}:b`)}
              onClick={() => toggleLoop(`${surah.n}:b`, 1, 1)}
            >
              <Repeat1 size={13} />
            </button>
          </div>
          <button type="button" className="ayah-hit" onClick={() => claim(bismillahPiece)}>
            <span className="ayah-ar" dir="rtl" lang="ar">
              {book.bismillah}
            </span>
          </button>
          {lang !== "ar" ? (
            <button type="button" className="ayah-read" onClick={() => onGloss(surah.n)}>
              {reads[`${surah.n}:b`] ?? ""}
              {glossSurah === surah.n ? (
                mean?.surahs[0]?.[0] ? <span className="ayah-gloss block">{mean.surahs[0][0]}</span> : null
              ) : (
                <span className="ayah-more">···</span>
              )}
            </button>
          ) : null}
          <span className="ayah-meta">
            {formatNum(book.bismillahLetters)} {copy.letters} · +{formatNum(letterReward(book.bismillahLetters))}
          </span>
        </div>
      ) : null}
      {groups.map((group) => {
        const pieces: Piece[] = [
          ...(hasBismillah && group === groups[0] ? bismillahPiece : []),
          ...group.ayahs.map((ayah) => ({ key: `${surah.n}:${ayah.n}`, letters: ayah.l })),
        ];
        const left = sumLetters(unpaid(pieces, done));
        return (
          <section key={group.page} className="mt-3">
            {groups.length > 1 ? (
              left > 0 ? (
                <button type="button" className="quran-claim" onClick={() => claim(pieces)}>
                  {copy.page} {group.page} · {copy.pageBtn}
                  <span className="mt-0.5 block text-[0.7rem] font-bold text-gold">
                    {formatNum(left)} {copy.letters} · +{formatNum(letterReward(left))}
                  </span>
                </button>
              ) : (
                <button type="button" className="quran-claim" onClick={() => reread(pieces)}>
                  {copy.page} {group.page} · {copy.again}
                </button>
              )
            ) : null}
            {group.ayahs.map((ayah) => {
              const key = `${surah.n}:${ayah.n}`;
              const meaning = mean?.surahs[surah.n - 1]?.[ayah.n - 1] ?? "";
              return (
                <div
                  key={ayah.n}
                  className={cn("ayah-btn", done[key] && "is-read")}
                >
                  <div className="ayah-top">
                    <button
                      type="button"
                      className={cn("ayah-play", playing === key && "on")}
                      aria-label={hearWord(lang, playing === key)}
                      onClick={() => toggleAyah(key, surah.n, ayah.n)}
                    >
                      {playing === key ? <Pause size={13} /> : <Play size={13} />}
                    </button>
                    <button
                      type="button"
                      className={cn("ayah-play", looping === key && "on")}
                      aria-label={loopWord(lang, looping === key)}
                      onClick={() => toggleLoop(key, surah.n, ayah.n)}
                    >
                      <Repeat1 size={13} />
                    </button>
                    <span className="ayah-no">{ayah.n}</span>
                  </div>
                  <button type="button" className="ayah-hit" onClick={() => claim([{ key, letters: ayah.l }])}>
                    <span className="ayah-ar" dir="rtl" lang="ar">
                      {ayah.t}
                    </span>
                  </button>
                  {lang !== "ar" ? (
                    <button type="button" className="ayah-read" onClick={() => onGloss(surah.n)}>
                      {reads[key] ?? ""}
                      {surah.n === 1 && ayah.n === 1 && glossSurah !== surah.n ? <span className="ayah-more">···</span> : null}
                      {glossSurah === surah.n && meaning ? <span className="ayah-gloss block">{meaning}</span> : null}
                    </button>
                  ) : null}
                  <span className="ayah-meta">
                    {formatNum(ayah.l)} {copy.letters} · +{formatNum(letterReward(ayah.l))}
                  </span>
                </div>
              );
            })}
          </section>
        );
      })}
    </div>
  );
}
