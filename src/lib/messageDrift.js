// Diagnostic for the Zustand↔SWR overlap in useAssistantChat (audit §5.5.5).
//
// The chat message state is held in TWO places today:
//   - SWR cache (useChatMessages) — the "true" backend snapshot
//   - Zustand (useModelsStore.activeChatMessages) — mirror + optimistic writes
//
// A useEffect copies SWR → Zustand on every SWR update. If SWR revalidates
// mid-write (e.g. a streaming SSE finished half a beat before the fetch),
// the copy overwrites optimistic rows that the caller expected to keep.
//
// This detector doesn't fix the race — it observes it. Wire it into the
// copy effect + log when `drifted` is true. Use as a regression harness
// when we eventually flip to SWR-first (or Zustand-first) in a follow-up.
//
// Identity contract:
//   - Persisted rows: `id` (bigint-in-prod → serialized as string)
//   - Optimistic rows (mid-stream, pre-persist): fall back to
//     `sessionID:created_at` because id isn't assigned until the backend
//     inserts. A row that transitions optimistic→persisted has its
//     identity change (opt:... → id:...) — that's a KNOWN false positive
//     documented in the spec.

export function identityOf(msg) {
  if (msg == null) return null;
  // Explicit undefined check — id=0 is falsy but valid.
  if (msg.id !== undefined && msg.id !== null) return `id:${msg.id}`;
  if (msg.sessionID != null && msg.created_at != null) {
    return `opt:${msg.sessionID}:${msg.created_at}`;
  }
  return null;
}

/**
 * @param {Array | null | undefined} prev - Zustand snapshot before the copy
 * @param {Array | null | undefined} next - incoming SWR data
 * @returns {{
 *   drifted: boolean,
 *   prevCount: number,
 *   nextCount: number,
 *   missingIds: string[],  // present in prev, absent in next
 *   addedIds: string[]     // absent in prev, present in next
 * }}
 *
 * `drifted` is true ONLY when the next set is missing identities the prev
 * set had — that's the clobber symptom. Gaining rows is expected on a
 * fresh fetch and is not drift.
 */
export function detectMessageDrift(prev, next) {
  const prevArr = Array.isArray(prev) ? prev : [];
  const nextArr = Array.isArray(next) ? next : [];

  const prevIds = new Set();
  for (const m of prevArr) {
    const id = identityOf(m);
    if (id !== null) prevIds.add(id);
  }
  const nextIds = new Set();
  for (const m of nextArr) {
    const id = identityOf(m);
    if (id !== null) nextIds.add(id);
  }

  const missingIds = [...prevIds].filter((id) => !nextIds.has(id));
  const addedIds = [...nextIds].filter((id) => !prevIds.has(id));

  return {
    drifted: missingIds.length > 0,
    prevCount: prevArr.length,
    nextCount: nextArr.length,
    missingIds,
    addedIds,
  };
}
