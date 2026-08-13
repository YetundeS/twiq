"use client";

// Suggested next actions (Phase 3 track 1 FE). Renders 3 clickable
// pills under an assistant reply. Click populates the input via the
// caller's onPick — does NOT auto-send, so users always review before
// firing the next turn. Backend-side generation lives in
// services/suggestionsService.js on the twiq-server repo.
//
// Silent no-op when suggestions is null / empty (legacy assistant rows
// pre-migration 31, aborted-partial replies, or generation failures).

// Guard against oversized / non-string items from a malformed row —
// backend already caps to 3 × 60 chars, this is defense in depth so a
// bad row doesn't blow up the message list.
const MAX_PILLS = 3;
const MAX_CHARS_PER_PILL = 80;

function sanitize(suggestions) {
  if (!Array.isArray(suggestions)) return [];
  const out = [];
  for (const item of suggestions) {
    if (typeof item !== "string") continue;
    const trimmed = item.trim();
    if (trimmed.length === 0) continue;
    out.push(trimmed.length > MAX_CHARS_PER_PILL
      ? trimmed.slice(0, MAX_CHARS_PER_PILL)
      : trimmed);
    if (out.length >= MAX_PILLS) break;
  }
  return out;
}

export default function SuggestionPills({ suggestions, onPick }) {
  const pills = sanitize(suggestions);
  if (pills.length === 0) return null;

  const handleClick = (text) => {
    if (typeof onPick === "function") onPick(text);
  };

  return (
    <div
      data-testid="suggestion-pills"
      className="flex flex-wrap gap-2 pt-2"
      role="group"
      aria-label="Suggested next actions"
    >
      {pills.map((text, i) => (
        <button
          key={i}
          type="button"
          onClick={() => handleClick(text)}
          className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-800 dark:hover:text-white"
        >
          {text}
        </button>
      ))}
    </div>
  );
}
