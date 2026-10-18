import { useEffect, useRef } from "react";
import { MILESTONES } from "@/lib/zikr/content";
import { formatNum } from "@/lib/zikr/format";
import { t, tx } from "@/lib/zikr/i18n";
import { playAchievement } from "@/lib/zikr/sound";
import { useZikr } from "@/lib/zikr/store";

export function Celebrate({ armed }: { armed: boolean }) {
  const lang = useZikr((s) => s.lang);
  const achievements = useZikr((s) => s.achievements);
  const celebrated = useZikr((s) => s.celebrated);
  const sound = useZikr((s) => s.sound);
  const volume = useZikr((s) => s.volume);
  const markCelebrated = useZikr((s) => s.markCelebrated);
  const item = armed ? MILESTONES.find((m) => achievements.includes(m.at) && !celebrated.includes(m.at)) : undefined;
  const played = useRef<number | null>(null);
  const opened = useRef(0);

  useEffect(() => {
    if (!item || played.current === item.at) return;
    played.current = item.at;
    opened.current = Date.now();
    if (sound === "on") playAchievement(volume);
  }, [item, sound, volume]);

  if (!item) return null;

  const title = lang === "ru" ? item.title : formatNum(item.at);
  const body = lang === "ru" ? item.text : tx(lang, "milestoneOpen").replace("{n}", formatNum(item.at));

  function close() {
    if (Date.now() - opened.current < 700) return;
    markCelebrated(item!.at);
  }

  return (
    <div
      className="celebrate pointer-events-auto absolute inset-0 z-50 grid place-items-center px-5"
      role="presentation"
      onPointerDown={(event) => event.stopPropagation()}
    >
      <div className="celebrate-bg absolute inset-0 bg-black/70" />
      <article
        className="celebrate-card relative z-10 w-full max-w-sm rounded-3xl border border-line bg-surface px-5 py-6 text-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby="celebrate-title"
      >
        <p className="font-arabic text-3xl leading-none text-gold" dir="rtl" lang="ar">
          مَا شَاءَ اللَّهُ
        </p>
        <p className="mt-4 text-3xl font-extrabold tabular-nums tracking-tight text-gold">{formatNum(item.at)}</p>
        <h2 id="celebrate-title" className="mt-1 text-xl text-fg">{title}</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">{body}</p>
        <button type="button" onClick={close} className="mt-5 h-12 w-full rounded-full bg-gold text-sm font-semibold text-ink">
          {t(lang, "close")}
        </button>
      </article>
    </div>
  );
}
