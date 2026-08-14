import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock the Supabase browser-client factory — the module under test only
// consumes `auth.setSession`, `auth.signOut`, `auth.onAuthStateChange`.
// Everything else is stubbed to no-ops.
let listenerCallback = null;
const unsubscribeSpy = vi.fn();
const setSessionSpy = vi.fn();
const signOutSpy = vi.fn();
const onAuthStateChangeSpy = vi.fn((cb) => {
    listenerCallback = cb;
    return { data: { subscription: { unsubscribe: unsubscribeSpy } } };
});

vi.mock("@/lib/supabase", () => ({
    getSupabase: () => ({
        auth: {
            setSession: setSessionSpy,
            signOut: signOutSpy,
            onAuthStateChange: onAuthStateChangeSpy,
        },
    }),
}));

const {
    initAuthTokenSync,
    syncTokensAfterLogin,
    clearAuthTokens,
    __resetAuthTokenSyncForTests,
} = await import("./authTokenSync.js");

const ACCESS_KEY = "twiq_access_token";
const REFRESH_KEY = "twiq_refresh_token";

beforeEach(() => {
    localStorage.clear();
    setSessionSpy.mockReset().mockResolvedValue(undefined);
    signOutSpy.mockReset().mockResolvedValue(undefined);
    onAuthStateChangeSpy.mockClear();
    unsubscribeSpy.mockClear();
    listenerCallback = null;
    __resetAuthTokenSyncForTests();
});

describe("initAuthTokenSync", () => {
    it("hands existing localStorage tokens to Supabase.setSession", async () => {
        localStorage.setItem(ACCESS_KEY, "access-1");
        localStorage.setItem(REFRESH_KEY, "refresh-1");

        await initAuthTokenSync();

        expect(setSessionSpy).toHaveBeenCalledWith({
            access_token: "access-1",
            refresh_token: "refresh-1",
        });
    });

    it("subscribes to onAuthStateChange exactly once", async () => {
        await initAuthTokenSync();
        expect(onAuthStateChangeSpy).toHaveBeenCalledTimes(1);
    });

    it("is idempotent — a second call does not re-subscribe or re-setSession", async () => {
        localStorage.setItem(ACCESS_KEY, "access-1");
        localStorage.setItem(REFRESH_KEY, "refresh-1");

        await initAuthTokenSync();
        await initAuthTokenSync();

        expect(onAuthStateChangeSpy).toHaveBeenCalledTimes(1);
        expect(setSessionSpy).toHaveBeenCalledTimes(1);
    });

    it("does not call setSession when either token is missing", async () => {
        localStorage.setItem(ACCESS_KEY, "access-1");
        // no refresh token stored
        await initAuthTokenSync();
        expect(setSessionSpy).not.toHaveBeenCalled();
    });

    it("swallows setSession rejection instead of throwing (falls through to 401 flow)", async () => {
        localStorage.setItem(ACCESS_KEY, "access-1");
        localStorage.setItem(REFRESH_KEY, "expired");
        setSessionSpy.mockRejectedValueOnce(new Error("refresh_token_expired"));

        // Must not throw — the pre-existing 401 → sign-off flow catches
        // the eventual auth failure.
        await expect(initAuthTokenSync()).resolves.toBeUndefined();
    });
});

describe("onAuthStateChange listener", () => {
    it("TOKEN_REFRESHED event updates both localStorage keys with the new session tokens", async () => {
        await initAuthTokenSync();

        listenerCallback("TOKEN_REFRESHED", {
            access_token: "access-new",
            refresh_token: "refresh-new",
        });

        expect(localStorage.getItem(ACCESS_KEY)).toBe("access-new");
        expect(localStorage.getItem(REFRESH_KEY)).toBe("refresh-new");
    });

    it("SIGNED_IN event also updates localStorage (covers cross-tab sign-in)", async () => {
        await initAuthTokenSync();

        listenerCallback("SIGNED_IN", {
            access_token: "access-signed-in",
            refresh_token: "refresh-signed-in",
        });

        expect(localStorage.getItem(ACCESS_KEY)).toBe("access-signed-in");
    });

    it("SIGNED_OUT event clears both localStorage keys", async () => {
        localStorage.setItem(ACCESS_KEY, "access-1");
        localStorage.setItem(REFRESH_KEY, "refresh-1");
        await initAuthTokenSync();

        listenerCallback("SIGNED_OUT", null);

        expect(localStorage.getItem(ACCESS_KEY)).toBeNull();
        expect(localStorage.getItem(REFRESH_KEY)).toBeNull();
    });

    it("unrecognised event is a silent no-op", async () => {
        localStorage.setItem(ACCESS_KEY, "access-1");
        await initAuthTokenSync();

        listenerCallback("USER_UPDATED", { access_token: "should-not-write" });

        expect(localStorage.getItem(ACCESS_KEY)).toBe("access-1");
    });
});

describe("syncTokensAfterLogin", () => {
    it("calls Supabase.setSession with the provided tokens", async () => {
        await syncTokensAfterLogin("access-2", "refresh-2");
        expect(setSessionSpy).toHaveBeenCalledWith({
            access_token: "access-2",
            refresh_token: "refresh-2",
        });
    });

    it("is a no-op when either token is missing (defensive against callers)", async () => {
        await syncTokensAfterLogin("access-2", "");
        await syncTokensAfterLogin("", "refresh-2");
        await syncTokensAfterLogin(null, null);
        expect(setSessionSpy).not.toHaveBeenCalled();
    });

    it("swallows setSession rejection so login flow doesn't crash", async () => {
        setSessionSpy.mockRejectedValueOnce(new Error("network"));
        await expect(syncTokensAfterLogin("a", "b")).resolves.toBeUndefined();
    });
});

describe("clearAuthTokens", () => {
    it("calls Supabase.signOut and clears both localStorage keys", async () => {
        localStorage.setItem(ACCESS_KEY, "access-1");
        localStorage.setItem(REFRESH_KEY, "refresh-1");

        await clearAuthTokens();

        expect(signOutSpy).toHaveBeenCalledTimes(1);
        expect(localStorage.getItem(ACCESS_KEY)).toBeNull();
        expect(localStorage.getItem(REFRESH_KEY)).toBeNull();
    });

    it("still clears localStorage when signOut rejects (defensive)", async () => {
        localStorage.setItem(ACCESS_KEY, "access-1");
        localStorage.setItem(REFRESH_KEY, "refresh-1");
        signOutSpy.mockRejectedValueOnce(new Error("network"));

        await clearAuthTokens();

        expect(localStorage.getItem(ACCESS_KEY)).toBeNull();
        expect(localStorage.getItem(REFRESH_KEY)).toBeNull();
    });
});
