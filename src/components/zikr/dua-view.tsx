import { useState } from "react";
import { DUAS, duaRead, localDua } from "@/lib/zikr/duas";
import { t } from "@/lib/zikr/i18n";
import { useZikr } from "@/lib/zikr/store";

export function DuaView() {
  const lang = useZikr((s) => s.lang);
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="pane px-4 pt-3 pb-8">
      <p className="text-sm leading-relaxed text-muted">{t(lang, "duaLead")}</p>
      <div className="mt-3 grid gap-3">
        {DUAS.map((dua) => {
          const line = localDua(dua, lang);
          const open = openId === dua.id;
          return (
            <button
              key={dua.id}
              type="button"
              className="w-full rounded-3xl border border-line bg-surface px-4 py-4 text-left"
              onClick={() => setOpenId((cur) => (cur === dua.id ? null : dua.id))}
            >
              <h3 className="text-lg leading-snug font-extrabold text-fg">{line.name}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{line.forWhat}</p>
              {open ? (
                <div className="mt-4 border-t border-line pt-4">
                  <p className="text-center font-arabic text-xl leading-loose text-fg" dir="rtl" lang="ar">
                    {dua.arabic}
                  </p>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-fg">{duaRead(dua.id, lang)}</p>
                  <p className="mt-3 text-base leading-relaxed text-muted">{line.meaning}</p>
                  <p className="mt-4 text-sm leading-relaxed text-gold">{t(lang, "duaFor")}</p>
                  <p className="mt-1 text-base leading-relaxed text-fg">{line.forWhat}</p>
                  <p className="mt-4 text-base leading-relaxed text-fg">{line.gives}</p>
                  <p className="mt-3 text-sm text-gold">{dua.source}</p>
                </div>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}