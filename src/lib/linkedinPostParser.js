// LinkedIn-post artifact detector (Phase 3 track 3).
//
// Shared by both LinkedIn coaches — linkedin_business + linkedin_personal
// emit the same 3-section shape per docs/coaches/linkedin_business.md
// and linkedin_personal.md §"Example Post Output":
//   Hook:
//     "<one or two lines>"
//   Main Body:
//     "<four to five paragraphs>"
//   CTA:
//     "<one or two lines>"
//
// KEY DIFFERENCE from carousel + video-script: the coach puts the label
// on its own line and the body on the following lines (often multi-
// paragraph for Main Body). Same-line format ("Hook: body") is also
// tolerated because LLMs occasionally collapse.
//
// Block-based body collection:
//   1. Scan every line and record label hits with their line indices.
//   2. For each hit, body = same-line capture if non-empty, else the
//      lines between this label and the next label (or EOF).
//
// False-positive guard: requires ALL 3 canonical labels (Hook + Main
// Body + CTA). Small label set + prose-heavy platform = strict gate
// needed. Better to miss an artifact than mis-render prose as one.

import { buildLabelMatcher, stripBoldMarkers } from "./artifactRegexHelpers";

const SECTION_LABELS = [
    { key: "hook",      label: "Hook",      patterns: ["hook"] },
    { key: "main_body", label: "Main Body", patterns: ["main body", "body"] },
    { key: "cta",       label: "CTA",       patterns: ["cta", "call to action", "call-to-action"] },
];

const MIN_MATCHES = 3;

const SECTION_MATCHERS = SECTION_LABELS.map((s) => ({
    ...s,
    regex: buildLabelMatcher(s.patterns),
}));

/**
 * Parse LinkedIn-post-coach content into a structured artifact.
 *
 * @param {string} content — raw assistant reply text
 * @returns {{ sections: Array<{ index: number, key: string, title: string, body: string }> } | null}
 *   `sections` is always length 3 in output — missing labels get an
 *   empty body (though with MIN_MATCHES=3 that's rare). Returns null
 *   when fewer than all 3 canonical labels appear anywhere in content.
 */
export function parseLinkedinPostArtifact(content) {
    if (!content || typeof content !== "string") return null;

    const lines = content.split(/\r?\n/);

    // Record every label hit with its line index + any same-line body.
    // First-hit-per-key wins.
    const seen = new Set();
    const hits = []; // { key, lineIndex, sameLineBody }
    for (let i = 0; i < lines.length; i++) {
        for (const { key, regex } of SECTION_MATCHERS) {
            if (seen.has(key)) continue;
            const m = lines[i].match(regex);
            if (m) {
                seen.add(key);
                hits.push({
                    key,
                    lineIndex: i,
                    sameLineBody: stripBoldMarkers(m[1]),
                });
                break; // this line consumed
            }
        }
    }

    if (hits.length < MIN_MATCHES) return null;

    // Bodies come from lines between this hit's label and the next hit's
    // label (or EOF for the last one). We already ordered by scan order,
    // which is line-index order — but be defensive and sort explicitly.
    const orderedHits = [...hits].sort((a, b) => a.lineIndex - b.lineIndex);
    const bodies = new Map();
    for (let i = 0; i < orderedHits.length; i++) {
        const hit = orderedHits[i];
        if (hit.sameLineBody) {
            bodies.set(hit.key, hit.sameLineBody);
            continue;
        }
        const nextIdx = orderedHits[i + 1]?.lineIndex ?? lines.length;
        const collected = lines
            .slice(hit.lineIndex + 1, nextIdx)
            .join("\n")
            .trim();
        bodies.set(hit.key, stripBoldMarkers(collected));
    }

    return {
        sections: SECTION_LABELS.map((s, i) => ({
            index: i + 1,
            key: s.key,
            title: s.label,
            body: bodies.get(s.key) || "",
        })),
    };
}
