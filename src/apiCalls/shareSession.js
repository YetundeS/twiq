import { addAuthHeader } from "@/lib/utils";
import { toast } from "sonner";

/**
 * POST /api/chats/:sessionId/share — mint or extend a share link.
 * Idempotent backend: an existing share is returned with the same slug +
 * a refreshed expiry (matches Google Docs Share-settings behavior).
 *
 * @param {string} sessionId
 * @param {number} [expiresInDays] — optional; defaults server-side to 30, capped at 365.
 * @returns {Promise<{ url: string, slug: string, expires_at: string } | null>}
 *   null on failure — the caller can render an error/retry state. The
 *   wrapper already surfaced a toast, so no re-notification needed.
 */
export const shareSession = async (sessionId, expiresInDays) => {
    if (!sessionId) return null;

    const authHeader = addAuthHeader();
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URI}/chats/${sessionId}/share`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...authHeader,
                },
                body: JSON.stringify(
                    expiresInDays ? { expires_in_days: expiresInDays } : {}
                ),
            }
        );

        if (!response.ok) {
            if (response.status === 429) {
                const retryAfter = response.headers.get("Retry-After");
                toast.error("Rate limited", {
                    description: `Please wait ${retryAfter ? Math.ceil(retryAfter / 60) + " minutes" : "a moment"} before trying again`,
                    style: { border: "none", color: "red" },
                });
                return null;
            }

            let description = response.statusText || "Please try again";
            try {
                const body = await response.json();
                if (body?.error) description = body.error;
            } catch (_) { /* ignore parse failures */ }

            toast.error("Failed to share session", {
                description,
                style: { border: "none", color: "red" },
            });
            return null;
        }

        return await response.json();
    } catch (_err) {
        toast.error("Failed to share session", {
            description: "Something went wrong - please try again",
            style: { border: "none", color: "red" },
        });
        return null;
    }
};

/**
 * DELETE /api/chats/:sessionId/share — revoke an existing share link.
 * Idempotent: a second call on an already-revoked session still returns
 * { revoked: true } from the backend, so this returns true either way.
 *
 * @param {string} sessionId
 * @returns {Promise<boolean>} true on success (including idempotent success), false on failure.
 */
export const revokeShare = async (sessionId) => {
    if (!sessionId) return false;

    const authHeader = addAuthHeader();
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URI}/chats/${sessionId}/share`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    ...authHeader,
                },
            }
        );

        if (!response.ok) {
            let description = response.statusText || "Please try again";
            try {
                const body = await response.json();
                if (body?.error) description = body.error;
            } catch (_) { /* ignore parse failures */ }

            toast.error("Failed to revoke share", {
                description,
                style: { border: "none", color: "red" },
            });
            return false;
        }

        return true;
    } catch (_err) {
        toast.error("Failed to revoke share", {
            description: "Something went wrong - please try again",
            style: { border: "none", color: "red" },
        });
        return false;
    }
};

/**
 * GET /shared/:slug — public, unauthenticated. Server-side fetch only;
 * called from the Server Component page. No auth header (endpoint doesn't
 * accept one) and no toast (the page renders the error state directly —
 * this runs during SSR where sonner isn't mounted).
 *
 * @param {string} slug
 * @returns {Promise<{ status: number, body?: { session: object, messages: object[] } }>}
 *   status is the HTTP code; body is present only on 200. Non-200s
 *   (404 revoked/unknown, 410 expired, 500 network) return { status } alone.
 */
export const fetchSharedPublicSession = async (slug) => {
    const base = process.env.NEXT_PUBLIC_SERVER_URI;
    if (!base) return { status: 500 };
    if (!slug || typeof slug !== "string") return { status: 404 };
    try {
        const res = await fetch(`${base}/shared/${encodeURIComponent(slug)}`, {
            cache: "no-store",
        });
        if (res.status === 200) {
            const body = await res.json();
            return { status: 200, body };
        }
        return { status: res.status };
    } catch (_err) {
        return { status: 500 };
    }
};
