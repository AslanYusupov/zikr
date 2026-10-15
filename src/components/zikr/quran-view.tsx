import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { rewardPoints } from "@/lib/zikr/content";
import { formatNum, plural } from "@/lib/zikr/format";
import { t } from "@/lib/zikr/i18n";
import { loadMeaning, loadQuran, quranCopy, type QuranAyah, type QuranBook, type QuranMeaning } from "@/lib/zikr/quran";
import { transliterate } from "@/lib/zikr/translit";
import { playTap } from "@/lib/zikr/sound";
import { useZikr } from "@/lib/zikr/store";
import { cn } from "@/lib/cn";
import { TajweedView } from "./tajweed-view";

const DONE_KEY = "zikr-quran-done";

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
  const [part, setPart] = useState<"surahs" | "tajweed">("surahs");
  const [glossMode, setGlossMode] = useState<"off" | "one" | "all">("off");
  const [glossNext, setGlossNext] = useState<"one" | "all">("one");
  const [glossKey, setGlossKey] = useState<string | null>(null);
  const [glossSurah, setGlossSurah] = useState<number | null>(null);
  const [mean, setMean] = useState<QuranMeaning | null>(null);
  const lastClaim = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const swipe = useRef<{ x: number; y: number } | null>(null);

  const [attempt, setAttempt] = useState(0);

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
    setGlossMode("off");
    setGlossNext("one");
    setGlossKey(null);
    setGlossSurah(null);
  }
  function glossOpen(surahN: number, key: string) {
    if (glossSurah !== surahN || glossMode === "off") return false;
    return glossMode === "all" || glossKey === key;
  }

  function onGloss(surahN: number, key: string) {
    if (glossSurah === surahN && glossMode !== "off") {
      setGlossNext(glossMode === "one" ? "all" : "one");
      setGlossMode("off");
      setGlossKey(null);
      return;
    }
    const next = glossSurah === surahN ? glossNext : "one";
    setGlossSurah(surahN);
    setGlossKey(key);
    setGlossMode(next);
  }

  function claim(pieces: Piece[]) {
    const at = Date.now();
    if (at - lastClaim.current < 380) return;
    const fresh = unpaid(pieces, done);
    if (!fresh.length) return;
    lastClaim.current = at;
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
    const word = lang === "ru" ? plural(result.added, "буква", "буквы", "букв") : copy.letters;
    setNote(`${formatNum(result.added)} ${word} · +${formatNum(result.added * 10)}`);
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

  function onSwipeStart(event: PointerEvent) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    swipe.current = { x: event.clientX, y: event.clientY };
  }

  function onSwipeEnd(event: PointerEvent) {
    const start = swipe.current;
    swipe.current = null;
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) < 72 || Math.abs(dx) < Math.abs(dy) * 1.6) return;
    goSurah(dx < 0 ? 1 : -1);
  }

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [open]);

  const switcher = !surah ? (
    <div className="home-switch">
      <button type="button" className={part === "surahs" ? "on" : ""} onClick={() => setPart("surahs")}>
        {copy.surahs}
      </button>
      <button type="button" className={part === "tajweed" ? "on" : ""} onClick={() => setPart("tajweed")}>
        {copy.tajweed}
      </button>
    </div>
  ) : null;

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
        <article className="quran-hadith">
          <p className="quran-hadith-ar" dir="rtl" lang="ar">{copy.hadithAr}</p>
          {lang !== "ar" ? <p className="quran-hadith-text">{copy.hadith}</p> : null}
          <p className="quran-hadith-src">{copy.source}</p>
        </article>
        <p className="mt-2 text-xs text-muted">
          {t(lang, "rewards")}: {formatNum(rewardPoints(total + quranLetters))}
        </p>
        <div className="mt-2 grid gap-1.5">
          {book.surahs.map((item) => {
            const pieces: Piece[] = item.ayahs.map((ayah) => ({ key: `${item.n}:${ayah.n}`, letters: ayah.l }));
            if (item.n !== 1 && item.n !== 9) pieces.unshift({ key: `${item.n}:b`, letters: book.bismillahLetters });
            const letters = sumLetters(pieces);
            return (
              <button key={item.n} type="button" className="surah-row" onClick={() => { clearGloss(); setOpen(item.n); }}>
                <span className="surah-no">{item.n}</span>
                <span className="min-w-0 flex-1 text-left">
                  <span className="block font-arabic text-lg leading-loose text-fg" dir="rtl" lang="ar">
                    {item.name}
                  </span>
                  {lang !== "ar" ? <span className="block text-xs text-muted">{lang === "ru" ? item.ru : item.en}</span> : null}
                </span>
                <span className="shrink-0 text-right text-[0.65rem] leading-tight text-gold">
                  {formatNum(letters)} {copy.letters}
                  <span className="mt-0.5 block">+{formatNum(letters * 10)}</span>
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
  const surahLabel = (item: { name: string; ru: string; en: string }) =>
    lang === "ar" ? item.name : lang === "ru" ? item.ru : item.en;

  return (
    <div
      ref={scrollRef}
      className="quran-scroll"
      style={{ touchAction: "pan-y" }}
      onPointerDown={onSwipeStart}
      onPointerUp={onSwipeEnd}
      onPointerCancel={() => {
        swipe.current = null;
      }}
    >
      <button type="button" className="tap-btn" onClick={() => { clearGloss(); setOpen(null); }}>
        {copy.back}
      </button>
      <div className="surah-nav mt-2" dir="ltr">
        <button
          type="button"
          className="surah-side"
          disabled={!prevSurah}
          onClick={() => goSurah(-1)}
          aria-label={prevSurah ? surahLabel(prevSurah) : ""}
        >
          <span className="surah-arrow" aria-hidden>‹</span>
          <span className="surah-side-name">{prevSurah ? surahLabel(prevSurah) : ""}</span>
        </button>
        <div className="surah-now">
          <h2 className="font-arabic text-2xl leading-loose text-fg" dir="rtl" lang="ar">
            {surah.name}
          </h2>
          {lang !== "ar" ? <p className="truncate text-xs text-muted">{surahLabel(surah)}</p> : null}
        </div>
        <button
          type="button"
          className="surah-side surah-side-next"
          disabled={!nextSurah}
          onClick={() => goSurah(1)}
          aria-label={nextSurah ? surahLabel(nextSurah) : ""}
        >
          <span className="surah-side-name">{nextSurah ? surahLabel(nextSurah) : ""}</span>
          <span className="surah-arrow" aria-hidden>›</span>
        </button>
      </div>
      <p className="mt-1 text-center text-xs text-gold">{t(lang, "rewards")} {formatNum(rewardPoints(total + quranLetters))}</p>
      <p className="mt-2 text-center text-sm text-gold">{note}</p>
      {surahLeft > 0 ? (
        <button type="button" className="quran-claim" onClick={() => claim(surahPieces)}>
          {copy.surahBtn}
          <span className="mt-0.5 block text-[0.7rem] font-bold text-gold">
            {formatNum(surahLeft)} {copy.letters} · +{formatNum(surahLeft * 10)}
          </span>
        </button>
      ) : (
        <button type="button" className="quran-claim" onClick={() => reread(surahPieces)}>
          {copy.again}
        </button>
      )}
      {hasBismillah ? (
        <div className={cn("ayah-btn", done[`${surah.n}:b`] && "is-read")}>
          <button type="button" className="ayah-hit" onClick={() => claim(bismillahPiece)}>
            <span className="ayah-ar" dir="rtl" lang="ar">
              {book.bismillah}
            </span>
          </button>
          {lang !== "ar" ? (
            <button type="button" className="ayah-read" onClick={() => onGloss(surah.n, `${surah.n}:b`)}>
              {reads[`${surah.n}:b`] ?? ""}
            </button>
          ) : null}
          {glossOpen(surah.n, `${surah.n}:b`) && mean?.surahs[0]?.[0] ? (
            <p className="ayah-gloss">{mean.surahs[0][0]}</p>
          ) : null}
          <span className="ayah-meta">
            {formatNum(book.bismillahLetters)} {copy.letters} · +{formatNum(book.bismillahLetters * 10)}
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
                    {formatNum(left)} {copy.letters} · +{formatNum(left * 10)}
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
                  <span className="ayah-no">{ayah.n}</span>
                  <button type="button" className="ayah-hit" onClick={() => claim([{ key, letters: ayah.l }])}>
                    <span className="ayah-ar" dir="rtl" lang="ar">
                      {ayah.t}
                    </span>
                  </button>
                  {lang !== "ar" ? (
                    <button type="button" className="ayah-read" onClick={() => onGloss(surah.n, key)}>
                      {reads[key] ?? ""}
                    </button>
                  ) : null}
                  {glossOpen(surah.n, key) && meaning ? <p className="ayah-gloss">{meaning}</p> : null}
                  <span className="ayah-meta">
                    {formatNum(ayah.l)} {copy.letters} · +{formatNum(ayah.l * 10)}
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
