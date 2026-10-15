import { useState } from "react";
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
  const [open, setOpen] = useState<string | null>(TAJWEED_FLAT[0]?.id ?? null);
  const [picks, setPicks] = useState<Record<string, number>>({});
  const [note, setNote] = useState("");

  const say = (ru: string, en: string, ar: string, id: string, tr: string, ur: string) =>
    lang === "ru" ? ru : lang === "ar" ? ar : lang === "id" ? id : lang === "tr" ? tr : lang === "ur" ? ur : en;

  function save(next: string[]) {
    setPassed(next);
    try {
      localStorage.setItem(PASS_KEY, JSON.stringify(next));
    } catch {
      /* private mode */
    }
  }

  function openable(id: string) {
    const index = TAJWEED_FLAT.findIndex((lesson) => lesson.id === id);
    return index <= 0 || passed.includes(TAJWEED_FLAT[index - 1].id);
  }

  function check(lesson: CourseLesson) {
    const ok = lesson.quiz.every((item, index) => picks[`${lesson.id}:${index}`] === item.answer);
    if (!ok) {
      setNote(say(
        "Не то. Прочитай правило ещё раз и выбери снова.",
        "Not that. Read the rule again and choose once more.",
        "ليس هذا. أعد قراءة الحكم ثم اختر.",
        "Bukan itu. Baca hukum sekali lagi, lalu pilih semula.",
        "O değil. Hükmü yeniden oku ve tekrar seç.",
        "یہ نہیں۔ حکم دوبارہ پڑھیں اور پھر چنیں۔",
      ));
      return;
    }
    if (!passed.includes(lesson.id)) save([...passed, lesson.id]);
    setNote(say(
      "Верно. Следующий урок открыт.",
      "Right. The next lesson is open.",
      "صحيح. الدرس التالي مفتوح.",
      "Betul. Pelajaran berikutnya terbuka.",
      "Doğru. Sonraki ders açık.",
      "درست۔ اگلا سبق کھل گیا۔",
    ));
    const index = TAJWEED_FLAT.findIndex((item) => item.id === lesson.id);
    const next = TAJWEED_FLAT[index + 1];
    if (next) setOpen(next.id);
  }

  return (
    <div className="quran-scroll">
      <p className="text-xs leading-relaxed text-muted">
        {say(
          "Курс Хафса от Асыма, как в Мусхафе Медины. Один урок, потом короткий вопрос. Скажи пример вслух.",
          "The course of Hafs from Asim, as in the Madinah mushaf. One lesson, then a short question. Say the example aloud.",
          "دورة حفص عن عاصم كما في مصحف المدينة. درس، ثم سؤال قصير. انطق المثال.",
          "Kursus Hafs dari Asim, seperti mushaf Madinah. Satu pelajaran, lalu soalan pendek. Ucapkan contohnya.",
          "Hafs'ın Asım'dan rivayeti, Medine mushafındaki gibi. Bir ders, sonra kısa bir soru. Örneği sesli söyle.",
          "حفص عن عاصم کا کورس، جیسا کہ مصحف مدینہ میں ہے۔ ایک سبق، پھر چھوٹا سوال۔ مثال زبان سے کہیں۔",
        )}
      </p>
      <p className="mt-2 text-sm font-bold tabular-nums text-gold">
        {passed.length} / {TAJWEED_FLAT.length}
      </p>
      <div className="taj-key">
        <span className="taj-madd">{say("протяжка", "lengthening", "مد", "mad", "med", "مد")}</span>
        <span className="taj-ghunnah">{say("нос", "nose", "غنة", "hidung", "geniz", "غنہ")}</span>
        <span className="taj-qalqala">{say("отскок", "echo", "قلقلة", "pantulan", "sekme", "پلٹ")}</span>
        <span className="taj-izhar">{say("ясно", "clear", "إظهار", "jelas", "açık", "واضح")}</span>
      </div>
      {note ? <p className="mt-2 text-sm text-gold">{note}</p> : null}
      {TAJWEED_COURSE.map((mod) => (
        <section key={mod.id} className="mt-4">
          <h2 className="text-xs font-extrabold tracking-wide text-gold uppercase">{mod.title[lang]}</h2>
          <div className="mt-2 grid gap-1.5">
            {mod.lessons.map((lesson) => {
              const on = open === lesson.id;
              const locked = !openable(lesson.id);
              return (
                <article key={lesson.id} className="taj-lesson">
                  <button
                    type="button"
                    className="surah-row"
                    onClick={() => {
                      if (locked) {
                        setNote(say(
                          "Сначала ответь на вопрос предыдущего урока.",
                          "Answer the previous lesson first.",
                          "أجب عن الدرس السابق أولًا.",
                          "Jawab pelajaran sebelumnya dahulu.",
                          "Önce önceki dersi cevapla.",
                          "پہلے پچھلے سبق کا جواب دیں۔",
                        ));
                        return;
                      }
                      setOpen(on ? null : lesson.id);
                      setNote("");
                    }}
                  >
                    <span className={cn("surah-no", TONE[lesson.tone])}>{passed.includes(lesson.id) ? "✓" : TAJWEED_FLAT.findIndex((item) => item.id === lesson.id) + 1}</span>
                    <span className="min-w-0 flex-1 text-left text-sm leading-snug font-bold text-fg">{lesson.title[lang]}</span>
                  </button>
                  {on && !locked ? (
                    <div className="taj-body">
                      <p className="text-sm leading-relaxed text-fg">{lesson.definition[lang]}</p>
                      {lesson.letters !== "—" ? (
                        <p className={cn("taj-letters", TONE[lesson.tone])} dir="rtl" lang="ar">{lesson.letters}</p>
                      ) : null}
                      <p className="mt-2 text-sm leading-relaxed text-fg">{lesson.mechanism[lang]}</p>
                      {lesson.examples.map((row) => (
                        <div key={row.ar} className="taj-row">
                          <p className={cn("taj-ar", TONE[lesson.tone])} dir="rtl" lang="ar">{row.ar}</p>
                          {lang === "ru" ? <p className="taj-read">{row.read}</p> : null}
                          {lang !== "ru" && lang !== "ar" ? <p className="taj-read">{row.lat}</p> : null}
                          <p className="taj-gloss">{row.where}</p>
                        </div>
                      ))}
                      <p className="mt-3 text-sm leading-relaxed text-muted">{lesson.mistakes[lang]}</p>
                      {lesson.quiz.map((item, index) => (
                        <fieldset key={item.q.ru} className="mt-3 grid gap-1">
                          <legend className="text-sm font-bold text-fg">{item.q[lang]}</legend>
                          {item.choices.map((choice, choiceIndex) => {
                            const key = `${lesson.id}:${index}`;
                            return (
                              <button
                                key={choice.ru}
                                type="button"
                                className={cn("taj-choice", picks[key] === choiceIndex && "on")}
                                onClick={() => setPicks((current) => ({ ...current, [key]: choiceIndex }))}
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
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
