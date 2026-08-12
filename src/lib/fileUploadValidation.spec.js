import { describe, expect, test } from "vitest";
import {
  validateFilesForUpload,
  DEFAULT_MAX_FILES,
  DEFAULT_MAX_SIZE,
  DEFAULT_ALLOWED_TYPES,
} from "./fileUploadValidation";

// Small helper — mimic the File constructor shape well enough for validation.
// We only need `name`, `size`, and `type`.
function makeFile({ name = "x.pdf", size = 1024, type = "application/pdf" } = {}) {
  return { name, size, type };
}

describe("validateFilesForUpload", () => {
  test("accepts a fresh valid file on an empty existing list", () => {
    const f = makeFile();
    const out = validateFilesForUpload([f], []);
    expect(out.accepted).toEqual([f]);
    expect(out.rejections).toEqual([]);
  });

  test("rejects a file above the size limit", () => {
    const f = makeFile({ size: DEFAULT_MAX_SIZE + 1 });
    const out = validateFilesForUpload([f], []);
    expect(out.accepted).toEqual([]);
    expect(out.rejections).toHaveLength(1);
    expect(out.rejections[0].reason).toBe("too_large");
  });

  test("rejects a file with an unsupported MIME type", () => {
    const f = makeFile({ type: "application/x-msdownload", name: "evil.exe" });
    const out = validateFilesForUpload([f], []);
    expect(out.accepted).toEqual([]);
    expect(out.rejections[0].reason).toBe("unsupported_type");
  });

  test("rejects a duplicate (matching name AND size) against existing files", () => {
    const existing = [makeFile({ name: "doc.pdf", size: 500 })];
    const dup = makeFile({ name: "doc.pdf", size: 500 });
    const out = validateFilesForUpload([dup], existing);
    expect(out.accepted).toEqual([]);
    expect(out.rejections[0].reason).toBe("duplicate");
  });

  test("does NOT reject a same-name-different-size file as duplicate", () => {
    const existing = [makeFile({ name: "doc.pdf", size: 500 })];
    const different = makeFile({ name: "doc.pdf", size: 800 });
    const out = validateFilesForUpload([different], existing);
    expect(out.accepted).toEqual([different]);
  });

  test("stops accepting once existing + accepted crosses max files", () => {
    const existing = Array.from({ length: 3 }, (_, i) => makeFile({ name: `a${i}.pdf`, size: 100 + i }));
    const incoming = Array.from({ length: 4 }, (_, i) => makeFile({ name: `b${i}.pdf`, size: 200 + i }));
    const out = validateFilesForUpload(incoming, existing);
    // Existing count = 3; max = 5 → only 2 of the incoming should fit.
    expect(out.accepted).toHaveLength(DEFAULT_MAX_FILES - existing.length);
    // Remaining rejections are 'max_files' hits.
    const overflow = out.rejections.filter((r) => r.reason === "max_files");
    expect(overflow.length).toBeGreaterThan(0);
  });

  test("skips a duplicate but keeps counting the next valid one", () => {
    const existing = [makeFile({ name: "keep.pdf", size: 500 })];
    const incoming = [
      makeFile({ name: "keep.pdf", size: 500 }),  // dup — rejected
      makeFile({ name: "fresh.pdf", size: 700 }), // accepted
    ];
    const out = validateFilesForUpload(incoming, existing);
    expect(out.accepted).toEqual([incoming[1]]);
    expect(out.rejections).toHaveLength(1);
    expect(out.rejections[0].reason).toBe("duplicate");
  });

  test("accepts any DEFAULT_ALLOWED_TYPES entry (parameterized)", () => {
    for (const t of DEFAULT_ALLOWED_TYPES) {
      const f = makeFile({ type: t, name: `f-${t}` });
      const out = validateFilesForUpload([f], []);
      expect(out.accepted, `type=${t}`).toEqual([f]);
    }
  });

  test("respects custom opts overrides (max files=1)", () => {
    const existing = [makeFile({ name: "a.pdf", size: 100 })];
    const incoming = [makeFile({ name: "b.pdf", size: 200 })];
    const out = validateFilesForUpload(incoming, existing, { maxFiles: 1 });
    expect(out.accepted).toEqual([]);
    expect(out.rejections[0].reason).toBe("max_files");
  });
});
