import { describe, expect, test } from "vitest";
import { parseMessageIdFromHash, buildMessageAnchorHash } from "./messageHash";

describe("parseMessageIdFromHash", () => {
  test.each([
    ["", null],
    [null, null],
    [undefined, null],
    ["#", null],
    ["#foo", null],
    ["#message-", null],
    ["#message-42-extra", null],
    ["#message-abc", null],  // non-digit rejected
    ["message-42", null],    // missing leading '#'
  ])("returns null for %j", (input, expected) => {
    expect(parseMessageIdFromHash(input)).toBe(expected);
  });

  test.each([
    ["#message-1", "1"],
    ["#message-42", "42"],
    ["#message-9007199254740993", "9007199254740993"],  // bigint > MAX_SAFE_INTEGER
  ])("returns %j → id string for happy path %j", (input, expected) => {
    expect(parseMessageIdFromHash(input)).toBe(expected);
  });
});

describe("buildMessageAnchorHash", () => {
  test("returns the round-trip pair for a bigint id", () => {
    expect(buildMessageAnchorHash(42)).toBe("#message-42");
    expect(parseMessageIdFromHash(buildMessageAnchorHash(42))).toBe("42");
  });

  test("returns null on falsy id (invariant: caller must guard)", () => {
    expect(buildMessageAnchorHash(null)).toBe(null);
    expect(buildMessageAnchorHash(undefined)).toBe(null);
    expect(buildMessageAnchorHash("")).toBe(null);
  });
});
