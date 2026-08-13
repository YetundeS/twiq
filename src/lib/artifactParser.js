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

// Match: optional markdown-heading marker, optional list marker, optional
// emoji + space, optional bold markers, then the label, optional bold
// close, colon, then rest-of-line as body.
//
//   line = <heading?> <list?> <emoji?> <bold?> LABEL <bold?> ':' <body>
//
// Kept as a builder rather than a giant static regex so each label's
// aliases can be plugged in individually and the pattern set stays
// readable.
function buildLabelMatcher(patterns) {
    // Escape any regex metachars in patterns (defensive — current
    // patterns are letters + spaces, but future aliases might not be).
    const alt = patterns
        .map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        .join("|");
    // Anchored at start; case-insensitive; captures the body.
    // - Optional markdown heading (`#`, `##`, `###`) followed by space
    // - Optional list marker (`1.`, `-`, `*`) followed by space
    // - Optional emoji cluster + space (broad match; \p{Extended_Pictographic}
    //   isn't universally supported, so fall back to a permissive char set)
    // - Optional bold open (`**` or `__`)
    // - The label
    // - Optional bold close (`**` or `__`)
    // - Colon
    // - Body (rest of line, trimmed later)
    return new RegExp(
        `^\\s*(?:#{1,3}\\s+)?(?:(?:\\d+\\.|[-*])\\s+)?(?:[^\\s\\w]+\\s+)?(?:\\*\\*|__)?\\s*(?:${alt})\\s*(?:\\*\\*|__)?\\s*:\\s*(.*)$`,
        "i"
    );
}

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
                // Strip a leading bold-close (`**Hook:**` puts the closing
                // `**` after the colon, so it ends up at the head of the
                // captured body). Same for underscore-style bold + a
                // stray trailing bold-close on the body.
                const body = (m[1] || "")
                    .replace(/^\s*(\*\*|__)\s*/, "")
                    .replace(/\s*(\*\*|__)\s*$/, "")
                    .trim();
                matched.set(key, body);
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
