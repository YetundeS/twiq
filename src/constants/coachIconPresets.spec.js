import { describe, expect, it } from "vitest";
import { ICON_PRESETS, resolveCoachIcon } from "./coachIconPresets";

describe("resolveCoachIcon", () => {
  it.each([
    [null],
    [undefined],
    [""],
    [123],
    [{}],
  ])("returns { kind: 'none' } for falsy or non-string input: %s", (input) => {
    expect(resolveCoachIcon(input)).toEqual({ kind: "none" });
  });

  it("returns { kind: 'lucide', Icon, key, label } for a known preset key", () => {
    const known = ICON_PRESETS[0];
    const result = resolveCoachIcon(`lucide:${known.key}`);
    expect(result).toEqual({
      kind: "lucide",
      Icon: known.Icon,
      key: known.key,
      label: known.label,
    });
  });

  it("returns { kind: 'none' } for a lucide: prefix pointing at a non-preset key", () => {
    // A key that isn't in the curated set — e.g. an admin poked a rogue value
    // via API. Never render an uncurated icon; fall back to the caller's
    // default so the visual language stays consistent.
    expect(resolveCoachIcon("lucide:NotACuratedIcon")).toEqual({ kind: "none" });
  });

  it.each([
    "https://cdn.example.com/x.png",
    "http://cdn.example.com/x.png",
    "/images/model_icons/carousel_light.png",
  ])("returns { kind: 'image', src } for legacy URL value: %s", (url) => {
    expect(resolveCoachIcon(url)).toEqual({ kind: "image", src: url });
  });

  it("returns { kind: 'none' } for arbitrary strings that are neither preset nor URL", () => {
    // Defence against a stale/misformatted DB value. If someone stored a raw
    // filename, don't gamble on rendering it — fall back cleanly.
    expect(resolveCoachIcon("carousel_light.png")).toEqual({ kind: "none" });
  });
});

describe("ICON_PRESETS", () => {
  it("contains only unique keys", () => {
    const keys = ICON_PRESETS.map((p) => p.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("each preset has a truthy Icon component and non-empty label", () => {
    for (const p of ICON_PRESETS) {
      expect(p.Icon).toBeTruthy();
      expect(typeof p.label).toBe("string");
      expect(p.label.length).toBeGreaterThan(0);
    }
  });
});
