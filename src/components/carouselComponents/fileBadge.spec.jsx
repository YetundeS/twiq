import { describe, expect, test } from "vitest";
import { getFileIcon } from "./fileBadge";

// The shared-view backend (services/sessionShareService.js:63-65) strips
// linkedFiles down to `{ name }` only for public viewers — so the FE
// receives file rows with `type === undefined`. The pre-fix version of
// getFileIcon called `type.startsWith(...)` directly and crashed the
// whole shared page. These tests lock the null-safety guard in.

describe("getFileIcon", () => {
  test("does not throw when type is undefined (shared-view row shape)", () => {
    expect(() => getFileIcon(undefined)).not.toThrow();
    expect(getFileIcon(undefined)).toBeTruthy();
  });

  test("does not throw when type is null", () => {
    expect(() => getFileIcon(null)).not.toThrow();
    expect(getFileIcon(null)).toBeTruthy();
  });

  test("does not throw when type is an empty string", () => {
    expect(() => getFileIcon("")).not.toThrow();
    expect(getFileIcon("")).toBeTruthy();
  });

  test("returns an element for a known image mime type", () => {
    expect(getFileIcon("image/png")).toBeTruthy();
  });

  test("returns an element for a known document mime type", () => {
    expect(getFileIcon("application/pdf")).toBeTruthy();
  });

  test("returns an element for an unknown mime type (fallback path)", () => {
    expect(getFileIcon("application/octet-stream")).toBeTruthy();
  });
});
