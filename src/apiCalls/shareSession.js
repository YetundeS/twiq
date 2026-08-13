import { addAuthHeader } from "@/lib/utils";
import { toast } from "sonner";

// POST /api/chats/:sessionId/share
// Idempotent backend — creates a slug if none exists, or extends the
// existing share's expiry. Response: { url, slug, expires_at }.
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

// DELETE /api/chats/:sessionId/share
// Idempotent — a second call on an already-revoked session still returns
// { revoked: true } from the backend.
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
