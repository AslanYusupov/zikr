import { useEffect, useRef, useState } from "react";
import { authClient, signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { GOALS, REMEMBRANCE, TAP_VOICES, THEMES, rewardPoints } from "@/lib/zikr/content";
import { formatNum, inviteBody, inviteLink, inviteText, telegramHref, todayKey, whatsappHref } from "@/lib/zikr/format";
import { playAchievement, playTap } from "@/lib/zikr/sound";
import { triggerHaptic } from "@/lib/zikr/haptic";
import { countryName, COUNTRY_IDS, t, themeHint, themeName, tx, voiceHint, voiceName } from "@/lib/zikr/i18n";
import type { LangId } from "@/lib/zikr/types";
import { phraseOf } from "@/lib/zikr/tr";
import { AYAHS_TOTAL, ayahCount, ayahFile, downloadAyahs, savedAyahFiles } from "@/lib/zikr/ayah-audio";
import { loadQuran } from "@/lib/zikr/quran";
import { useZikr } from "@/lib/zikr/store";
import type { CloudMeta } from "@/lib/zikr/api";
import { cn } from "@/lib/cn";
import { Sheet } from "./pattern";

const THEME_PHOTO: Record<string, string> = {
  roses: "/roses.jpg",
  sea: "/shore.jpg",
  desert: "/desert.jpg",
  cosmos: "/cosmos.jpg",
  peaks: "/peaks.jpg",
  lake: "/lake.jpg",
  jungle: "/jungle.jpg",
};

function explainAccount(lang: LangId, message: string | undefined, ok: "passwordChanged" | "deleteFail"): string {
  const text = (message ?? "").replace(/\s+/g, " ").trim();
  if (!text) return tx(lang, ok);
  const foreign = (lang === "ru" || lang === "ar" || lang === "ur") && /[A-Za-z]{5,}/.test(text);
  if (foreign || /cf-ray|x-request-id|session terminated|fetch failed|network|econn|aborted|internal server/i.test(text) || text.length > 160) {
    return tx(lang, ok === "passwordChanged" ? "passwordFail" : "deleteFail");
  }
  return text;
}

export function SettingsView({
  onClose,
  meta,
  status,
}: {
  onClose: () => void;
  meta: CloudMeta | null;
  status: "local" | "saving" | "saved" | "error";
}) {
  const s = useZikr();
  const { user, isPending } = useCurrentUserState();
  const [sessionReady, setSessionReady] = useState(false);
  const waiting = isPending && !sessionReady;
  const [copied, setCopied] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [nextPassword, setNextPassword] = useState("");
  const [accountNote, setAccountNote] = useState("");
  const [resetAsk, setResetAsk] = useState<"" | "day" | "rewards">("");
  const [resetNote, setResetNote] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => setSessionReady(true), 2500);
    return () => window.clearTimeout(timer);
  }, []);

  async function copyInvite() {
    const code = /^\d{8}$/.test(s.publicId) ? s.publicId : s.ensurePublicId();
    const text = inviteText(inviteLink(code), s.lang);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      /* ignore */
    }
  }

  return (
    <Sheet title={tx(s.lang, "settingsTitle")} onClose={onClose}>
        <p className="text-sm leading-relaxed text-muted">{user ? tx(s.lang, status === "saving" ? "savingAccount" : status === "saved" ? "savedAccount" : status === "error" ? "accountQuiet" : "savedDevice") : tx(s.lang, "savedPhone")}</p>

        <section className="mt-3 rounded-2xl border border-line bg-surface px-3 py-3">
          <h2 className="text-base font-extrabold text-fg">{t(s.lang, "inviteTitle")}</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted">{t(s.lang, "inviteHadith")}</p>
          <InviteButtons />
          <p className="mt-3 text-center font-arabic text-lg leading-snug text-fg" dir="rtl" lang="ar">
            سُبْحَانَ اللَّهِ وَبِحَمْدِهِ
          </p>
          <p className="mt-1 text-center text-sm font-extrabold text-fg">{t(s.lang, "invitePhrase")}</p>
          <p className="mt-1 text-center text-xs leading-relaxed text-muted">{t(s.lang, "inviteFoam")}</p>
          <button type="button" onClick={() => void copyInvite()} className="mt-3 h-11 w-full rounded-full border border-line text-sm text-fg">
            {copied ? t(s.lang, "inviteCopied") : t(s.lang, "inviteCopy")}
          </button>
        </section>

        <InstallApp lang={s.lang} />

        <QuranAudio lang={s.lang} />

        <details className="fold">
<summary className="fold-sum">{t(s.lang, "theme")}</summary>
        <p className="mt-1 text-sm leading-relaxed text-muted">{tx(s.lang, "themeLead")}</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {THEMES.map((theme) => (
            <button
              key={theme.id}
              type="button"
              data-theme={theme.id}
              onClick={() => s.setTheme(theme.id)}
              className={cn(
                "rounded-2xl border px-3 py-3 text-start",
                s.theme === theme.id ? "border-fg" : "border-line",
              )}
              style={
                THEME_PHOTO[theme.id]
                  ? {
                      backgroundImage: `linear-gradient(180deg, rgba(8,12,16,.18), rgba(8,12,16,.7)), url(${THEME_PHOTO[theme.id]})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center 40%",
                      color: "#f6f3ec",
                    }
                  : { background: "var(--bg)", color: "var(--fg)" }
              }
            >
              <span className="block text-sm">{themeName(s.lang, theme.id)}</span>
              <span className="mt-1 block text-xs" style={{ color: "var(--muted)" }}>
                {themeHint(s.lang, theme.id)}
              </span>
            </button>
          ))}
        </div>
        </details>

<details className="fold">
<summary className="fold-sum">{t(s.lang, "sound")}</summary>
        <p className="mt-1 text-sm leading-relaxed text-muted">{tx(s.lang, "soundLead")}</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => s.setSound("on")}
            className={cn(
              "h-11 rounded-full border text-sm font-bold",
              s.sound === "on" ? "border-gold bg-gold text-ink" : "border-line bg-chip text-fg",
            )}
          >
            {tx(s.lang, "soundOn")}
          </button>
          <button
            type="button"
            onClick={() => s.setSound("off")}
            className={cn(
              "h-11 rounded-full border text-sm font-bold",
              s.sound === "off" ? "border-gold bg-gold text-ink" : "border-line bg-chip text-fg",
            )}
          >
            {tx(s.lang, "soundOff")}
          </button>
        </div>
        <div className="mt-2 grid gap-2">
          {TAP_VOICES.map((voice) => (
            <button
              key={voice.id}
              type="button"
              onClick={() => {
                s.setVoice(voice.id);
                playTap(voice.id, Math.max(s.volume, 0.4));
              }}
              className={cn(
                "flex h-12 items-center justify-between rounded-2xl border px-3 text-start",
                s.voice === voice.id && s.sound === "on" ? "border-gold bg-surface" : "border-line bg-chip",
              )}
            >
              <span className="text-sm font-bold text-fg">{voiceName(s.lang, voice.id)}</span>
              <span className="text-xs text-muted">{voiceHint(s.lang, voice.id)}</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => playAchievement(Math.max(s.volume, 0.4))}
          className="mt-2 flex h-12 w-full items-center justify-between rounded-2xl border border-line bg-chip px-3 text-start"
        >
          <span className="text-sm font-bold text-fg">{tx(s.lang, "achieveSound")}</span>
          <span className="text-xs text-muted">{tx(s.lang, "achieveSoundHint")}</span>
        </button>
        <label className="mt-3 block text-sm text-muted">
          {tx(s.lang, "volume")}
          <input
            className="mt-2 w-full accent-[var(--gold)]"
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={s.volume}
            onChange={(e) => s.setVolume(Number(e.target.value))}
          />
        </label>
        </details>

<details className="fold">
<summary className="fold-sum">{t(s.lang, "screen")}</summary>
        <Toggle
          label={tx(s.lang, "vibrate")}
          hint={tx(s.lang, "vibrateHint")}
          on={s.vibrate}
          onChange={(on) => {
            s.setVibrate(on);
            if (on) triggerHaptic(true);
          }}
        />
        <Toggle
          label={tx(s.lang, "starFlow")}
          hint={tx(s.lang, "starFlowHint")}
          on={s.starFlow}
          onChange={s.setStarFlow}
        />
        <Toggle
          label={tx(s.lang, "orbitOn")}
          hint={tx(s.lang, "orbitHint")}
          on={s.orbit}
          onChange={s.setOrbit}
        />
        <Toggle
          label={tx(s.lang, "rainOn")}
          hint={tx(s.lang, "rainHint")}
          on={s.rain}
          onChange={s.setRain}
        />
        <Toggle
          label={tx(s.lang, "screenTap")}
          hint={tx(s.lang, "screenTapHint")}
          on={s.screenTap}
          onChange={s.setScreenTap}
        />
        <Toggle
          label={tx(s.lang, "wisdom")}
          hint={tx(s.lang, "wisdomHint")}
          on={s.showWisdom}
          onChange={s.setShowWisdom}
        />
        <Toggle
          label={tx(s.lang, "publicOn")}
          hint={tx(s.lang, "publicHint")}
          on={s.publicBoard}
          onChange={s.setPublicBoard}
        />
        </details>

<details className="fold">
<summary className="fold-sum">{t(s.lang, "goalDay")}</summary>
        <div className="mt-2 flex flex-wrap gap-2">
          {GOALS.map((goal) => (
            <button
              key={goal}
              type="button"
              onClick={() => s.setGoal(goal)}
              className={cn(
                "h-10 rounded-full px-3 text-sm",
                s.goal === goal ? "bg-gold text-ink" : "border border-line bg-chip text-fg",
              )}
            >
              {formatNum(goal)}
            </button>
          ))}
        </div>
        </details>

<details className="fold">
<summary className="fold-sum">{tx(s.lang, "resetTitle")}</summary>
        <p className="mt-2 text-sm leading-relaxed text-muted">{tx(s.lang, "resetLead")}</p>
        <p className="mt-2 text-sm tabular-nums text-fg">
          {t(s.lang, "today")} {formatNum(s.days[todayKey()]?.total ?? 0)} · {t(s.lang, "rewards")} {formatNum(rewardPoints(s.total + s.quranLetters))}
        </p>
        {resetAsk === "day" ? (
          <div className="mt-3">
            <p className="text-sm leading-relaxed text-fg">{tx(s.lang, "resetDayAsk")}</p>
            <button type="button" className="mt-2 h-11 w-full rounded-full bg-gold text-sm text-ink" onClick={() => { setResetNote(s.resetDay() ? tx(s.lang, "resetKept") : tx(s.lang, "resetNone")); setResetAsk(""); }}>{tx(s.lang, "resetYes")}</button>
            <button type="button" className="mt-2 h-11 w-full rounded-full border border-line text-sm text-fg" onClick={() => setResetAsk("")}>{tx(s.lang, "resetNo")}</button>
          </div>
        ) : (
          <button type="button" className="mt-3 h-11 w-full rounded-full border border-line text-sm text-fg" onClick={() => { setResetNote(""); setResetAsk("day"); }}>{tx(s.lang, "resetDay")}</button>
        )}
        {resetAsk === "rewards" ? (
          <div className="mt-3">
            <p className="text-sm leading-relaxed text-fg">{tx(s.lang, "resetRewardsAsk")}</p>
            <button type="button" className="mt-2 h-11 w-full rounded-full bg-gold text-sm text-ink" onClick={() => { setResetNote(s.resetRewards() ? tx(s.lang, "resetKept") : tx(s.lang, "resetNone")); setResetAsk(""); }}>{tx(s.lang, "resetYes")}</button>
            <button type="button" className="mt-2 h-11 w-full rounded-full border border-line text-sm text-fg" onClick={() => setResetAsk("")}>{tx(s.lang, "resetNo")}</button>
          </div>
        ) : (
          <button type="button" className="mt-2 h-11 w-full rounded-full border border-line text-sm text-fg" onClick={() => { setResetNote(""); setResetAsk("rewards"); }}>{tx(s.lang, "resetRewards")}</button>
        )}
        {s.dayArchive ? <button type="button" className="mt-2 h-11 w-full rounded-full border border-line text-sm text-gold" onClick={() => { s.restoreDay(); setResetNote(tx(s.lang, "restoreDone")); }}>{tx(s.lang, "restoreDay")}</button> : null}
        {s.rewardArchive ? <button type="button" className="mt-2 h-11 w-full rounded-full border border-line text-sm text-gold" onClick={() => { s.restoreRewards(); setResetNote(tx(s.lang, "restoreDone")); }}>{tx(s.lang, "restoreRewards")}</button> : null}
        {resetNote ? <p className="mt-2 text-sm text-muted">{resetNote}</p> : null}
        </details>

<details className="fold">
<summary className="fold-sum">{t(s.lang, "randomSet")}</summary>
        <div className="mt-2 grid gap-2">
          {REMEMBRANCE.map((d) => {
            const on = s.pool.includes(d.id);
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => s.togglePool(d.id)}
                className="flex items-center justify-between rounded-2xl border border-line bg-surface px-3 py-2 text-start"
              >
                <span className="min-w-0 pe-3 text-sm leading-snug text-pretty text-fg">{phraseOf(d, s.lang).name}</span>
                <span className={cn("text-xs", on ? "text-gold" : "text-muted")}>{on ? tx(s.lang, "inSet") : tx(s.lang, "notInSet")}</span>
              </button>
            );
          })}
        </div>
        </details>

<details className="fold">
<summary className="fold-sum">{t(s.lang, "language")}</summary>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {(
            [
              ["ru", "Русский"],
              ["en", "English"],
              ["ar", "العربية"],
              ["id", "Indonesia"],
              ["tr", "Türkçe"],
              ["ur", "اردو"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => s.setLang(id)}
              className={cn("h-11 rounded-2xl border text-sm", s.lang === id ? "border-fg text-fg" : "border-line text-muted")}
            >
              {label}
            </button>
          ))}
        </div>
        </details>

<details className="fold">
<summary className="fold-sum">{t(s.lang, "country")}</summary>
        <select
          value={s.country}
          onChange={(e) => s.setCountry(e.target.value)}
          className="mt-2 h-11 w-full rounded-2xl border border-line bg-bg px-3 text-sm text-fg"
        >
          {COUNTRY_IDS.map((id) => (
            <option key={id || "none"} value={id}>
              {countryName(s.lang, id)}
            </option>
          ))}
        </select>
        </details>

<details className="fold">
<summary className="fold-sum">{t(s.lang, "account")}</summary>
        {waiting && <div className="mt-2 h-11 animate-pulse rounded-2xl bg-surface" />}
        {!waiting && !user && (
          <>
            <p className="mt-2 text-sm leading-relaxed text-muted">{tx(s.lang, "accountLead")}</p>
            <a href="/login" className="mt-2 flex h-11 items-center justify-center rounded-full bg-gold text-sm text-ink">
              {tx(s.lang, "signIn")}
            </a>
          </>
        )}
        {!waiting && user && (
          <div className="mt-2 rounded-2xl border border-line bg-surface px-3 py-3">
            <p className="text-sm text-fg">{tx(s.lang, "signedIn")}</p>
            {meta && <p className="mt-3 text-sm text-fg">{tx(s.lang, "inviteCode")}: {meta.inviteCode}</p>}
            <label className="mt-3 block text-sm text-muted">
              {tx(s.lang, "currentPassword")}
              <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="mt-1 h-11 w-full rounded-2xl border border-line bg-bg px-3 text-fg" />
            </label>
            <label className="mt-2 block text-sm text-muted">
              {tx(s.lang, "newPassword")}
              <input type="password" value={nextPassword} onChange={(e) => setNextPassword(e.target.value)} className="mt-1 h-11 w-full rounded-2xl border border-line bg-bg px-3 text-fg" />
            </label>
            <button
              type="button"
              className="mt-2 h-11 w-full rounded-full border border-line text-sm text-fg"
              onClick={() => {
                const client = authClient as unknown as {
                  changePassword: (body: { currentPassword: string; newPassword: string; revokeOtherSessions: boolean }) => Promise<{ error?: { message?: string } | null }>;
                };
                void client
                  .changePassword({ currentPassword, newPassword: nextPassword, revokeOtherSessions: true })
                  .then((res) => setAccountNote(explainAccount(s.lang, res.error?.message, "passwordChanged")))
                  .catch(() => setAccountNote(tx(s.lang, "passwordFail")));
              }}
            >
              {tx(s.lang, "changePassword")}
            </button>
            <button type="button" className="mt-2 h-11 w-full rounded-full border border-line text-sm text-fg" onClick={() => void signOut("/")}>
              {tx(s.lang, "signOut")}
            </button>
            <button
              type="button"
              className="mt-2 h-10 w-full text-sm text-muted"
              onClick={() => {
                const password = window.prompt(tx(s.lang, "deleteAsk"));
                if (!password) return;
                const client = authClient as unknown as {
                  deleteUser: (body: { password: string }) => Promise<{ error?: { message?: string } | null }>;
                };
                void client
                  .deleteUser({ password })
                  .then((res) => {
                    if (res.error) setAccountNote(explainAccount(s.lang, res.error.message, "deleteFail"));
                    else void signOut("/");
                  })
                  .catch(() => setAccountNote(tx(s.lang, "deleteFail")));
              }}
            >
              {tx(s.lang, "deleteAccount")}
            </button>
            {accountNote ? <p className="mt-2 text-sm text-muted">{accountNote}</p> : null}
          </div>
        )}
        </details>

<details className="fold">
<summary className="fold-sum">{t(s.lang, "about")}</summary>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          {tx(s.lang, "aboutLead")}
        </p>
        <a className="mt-2 inline-block text-sm text-gold" href="mailto:zikr.web.app@gmail.com">
          zikr.web.app@gmail.com
        </a>
        </details>
    </Sheet>
  );
}

type InstallPrompt = Event & { prompt: () => Promise<void> };

function InstallApp({ lang }: { lang: LangId }) {
  const [ready, setReady] = useState<InstallPrompt | null>(null);
  const [standalone, setStandalone] = useState(false);
  const [kind, setKind] = useState<"ios" | "android" | "other">("other");

  useEffect(() => {
    const nav = navigator as Navigator & { standalone?: boolean };
    setStandalone(window.matchMedia("(display-mode: standalone)").matches || nav.standalone === true);
    const ua = navigator.userAgent;
    const ios = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    setKind(ios ? "ios" : /Android/i.test(ua) ? "android" : "other");
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setReady(event as InstallPrompt);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  const steps = kind === "ios" ? t(lang, "installIos") : kind === "android" ? t(lang, "installAndroid") : t(lang, "installOther");

  return (
    <section className="mt-3 rounded-2xl border border-line bg-surface px-3 py-3">
      {standalone ? null : <h2 className="text-base font-extrabold text-fg">{t(lang, "installTitle")}</h2>}
      {standalone ? (
        <p className="flex items-center gap-2 text-sm font-bold text-fg">
          <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#1f8a4c] text-white" aria-hidden>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2.2 6.2 4.7 8.7 9.8 3.3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          {t(lang, "installDone")}
        </p>
      ) : (
        <>
          <p className="mt-1 text-sm leading-relaxed text-muted">{t(lang, "installLead")}</p>
          <p className="mt-2 text-sm leading-relaxed text-fg">{steps}</p>
          {ready ? (
            <button
              type="button"
              className="mt-3 h-11 w-full rounded-full bg-gold text-sm text-ink"
              onClick={() => {
                void ready.prompt();
                setReady(null);
              }}
            >
              {t(lang, "installButton")}
            </button>
          ) : null}
        </>
      )}
    </section>
  );
}

const QURAN_DL: Record<LangId, { title: string; lead: string; one: string; all: string; stop: string; saved: string; of: string; need: string; done: string; fail: string }> = {
  ru: {
    title: "Коран на устройстве",
    lead: "Чтение аятов сохранится на устройстве и останется доступным без интернета.",
    one: "Скачать эту суру",
    all: "Скачать все аяты",
    stop: "Остановить",
    saved: "Сохранено",
    of: "из",
    need: "Для загрузки нужен интернет. Затем чтение останется на устройстве.",
    done: "Сохранено. Эти аяты можно слушать без сети.",
    fail: "Часть аятов не загрузилась. Проверьте связь и повторите. Уже сохранённые не загружаются снова.",
  },
  en: {
    title: "Quran on this device",
    lead: "The recitation is kept on this device and stays available without internet.",
    one: "Download this surah",
    all: "Download every ayah",
    stop: "Stop",
    saved: "Saved",
    of: "of",
    need: "Internet is needed to download. After that the recitation stays on the device.",
    done: "Saved. These ayahs can be heard offline.",
    fail: "Some ayahs were not saved. Check the connection and try again. Saved ones are not downloaded twice.",
  },
  ar: {
    title: "القرآن على الجهاز",
    lead: "تُحفظ التلاوة على هذا الجهاز وتبقى متاحة بلا إنترنت.",
    one: "تنزيل هذه السورة",
    all: "تنزيل كل الآيات",
    stop: "إيقاف",
    saved: "محفوظ",
    of: "من",
    need: "التنزيل يحتاج إلى إنترنت. بعد ذلك تبقى التلاوة على الجهاز.",
    done: "تم الحفظ. يمكن سماع هذه الآيات بلا شبكة.",
    fail: "لم تُحفظ بعض الآيات. تحقق من الاتصال ثم أعد المحاولة. المحفوظ لا يُنزَّل مرة أخرى.",
  },
  id: {
    title: "Quran di perangkat ini",
    lead: "Bacaan tersimpan di perangkat ini dan tetap bisa didengar tanpa internet.",
    one: "Unduh surah ini",
    all: "Unduh semua ayat",
    stop: "Berhenti",
    saved: "Tersimpan",
    of: "dari",
    need: "Internet diperlukan untuk mengunduh. Setelah itu bacaan tetap di perangkat.",
    done: "Tersimpan. Ayat ini bisa didengar tanpa jaringan.",
    fail: "Sebagian ayat belum tersimpan. Periksa koneksi lalu coba lagi. Yang sudah tersimpan tidak diunduh ulang.",
  },
  tr: {
    title: "Kur’an bu cihazda",
    lead: "Tilavet bu cihazda saklanır ve internet olmadan dinlenmeye devam eder.",
    one: "Bu sureyi indir",
    all: "Bütün ayetleri indir",
    stop: "Durdur",
    saved: "Kayıtlı",
    of: "/",
    need: "İndirmek için internet gerekir. Sonra tilavet cihazda kalır.",
    done: "Kaydedildi. Bu ayetler ağ olmadan dinlenir.",
    fail: "Bazı ayetler kaydedilmedi. Bağlantıyı kontrol edip yeniden deneyin. Kayıtlı olanlar tekrar inmez.",
  },
  ur: {
    title: "قرآن اس ڈیوائس پر",
    lead: "تلاوت اس ڈیوائس پر محفوظ رہتی ہے اور بغیر انٹرنیٹ سنی جا سکتی ہے۔",
    one: "یہ سورت ڈاؤن لوڈ کریں",
    all: "تمام آیات ڈاؤن لوڈ کریں",
    stop: "روکیں",
    saved: "محفوظ",
    of: "میں سے",
    need: "ڈاؤن لوڈ کے لیے انٹرنیٹ چاہیے۔ اس کے بعد تلاوت ڈیوائس پر رہتی ہے۔",
    done: "محفوظ ہو گیا۔ یہ آیات بغیر نیٹ کے سن سکتے ہیں۔",
    fail: "کچھ آیات محفوظ نہیں ہوئیں۔ کنکشن دیکھ کر دوبارہ کوشش کریں۔ جو محفوظ ہیں وہ دوبارہ نہیں اترتیں۔",
  },
};

function QuranAudio({ lang }: { lang: LangId }) {
  const copy = QURAN_DL[lang];
  const [names, setNames] = useState<string[]>([]);
  const [pick, setPick] = useState(1);
  const [have, setHave] = useState(0);
  const [run, setRun] = useState<{ done: number; total: number } | null>(null);
  const [note, setNote] = useState("");
  const stopRef = useRef<AbortController | null>(null);

  useEffect(() => {
    let stop = false;
    void loadQuran()
      .then((book) => {
        if (stop) return;
        setNames(book.surahs.map((item) => (lang === "ar" ? item.name : lang === "ru" ? item.ru : item.en)));
      })
      .catch(() => {});
    void savedAyahFiles().then((files) => {
      if (!stop) setHave(files.size);
    });
    return () => {
      stop = true;
    };
  }, [lang]);

  useEffect(() => () => stopRef.current?.abort(), []);

  async function start(scope: "one" | "all") {
    if (run) return;
    const numbers = scope === "all" ? Array.from({ length: 114 }, (_, i) => i + 1) : [pick];
    const jobs: { surah: number; ayah: number }[] = [];
    for (const surah of numbers) {
      const count = ayahCount(surah);
      for (let ayah = 1; ayah <= count; ayah += 1) jobs.push({ surah, ayah });
    }
    const files = await savedAyahFiles();
    const missing = jobs.some((job) => !files.has(ayahFile(job.surah, job.ayah)));
    if (missing && typeof navigator !== "undefined" && navigator.onLine === false) {
      setNote(copy.need);
      return;
    }
    const control = new AbortController();
    stopRef.current = control;
    setNote("");
    setRun({ done: 0, total: jobs.length });
    await downloadAyahs(jobs, (done) => setRun({ done, total: jobs.length }), control.signal);
    const next = await savedAyahFiles();
    setHave(next.size);
    setRun(null);
    if (control.signal.aborted) return;
    const got = jobs.filter((job) => next.has(ayahFile(job.surah, job.ayah))).length;
    setNote(got >= jobs.length ? copy.done : copy.fail);
  }

  const shown = run ? Math.round((run.done / Math.max(1, run.total)) * 100) : Math.round((have / AYAHS_TOTAL) * 100);

  return (
    <details className="fold">
      <summary className="fold-sum">{copy.title}</summary>
      <p className="text-sm leading-relaxed text-muted">{copy.lead}</p>
      <p className="text-sm tabular-nums text-fg">
        {copy.saved} {formatNum(have)} {copy.of} {formatNum(AYAHS_TOTAL)}
      </p>
      <div className="h-1 overflow-hidden rounded-full bg-bg">
        <div className="h-full rounded-full bg-gold" style={{ width: `${Math.min(100, shown)}%` }} />
      </div>
      <select
        value={pick}
        disabled={run !== null}
        onChange={(event) => setPick(Number(event.target.value))}
        className="h-11 w-full rounded-2xl border border-line bg-bg px-3 text-sm text-fg"
      >
        {Array.from({ length: 114 }, (_, i) => i + 1).map((n) => (
          <option key={n} value={n}>
            {n}. {names[n - 1] ?? ""}
          </option>
        ))}
      </select>
      {run ? (
        <>
          <p className="text-sm tabular-nums text-gold">
            {formatNum(run.done)} {copy.of} {formatNum(run.total)}
          </p>
          <button type="button" onClick={() => stopRef.current?.abort()} className="h-11 w-full rounded-full border border-line text-sm text-fg">
            {copy.stop}
          </button>
        </>
      ) : (
        <div className="grid gap-2">
          <button type="button" onClick={() => void start("one")} className="h-11 w-full rounded-full bg-gold text-sm font-bold text-ink">
            {copy.one}
          </button>
          <button type="button" onClick={() => void start("all")} className="h-11 w-full rounded-full border border-line text-sm text-fg">
            {copy.all}
          </button>
        </div>
      )}
      {note ? <p className="text-sm leading-relaxed text-muted">{note}</p> : null}
    </details>
  );
}

export function InviteButtons() {
  const publicId = useZikr((s) => s.publicId);
  const ensurePublicId = useZikr((s) => s.ensurePublicId);
  const lang = useZikr((s) => s.lang);
  useEffect(() => {
    if (!/^\d{8}$/.test(publicId)) ensurePublicId();
  }, [publicId, ensurePublicId]);
  const code = /^\d{8}$/.test(publicId) ? publicId : "";
  const link = inviteLink(code);
  const text = inviteText(link, lang);
  const body = inviteBody(lang);
  return (
    <>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <a
          className="flex h-11 items-center justify-center rounded-full bg-gold text-sm font-bold text-ink"
          href={code ? whatsappHref(text) : undefined}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={!code}
        >
          WhatsApp
        </a>
        <a
          className="flex h-11 items-center justify-center rounded-full border border-line text-sm font-bold text-fg"
          href={code ? telegramHref(body, link) : undefined}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={!code}
        >
          Telegram
        </a>
      </div>
    </>
  );
}

function Toggle({
  label,
  hint,
  on,
  onChange,
}: {
  label: string;
  hint: string;
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button type="button" onClick={() => onChange(!on)} className="mt-3 flex w-full items-center justify-between gap-3 rounded-2xl border border-line bg-surface px-3 py-3 text-start">
      <span>
        <span className="block text-sm text-fg">{label}</span>
        <span className="mt-0.5 block text-xs text-muted">{hint}</span>
      </span>
      <span className={cn("h-7 w-12 shrink-0 rounded-full p-0.5 transition-colors", on ? "bg-gold" : "bg-bg-deep")}>
        <span className={cn("block h-6 w-6 rounded-full bg-gold-soft transition-transform", on && "translate-x-5 bg-ink")} />
      </span>
    </button>
  );
}
