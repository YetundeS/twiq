import { describe, expect, test } from "vitest";
import {
  getCharCountState,
  CHAR_COUNT_VISIBILITY_THRESHOLD,
  CHAR_COUNT_WARN_AT,
  CHAR_COUNT_DANGER_AT,
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

  test("display uses locale grouping (comma separators)", () => {
    const s = getCharCountState("x".repeat(5001));
    expect(s.display).toBe((5001).toLocaleString());
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
