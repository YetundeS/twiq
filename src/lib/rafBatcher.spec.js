import { describe, expect, test, vi } from "vitest";
import { createRafBatcher } from "./rafBatcher";

// Simple fake raf that gives the test control over when the frame fires.
function makeFakeRaf() {
  const callbacks = [];
  let nextId = 1;
  const raf = vi.fn((cb) => {
    const id = nextId++;
    callbacks.push({ id, cb });
    return id;
  });
  const cancel = vi.fn((id) => {
    const idx = callbacks.findIndex((c) => c.id === id);
    if (idx !== -1) callbacks.splice(idx, 1);
  });
  const flush = () => {
    // Fire everything that's currently queued, in order. New schedules
    // during flush don't run in the same tick — mirrors real rAF.
    const batch = callbacks.splice(0, callbacks.length);
    for (const { cb } of batch) cb();
  };
  return { raf, cancel, flush };
}

describe("createRafBatcher", () => {
  test("schedule → flush runs the callback exactly once", () => {
    const { raf, cancel, flush } = makeFakeRaf();
    const b = createRafBatcher({ raf, cancel });
    const cb = vi.fn();
    b.schedule(cb);
    expect(cb).not.toHaveBeenCalled();
    flush();
    expect(cb).toHaveBeenCalledTimes(1);
  });

  test("multiple schedules before flush coalesce into one raf + one callback", () => {
    const { raf, cancel, flush } = makeFakeRaf();
    const b = createRafBatcher({ raf, cancel });
    const cb = vi.fn();
    b.schedule(cb);
    b.schedule(cb);
    b.schedule(cb);
    expect(raf).toHaveBeenCalledTimes(1);
    flush();
    expect(cb).toHaveBeenCalledTimes(1);
  });

  test("only the FIRST scheduled callback runs; later schedule() calls are dropped", () => {
    // Contract: caller should mutate shared state, then schedule; the
    // pending callback reads the latest state at flush time. Later
    // callbacks with fresh state would defeat this pattern.
    const { raf, cancel, flush } = makeFakeRaf();
    const b = createRafBatcher({ raf, cancel });
    const first = vi.fn();
    const second = vi.fn();
    b.schedule(first);
    b.schedule(second);
    flush();
    expect(first).toHaveBeenCalledTimes(1);
    expect(second).not.toHaveBeenCalled();
  });

  test("schedule after flush runs a fresh frame", () => {
    const { raf, cancel, flush } = makeFakeRaf();
    const b = createRafBatcher({ raf, cancel });
    const cb1 = vi.fn();
    const cb2 = vi.fn();
    b.schedule(cb1);
    flush();
    b.schedule(cb2);
    expect(raf).toHaveBeenCalledTimes(2);
    flush();
    expect(cb1).toHaveBeenCalledTimes(1);
    expect(cb2).toHaveBeenCalledTimes(1);
  });

  test("cancel removes pending — flush after cancel does nothing", () => {
    const { raf, cancel, flush } = makeFakeRaf();
    const b = createRafBatcher({ raf, cancel });
    const cb = vi.fn();
    b.schedule(cb);
    expect(b.hasPending()).toBe(true);
    b.cancel();
    expect(cancel).toHaveBeenCalledTimes(1);
    expect(b.hasPending()).toBe(false);
    flush();
    expect(cb).not.toHaveBeenCalled();
  });

  test("cancel is idempotent when nothing is scheduled", () => {
    const { raf, cancel } = makeFakeRaf();
    const b = createRafBatcher({ raf, cancel });
    expect(() => b.cancel()).not.toThrow();
    expect(cancel).not.toHaveBeenCalled();
  });

  test("schedule after cancel re-schedules a fresh frame", () => {
    const { raf, cancel, flush } = makeFakeRaf();
    const b = createRafBatcher({ raf, cancel });
    const cb = vi.fn();
    b.schedule(cb);
    b.cancel();
    b.schedule(cb);
    flush();
    expect(cb).toHaveBeenCalledTimes(1);
    expect(raf).toHaveBeenCalledTimes(2);
  });

  test("falls back to sync execution when raf is absent (SSR / Node)", () => {
    const b = createRafBatcher({ raf: null, cancel: null });
    const cb = vi.fn();
    b.schedule(cb);
    expect(cb).toHaveBeenCalledTimes(1);
    expect(b.hasPending()).toBe(false);
  });

  test("cancel is a no-op when raf is absent (nothing was ever scheduled async)", () => {
    const b = createRafBatcher({ raf: null, cancel: null });
    const cb = vi.fn();
    b.schedule(cb);
    expect(() => b.cancel()).not.toThrow();
    expect(cb).toHaveBeenCalledTimes(1); // sync fallback fired
  });

  test("pending is cleared once the callback fires — hasPending flips back to false", () => {
    const { raf, cancel, flush } = makeFakeRaf();
    const b = createRafBatcher({ raf, cancel });
    b.schedule(() => {});
    expect(b.hasPending()).toBe(true);
    flush();
    expect(b.hasPending()).toBe(false);
  });
});
