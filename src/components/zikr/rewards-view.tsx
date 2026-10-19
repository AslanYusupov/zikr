import { MILESTONES, REMEMBRANCE } from "@/lib/zikr/content";
import { formatNum, zikrWord } from "@/lib/zikr/format";
import { levelFromXp } from "@/lib/zikr/levels";
import { cachedReach, syncReach } from "@/lib/zikr/reach";
import { useZikr } from "@/lib/zikr/store";
import { phraseOf, localQuote } from "@/lib/zikr/tr";
import { cn } from "@/lib/cn";
import { t, tx, degreeName } from "@/lib/zikr/i18n";
import { Crescent } from "./pattern";
import { useEffect, useState } from "react";

export function RewardsView() {
  const total = useZikr((s) => s.total);
  const byDhikr = useZikr((s) => s.byDhikr);
  const lang = useZikr((s) => s.lang);
  const xp = useZikr((s) => s.xp);
  const level = levelFromXp(xp);
  const rows = [...REMEMBRANCE].sort((a, b) => (byDhikr[b.id] ?? 0) - (byDhikr[a.id] ?? 0));
  const max = Math.max(1, ...rows.map((d) => byDhikr[d.id] ?? 0));
  const [reach, setReach] = useState(cachedReach);

  useEffect(() => {
    const apply = () => setReach(cachedReach());
    const pull = () => {
      const s = useZikr.getState();
      void syncReach(s.publicId, s.total).then(apply);
    };
    pull();
    window.addEventListener("zikr-reach", apply);
    return () => window.removeEventListener("zikr-reach", apply);
  }, []);

  return (
    <div className="pane px-4 pt-2 pb-6">
      <article className="rounded-3xl border border-line bg-surface px-4 py-4">
        <div className="flex items-center gap-3">
          <Crescent className="h-10 w-10 text-gold" />
          <div className="min-w-0">
            <p className="text-xs text-muted">{t(lang, "degree")} {level.level}</p>
            <h2 className="text-xl text-pretty text-fg">{degreeName(lang, level.level)}</h2>
          </div>
        </div>
        <p className="mt-3 text-2xl font-extrabold tabular-nums text-gold">{formatNum(total)}</p>
        <p className="text-sm text-muted">{zikrWord(total, lang)}</p>
        <p className="mt-3 text-sm leading-relaxed text-muted">{t(lang, "rewardLead")}</p>
        {level.need > 0 && (
          <p className="mt-2 text-sm tabular-nums text-gold">
            {formatNum(level.into)} / {formatNum(level.need)}
          </p>
        )}
      </article>

      <h2 className="mt-5 text-xs tracking-wide text-gold uppercase">{tx(lang, "marks")}</h2>
      <div className="mt-2 grid gap-2">
        {MILESTONES.map((m) => {
          const open = total >= m.at;
          const left = Math.max(0, m.at - total);
          return (
            <article
              key={m.at}
              className={cn("rounded-2xl border px-3 py-3", open ? "border-line bg-surface" : "border-line/70 bg-bg-deep")}
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className={cn("text-base", open ? "text-fg" : "text-muted")}>{lang === "ru" ? m.title : formatNum(m.at)}</h3>
                <p className="text-sm tabular-nums text-gold">{formatNum(m.at)}</p>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                {open ? (lang === "ru" ? m.text : tx(lang, "milestoneOpen").replace("{n}", formatNum(m.at))) : `${t(lang, "moreLeft")} ${formatNum(left)} ${zikrWord(left, lang)}.`}
              </p>
              {reach.ready && (
                <p className="mt-2 text-sm font-semibold tabular-nums text-gold">{formatNum(reach.rows[String(m.at)] ?? 0)}</p>
              )}
            </article>
          );
        })}
      </div>

      <h2 className="mt-5 text-xs tracking-wide text-gold uppercase">{tx(lang, "perDhikr")}</h2>
      <div className="mt-2 grid gap-2">
        {rows.map((d) => {
          const n = byDhikr[d.id] ?? 0;
          const line = phraseOf(d, lang);
          return (
            <div key={d.id} className="rounded-2xl border border-line bg-surface px-3 py-2.5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm leading-snug text-pretty text-fg">{line.name}</p>
                  <p className="mt-1 text-xs leading-relaxed text-pretty text-muted">{line.reward}</p>
                  <p className="mt-1 text-xs text-gold">{localQuote({ text: "", source: d.source }, lang).source}</p>
                </div>
                <p className="shrink-0 text-sm tabular-nums text-gold">
                  {formatNum(n)} {zikrWord(n, lang)}
                </p>
              </div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-bg-deep">
                <div className="h-full bg-gold" style={{ width: `${(n / max) * 100}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
