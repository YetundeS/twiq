import { describe, expect, test } from "vitest";
import {
  getCharCountState,
  CHAR_COUNT_VISIBILITY_THRESHOLD,
  CHAR_COUNT_WARN_AT,
  CHAR_COUNT_DANGER_AT,
  LEVEL_CLASS_NAME,
} from "./charCount";

describe("getCharCountState", () => {
  test.each([
    [null, 0, "hidden", "normal"],
    [undefined, 0, "hidden", "normal"],
    ["", 0, "hidden", "normal"],
  ])("returns count 0 + hidden for %j", (input, expectedCount, visibility, level) => {
    const s = getCharCountState(input);
    expect(s.count).toBe(expectedCount);
    expect(s.visibility).toBe(visibility);
    expect(s.level).toBe(level);
  });

  test("stays hidden just below the visibility threshold", () => {
    const s = getCharCountState("x".repeat(CHAR_COUNT_VISIBILITY_THRESHOLD - 1));
    expect(s.visibility).toBe("hidden");
    expect(s.level).toBe("normal");
  });

  test("becomes visible at exactly the visibility threshold", () => {
    const s = getCharCountState("x".repeat(CHAR_COUNT_VISIBILITY_THRESHOLD));
    expect(s.visibility).toBe("visible");
    expect(s.level).toBe("normal");
    expect(s.count).toBe(CHAR_COUNT_VISIBILITY_THRESHOLD);
  });

  test("stays 'normal' just below the warn threshold", () => {
    const s = getCharCountState("x".repeat(CHAR_COUNT_WARN_AT - 1));
    expect(s.level).toBe("normal");
  });

  test("flips to 'warn' at exactly the warn threshold", () => {
    const s = getCharCountState("x".repeat(CHAR_COUNT_WARN_AT));
    expect(s.level).toBe("warn");
  });

  test("stays 'warn' just below the danger threshold", () => {
    const s = getCharCountState("x".repeat(CHAR_COUNT_DANGER_AT - 1));
    expect(s.level).toBe("warn");
  });

  test("flips to 'danger' at exactly the danger threshold", () => {
    const s = getCharCountState("x".repeat(CHAR_COUNT_DANGER_AT));
    expect(s.level).toBe("danger");
  });

  test("stays 'danger' above the danger threshold", () => {
    const s = getCharCountState("x".repeat(CHAR_COUNT_DANGER_AT + 500));
    expect(s.level).toBe("danger");
  });

  test("display formats large counts with thousands separators (en-US)", () => {
    // Hardcoded oracle — earlier version used `.toLocaleString()` which was
    // the impl's own output (tautology). Node CI defaults to en-US so this
    // literal check is deterministic across CI environments.
    const s = getCharCountState("x".repeat(5001));
    expect(s.display).toBe("5,001");
  });

  test("honours custom opts overrides", () => {
    const s = getCharCountState("xxxxxxxxxx", {
      visibilityAt: 1,
      warnAt: 5,
      dangerAt: 8,
    });
    expect(s.visibility).toBe("visible");
    expect(s.level).toBe("danger");
  });

  test("counts unicode characters using string length (JS char units)", () => {
    // Emoji are surrogate pairs — length is 2 per emoji; documented behavior.
    const s = getCharCountState("👍👍👍");
    expect(s.count).toBe(6);
  });
});

// Invariant: the consumer-facing className map must cover every possible
// level getCharCountState can return. Guards against a future refactor
// where someone adds a new level without updating the map (qcheck L3).
describe("LEVEL_CLASS_NAME", () => {
  test("has an entry for every level getCharCountState can produce", () => {
    const producedLevels = new Set();
    producedLevels.add(getCharCountState("").level);                                        // normal
    producedLevels.add(getCharCountState("x".repeat(CHAR_COUNT_WARN_AT)).level);            // warn
    producedLevels.add(getCharCountState("x".repeat(CHAR_COUNT_DANGER_AT)).level);          // danger
    for (const level of producedLevels) {
      expect(LEVEL_CLASS_NAME).toHaveProperty(level);
      expect(typeof LEVEL_CLASS_NAME[level]).toBe("string");
    }
    // Map must have EXACTLY the produced levels — no dead entries, no gaps.
    expect(new Set(Object.keys(LEVEL_CLASS_NAME))).toEqual(producedLevels);
  });

  test("normal maps to empty string (chip stays base-styled)", () => {
    expect(LEVEL_CLASS_NAME.normal).toBe("");
  });
});
