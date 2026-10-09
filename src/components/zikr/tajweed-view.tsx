import { useState } from "react";
import { TAJWEED, TAJWEED_LEAD } from "@/lib/zikr/tajweed";
import { useZikr } from "@/lib/zikr/store";

export function TajweedView() {
  const lang = useZikr((s) => s.lang);
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="quran-scroll">
      <p className="text-xs leading-relaxed text-muted">{TAJWEED_LEAD[lang]}</p>
      <div className="mt-2 grid gap-1.5">
        {TAJWEED.map((lesson, index) => {
          const on = open === lesson.id;
          return (
            <article key={lesson.id} className="taj-lesson">
              <button
                type="button"
                className="surah-row"
                onClick={() => setOpen(on ? null : lesson.id)}
              >
                <span className="surah-no">{index + 1}</span>
                <span className="min-w-0 flex-1 text-left text-sm leading-snug font-bold text-fg">{lesson.title[lang]}</span>
              </button>
              {on ? (
                <div className="taj-body">
                  <p className="text-sm leading-relaxed text-fg">{lesson.text[lang]}</p>
                  {lesson.rows?.length ? (
                    <p className="mt-2 text-xs text-muted">
                      {lang === "ru" ? "Скажи пример вслух. Строка под арабским — как это слышится." : lang === "ar" ? "انطق المثال. السطر توضيح." : lang === "id" ? "Ucapkan contohnya. Baris di bawah ialah bunyinya." : lang === "tr" ? "Örneği sesli söyle. Alttaki satır duyuluşudur." : lang === "ur" ? "مثال زبان سے کہیں۔ نیچے کی سطر آواز ہے۔" : "Say the example aloud. The line under the Arabic is how it sounds."}
                    </p>
                  ) : null}
                  {lesson.rows?.map((row) => (
                    <div key={row.ar} className="taj-row">
                      <p className="taj-ar" dir="rtl" lang="ar">{row.ar}</p>
                      {lang === "ru" ? <p className="taj-read">{row.read}</p> : null}
                      {lang !== "ru" && lang !== "ar" && row.lat ? <p className="taj-read">{row.lat}</p> : null}
                      {row.gloss ? <p className="taj-gloss">{row.gloss[lang]}</p> : null}
                    </div>
                  ))}
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}
