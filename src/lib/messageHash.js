// URL-fragment helpers for the "jump to message" flow (§6.11 polish).
//
// Format: `#message-<bigint>`. bigint because chat_messages.id is bigint
// in prod (see schema drift note in project CLAUDE.md). We keep the id
// as a string throughout so we don't lose precision if it ever exceeds
// Number.MAX_SAFE_INTEGER.

const HASH_RE = /^#message-(\d+)$/;

export function parseMessageIdFromHash(hash) {
  if (typeof hash !== "string") return null;
  const m = hash.match(HASH_RE);
  return m ? m[1] : null;
}

export function buildMessageAnchorHash(messageId) {
  if (messageId === null || messageId === undefined || messageId === "") return null;
  return `#message-${messageId}`;
}
