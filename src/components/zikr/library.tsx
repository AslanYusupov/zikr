import { useEffect, useRef } from "react";
import { QUOTES, REMEMBRANCE } from "@/lib/zikr/content";
import { tx } from "@/lib/zikr/i18n";
import { useZikr } from "@/lib/zikr/store";
import { localQuote, phraseOf } from "@/lib/zikr/tr";
import { cn } from "@/lib/cn";
import { Sheet } from "./pattern";

export function Library({ focus, onClose }: { focus: number; onClose: () => void }) {
  const lang = useZikr((s) => s.lang);
  const arabicAside = lang !== "ar" && lang !== "ur";
  const hit = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = hit.current;
    if (!node) return;
    const timer = window.setTimeout(() => node.scrollIntoView({ block: "start" }), 40);
    return () => window.clearTimeout(timer);
  }, [focus]);

  return (
    <Sheet title={tx(lang, "libraryTitle")} onClose={onClose}>
      <p className="text-sm leading-relaxed text-muted">{tx(lang, "libraryLead")}</p>

      <h3 className="mt-5 text-xs tracking-wide text-gold uppercase">{tx(lang, "libraryDhikr")}</h3>
      <div className="mt-2 grid gap-2">
        {REMEMBRANCE.map((d) => {
          const line = phraseOf(d, lang);
          return (
            <article key={d.id} className="rounded-2xl border border-line bg-surface px-3 py-3">
              {arabicAside && /[\u0600-\u06FF]/.test(d.arabic) ? (
                <p className="text-center font-arabic text-xl leading-loose text-fg" dir="rtl" lang="ar">
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
        {QUOTES.map((q, index) => {
          const line = localQuote(q, lang);
          const open = index === focus;
          return (
            <article
              key={q.text}
              ref={open ? hit : undefined}
              className={cn(
                "scroll-mt-3 rounded-2xl border bg-surface px-3 py-3",
                open ? "border-gold" : "border-line",
              )}
            >
              {line.arabic && arabicAside ? (
                <p className="text-center font-arabic text-lg leading-loose text-fg" dir="rtl" lang="ar">
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