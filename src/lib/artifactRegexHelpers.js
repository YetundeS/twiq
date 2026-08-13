// Shared helpers for artifact parsers (Phase 3 track 3). Extracted the
// third time the same regex-builder + body-stripper appeared — carousel,
// video-script, and now linkedin-post all share the same label surface.
//
// Purposefully framework-agnostic and pure so parsers can compose these
// however they like (single-line body vs multi-line block body).

/**
 * Build an anchored, case-insensitive regex that matches a labeled line
 * with optional markdown / list / emoji noise before the label and an
 * optional bold-close after the label. Body is captured as group 1
 * (rest of line after the colon).
 *
 * Matches:
 *   Hook: body                 → captures "body"
 *   ## Hook: body              → captures "body"
 *   1. Hook: body              → captures "body"
 *   ✍🏽 Hook: body             → captures "body"
 *   **Hook:** body             → captures "** body" (caller strips)
 *   Hook:                       → captures ""      (multi-line callers use empty capture as a signal)
 *
 * @param {string[]} patterns — alternative label strings (e.g. ["cta", "call to action"])
 * @returns {RegExp}
 */
export function buildLabelMatcher(patterns) {
    const alt = patterns
        .map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        .join("|");
    return new RegExp(
        `^\\s*(?:#{1,3}\\s+)?(?:(?:\\d+\\.|[-*])\\s+)?(?:[^\\s\\w]+\\s+)?(?:\\*\\*|__)?\\s*(?:${alt})\\s*(?:\\*\\*|__)?\\s*:\\s*(.*)$`,
        "i"
    );
}

/**
 * Strip leading/trailing markdown bold markers plus surrounding whitespace.
 * Handles the `**Hook:**` case where the closing `**` lands on the body
 * side of the colon.
 *
 * Non-multiline (anchored at ^ / $ of the whole string, not per-line) so
 * block-mode callers can strip only the outer markers of a multi-line
 * blob without touching interior `**bold**` spans.
 *
 * @param {string} raw
 * @returns {string}
 */
export function stripBoldMarkers(raw) {
    return (raw || "")
        .replace(/^\s*(\*\*|__)\s*/, "")
        .replace(/\s*(\*\*|__)\s*$/, "")
        .trim();
}
