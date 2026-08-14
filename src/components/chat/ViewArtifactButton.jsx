"use client";

// Message-row entrypoint into the artifact panel (Phase 3 track 3).
//
// Renders a "view as ..." button only when the message came from a known
// artifact-emitting coach AND that coach's parser matches the content.
// Both gates required — no cross-coach false positives, no half-built
// artifacts on prose replies.
//
// Extensibility: add a new artifact type by dropping one entry into
// KNOWN_ARTIFACTS. The button, panel dispatch, and store contract all
// key off the `kind` string — no other file needs to know.

import { useMemo } from "react";
import { LayoutGrid, FileText, Newspaper } from "lucide-react";
import { parseCarouselArtifact } from "@/lib/artifactParser";
import { parseVideoScriptArtifact } from "@/lib/videoScriptParser";
import { parseLinkedinPostArtifact } from "@/lib/linkedinPostParser";
import useArtifactStore from "@/store/useArtifactStore";

// Ordered: first parser to match wins. Order matters only if a single
// coach ever supports multiple artifact shapes — today each coach has
// exactly one type, so the coach-slug gate makes it effectively 1:1.
const KNOWN_ARTIFACTS = [
    {
        coach: "carousel",
        kind: "carousel",
        title: "Carousel",
        buttonLabel: "View as carousel",
        Icon: LayoutGrid,
        parser: parseCarouselArtifact,
        // Parser returns { slides }. Store payload uses `slides` directly.
        toPayload: (parsed) => ({ slides: parsed.slides }),
    },
    {
        coach: "video_scripts",
        kind: "video_script",
        title: "Video script",
        buttonLabel: "View as video script",
        Icon: FileText,
        parser: parseVideoScriptArtifact,
        // Parser returns { sections, hashtags }.
        toPayload: (parsed) => ({ sections: parsed.sections, hashtags: parsed.hashtags }),
    },
    // Both LinkedIn coaches (business + personal) emit the same 3-section
    // shape. Two entries → same parser + kind so the panel doesn't need
    // to distinguish them.
    {
        coach: "linkedin_business",
        kind: "linkedin_post",
        title: "LinkedIn post",
        buttonLabel: "View as LinkedIn post",
        Icon: Newspaper,
        parser: parseLinkedinPostArtifact,
        toPayload: (parsed) => ({ sections: parsed.sections }),
    },
    {
        coach: "linkedin_personal",
        kind: "linkedin_post",
        title: "LinkedIn post",
        buttonLabel: "View as LinkedIn post",
        Icon: Newspaper,
        parser: parseLinkedinPostArtifact,
        toPayload: (parsed) => ({ sections: parsed.sections }),
    },
];

export default function ViewArtifactButton({ chat, assistantSlug }) {
    const open = useArtifactStore((s) => s.open);

    // Try parsers in registry order. The coach-slug gate on each entry
    // means at most one parser ever runs for a given message.
    const match = useMemo(() => {
        if (!chat?.content) return null;
        for (const entry of KNOWN_ARTIFACTS) {
            if (entry.coach !== assistantSlug) continue;
            const parsed = entry.parser(chat.content);
            if (parsed) return { entry, parsed };
        }
        return null;
    }, [assistantSlug, chat?.content]);

    if (!match) return null;

    const { entry, parsed } = match;
    const { Icon, kind, title, buttonLabel, toPayload } = entry;

    return (
        <button
            type="button"
            className="messageActionBtn"
            aria-label={buttonLabel}
            title={buttonLabel}
            data-testid="view-artifact-btn"
            data-artifact-kind={kind}
            onClick={() =>
                open({
                    kind,
                    sourceMessageId: chat?.id ?? null,
                    title,
                    ...toPayload(parsed),
                })
            }
        >
            <Icon size={14} />
        </button>
    );
}
