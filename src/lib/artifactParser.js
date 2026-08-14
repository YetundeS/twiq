// Carousel-artifact detector (Phase 3 track 3, MVP).
//
// The Carousel coach produces deterministic 10-slide output per its
// system prompt at docs/coaches/carousel.md §"Example Carousel Output":
//   Hook: ...
//   Misstep: ...
//   Pain Point: ...
//   Tip 1: ...
//   Tip 2: ...
//   Tip 3: ...
//   Analogy: ...
//   Mini Shift: ...
//   CTA: ...
//   Outro: ...
//
// This module recognises that shape and returns a normalized structure
// the ArtifactPanel can render as a 10-slide grid. Returns null when
// the content doesn't match — the caller then renders the raw message
// as plain markdown as usual.
//
// Tolerant of common LLM formatting drift:
//   - markdown bolding (**Hook:**, __Hook__)
//   - markdown headings (## Hook, ### Hook)
//   - emoji prefixes (✍🏽 Hook, 🎯 CTA)
//   - leading list markers (1. Hook, - Hook)
//   - leading/trailing whitespace on labels
//
// False-positive guard: requires ≥8 of the 10 canonical labels to match
// so a generic prose reply with a stray "Tip 1:" line doesn't get
// misidentified as a carousel.

import { buildLabelMatcher, stripBoldMarkers } from "./artifactRegexHelpers";

// Ordered canonical labels. `key` = internal id; `label` = user-facing
// slide title in the panel. Aliases handle common naming variants the
// coach occasionally produces (e.g. "Support Text" instead of "Body").
const SLIDE_LABELS = [
    { key: "hook",       label: "Hook",           patterns: ["hook"] },
    { key: "misstep",    label: "Common Misstep", patterns: ["misstep", "common misstep"] },
    { key: "pain",       label: "Pain Point",     patterns: ["pain point", "pain"] },
    { key: "tip1",       label: "Tip 1",          patterns: ["tip 1", "what really works 1"] },
    { key: "tip2",       label: "Tip 2",          patterns: ["tip 2", "what really works 2"] },
    { key: "tip3",       label: "Tip 3",          patterns: ["tip 3", "what really works 3"] },
    { key: "analogy",    label: "Analogy",        patterns: ["analogy"] },
    { key: "mini_shift", label: "Mini Shift",     patterns: ["mini shift", "shift"] },
    { key: "cta",        label: "CTA",            patterns: ["cta", "call to action", "call-to-action"] },
    { key: "outro",      label: "Outro",          patterns: ["outro"] },
];

const MIN_MATCHES = 8;

const MATCHERS = SLIDE_LABELS.map((s) => ({
    ...s,
    regex: buildLabelMatcher(s.patterns),
}));

/**
 * Parse Carousel-coach content into a structured artifact.
 *
 * @param {string} content — raw assistant reply text
 * @returns {{ slides: Array<{ index: number, key: string, title: string, body: string }> } | null}
 *   `slides` is always length 10 in output — missing labels get an empty
 *   body so the panel can still render a placeholder slot. Returns null
 *   when fewer than MIN_MATCHES canonical labels appear.
 */
export function parseCarouselArtifact(content) {
    if (!content || typeof content !== "string") return null;

    const lines = content.split(/\r?\n/);
    const matched = new Map(); // key → body

    for (const line of lines) {
        for (const { key, regex } of MATCHERS) {
            if (matched.has(key)) continue; // first-match-wins per label
            const m = line.match(regex);
            if (m) {
                // Strip bold-close markers that end up on the body side
                // when the coach writes `**Hook:**` (colon inside bold).
                matched.set(key, stripBoldMarkers(m[1]));
                break; // this line consumed
            }
        }
    }

    if (matched.size < MIN_MATCHES) return null;

    return {
        slides: SLIDE_LABELS.map((s, i) => ({
            index: i + 1,
            key: s.key,
            title: s.label,
            body: matched.get(s.key) || "",
        })),
    };
}
