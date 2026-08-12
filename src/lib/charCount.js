// Pure helper for the input-area character counter (§6.7 remainder).
//
// Chars are a UX proxy — not a hard limit. The backend enforces context
// window via tiktoken + quota. Hitting 'danger' here doesn't block send;
// it just signals "this message is very long, are you sure?".
//
// We use JS char units (String.length) — same convention every browser
// input already uses. Surrogate-pair chars (emoji) count as 2, which
// matches the underlying storage cost.

export const CHAR_COUNT_VISIBILITY_THRESHOLD = 200;   // hide chip for typical short messages
export const CHAR_COUNT_WARN_AT = 5000;               // orange: "getting long"
export const CHAR_COUNT_DANGER_AT = 10000;            // red: "very long"

/**
 * @param {string | null | undefined} text
 * @param {{visibilityAt?: number, warnAt?: number, dangerAt?: number}} [opts]
 * @returns {{ count: number, visibility: 'hidden' | 'visible', level: 'normal' | 'warn' | 'danger', display: string }}
 */
export function getCharCountState(text, opts = {}) {
  const visibilityAt = opts.visibilityAt ?? CHAR_COUNT_VISIBILITY_THRESHOLD;
  const warnAt = opts.warnAt ?? CHAR_COUNT_WARN_AT;
  const dangerAt = opts.dangerAt ?? CHAR_COUNT_DANGER_AT;

  const count = typeof text === "string" ? text.length : 0;

  let level = "normal";
  if (count >= dangerAt) level = "danger";
  else if (count >= warnAt) level = "warn";

  const visibility = count >= visibilityAt ? "visible" : "hidden";

  return {
    count,
    visibility,
    level,
    display: count.toLocaleString(),
  };
}
