import { useEffect, useRef, useState } from "react";
import { TAJWEED_COURSE, TAJWEED_FLAT, type CourseLesson } from "@/lib/zikr/tajweed-course";
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
  const [mod, setMod] = useState(TAJWEED_COURSE[0].id);
  const [open, setOpen] = useState<string | null>(null);
  const [picks, setPicks] = useState<Record<string, number>>({});
  const [result, setResult] = useState<Record<string, "ok" | "bad">>({});
  const card = useRef<HTMLElement | null>(null);

  const say = (ru: string, en: string, ar: string, id: string, tr: string, ur: string) =>
    lang === "ru" ? ru : lang === "ar" ? ar : lang === "id" ? id : lang === "tr" ? tr : lang === "ur" ? ur : en;

  const current = TAJWEED_COURSE.find((item) => item.id === mod) ?? TAJWEED_COURSE[0];
  const done = passed.length;
  const total = TAJWEED_FLAT.length;

  useEffect(() => {
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
    const ok = lesson.quiz.every((item, index) => picks[`${lesson.id}:${index}`] === item.answer);
    setResult((current) => ({ ...current, [lesson.id]: ok ? "ok" : "bad" }));
    if (ok && !passed.includes(lesson.id)) save([...passed, lesson.id]);
  }

  function goNext(lesson: CourseLesson) {
    const index = TAJWEED_FLAT.findIndex((item) => item.id === lesson.id);
    const next = TAJWEED_FLAT[index + 1];
    if (!next) return;
    const host = TAJWEED_COURSE.find((item) => item.lessons.some((row) => row.id === next.id));
    if (host) setMod(host.id);
    setOpen(next.id);
  }

  return (
    <div className="quran-scroll">
      <p className="text-xs leading-relaxed text-muted">
        {say(
          "Хафс от Асыма, Мусхаф Медины. Любой урок можно открыть. Пример скажи вслух.",
          "Hafs from Asim, the Madinah mushaf. Any lesson can be opened. Say the example aloud.",
          "حفص عن عاصم، مصحف المدينة. أي درس يُفتح. انطق المثال.",
          "Hafs dari Asim, mushaf Madinah. Semua pelajaran boleh dibuka. Ucapkan contohnya.",
          "Hafs, Asım'dan, Medine mushafı. Her ders açılır. Örneği sesli söyle.",
          "حفص عن عاصم، مصحف مدینہ۔ کوئی بھی سبق کھل سکتا ہے۔ مثال زبان سے کہیں۔",
        )}
      </p>
      <div className="taj-bar" aria-hidden>
        <span style={{ width: `${Math.round((done / total) * 100)}%` }} />
      </div>
      <p className="mt-1 text-xs font-bold tabular-nums text-gold">{done} / {total}</p>
      <div className="taj-key">
        <span className="taj-madd">{say("протяжка", "length", "مد", "mad", "med", "مد")}</span>
        <span className="taj-ghunnah">{say("нос", "nose", "غنة", "hidung", "geniz", "غنہ")}</span>
        <span className="taj-qalqala">{say("отскок", "echo", "قلقلة", "pantulan", "sekme", "پلٹ")}</span>
        <span className="taj-izhar">{say("ясно", "clear", "إظهار", "jelas", "açık", "واضح")}</span>
      </div>
      <div className="taj-mods">
        {TAJWEED_COURSE.map((item, index) => {
          const got = item.lessons.filter((lesson) => passed.includes(lesson.id)).length;
          return (
            <button
              key={item.id}
              type="button"
              className={cn("taj-mod", mod === item.id && "on")}
              onClick={() => { setMod(item.id); setOpen(null); }}
            >
              {index + 1}
              <span>{got}/{item.lessons.length}</span>
            </button>
          );
        })}
      </div>
      <h2 className="mt-3 text-sm font-extrabold text-fg">{current.title[lang]}</h2>
      <div className="mt-2 grid gap-1.5">
        {current.lessons.map((lesson) => {
          const on = open === lesson.id;
          const state = result[lesson.id];
          return (
            <article key={lesson.id} className="taj-lesson" ref={on ? card : undefined}>
              <button type="button" className="surah-row" onClick={() => setOpen(on ? null : lesson.id)}>
                <span className={cn("surah-no", TONE[lesson.tone])}>{passed.includes(lesson.id) ? "✓" : TAJWEED_FLAT.findIndex((item) => item.id === lesson.id) + 1}</span>
                <span className="min-w-0 flex-1 text-left text-sm leading-snug font-bold text-fg">{lesson.title[lang]}</span>
              </button>
              {on ? (
                <div className="taj-body">
                  <p className="taj-lab">{say("Правило", "The rule", "الحكم", "Hukum", "Hüküm", "حکم")}</p>
                  <p className="text-sm leading-relaxed text-fg">{lesson.definition[lang]}</p>
                  {lesson.letters !== "—" ? (
                    <p className={cn("taj-letters", TONE[lesson.tone])} dir="rtl" lang="ar">{lesson.letters}</p>
                  ) : null}
                  <p className="taj-lab">{say("Как звучит", "How it sounds", "كيف يُنطق", "Bagaimana bunyinya", "Nasıl duyulur", "کیسے سنائی دیتا ہے")}</p>
                  <p className="text-sm leading-relaxed text-fg">{lesson.mechanism[lang]}</p>
                  <p className="taj-lab">{say("Примеры", "Examples", "أمثلة", "Contoh", "Örnekler", "مثالیں")}</p>
                  {lesson.examples.map((row) => (
                    <div key={row.ar + row.where} className="taj-row">
                      <p className={cn("taj-ar", TONE[lesson.tone])} dir="rtl" lang="ar">{row.ar}</p>
                      {lang === "ru" ? <p className="taj-read">{row.read}</p> : null}
                      {lang !== "ru" && lang !== "ar" ? <p className="taj-read">{row.lat}</p> : null}
                      <p className="taj-gloss">{row.where}</p>
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
                  {state === "bad" ? (
                    <p className="mt-2 text-sm text-muted">{say("Не то. Верный ответ отмечен.", "Not that. The right answer is marked.", "ليس هذا. الصواب موضَّح.", "Bukan itu. Jawapan betul ditanda.", "O değil. Doğru cevap işaretli.", "یہ نہیں۔ درست جواب نشان زد ہے۔")}</p>
                  ) : null}
                  {state === "ok" && TAJWEED_FLAT.findIndex((item) => item.id === lesson.id) < TAJWEED_FLAT.length - 1 ? (
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
