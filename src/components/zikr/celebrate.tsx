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

  useEffect(() => {
    if (!item || played.current === item.at) return;
    played.current = item.at;
    if (sound === "on") playAchievement(volume);
  }, [item, sound, volume]);

  if (!item) return null;

  const title = lang === "ru" ? item.title : formatNum(item.at);
  const body = lang === "ru" ? item.text : tx(lang, "milestoneOpen").replace("{n}", formatNum(item.at));

  function close() {
    const pending = useZikr.getState().achievements.filter((at) => !useZikr.getState().celebrated.includes(at));
    for (const at of pending.length ? pending : [item!.at]) markCelebrated(at);
  }

  return (
    <div className="celebrate pointer-events-auto absolute inset-0 z-50 grid place-items-center px-5">
      <button
        type="button"
        className="celebrate-bg absolute inset-0 bg-black/65"
        aria-label={t(lang, "close")}
        onClick={close}
      />
      <article className="celebrate-card relative z-10 w-full max-w-sm rounded-3xl border border-line bg-surface px-5 py-5 text-center" onClick={close}>
        <p className="font-arabic text-3xl leading-none text-gold" dir="rtl" lang="ar">
          مَا شَاءَ اللَّهُ
        </p>
        <h2 className="mt-3 text-xl text-fg">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
        <button type="button" onClick={close} className="mt-4 h-12 w-full rounded-full bg-gold text-sm text-ink">
          {t(lang, "close")}
        </button>
      </article>
    </div>
  );
}
