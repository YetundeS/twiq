"use client";

// Message-row entrypoint into the artifact panel (Phase 3 track 3 MVP).
//
// Renders only when the message came from the Carousel coach AND the
// content parses as a valid carousel (≥8/10 canonical slide labels).
// Both gates required — no cross-coach false positives, no half-built
// artifacts on prose replies.
//
// The parse runs on every render for now; memoize inline if profiling
// ever shows it in a chat with hundreds of assistant messages.

import { useMemo } from "react";
import { LayoutGrid } from "lucide-react";
import { parseCarouselArtifact } from "@/lib/artifactParser";
import useArtifactStore from "@/store/useArtifactStore";

export default function ViewAsCarouselButton({ chat, assistantSlug }) {
    const open = useArtifactStore((s) => s.open);

    const artifact = useMemo(() => {
        if (assistantSlug !== "carousel") return null;
        if (!chat?.content) return null;
        return parseCarouselArtifact(chat.content);
    }, [assistantSlug, chat?.content]);

    if (!artifact) return null;

    return (
        <button
            type="button"
            className="messageActionBtn"
            aria-label="View as carousel"
            title="View as carousel"
            data-testid="view-as-carousel-btn"
            onClick={() =>
                open({
                    kind: "carousel",
                    sourceMessageId: chat?.id ?? null,
                    title: "Carousel",
                    slides: artifact.slides,
                })
            }
        >
            <LayoutGrid size={14} />
        </button>
    );
}
