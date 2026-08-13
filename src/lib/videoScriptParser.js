// Video-script artifact detector (Phase 3 track 3 follow-up).
//
// The Video Scripts coach produces a 4-section short-form script per its
// system prompt at docs/coaches/video_scripts.md §"Example Script Output":
//   Hook: ...
//   Build-Up: ...
//   Value: ...
//   CTA: ...
//   Hashtags: ...   (optional trailer, one line)
//
// Recognises that shape and returns a normalized structure the
// ArtifactPanel can render as a stack of 4 section cards + a hashtags
// footer. Returns null when the content doesn't match — the caller
// renders the raw message as plain markdown as usual.
//
// Same tolerance surface as the carousel parser (markdown bold, headings,
// emoji prefixes, list markers). Regex + strip helpers extracted to
// artifactRegexHelpers.js on the third use (linkedin-post parser).
//
// False-positive guard: requires ≥3 of the 4 canonical labels
// (`MIN_MATCHES=3`, i.e. 75%) — same relative strictness as carousel
// (8 of 10 = 80%). A single stray "Hook:" line in prose won't trip it.

import { buildLabelMatcher, stripBoldMarkers } from "./artifactRegexHelpers";

const SECTION_LABELS = [
    { key: "hook",     label: "Hook",     patterns: ["hook"] },
    { key: "build_up", label: "Build-Up", patterns: ["build-up", "build up", "buildup"] },
    { key: "value",    label: "Value",    patterns: ["value"] },
    { key: "cta",      label: "CTA",      patterns: ["cta", "call to action", "call-to-action"] },
];

const HASHTAGS_LABEL = { key: "hashtags", patterns: ["hashtags", "hashtag"] };

const MIN_MATCHES = 3;

const SECTION_MATCHERS = SECTION_LABELS.map((s) => ({
    ...s,
    regex: buildLabelMatcher(s.patterns),
}));

const HASHTAGS_MATCHER = {
    ...HASHTAGS_LABEL,
    regex: buildLabelMatcher(HASHTAGS_LABEL.patterns),
};

/**
 * Parse Video-Scripts-coach content into a structured artifact.
 *
 * @param {string} content — raw assistant reply text
 * @returns {{
 *   sections: Array<{ index: number, key: string, title: string, body: string }>,
 *   hashtags: string | null
 * } | null}
 *   `sections` is always length 4 in output — missing labels get an empty
 *   body so the panel can still render a placeholder card. `hashtags` is
 *   null when the coach didn't emit a hashtags line. Returns null overall
 *   when fewer than MIN_MATCHES canonical section labels appear.
 */
export function parseVideoScriptArtifact(content) {
    if (!content || typeof content !== "string") return null;

    const lines = content.split(/\r?\n/);
    const matchedSections = new Map();
    let hashtags = null;

    for (const line of lines) {
        // Sections first — first-match-wins per label.
        let consumed = false;
        for (const { key, regex } of SECTION_MATCHERS) {
            if (matchedSections.has(key)) continue;
            const m = line.match(regex);
            if (m) {
                matchedSections.set(key, stripBoldMarkers(m[1]));
                consumed = true;
                break;
            }
        }
        if (consumed) continue;

        // Hashtags trailer — optional, first-match-wins.
        if (hashtags == null) {
            const m = line.match(HASHTAGS_MATCHER.regex);
            if (m) hashtags = stripBoldMarkers(m[1]) || null;
        }
    }

    if (matchedSections.size < MIN_MATCHES) return null;

    return {
        sections: SECTION_LABELS.map((s, i) => ({
            index: i + 1,
            key: s.key,
            title: s.label,
            body: matchedSections.get(s.key) || "",
        })),
        hashtags,
    };
}
