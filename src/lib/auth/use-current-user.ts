import { useEffect, useRef, useState } from "react";
import { authClient, authEnabled } from "./client";

/** Normalized user shape used across the app, auth on or off. */
export type AppUser = {
  id: string;
  displayName: string | null;
  primaryEmail: string | null;
  profileImageUrl: string | null;
  /** True when this is the sandbox/dev fallback (auth not configured). */
  isDevFallback: boolean;
};

/**
 * Stable fallback user, used ONLY when auth is disabled
 * (`VITE_AUTH_ENABLED=false`, the shipped default). With auth on, the sandbox
 * live preview does real sign-in via the baked preview client. Its id is
 * `"dev-user"` — the SAME id `verify.server.ts` returns server-side — so per-user
 * rows written in that mode belong to one consistent owner.
 */
export const DEV_USER: AppUser = {
  id: "dev-user",
  displayName: "Dev User",
  primaryEmail: "dev@example.com",
  profileImageUrl: null,
  isDevFallback: true,
};

/** `useCurrentUserState()` result: the user plus the session-loading flag. */
export type CurrentUserState = {
  /** The user — `null` BOTH while the session loads and when signed out. */
  user: AppUser | null;
  /** True while the session is still resolving — don't treat `user: null` as signed out yet. */
  isPending: boolean;
};

/**
 * Current user + loading state. Same behavior in live preview and when deployed:
 *   - Auth enabled -> the real signed-in user; `user` is `null` while
 *                            the session resolves (`isPending: true`) and when
 *                            signed out (`isPending: false`). Session comes from
 *                            Better Auth `useSession()` → `/api/auth/get-session`
 *                            (cookie when deployed; bearer in live preview).
 *   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
 *
 * Protect a route by waiting out `isPending` before acting on `user` —
 * redirecting on `user: null` alone bounces signed-in visitors to sign-in on
 * every hard reload:
 *
 *   import { RedirectToSignIn } from "@/lib/auth/gates";
 *   const { user, isPending } = useCurrentUserState();
 *   if (isPending) return null;              // still resolving — don't redirect yet
 *   if (!user) return <RedirectToSignIn />;  // definitely signed out
 *
 * `authEnabled` is a module-level constant fixed at load, so the guarded hook
 * call keeps a stable hook order across every render of a given component.
 */
/** Last session that loaded. A failed refetch must not look like a sign-out. */
const HELD_KEY = "zikr-auth-user";
let heldUser: AppUser | null = null;

function readStoredUser(): AppUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(HELD_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AppUser;
    if (!parsed?.id || parsed.isDevFallback) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeStoredUser(user: AppUser | null) {
  if (typeof window === "undefined") return;
  try {
    if (!user) window.localStorage.removeItem(HELD_KEY);
    else window.localStorage.setItem(HELD_KEY, JSON.stringify(user));
  } catch {
    /* private mode */
  }
}

export function clearHeldUser() {
  heldUser = null;
  writeStoredUser(null);
}

export function useCurrentUserState(): CurrentUserState {
  if (!authEnabled) return { user: DEV_USER, isPending: false };
  // eslint-disable-next-line react-hooks/rules-of-hooks -- authEnabled is constant for the app's lifetime
  const { data, isPending, error } = authClient.useSession();
  // eslint-disable-next-line react-hooks/rules-of-hooks -- same constant branch as useSession
  const [gaveUp, setGaveUp] = useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks -- same constant branch as useSession
  const [kept, setKept] = useState<AppUser | null>(null);
  // eslint-disable-next-line react-hooks/rules-of-hooks -- same constant branch as useSession
  const sawPending = useRef(false);
  if (isPending) sawPending.current = true;
  // eslint-disable-next-line react-hooks/rules-of-hooks -- same constant branch as useSession
  useEffect(() => {
    setKept(readStoredUser());
  }, []);
  // eslint-disable-next-line react-hooks/rules-of-hooks -- same constant branch as useSession
  useEffect(() => {
    if (!isPending) {
      setGaveUp(false);
      return;
    }
    const timer = window.setTimeout(() => setGaveUp(true), 4000);
    return () => window.clearTimeout(timer);
  }, [isPending]);
  // eslint-disable-next-line react-hooks/rules-of-hooks -- same constant branch as useSession
  useEffect(() => {
    const retry = () => {
      void authClient.getSession().catch(() => {});
    };
    window.addEventListener("online", retry);
    return () => window.removeEventListener("online", retry);
  }, []);
  const user = data?.user;
  const next: AppUser | null = user
    ? {
        id: user.id,
        displayName: user.name ?? null,
        primaryEmail: user.email ?? null,
        profileImageUrl: user.image ?? null,
        isDevFallback: false,
      }
    : null;
  if (next) {
    heldUser = next;
    writeStoredUser(next);
  } else if (sawPending.current && !isPending && !error) {
    heldUser = null;
    writeStoredUser(null);
  }
  const shown = next ?? heldUser ?? (error || isPending ? kept : null);
  return {
    user: shown,
    isPending: !shown && isPending && !gaveUp,
  };
}

/**
 * Convenience view of `useCurrentUserState().user` for display (e.g.
 * `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
 * for redirects/guards use `useCurrentUserState()` and check `isPending`.
 */
export function useCurrentUser(): AppUser | null {
  return useCurrentUserState().user;
}
