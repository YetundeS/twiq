"use client";

import { useEffect } from "react";

// Bind global keyboard shortcuts scoped to a chat/coach page.
// Handlers are optional — omit any you don't need for the current context.
//
// Shortcuts:
//   ⌘K / Ctrl+K   → onNewChat (only when not typing in an input)
//   Escape        → onEscape  (typically closes an in-flight stream)
export default function useKeyboardShortcuts({ onNewChat, onEscape } = {}) {
  useEffect(() => {
    const isTypingInField = (target) => {
      if (!target) return false;
      const tag = target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
      if (target.isContentEditable) return true;
      return false;
    };

    const handler = (event) => {
      // ⌘K on macOS, Ctrl+K everywhere else.
      const cmdOrCtrl = event.metaKey || event.ctrlKey;
      if (cmdOrCtrl && (event.key === "k" || event.key === "K")) {
        if (typeof onNewChat !== "function") return;
        // Don't hijack ⌘K inside a text field where the user might be
        // trying to trigger a different shortcut (browser search, etc.).
        if (isTypingInField(event.target)) return;
        event.preventDefault();
        onNewChat();
        return;
      }

      if (event.key === "Escape") {
        if (typeof onEscape !== "function") return;
        event.preventDefault();
        onEscape();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onNewChat, onEscape]);
}
