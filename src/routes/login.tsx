import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { authClient, authEnabled, setStayToken } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Backdrop, Emblem } from "@/components/zikr/pattern";
import { isRtl, tx } from "@/lib/zikr/i18n";
import { useZikr } from "@/lib/zikr/store";
import type { LangId } from "@/lib/zikr/types";

export const Route = createFileRoute("/login")({ component: Login });

function explainAuthError(
  lang: LangId,
  error: { message?: string; status?: number; code?: string } | null | undefined,
  fallback: string,
) {
  const code = error?.code ?? "";
  const message = error?.message ?? "";
  if (code === "INVALID_EMAIL_OR_PASSWORD" || /invalid email or password/i.test(message)) return tx(lang, "loginBad");
  if ((error?.status ?? 0) >= 500 || /internal server|cf-ray|x-request-id|session terminated|fetch failed|network|econn|aborted/i.test(message)) return tx(lang, "loginDown");
  if (message.length > 160) return fallback;
  return message || fallback;
}

function Login() {
  const { user, isPending } = useCurrentUserState();
  const lang = useZikr((s) => s.lang);
  const [mode, setMode] = useState<"in" | "up" | "reset">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [again, setAgain] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [gaveUp, setGaveUp] = useState(false);

  useEffect(() => {
    document.documentElement.dir = isRtl(lang) ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    const timer = window.setTimeout(() => setGaveUp(true), 2500);
    return () => window.clearTimeout(timer);
  }, []);

  if (isPending && !gaveUp) {
    return (
      <div className="grid h-dvh place-items-center bg-bg text-fg">
        <p className="text-sm text-muted">{tx(lang, "loginWait")}</p>
      </div>
    );
  }
  if (user) return <Navigate to="/" />;

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (mode === "up" && password !== again) {
      setError(tx(lang, "loginPassMismatch"));
      return;
    }
    setBusy(true);
    try {
      if (mode === "reset") {
        const client = authClient as unknown as {
          requestPasswordReset: (body: { email: string; redirectTo: string }) => Promise<{ error?: { message?: string; status?: number; code?: string } | null }>;
        };
        const res = await client.requestPasswordReset({ email: email.trim(), redirectTo: "/" });
        if (res.error) setError(explainAuthError(lang, res.error, tx(lang, "loginMailFail")));
        else setError(tx(lang, "loginMailOk"));
        return;
      }
      if (mode === "up") {
        const res = await authClient.signUp.email({
          email: email.trim(),
          password,
          name: "—",
          callbackURL: "/",
        });
        if (res.error) {
          setError(explainAuthError(lang, res.error, tx(lang, "loginUpFail")));
          return;
        }
        const created = res.data as { token?: string | null } | null;
        if (created?.token) setStayToken(created.token);
      } else {
        const res = await authClient.signIn.email({
          email: email.trim(),
          password,
          callbackURL: "/",
          rememberMe: true,
        });
        if (res.error) {
          setError(explainAuthError(lang, res.error, tx(lang, "loginInFail")));
          return;
        }
        const signed = res.data as { token?: string | null } | null;
        if (signed?.token) setStayToken(signed.token);
      }
      window.location.assign("/");
    } catch (err) {
      setError(explainAuthError(lang, err instanceof Error ? { message: err.message } : null, tx(lang, "loginFail")));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="app-frame">
      <div className="app-column">
        <Backdrop />
        <div className="pane relative z-10 px-5 pt-[max(0.8rem,env(safe-area-inset-top))] pb-8">
          <a href="/" className="mb-4 flex h-11 items-center justify-center rounded-full border border-line bg-chip text-sm text-gold">
            {tx(lang, "home")}
          </a>
          <Emblem className="text-gold" />
          <h1 className="mt-4 text-3xl text-fg">{tx(lang, "loginSave")}</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">{tx(lang, "loginLead")}</p>
          {authEnabled ? (
            <>
              <form onSubmit={(e) => void submit(e)} className="mt-5 grid gap-2">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                  autoComplete="email"
                  placeholder={tx(lang, "loginEmail")}
                  className="h-11 rounded-2xl border border-line bg-surface px-3 text-fg"
                />
                {mode !== "reset" && (
                  <div className="relative">
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type={showPass ? "text" : "password"}
                      required
                      minLength={8}
                      autoComplete={mode === "up" ? "new-password" : "current-password"}
                      placeholder={tx(lang, "loginPass")}
                      className="h-11 w-full rounded-2xl border border-line bg-surface px-3 pe-24 text-fg"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((on) => !on)}
                      className="absolute inset-y-0 end-2 text-xs text-gold"
                    >
                      {showPass ? tx(lang, "loginPassHide") : tx(lang, "loginPassShow")}
                    </button>
                  </div>
                )}
                {mode === "up" && (
                  <div className="relative">
                    <input
                      value={again}
                      onChange={(e) => setAgain(e.target.value)}
                      type={showPass ? "text" : "password"}
                      required
                      minLength={8}
                      autoComplete="new-password"
                      placeholder={tx(lang, "loginPassAgain")}
                      className="h-11 w-full rounded-2xl border border-line bg-surface px-3 pe-24 text-fg"
                    />
                  </div>
                )}
                {error && <p className="text-sm text-gold">{error}</p>}
                <button type="submit" disabled={busy} className="h-11 rounded-full bg-gold text-sm text-ink disabled:opacity-60">
                  {busy ? tx(lang, "loginWait") : mode === "up" ? tx(lang, "loginCreate") : mode === "reset" ? tx(lang, "loginResetSend") : tx(lang, "loginEmailIn")}
                </button>
              </form>
              <button
                type="button"
                onClick={() => {
                  setMode(mode === "up" ? "in" : "up");
                  setAgain("");
                  setError("");
                }}
                className="mt-3 text-sm text-gold"
              >
                {mode === "up" ? tx(lang, "loginHave") : tx(lang, "loginCreateMail")}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode(mode === "reset" ? "in" : "reset");
                  setAgain("");
                  setError("");
                }}
                className="mt-2 text-sm text-muted"
              >
                {mode === "reset" ? tx(lang, "loginBackIn") : tx(lang, "loginForgot")}
              </button>
            </>
          ) : (
            <p className="mt-4 text-sm text-muted">{tx(lang, "loginOff")}</p>
          )}
          <a href="/" className="mt-6 inline-block text-sm text-muted">
            {tx(lang, "backZikr")}
          </a>
        </div>
      </div>
    </div>
  );
}
