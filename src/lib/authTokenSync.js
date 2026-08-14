"use client";

// Auth token sync — kickoff-doc tracked debt: adopt Supabase's built-in
// refresh-token flow instead of orphaning the refresh_token in localStorage.
//
// The prior behavior stored access_token + refresh_token in localStorage on
// login but never used the refresh_token. Users on long-lived tabs got
// kicked out after ~1 h when the access token expired, with no chance to
// auto-recover.
//
// Fix: hand tokens to @supabase/supabase-js's session manager, which knows
// how to refresh on its own via `onAuthStateChange` + TOKEN_REFRESHED
// events. We keep the localStorage keys in sync so every existing
// `addAuthHeader()` / `localStorage.getItem("twiq_access_token")` call site
// keeps working with the current token — no ripple change to API wrappers.

import { getSupabase } from "@/lib/supabase";

const ACCESS_KEY = "twiq_access_token";
const REFRESH_KEY = "twiq_refresh_token";

let initialized = false;
let unsubscribe = null;

/**
 * Hand any existing localStorage tokens to Supabase so its session
 * manager can auto-refresh them, then subscribe to auth state changes
 * to keep localStorage in sync with future refreshes.
 *
 * Idempotent — safe to call from multiple mount effects.
 */
export async function initAuthTokenSync() {
    if (initialized) return;
    if (typeof window === "undefined") return;

    const supabase = getSupabase();
    if (!supabase) return;

    initialized = true;

    // Subscribe FIRST so we catch the TOKEN_REFRESHED event that fires
    // synchronously inside setSession() below.
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === "TOKEN_REFRESHED" || event === "SIGNED_IN") {
            if (session?.access_token) {
                localStorage.setItem(ACCESS_KEY, session.access_token);
            }
            if (session?.refresh_token) {
                localStorage.setItem(REFRESH_KEY, session.refresh_token);
            }
        } else if (event === "SIGNED_OUT") {
            localStorage.removeItem(ACCESS_KEY);
            localStorage.removeItem(REFRESH_KEY);
        }
    });
    unsubscribe = () => data?.subscription?.unsubscribe();

    // Hand any pre-existing localStorage tokens to Supabase so it can
    // start auto-refreshing them. If the refresh_token is already expired
    // this will reject silently — the next protected request 401s exactly
    // like before, so no regression.
    const access_token = localStorage.getItem(ACCESS_KEY);
    const refresh_token = localStorage.getItem(REFRESH_KEY);
    if (access_token && refresh_token) {
        try {
            await supabase.auth.setSession({ access_token, refresh_token });
        } catch {
            // Silent — falls through to pre-existing 401 → sign-off flow.
        }
    }
}

/**
 * Call this AFTER a successful login/signup that returned fresh tokens
 * from the backend. Hands the tokens to Supabase so auto-refresh kicks in
 * for the rest of the session.
 *
 * @param {string} access_token
 * @param {string} refresh_token
 */
export async function syncTokensAfterLogin(access_token, refresh_token) {
    if (typeof window === "undefined") return;
    const supabase = getSupabase();
    if (!supabase || !access_token || !refresh_token) return;
    try {
        await supabase.auth.setSession({ access_token, refresh_token });
    } catch {
        // Silent — the caller has already stored the tokens in
        // localStorage, so the pre-existing auth flow still works.
    }
}

/**
 * Call this on logout. Tells Supabase to sign out (fires SIGNED_OUT
 * event, which the listener above uses to clear localStorage) and
 * defensively clears localStorage in case the listener isn't wired.
 */
export async function clearAuthTokens() {
    if (typeof window === "undefined") return;
    const supabase = getSupabase();
    if (supabase) {
        try {
            await supabase.auth.signOut();
        } catch {
            // Defensive fallthrough — clear storage below regardless.
        }
    }
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
}

// Test-only escape hatch — reset the module state so unit tests can
// re-run initAuthTokenSync from a clean slate.
export function __resetAuthTokenSyncForTests() {
    if (unsubscribe) unsubscribe();
    initialized = false;
    unsubscribe = null;
}
