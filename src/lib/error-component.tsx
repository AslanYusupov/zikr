import type { ErrorComponentProps } from "@tanstack/react-router";
import { tx } from "@/lib/zikr/i18n";
import { useZikr } from "@/lib/zikr/store";

function readable(error: unknown, fallback: string): string {
  const raw = error instanceof Error ? error.message : typeof error === "string" ? error : "";
  const text = raw.replace(/\s+/g, " ").trim();
  if (!text || text.length > 160) return fallback;
  if (/cf-ray|x-request-id|session terminated|econn|fetch failed|network|internal server|aborted|<!doctype|<html/i.test(text)) return fallback;
  return text;
}

export function AppErrorComponent({ error }: ErrorComponentProps) {
  const lang = useZikr((s) => s.lang);
  const message = readable(error, tx(lang, "errorPage"));
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-[#050505] px-6 text-center text-[#f4f1ea]">
      <h1 className="text-lg font-semibold">{tx(lang, "errorOpen")}</h1>
      <p className="max-w-md text-sm break-words text-[#c8c2b4]">{message}</p>
      <button
        type="button"
        className="mt-2 h-11 rounded-full bg-[#f4f1ea] px-5 text-sm text-[#050505]"
        onClick={() => location.reload()}
      >
        {tx(lang, "errorAgain")}
      </button>
    </main>
  );
}
