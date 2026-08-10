"use client";

import { memo, useEffect, useRef, useState } from "react";

// Inline editor for a user message. Renders a textarea seeded with the
// current content; commits on Save / Ctrl-Enter, cancels on Esc.
// The parent handles the actual PATCH via `onSave(next)`.
const UserMessageEditor = memo(({ initialContent, onCancel, onSave }) => {
  const [value, setValue] = useState(initialContent || "");
  const [saving, setSaving] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.focus();
    // Move cursor to end so the user can keep typing without extra clicks.
    el.setSelectionRange(el.value.length, el.value.length);
    // Auto-size to content.
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 300) + "px";
  }, []);

  const commit = async () => {
    const next = value.trim();
    if (!next || next === (initialContent || "").trim()) {
      onCancel();
      return;
    }
    setSaving(true);
    await onSave(next);
    setSaving(false);
  };

  return (
    <div className="userMessageEditor">
      <textarea
        ref={textareaRef}
        value={value}
        disabled={saving}
        onChange={(e) => {
          setValue(e.target.value);
          e.target.style.height = "auto";
          e.target.style.height = Math.min(e.target.scrollHeight, 300) + "px";
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.preventDefault();
            onCancel();
          } else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            commit();
          }
        }}
        className="userMessageEditor__textarea"
        rows={2}
        maxLength={10000}
      />
      <div className="userMessageEditor__actions">
        <button
          type="button"
          className="userMessageEditor__btn userMessageEditor__cancel"
          onClick={onCancel}
          disabled={saving}
        >
          Cancel
        </button>
        <button
          type="button"
          className="userMessageEditor__btn userMessageEditor__save"
          onClick={commit}
          disabled={saving || !value.trim()}
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
});

UserMessageEditor.displayName = "UserMessageEditor";

export default UserMessageEditor;
