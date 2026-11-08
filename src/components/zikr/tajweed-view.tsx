import { useEffect, useRef, useState } from "react";
import { TAJWEED_PATH, TAJWEED_PATH_FLAT } from "@/lib/zikr/tajweed-path";
import { type CourseLesson } from "@/lib/zikr/tajweed-course";
import { useZikr } from "@/lib/zikr/store";
import { cn } from "@/lib/cn";

const PASS_KEY = "zikr-tajweed-pass";

function readPassed(): string[] {
  try {
    const raw = localStorage.getItem(PASS_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

function Measure({ say }: { say: (ru: string, en: string, ar: string, id: string, tr: string, ur: string) => string }) {
  const [count, setCount] = useState<2 | 4 | 6>(2);
  const [lit, setLit] = useState(0);

  useEffect(() => {
    let i = 0;
    const timer = window.setInterval(() => {
      i = i >= count ? 1 : i + 1;
      setLit(i);
    }, 450);
    return () => window.clearInterval(timer);
  }, [count]);

  const note =
    count === 2
      ? say(
          "Две меры — обычная протяжка: «баа», как «къаля».",
          "Two counts is the ordinary lengthening: baa, as in qala.",
          "حركتان: المد الطبيعي، كـ«قَالَ».",
          "Dua harakat: mad biasa, seperti qala.",
          "İki miktar: normal med, qale gibi.",
          "دو حرکت: عام مد، جیسے قَالَ۔",
        )
      : count === 4
        ? say(
            "Четыре — если хамза в том же слове. В Хафсе это четыре или пять. Если хамза в следующем слове, можно и две, но в одном чтении держи одно.",
            "Four is when the hamza is in the same word. In Hafs that is four or five. If the hamza is in the next word, two is also allowed, but keep one choice in one sitting.",
            "أربع: إذا كانت الهمزة في الكلمة نفسها، وفي حفص أربع أو خمس. وإن كانت في الكلمة التالية جازت حركتان، مع لزوم وجه واحد في المجلس.",
            "Empat: jika hamzah dalam kata yang sama. Dalam Hafs empat atau lima. Jika hamzah di kata berikutnya, dua juga boleh, tetapi satu pilihan dalam satu bacaan.",
            "Dört: hemze aynı kelimedeyse. Hafs'ta bu dört veya beştir. Hemze sonraki kelimedeyse iki de olur, ama bir oturuşta birini seç.",
            "چار: اگر ہمزہ اسی لفظ میں ہو۔ حفص میں چار یا پانچ۔ اگر اگلے لفظ میں ہو تو دو بھی ہو سکتی ہیں، مگر ایک نشست میں ایک ہی رکھیں۔",
          )
        : say(
            "Шесть — протяжка, которую нельзя укоротить. В «алиф лам мим» так тянутся лам и мим, не алиф.",
            "Six is the lengthening that cannot be shortened. In Alif Lam Mim, Lam and Mim are held this way, not the Alif.",
            "ست: المد الواجب الذي لا يُقصر. وفي «الم» يُمدّ اللام والميم، لا الألف.",
            "Enam: mad yang tidak boleh dipendekkan. Dalam Alif Lam Mim, yang dipanjangkan Lam dan Mim, bukan Alif.",
            "Altı: kısaltılamayan med. Elif Lâm Mîm'de Lâm ve Mîm böyle uzar, Elif değil.",
            "چھ: وہ مد جو چھوٹی نہیں ہوتی۔ الم میں لام اور میم ایسے کھینچے جاتے ہیں، الف نہیں۔",
          );

  return (
    <div className="taj-meter">
      <p className="text-xs font-extrabold text-gold">{say("Мера", "The count", "المقدار", "Kadar", "Miktar", "مقدار")}</p>
      <p className="mt-1 text-sm leading-snug text-fg">
        {say(
          "Одна мера — короткое «ба». Считай вспышки вслух, в одном темпе.",
          "One count is a short ba. Count the flashes aloud, at one steady speed.",
          "الحركة كـ«بَ». عُدّ الومضات بصوت واحد.",
          "Satu harakat ialah ba yang pendek. Hitung kelipan dengan suara, dalam satu tempo.",
          "Bir miktar kısa ba'dır. Yanıp sönenleri aynı hızda sesli say.",
          "ایک حرکت چھوٹی بَ ہے۔ چمک کو ایک رفتار سے زبان سے گنیں۔",
        )}
      </p>
      <div className="taj-pips" aria-hidden>
        {Array.from({ length: count }, (_, index) => (
          <i key={index} className={index < lit ? "on" : ""} />
        ))}
      </div>
      <div className="taj-meter-row">
        {([2, 4, 6] as const).map((n) => (
          <button key={n} type="button" className={cn("taj-meter-n", count === n && "on")} onClick={() => setCount(n)}>
            {n}
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs leading-snug text-muted">{note}</p>
    </div>
  );
}

function speak(ar: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const line = new SpeechSynthesisUtterance(ar);
  const voice = window.speechSynthesis.getVoices().find((v) => v.lang.toLowerCase().startsWith("ar"));
  if (voice) line.voice = voice;
  line.lang = voice?.lang || "ar-SA";
  line.rate = 0.65;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(line);
}

const TONE: Record<CourseLesson["tone"], string> = {
  madd: "taj-madd",
  ghunnah: "taj-ghunnah",
  qalqala: "taj-qalqala",
  izhar: "taj-izhar",
  plain: "",
};

export function TajweedView() {
  const lang = useZikr((s) => s.lang);
  const [passed, setPassed] = useState<string[]>(readPassed);
  const [mod, setMod] = useState(TAJWEED_PATH[0].id);
  const [open, setOpen] = useState<string | null>(TAJWEED_PATH[0].lessons[0].id);
  const [picks, setPicks] = useState<Record<string, number>>({});
  const [result, setResult] = useState<Record<string, "ok" | "bad">>({});
  const [hint, setHint] = useState("");
  const card = useRef<HTMLElement | null>(null);
  const skipScroll = useRef(true);

  const say = (ru: string, en: string, ar: string, id: string, tr: string, ur: string) =>
    lang === "ru" ? ru : lang === "ar" ? ar : lang === "id" ? id : lang === "tr" ? tr : lang === "ur" ? ur : en;

  const current = TAJWEED_PATH.find((item) => item.id === mod) ?? TAJWEED_PATH[0];
  const pathIds = TAJWEED_PATH_FLAT.map((lesson) => lesson.id);
  const done = pathIds.filter((id) => passed.includes(id)).length;
  const total = pathIds.length;
  const percent = total ? Math.round((done / total) * 100) : 0;
  const unlocked = (index: number) => index === 0 || TAJWEED_PATH[index - 1].lessons.every((lesson) => passed.includes(lesson.id));

  useEffect(() => {
    if (skipScroll.current) {
      skipScroll.current = false;
      return;
    }
    card.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [open]);

  function save(next: string[]) {
    setPassed(next);
    try {
      localStorage.setItem(PASS_KEY, JSON.stringify(next));
    } catch {
      /* private mode */
    }
  }

  function check(lesson: CourseLesson) {
    const missing = lesson.quiz.some((_, index) => picks[`${lesson.id}:${index}`] == null);
    if (missing) {
      setHint(lesson.id);
      return;
    }
    setHint("");
    const ok = lesson.quiz.every((item, index) => picks[`${lesson.id}:${index}`] === item.answer);
    setResult((current) => ({ ...current, [lesson.id]: ok ? "ok" : "bad" }));
    if (ok && !passed.includes(lesson.id)) save([...passed, lesson.id]);
  }

  function goNext(lesson: CourseLesson) {
    const index = TAJWEED_PATH_FLAT.findIndex((item) => item.id === lesson.id);
    const next = TAJWEED_PATH_FLAT[index + 1];
    if (!next) return;
    const host = TAJWEED_PATH.find((item) => item.lessons.some((row) => row.id === next.id));
    if (host) setMod(host.id);
    setOpen(next.id);
  }

  return (
    <div className="quran-scroll">
      <p className="text-xs leading-relaxed text-muted">
        {say(
          "Хафс от Асыма, Мусхаф Медины. С нуля до чтения. Следующий модуль открывается, когда пройден тест предыдущего.",
          "Hafs from Asim, the Madinah mushaf. From the start to reading. The next module opens when the previous test is passed.",
          "حفص عن عاصم، مصحف المدينة. من البداية إلى القراءة. يُفتح الباب التالي بعد اختبار السابق.",
          "Hafs dari Asim, mushaf Madinah. Dari awal hingga membaca. Modul berikutnya terbuka selepas ujian sebelumnya lulus.",
          "Hafs, Asım'dan, Medine mushafı. Sıfırdan okumaya. Sonraki bölüm, öncekinin testi geçilince açılır.",
          "حفص عن عاصم، مصحف مدینہ۔ شروع سے پڑھنے تک۔ اگلا باب پچھلے امتحان کے بعد کھلتا ہے۔",
        )}
      </p>
      <div className="taj-bar" aria-hidden>
        <span style={{ width: `${percent}%` }} />
      </div>
      <p className="mt-1 text-sm font-extrabold tabular-nums text-gold">{percent}% · {done}/{total}</p>
      <div className="taj-badges">
        {TAJWEED_PATH.map((item, index) => {
          const earned = item.lessons.every((lesson) => passed.includes(lesson.id));
          return (
            <span key={item.id} className={cn("taj-badge", earned && "on")}>
              {earned ? item.badge[lang] : `${index + 1}`}
            </span>
          );
        })}
      </div>
      <Measure say={say} />
      <div className="taj-mods">
        {TAJWEED_PATH.map((item, index) => {
          const got = item.lessons.filter((lesson) => passed.includes(lesson.id)).length;
          const openMod = unlocked(index);
          return (
            <button
              key={item.id}
              type="button"
              className={cn("taj-mod", mod === item.id && "on", !openMod && "lock")}
              onClick={() => {
                if (!openMod) {
                  setHint("lock");
                  return;
                }
                setMod(item.id);
                setOpen(item.lessons[0]?.id ?? null);
                setHint("");
              }}
            >
              {openMod ? index + 1 : "·"}
              <span>{got}/{item.lessons.length}</span>
            </button>
          );
        })}
      </div>
      {hint === "lock" ? (
        <p className="mt-2 text-sm text-muted">
          {say(
            "Сначала пройди тест предыдущего модуля.",
            "Pass the previous module first.",
            "أتمّ اختبار الباب السابق أولًا.",
            "Luluskan modul sebelumnya dahulu.",
            "Önce önceki bölümün testini geç.",
            "پہلے پچھلے باب کا امتحان پاس کریں۔",
          )}
        </p>
      ) : null}
      <h2 className="mt-3 text-sm font-extrabold text-fg">{current.title[lang]}</h2>
      <p className="mt-1 text-sm leading-relaxed text-muted">{current.lead[lang]}</p>
      <div className="mt-2 grid gap-1.5">
        {current.lessons.map((lesson) => {
          const on = open === lesson.id;
          const state = result[lesson.id];
          return (
            <article key={lesson.id} className="taj-lesson" ref={on ? card : undefined}>
              <button type="button" className="surah-row" onClick={() => setOpen(on ? null : lesson.id)}>
                <span className={cn("surah-no", TONE[lesson.tone])}>{passed.includes(lesson.id) ? "✓" : TAJWEED_PATH_FLAT.findIndex((item) => item.id === lesson.id) + 1}</span>
                <span className="min-w-0 flex-1 text-start text-sm leading-snug font-bold text-fg">{lesson.title[lang]}</span>
              </button>
              {on ? (
                <div className="taj-body">
                  <p className="taj-lab">{say("Правило", "The rule", "الحكم", "Hukum", "Hüküm", "حکم")}</p>
                  <p className="text-sm leading-relaxed text-fg">{lesson.definition[lang]}</p>
                  {lesson.letters !== "—" ? (
                    <p className={cn("taj-letters", TONE[lesson.tone])} dir="rtl" lang="ar">{lesson.letters}</p>
                  ) : null}
                  <p className="taj-lab">{say("Как звучит", "How it sounds", "كيف يُنطق", "Bagaimana bunyinya", "Nasıl duyulur", "کیسے سنائی دیتا ہے")}</p>
                  <p className="taj-lines text-sm leading-relaxed text-fg">{lesson.mechanism[lang]}</p>
                  <p className="taj-lab">{say("Примеры", "Examples", "أمثلة", "Contoh", "Örnekler", "مثالیں")}</p>
                  {lesson.examples.map((row) => (
                    <div key={row.ar + row.where} className="taj-row">
                      <p className={cn("taj-ar", TONE[lesson.tone])} dir="rtl" lang="ar">{row.ar}</p>
                      <button type="button" className="taj-play" onClick={() => speak(row.ar)}>
                        {say("Слушать", "Listen", "استمع", "Dengar", "Dinle", "سنیں")}
                      </button>
                      {lang === "ru" ? <p className="taj-read">{row.read}</p> : lang !== "ar" ? <p className="taj-read">{row.lat}</p> : null}
                      {row.note ? <p className="taj-note">{row.note[lang]}</p> : (
                        <p className="taj-gloss">{/^\d+:\d+/.test(row.where) ? `${say("сура", "surah", "سورة", "surah", "sure", "سورہ")} ${row.where.replace(":", ", " + say("аят", "ayah", "آية", "ayat", "ayet", "آیت") + " ")}` : say(row.where === "мера" ? "мера" : "знак", row.where === "мера" ? "a count" : "a sign", row.where === "мера" ? "مقدار" : "علامة", row.where === "мера" ? "kadar" : "tanda", row.where === "мера" ? "miktar" : "işaret", row.where === "мера" ? "مقدار" : "نشان")}</p>
                      )}
                    </div>
                  ))}
                  <p className="taj-lab">{say("Чего избегать", "What to avoid", "ما يُجتنب", "Yang dielakkan", "Kaçınılacak", "جس سے بچیں")}</p>
                  <p className="text-sm leading-relaxed text-muted">{lesson.mistakes[lang]}</p>
                  {lesson.quiz.map((item, index) => (
                    <fieldset key={item.q.ru} className="mt-3 grid gap-1">
                      <legend className="text-sm font-bold text-fg">{item.q[lang]}</legend>
                      {item.choices.map((choice, choiceIndex) => {
                        const key = `${lesson.id}:${index}`;
                        const picked = picks[key] === choiceIndex;
                        const show = state === "ok" || state === "bad";
                        return (
                          <button
                            key={choice.ru}
                            type="button"
                            className={cn(
                              "taj-choice",
                              picked && !show && "on",
                              show && choiceIndex === item.answer && "good",
                              show && picked && choiceIndex !== item.answer && "bad",
                            )}
                            onClick={() => {
                              setPicks((current) => ({ ...current, [key]: choiceIndex }));
                              setHint("");
                              setResult((current) => {
                                const next = { ...current };
                                delete next[lesson.id];
                                return next;
                              });
                            }}
                          >
                            {choice[lang]}
                          </button>
                        );
                      })}
                    </fieldset>
                  ))}
                  <button type="button" className="quran-claim mt-3" onClick={() => check(lesson)}>
                    {say("Проверить", "Check", "تحقق", "Semak", "Kontrol et", "دیکھیں")}
                  </button>
                  {hint === lesson.id ? (
                    <p className="mt-2 text-sm text-muted">{say("Сначала выбери ответ.", "Choose an answer first.", "اختر جوابًا أولًا.", "Pilih jawapan dahulu.", "Önce bir cevap seç.", "پہلے جواب چنیں۔")}</p>
                  ) : null}
                  {state === "bad" ? (
                    <p className="mt-2 text-sm text-muted">{say("Не то. Верный ответ отмечен.", "Not that. The right answer is marked.", "ليس هذا. الصواب موضَّح.", "Bukan itu. Jawapan betul ditanda.", "O değil. Doğru cevap işaretli.", "یہ نہیں۔ درست جواب نشان زد ہے۔")}</p>
                  ) : null}
                  {state === "ok" && TAJWEED_PATH_FLAT.findIndex((item) => item.id === lesson.id) < TAJWEED_PATH_FLAT.length - 1 ? (
                    <button type="button" className="quran-claim" onClick={() => goNext(lesson)}>
                      {say("Дальше", "Next", "التالي", "Seterusnya", "Sonraki", "آگے")}
                    </button>
                  ) : null}
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}
