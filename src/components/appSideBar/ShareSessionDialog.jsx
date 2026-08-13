"use client";

import { shareSession, revokeShare } from "@/apiCalls/shareSession";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Copy, Link as LinkIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// Share a chat session as a public link. Owner-only writes go through the
// authenticated /api/chats/:id/share endpoint; the read-side lives on an
// unauthenticated /shared/:slug page.
//
// Behavior:
//   - When `open` flips false → true for a session we haven't fetched yet,
//     POST /share fires exactly once. Toggling for the SAME sessionId does
//     not re-POST (guarded by the "already have URL" check).
//   - The backend is idempotent — a fresh POST on an already-shared
//     session returns the same slug + extends expiry. Matches Google Docs.
//   - Revoke fires DELETE and closes the dialog on success.
//   - Failure leaves a Retry button visible so the user isn't stranded.
//
// Prop contract:
//   - sessionId  — the chat session to share (required)
//   - open       — controlled Dialog open state (parent-owned)
//   - onOpenChange(next) — Dialog open-change callback (used to close on revoke)
export default function ShareSessionDialog({ sessionId, open, onOpenChange }) {
    const [loading, setLoading] = useState(false);
    const [share, setShare] = useState(null); // { url, slug, expires_at }
    const [error, setError] = useState(false);
    const [revoking, setRevoking] = useState(false);

    // Track which sessionId we've already POSTed for so re-opening the
    // same dialog doesn't spam the backend. Resets when sessionId changes.
    const postedForRef = useRef(null);

    const doShare = useCallback(async () => {
        if (!sessionId) return;
        setLoading(true);
        setError(false);
        const out = await shareSession(sessionId);
        setLoading(false);
        if (!out) {
            setError(true);
            return;
        }
        postedForRef.current = sessionId;
        setShare(out);
    }, [sessionId]);

    // Fire POST on open for a session we haven't fetched yet. Note that
    // `share` clearing on sessionId change is handled by the reset effect below.
    useEffect(() => {
        if (!open) return;
        if (postedForRef.current === sessionId && share) return;
        doShare();
    }, [open, sessionId, share, doShare]);

    // Reset when the sessionId changes (parent reused the same dialog
    // instance for a different session).
    useEffect(() => {
        postedForRef.current = null;
        setShare(null);
        setError(false);
    }, [sessionId]);

    const handleCopy = async () => {
        if (!share?.url) return;
        try {
            await navigator.clipboard.writeText(share.url);
            toast.success("Link copied", {
                style: { border: "none" },
            });
        } catch (_err) {
            toast.error("Failed to copy link", {
                description: "Copy the URL manually",
                style: { border: "none", color: "red" },
            });
        }
    };

    const handleRevoke = async () => {
        if (!sessionId) return;
        setRevoking(true);
        const ok = await revokeShare(sessionId);
        setRevoking(false);
        if (!ok) return;
        toast.success("Share link revoked", { style: { border: "none" } });
        // Local reset so re-opening mints a fresh slug rather than reusing
        // the just-revoked one from memory.
        postedForRef.current = null;
        setShare(null);
        onOpenChange?.(false);
    };

    const expiresLabel = share?.expires_at
        ? new Date(share.expires_at).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
          })
        : null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Share this chat</DialogTitle>
                    <DialogDescription>
                        Anyone with the link can view this conversation. Uploaded files
                        are hidden.
                    </DialogDescription>
                </DialogHeader>

                {loading ? (
                    <div className="py-6 text-center text-sm text-muted-foreground">
                        Creating link…
                    </div>
                ) : error ? (
                    <div className="py-4">
                        <p className="text-sm text-red-600 mb-3">
                            Couldn&apos;t create a share link. Please try again.
                        </p>
                        <Button
                            type="button"
                            variant="outline"
                            data-testid="share-session-retry"
                            onClick={doShare}
                        >
                            Retry
                        </Button>
                    </div>
                ) : share ? (
                    <div className="flex flex-col gap-3 py-2">
                        <div className="flex items-center gap-2">
                            <LinkIcon size={16} className="shrink-0 text-muted-foreground" />
                            <Input
                                readOnly
                                value={share.url}
                                data-testid="share-session-url"
                                onFocus={(e) => e.target.select()}
                                className="flex-1"
                            />
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={handleCopy}
                                data-testid="share-session-copy"
                                aria-label="Copy share link"
                            >
                                <Copy size={14} /> Copy
                            </Button>
                        </div>
                        {expiresLabel && (
                            <p className="text-xs text-muted-foreground">
                                Expires {expiresLabel}
                            </p>
                        )}
                    </div>
                ) : null}

                <DialogFooter>
                    {share ? (
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleRevoke}
                            disabled={revoking}
                            data-testid="share-session-revoke"
                        >
                            {revoking ? "Revoking…" : "Revoke link"}
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange?.(false)}
                        >
                            Close
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
