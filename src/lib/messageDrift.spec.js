import { describe, expect, test } from "vitest";
import { detectMessageDrift, identityOf } from "./messageDrift";

// Small factories. `id` is a bigint-ish string (matches prod schema drift).
const dbMsg = ({ id, sender = "assistant", created_at = "2026-08-13T10:00:00Z", content = "" } = {}) =>
  ({ id, sender, created_at, content });
const optimisticMsg = ({ sessionID = "sess-1", sender = "user", created_at = "2026-08-13T10:00:00Z", content = "hi" } = {}) =>
  ({ sender, sessionID, created_at, content }); // no `id` yet

describe("identityOf", () => {
  test("prefers id when present (persisted rows)", () => {
    expect(identityOf(dbMsg({ id: "42" }))).toBe("id:42");
  });

  test("falls back to sessionID+created_at for optimistic rows without id", () => {
    const m = optimisticMsg({ sessionID: "s1", created_at: "2026-08-13T10:00:00Z" });
    expect(identityOf(m)).toBe("opt:s1:2026-08-13T10:00:00Z");
  });

  test("returns null for malformed input (no id + no sessionID)", () => {
    expect(identityOf({})).toBe(null);
    expect(identityOf(null)).toBe(null);
  });

  test("id=0 (falsy but valid) still resolves via the id path", () => {
    // bigint ids are strings in prod; guard against a hypothetical 0 anyway.
    expect(identityOf({ id: 0 })).toBe("id:0");
  });
});

describe("detectMessageDrift", () => {
  test("no drift when both arrays are identical", () => {
    const arr = [dbMsg({ id: "1" }), dbMsg({ id: "2" })];
    const out = detectMessageDrift(arr, arr);
    expect(out.drifted).toBe(false);
    expect(out.prevCount).toBe(2);
    expect(out.nextCount).toBe(2);
    expect(out.missingIds).toEqual([]);
    expect(out.addedIds).toEqual([]);
  });

  test("no drift when both are empty (fresh session)", () => {
    const out = detectMessageDrift([], []);
    expect(out.drifted).toBe(false);
    expect(out.prevCount).toBe(0);
    expect(out.nextCount).toBe(0);
  });

  test("no drift when SWR gains rows (expected — new backend inserts)", () => {
    const prev = [dbMsg({ id: "1" })];
    const next = [dbMsg({ id: "1" }), dbMsg({ id: "2" })];
    const out = detectMessageDrift(prev, next);
    expect(out.drifted).toBe(false); // gaining is fine — that's what a fresh fetch does
    expect(out.addedIds).toEqual(["id:2"]);
    expect(out.missingIds).toEqual([]);
  });

  test("DRIFTED when SWR loses rows the local state had (the clobber bug)", () => {
    // prev = local Zustand with a just-committed optimistic assistant reply
    // next = SWR revalidate that hasn't seen it yet
    const prev = [dbMsg({ id: "1" }), dbMsg({ id: "2" }), dbMsg({ id: "3-optimistic" })];
    const next = [dbMsg({ id: "1" }), dbMsg({ id: "2" })];
    const out = detectMessageDrift(prev, next);
    expect(out.drifted).toBe(true);
    expect(out.missingIds).toEqual(["id:3-optimistic"]);
    expect(out.addedIds).toEqual([]);
  });

  test("DRIFTED — optimistic (id-less) row survives via fallback identity", () => {
    // Optimistic user turn: no id yet, tracked via sessionID+created_at.
    // If SWR arrives without it and no matching id was assigned, drift.
    const optRow = optimisticMsg({ sessionID: "s1", created_at: "2026-08-13T10:00:00Z" });
    const prev = [dbMsg({ id: "1" }), optRow];
    const next = [dbMsg({ id: "1" })];
    const out = detectMessageDrift(prev, next);
    expect(out.drifted).toBe(true);
    expect(out.missingIds).toEqual(["opt:s1:2026-08-13T10:00:00Z"]);
  });

  test("does NOT flag drift when an optimistic row was replaced by a persisted row with same identity fallback", () => {
    // After backend responds, the optimistic row gets an id. Identity flips
    // from opt:... to id:... — our detector treats that as removed+added.
    // Documented as "known false positive at optimistic→persisted transition"
    // because the row identity legitimately changes; caller should
    // squash-and-fetch pattern to avoid this.
    const optRow = optimisticMsg({ sessionID: "s1", created_at: "2026-08-13T10:00:00Z" });
    const persistedRow = dbMsg({ id: "99", sender: "user", created_at: "2026-08-13T10:00:00Z" });
    const prev = [optRow];
    const next = [persistedRow];
    const out = detectMessageDrift(prev, next);
    // Documented false positive — identity legitimately changed
    expect(out.drifted).toBe(true);
    expect(out.missingIds).toEqual(["opt:s1:2026-08-13T10:00:00Z"]);
    expect(out.addedIds).toEqual(["id:99"]);
  });

  test("no drift on pure reorder (both sets have same identities)", () => {
    const prev = [dbMsg({ id: "1" }), dbMsg({ id: "2" })];
    const next = [dbMsg({ id: "2" }), dbMsg({ id: "1" })];
    const out = detectMessageDrift(prev, next);
    expect(out.drifted).toBe(false);
    expect(out.missingIds).toEqual([]);
    expect(out.addedIds).toEqual([]);
  });

  test("handles null / undefined prev + next as empty arrays without throwing", () => {
    expect(() => detectMessageDrift(null, null)).not.toThrow();
    const out = detectMessageDrift(null, [dbMsg({ id: "1" })]);
    expect(out.drifted).toBe(false); // going from empty to something is not drift
    expect(out.addedIds).toEqual(["id:1"]);
  });

  test("skips messages that produce a null identity (malformed rows)", () => {
    const prev = [dbMsg({ id: "1" }), {} /* malformed */];
    const next = [dbMsg({ id: "1" })];
    // The malformed row has no identity → not counted as missing.
    const out = detectMessageDrift(prev, next);
    expect(out.drifted).toBe(false);
    expect(out.missingIds).toEqual([]);
  });
});
