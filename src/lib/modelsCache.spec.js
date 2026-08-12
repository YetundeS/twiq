import { beforeEach, describe, expect, test, vi } from "vitest";
import {
  loadModelsCached,
  invalidateModelsCache,
  _cacheSizeForTests,
} from "./modelsCache";

const MODELS_A = [{ model_id: "openai/gpt-4o-mini", is_default: true }];
const MODELS_B = [
  { model_id: "openai/gpt-4o", is_default: true },
  { model_id: "anthropic/claude-3.5-sonnet", is_default: false },
];

beforeEach(() => {
  invalidateModelsCache();
});

describe("loadModelsCached", () => {
  test("returns [] and skips the fetch when userId is missing", async () => {
    const fetcher = vi.fn();
    const models = await loadModelsCached(null, fetcher);
    expect(models).toEqual([]);
    expect(fetcher).not.toHaveBeenCalled();
  });

  test("serves the second call from cache without re-hitting the fetcher", async () => {
    const fetcher = vi.fn(async () => ({ models: MODELS_A }));
    await loadModelsCached("u1", fetcher);
    await loadModelsCached("u1", fetcher);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  test("different users get different cache slots (M2 fix — no cross-user leak)", async () => {
    const fetcher = vi.fn()
      .mockResolvedValueOnce({ models: MODELS_A })
      .mockResolvedValueOnce({ models: MODELS_B });
    const outA = await loadModelsCached("u1", fetcher);
    const outB = await loadModelsCached("u2", fetcher);
    expect(outA).toEqual(MODELS_A);
    expect(outB).toEqual(MODELS_B);
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(_cacheSizeForTests()).toBe(2);
  });

  test("expires after the TTL window", async () => {
    const fetcher = vi.fn(async () => ({ models: MODELS_A }));
    let time = 1_000_000;
    const clock = () => time;
    await loadModelsCached("u1", fetcher, clock);
    time += 60 * 1000; // 1 min later — still cached
    await loadModelsCached("u1", fetcher, clock);
    expect(fetcher).toHaveBeenCalledTimes(1);
    time += 5 * 60 * 1000; // 5 more min → past TTL
    await loadModelsCached("u1", fetcher, clock);
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  test("invalidateModelsCache('u1') removes only u1's slot", async () => {
    const fetcher = vi.fn(async () => ({ models: MODELS_A }));
    await loadModelsCached("u1", fetcher);
    await loadModelsCached("u2", fetcher);
    expect(_cacheSizeForTests()).toBe(2);
    invalidateModelsCache("u1");
    expect(_cacheSizeForTests()).toBe(1);
  });

  test("invalidateModelsCache() with no args clears everything", async () => {
    const fetcher = vi.fn(async () => ({ models: MODELS_A }));
    await loadModelsCached("u1", fetcher);
    await loadModelsCached("u2", fetcher);
    invalidateModelsCache();
    expect(_cacheSizeForTests()).toBe(0);
  });

  test("handles fetcher returning null / missing models gracefully", async () => {
    const fetcher = vi.fn(async () => null);
    const out = await loadModelsCached("u1", fetcher);
    expect(out).toEqual([]);
  });
});
