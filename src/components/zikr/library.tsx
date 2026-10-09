import { QUOTES, REMEMBRANCE } from "@/lib/zikr/content";
import { tx } from "@/lib/zikr/i18n";
import { useZikr } from "@/lib/zikr/store";
import { localQuote, phraseOf } from "@/lib/zikr/tr";
import { Sheet } from "./pattern";

export function Library({ onClose }: { onClose: () => void }) {
  const lang = useZikr((s) => s.lang);
  const arabicAside = lang !== "ar" && lang !== "ur";
  return (
    <Sheet title={tx(lang, "libraryTitle")} onClose={onClose}>
      <p className="text-sm leading-relaxed text-muted">{tx(lang, "libraryLead")}</p>

      <h3 className="mt-5 text-xs tracking-wide text-gold uppercase">{tx(lang, "libraryDhikr")}</h3>
      <div className="mt-2 grid gap-2">
        {REMEMBRANCE.map((d) => {
          const line = phraseOf(d, lang);
          return (
            <article key={d.id} className="rounded-2xl border border-line bg-surface px-3 py-3">
              {arabicAside ? (
                <p className="text-center font-arabic text-xl leading-snug text-fg" dir="rtl" lang="ar">
                  {d.arabic}
                </p>
              ) : null}
              <p className="mt-1 text-center text-sm font-extrabold text-fg">{line.name}</p>
              <p className="mt-1 text-sm leading-snug text-muted">{line.meaning}</p>
              <p className="mt-2 text-sm leading-relaxed text-fg">{line.reward}</p>
              <p className="mt-1 text-xs text-gold">{localQuote({ text: "", source: d.source }, lang).source}</p>
            </article>
          );
        })}
      </div>

      <h3 className="mt-5 text-xs tracking-wide text-gold uppercase">{tx(lang, "wisdom")}</h3>
      <div className="mt-2 grid gap-2">
        {QUOTES.map((q) => {
          const line = localQuote(q, lang);
          return (
            <article key={q.text} className="rounded-2xl border border-line bg-surface px-3 py-3">
              {line.arabic && arabicAside ? (
                <p className="text-center font-arabic text-lg leading-snug text-fg" dir="rtl" lang="ar">
                  {line.arabic}
                </p>
              ) : null}
              <p className="mt-1 text-sm leading-relaxed text-fg">{line.text}</p>
              <p className="mt-1 text-xs text-gold">{line.source}</p>
            </article>
          );
        })}
      </div>
    </Sheet>
  );
}
