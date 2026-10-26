import { useEffect, useState } from "react";
import { dhikrById } from "@/lib/zikr/content";
import { formatNum, todayKey, zikrWord } from "@/lib/zikr/format";
import { questText } from "@/lib/zikr/quest-i18n";
import { SUNNAH_QUESTS, sunnahQuestById, type SunnahQuest } from "@/lib/zikr/quests";
import { cite, phraseOf } from "@/lib/zikr/tr";
import { t } from "@/lib/zikr/i18n";
import type { LangId } from "@/lib/zikr/types";
import { useZikr } from "@/lib/zikr/store";

const TIERS = ["easy", "medium", "hard"] as const;

export function QuestsView({ onBegin }: { onBegin: () => void }) {
  const activeQuestId = useZikr((s) => s.activeQuestId);
  const questStep = useZikr((s) => s.questStep);
  const questStepProgress = useZikr((s) => s.questStepProgress);
  const startQuest = useZikr((s) => s.startQuest);
  const leaveQuest = useZikr((s) => s.leaveQuest);
  const doneToday = useZikr((s) => s.doneToday);
  const lang = useZikr((s) => s.lang);
  const [day, setDay] = useState(todayKey);
  useEffect(() => {
    const sync = () => {
      setDay(todayKey());
      useZikr.getState().rollDay();
    };
    sync();
    const id = window.setInterval(sync, 30000);
    window.addEventListener("focus", sync);
    window.addEventListener("pageshow", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("focus", sync);
      window.removeEventListener("pageshow", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);
  const active = sunnahQuestById(activeQuestId);
  const step = active?.steps[questStep];
  const activeText = active ? questText(active, lang) : null;
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="pane px-4 pt-2 pb-8">
      {active && step ? (
        <article className="mt-4 rounded-3xl border border-line bg-surface px-4 py-4">
          <h2 className="text-lg text-fg">{activeText?.title}</h2>
          <p className="mt-2 text-base text-fg">
            {step.label ? `${activeText?.label(step.label)}: ` : ""}
            «{phraseOf(dhikrById(step.dhikrId), lang).short}» · {formatNum(questStepProgress)} / {formatNum(step.count)}
          </p>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-bg-deep">
            <div className="h-full bg-gold" style={{ width: `${Math.min(100, (questStepProgress / step.count) * 100)}%` }} />
          </div>
          <DhikrSunnah id={step.dhikrId} lang={lang} />
          <button type="button" onClick={onBegin} className="mt-3 h-11 w-full rounded-full bg-gold text-sm text-ink">
            {t(lang, "questCount")}
          </button>
          <button type="button" onClick={leaveQuest} className="mt-2 h-10 w-full text-sm text-muted">
            {t(lang, "questLeave")}
          </button>
        </article>
      ) : null}

      {TIERS.map((tier) => {
        const list = SUNNAH_QUESTS.filter((q) => q.tier === tier);
        return (
          <section key={tier} className="mt-6">
            <h2 className="text-xs tracking-wide text-gold uppercase">{t(lang, tier === "hard" ? "tierLong" : tier === "medium" ? "tierMid" : "tierEasy")}</h2>
            <div className="mt-2 grid gap-2">
              {list.map((q) => (
                <QuestCard
                  key={q.id}
                  quest={q}
                  lang={lang}
                  done={doneToday[q.id] === day}
                  open={openId === q.id}
                  locked={Boolean(active)}
                  onOpen={() => setOpenId((cur) => (cur === q.id ? null : q.id))}
                  onTake={() => { startQuest(q.id); onBegin(); }}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function QuestCard({
  quest,
  locked,
  done,
  open,
  onOpen,
  onTake,
  lang,
}: {
  quest: SunnahQuest;
  locked: boolean;
  done: boolean;
  open: boolean;
  onOpen: () => void;
  onTake: () => void;
  lang: LangId;
}) {
  const text = questText(quest, lang);
  return (
    <article className="rounded-2xl border border-line bg-surface px-3 py-3">
      <button type="button" onClick={onOpen} className="w-full text-start">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base text-fg">
            {done ? <span className="mr-1 text-gold">✓</span> : null}
            {text.title}
          </h3>
        </div>
        <ol className="mt-2 grid gap-1">
          {quest.steps.map((step, i) => (
            <li key={`${quest.id}-${i}`} className="text-sm text-muted">
              {i + 1}. {step.label ? `${text.label(step.label)} · ` : ""}
              {phraseOf(dhikrById(step.dhikrId), lang).short} · {formatNum(step.count)} {zikrWord(step.count, lang)}
            </li>
          ))}
        </ol>
        <p className="mt-2 text-sm leading-snug text-muted">{text.note}</p>
        <p className="mt-1 text-xs text-muted">{cite(quest.source, lang)}</p>
        {done ? <p className="mt-2 text-sm text-gold">✓ {t(lang, "questDone")}</p> : null}
      </button>
      {open
        ? quest.steps.map((step, i) => (
            <DhikrSunnah key={`${quest.id}-info-${i}`} id={step.dhikrId} lang={lang} label={text.label(step.label)} />
          ))
        : null}
      <button
        type="button"
        disabled={locked}
        onClick={onTake}
        className="mt-3 h-10 w-full rounded-full border border-line text-sm text-fg disabled:opacity-40"
      >
        {locked ? t(lang, "questLocked") : done ? t(lang, "questRepeat") : t(lang, "questChoose")}
      </button>
    </article>
  );
}

function DhikrSunnah({ id, lang, label }: { id: string; lang: LangId; label?: string }) {
  const d = dhikrById(id);
  const line = phraseOf(d, lang);
  return (
    <div className="mt-3 border-t border-line pt-3">
      {label ? <p className="text-xs text-gold">{label}</p> : null}
      <p className="text-center font-arabic text-xl leading-loose text-fg" dir="rtl" lang="ar">
        {d.arabic}
      </p>
      <p className="mt-2 text-center text-sm font-extrabold leading-snug text-fg">{line.name}</p>
      <p className="mt-1 text-center text-sm leading-snug text-muted">{line.meaning}</p>
      <p className="mt-2 text-sm leading-relaxed text-fg">{line.reward}</p>
      <p className="mt-1 text-xs text-gold">{cite(d.source, lang)}</p>
    </div>
  );
}