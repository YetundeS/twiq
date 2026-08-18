import { describe, expect, test } from "vitest";
import { canAccessCoach } from "./useCoaches";

// canAccessCoach is the data-driven replacement for the older
// hardcoded starterModels/proModels lists in components/appSideBar/index.jsx.
// It gates whether a user's plan is in the coach's allowed_plans array.
// Wrong behavior here means either (a) users see crowns on coaches they
// should access (upsell blocking their own subscribers) or (b) the reverse
// (Starter users appear to have Pro access — leaks the upsell). Both bad.

describe("canAccessCoach", () => {
  const proCoach = {
    slug: "carousel",
    allowed_plans: ["PRO", "ENTERPRISE"],
  };
  const starterCoach = {
    slug: "storyteller",
    allowed_plans: ["STARTER", "PRO", "ENTERPRISE"],
  };

  test("returns true when user's plan is in allowed_plans (exact case)", () => {
    expect(canAccessCoach("PRO", proCoach)).toBe(true);
  });

  test("case-insensitive on the user's plan input", () => {
    expect(canAccessCoach("pro", proCoach)).toBe(true);
    expect(canAccessCoach("Pro", proCoach)).toBe(true);
    expect(canAccessCoach("PRO", proCoach)).toBe(true);
  });

  test("case-insensitive on the stored allowed_plans values too", () => {
    // Defensive against a future migration that stores plans lowercase.
    const oddCoach = { slug: "x", allowed_plans: ["pro", "enterprise"] };
    expect(canAccessCoach("PRO", oddCoach)).toBe(true);
  });

  test("returns false when user's plan is NOT in allowed_plans", () => {
    expect(canAccessCoach("STARTER", proCoach)).toBe(false);
  });

  test("returns true for the Starter user on a Starter-eligible coach", () => {
    expect(canAccessCoach("STARTER", starterCoach)).toBe(true);
  });

  test("returns false when userPlan is missing / empty / null", () => {
    expect(canAccessCoach(null, proCoach)).toBe(false);
    expect(canAccessCoach(undefined, proCoach)).toBe(false);
    expect(canAccessCoach("", proCoach)).toBe(false);
  });

  test("returns false when coach is missing / null", () => {
    expect(canAccessCoach("PRO", null)).toBe(false);
    expect(canAccessCoach("PRO", undefined)).toBe(false);
  });

  test("returns false when coach has no allowed_plans field", () => {
    expect(canAccessCoach("PRO", { slug: "broken" })).toBe(false);
  });

  test("returns false when allowed_plans is an empty array", () => {
    expect(canAccessCoach("PRO", { slug: "locked", allowed_plans: [] })).toBe(
      false,
    );
  });

  test("returns false when allowed_plans contains only unrecognized plans", () => {
    // Malformed data shouldn't grant access — a coach with allowed_plans
    // = ['FREE'] (unknown tier) should be inaccessible to everyone, not
    // fall through to true.
    expect(canAccessCoach("PRO", { slug: "x", allowed_plans: ["FREE"] })).toBe(
      false,
    );
  });
});
