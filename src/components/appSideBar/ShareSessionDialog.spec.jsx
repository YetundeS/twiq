import { describe, expect, test, vi, afterEach, beforeEach } from "vitest";
import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";

// Dialog renders into a portal; testing-library's `screen` queries
// document.body which covers portals. Wrap querySelector in a helper
// that throws on miss so waitFor actually retries instead of returning null.
const waitForEl = (selector) =>
    waitFor(() => {
        const el = document.querySelector(selector);
        if (!el) throw new Error(`waiting for ${selector}`);
        return el;
    });

// Mock the API wrapper module BEFORE importing the component so the
// component's transitive `import { shareSession, revokeShare }` resolves
// to our spies.
const shareSpy = vi.fn();
const revokeSpy = vi.fn();
vi.mock("@/apiCalls/shareSession", () => ({
    shareSession: (...args) => shareSpy(...args),
    revokeShare: (...args) => revokeSpy(...args),
}));

// Mock sonner toast so we can assert Copy triggers a toast without
// pulling in the real Toaster.
const toastSuccessSpy = vi.fn();
const toastErrorSpy = vi.fn();
vi.mock("sonner", () => ({
    toast: {
        success: (...args) => toastSuccessSpy(...args),
        error: (...args) => toastErrorSpy(...args),
    },
}));

const { default: ShareSessionDialog } = await import("./ShareSessionDialog");

const SUCCESS_PAYLOAD = {
    url: "https://twiq.ai/shared/abc123DEF456",
    slug: "abc123DEF456",
    expires_at: "2026-09-12T12:00:00.000Z",
};

beforeEach(() => {
    shareSpy.mockReset();
    revokeSpy.mockReset();
    toastSuccessSpy.mockReset();
    toastErrorSpy.mockReset();
    // Fresh clipboard spy per test.
    Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
});

afterEach(() => {
    cleanup();
});

describe("ShareSessionDialog", () => {
    test("fires POST /share on open and shows the URL on success", async () => {
        shareSpy.mockResolvedValueOnce(SUCCESS_PAYLOAD);

        const onOpenChange = vi.fn();
        render(
            <ShareSessionDialog
                sessionId="sess-1"
                open={true}
                onOpenChange={onOpenChange}
            />
        );

        expect(shareSpy).toHaveBeenCalledTimes(1);
        expect(shareSpy).toHaveBeenCalledWith("sess-1");

        // URL surfaces once the POST resolves. Dialog renders in a portal;
        // testing-library queries document.body so this still finds it.
        const urlInput = await waitForEl('input[data-testid="share-session-url"]');
        expect(urlInput).not.toBeNull();
        expect(urlInput.value).toBe(SUCCESS_PAYLOAD.url);
    });

    test("does NOT fire POST when open=false (no wasted quota when closed)", () => {
        render(
            <ShareSessionDialog
                sessionId="sess-1"
                open={false}
                onOpenChange={vi.fn()}
            />
        );
        expect(shareSpy).not.toHaveBeenCalled();
    });

    test("Copy button writes the URL to the clipboard and toasts success", async () => {
        shareSpy.mockResolvedValueOnce(SUCCESS_PAYLOAD);

        render(
            <ShareSessionDialog
                sessionId="sess-1"
                open={true}
                onOpenChange={vi.fn()}
            />
        );

        const copyBtn = await waitForEl('[data-testid="share-session-copy"]');
        fireEvent.click(copyBtn);
        await waitFor(() =>
            expect(navigator.clipboard.writeText).toHaveBeenCalledWith(SUCCESS_PAYLOAD.url)
        );
        expect(toastSuccessSpy).toHaveBeenCalledTimes(1);
    });

    test("Revoke fires DELETE and closes the dialog on success", async () => {
        shareSpy.mockResolvedValueOnce(SUCCESS_PAYLOAD);
        revokeSpy.mockResolvedValueOnce(true);

        const onOpenChange = vi.fn();
        render(
            <ShareSessionDialog
                sessionId="sess-1"
                open={true}
                onOpenChange={onOpenChange}
            />
        );

        const revokeBtn = await waitForEl('[data-testid="share-session-revoke"]');
        fireEvent.click(revokeBtn);

        await waitFor(() => expect(revokeSpy).toHaveBeenCalledWith("sess-1"));
        // Closing the dialog is the visible signal that revoke succeeded.
        await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
    });

    test("POST failure surfaces an error state (no URL rendered)", async () => {
        shareSpy.mockResolvedValueOnce(null); // matches the wrapper's failure return

        render(
            <ShareSessionDialog
                sessionId="sess-1"
                open={true}
                onOpenChange={vi.fn()}
            />
        );

        await waitFor(() => expect(shareSpy).toHaveBeenCalledTimes(1));

        // No URL input should exist on failure — the wrapper already
        // toasted, we just need to make sure we don't leak an empty URL
        // pretending to be a valid link.
        const urlInput = document.querySelector('input[data-testid="share-session-url"]');
        expect(urlInput).toBeNull();

        // An error message + a Retry button should be visible so the user
        // isn't stuck on a spinner.
        const retryBtn = await waitForEl('[data-testid="share-session-retry"]');
        expect(retryBtn).not.toBeNull();
    });

    test("does NOT re-fire POST when open flips false → true if we already have a URL (single-open only)", async () => {
        // We intentionally guard against toggling the dialog spamming the
        // BE. Fresh open in a re-render should re-fire (new session in
        // effect), but toggling the same instance shouldn't.
        shareSpy.mockResolvedValue(SUCCESS_PAYLOAD);

        const { rerender } = render(
            <ShareSessionDialog
                sessionId="sess-1"
                open={true}
                onOpenChange={vi.fn()}
            />
        );

        await waitFor(() => expect(shareSpy).toHaveBeenCalledTimes(1));

        rerender(
            <ShareSessionDialog
                sessionId="sess-1"
                open={false}
                onOpenChange={vi.fn()}
            />
        );
        rerender(
            <ShareSessionDialog
                sessionId="sess-1"
                open={true}
                onOpenChange={vi.fn()}
            />
        );

        // Reopening the SAME sessionId shouldn't re-hit the BE — we already
        // have the URL from the first open.
        expect(shareSpy).toHaveBeenCalledTimes(1);
    });
});
