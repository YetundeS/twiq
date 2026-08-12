// Coalesce arbitrary work into at-most-one callback per animation frame.
// Used by useAssistantChat to cap SSE-driven React commits at paint-frame
// cadence (§10.2 perf sprint), but the primitive is content-agnostic.
//
// Fallback: when `requestAnimationFrame` isn't available (SSR, Node, test
// env), work runs synchronously so nothing silently drops.

const globalRaf = typeof window !== "undefined" && typeof window.requestAnimationFrame === "function"
  ? window.requestAnimationFrame.bind(window)
  : null;

const globalCancel = typeof window !== "undefined" && typeof window.cancelAnimationFrame === "function"
  ? window.cancelAnimationFrame.bind(window)
  : null;

/**
 * @param {{ raf?: (cb: () => void) => number, cancel?: (id: number) => void }} [deps]
 *   Inject fake raf/cancel in tests. Defaults to window.* when available.
 *   Explicit `null` opts into the sync fallback (useful for isolating the
 *   fallback path in tests even when jsdom provides its own rAF).
 */
export function createRafBatcher(deps = {}) {
  const raf = "raf" in deps ? deps.raf : globalRaf;
  const cancel = "cancel" in deps ? deps.cancel : globalCancel;
  let pending = null;

  return {
    /**
     * Schedule `cb` to run on the next animation frame. If a callback is
     * already pending, this is a no-op — the caller should update any
     * shared state BEFORE calling schedule() so the already-pending
     * callback picks up the latest value.
     */
    schedule(cb) {
      if (pending !== null) return;
      if (!raf) {
        cb();
        return;
      }
      pending = raf(() => {
        pending = null;
        cb();
      });
    },

    /**
     * Cancel any pending callback. Idempotent — safe to call multiple
     * times, safe to call when nothing is scheduled.
     */
    cancel() {
      if (pending !== null && cancel) {
        cancel(pending);
      }
      pending = null;
    },

    hasPending() {
      return pending !== null;
    },
  };
}
