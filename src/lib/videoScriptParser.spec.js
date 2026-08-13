import { describe, expect, test } from "vitest";
import { parseVideoScriptArtifact } from "./videoScriptParser.js";

// Ground-truth format verbatim from docs/coaches/video_scripts.md
// §"Example Script Output".
const CANONICAL_SCRIPT = `TWIQ Pillar: What to Do (W)
Theme: Time Management Hacks

Hook: "Want to stop feeling like you're running out of hours every day? Here's how to own your time."

Build-Up: "Most of us plan for what we want to do, but we forget to plan for distractions. Sound familiar? Life is messy, and our time management should reflect that."

Value: "Try the 70/30 rule. Block 70% of your day for essential tasks and leave 30% as a buffer for unexpected calls, emails, or emergencies. It's a game-changer for reducing stress and staying on track."

CTA: "Test it this week and let me know: how many hours did you reclaim? Drop your wins in the comments!"

Hashtags: #TimeManagement #ProductivityTips #WorkSmart #LifeHacks #FocusMode #OrganizedLiving #Efficiency`;

describe("parseVideoScriptArtifact — happy path", () => {
    test("returns 4 sections in canonical order for the ground-truth format", () => {
        const out = parseVideoScriptArtifact(CANONICAL_SCRIPT);
        expect(out).not.toBeNull();
        expect(out.sections).toHaveLength(4);
        expect(out.sections.map((s) => s.key)).toEqual([
            "hook", "build_up", "value", "cta",
        ]);
    });

    test("captures body text for each section", () => {
        const out = parseVideoScriptArtifact(CANONICAL_SCRIPT);
        expect(out.sections[0]).toEqual({
            index: 1,
            key: "hook",
            title: "Hook",
            body: '"Want to stop feeling like you\'re running out of hours every day? Here\'s how to own your time."',
        });
        expect(out.sections[3]).toEqual({
            index: 4,
            key: "cta",
            title: "CTA",
            body: '"Test it this week and let me know: how many hours did you reclaim? Drop your wins in the comments!"',
        });
    });

    test("captures the optional hashtags trailer", () => {
        const out = parseVideoScriptArtifact(CANONICAL_SCRIPT);
        expect(out.hashtags).toBe(
            "#TimeManagement #ProductivityTips #WorkSmart #LifeHacks #FocusMode #OrganizedLiving #Efficiency"
        );
    });
});

describe("parseVideoScriptArtifact — tolerant to LLM formatting drift", () => {
    test("recognises markdown-bolded labels (**Hook:**)", () => {
        const drifted = CANONICAL_SCRIPT.replace(
            /^(Hook|Build-Up|Value|CTA):/gm,
            "**$1:**"
        );
        const out = parseVideoScriptArtifact(drifted);
        expect(out).not.toBeNull();
        expect(out.sections[0].body).toContain("Want to stop feeling");
    });

    test("recognises 'Build Up' (no hyphen) as an alias for Build-Up", () => {
        const aliased = CANONICAL_SCRIPT.replace(/^Build-Up:/m, "Build Up:");
        const out = parseVideoScriptArtifact(aliased);
        expect(out).not.toBeNull();
        expect(out.sections[1].body).toContain("Most of us plan");
    });

    test("recognises emoji-prefixed labels (🎯 Hook:)", () => {
        const drifted = CANONICAL_SCRIPT.replace(/^Hook:/m, "🎯 Hook:");
        const out = parseVideoScriptArtifact(drifted);
        expect(out).not.toBeNull();
        expect(out.sections[0].body).toContain("Want to stop feeling");
    });

    test("hashtags null when the coach omits them entirely", () => {
        const noTags = CANONICAL_SCRIPT.replace(/^Hashtags:.*$/m, "");
        const out = parseVideoScriptArtifact(noTags);
        expect(out).not.toBeNull();
        expect(out.hashtags).toBeNull();
    });
});

describe("parseVideoScriptArtifact — false-positive rejection", () => {
    test("returns null for a generic prose reply with no section labels", () => {
        const prose = "Here's my thinking on short-form video. Hook the viewer fast, then deliver one clear insight. That's the whole game.";
        expect(parseVideoScriptArtifact(prose)).toBeNull();
    });

    test("returns null when only 2 of 4 canonical labels appear (below MIN_MATCHES)", () => {
        const stripped = CANONICAL_SCRIPT
            .replace(/^Value:.*$/m, "")
            .replace(/^CTA:.*$/m, "");
        expect(parseVideoScriptArtifact(stripped)).toBeNull();
    });

    test("returns a valid artifact when exactly 3 of 4 canonical labels appear (at MIN_MATCHES)", () => {
        const stripped = CANONICAL_SCRIPT.replace(/^CTA:.*$/m, "");
        const out = parseVideoScriptArtifact(stripped);
        expect(out).not.toBeNull();
        // Missing section renders as empty-body placeholder.
        expect(out.sections[3].body).toBe("");
    });
});

describe("parseVideoScriptArtifact — input guards", () => {
    test.each([
        ["null", null],
        ["undefined", undefined],
        ["empty string", ""],
        ["non-string", 42],
        ["object", {}],
    ])("returns null for %s input", (_label, input) => {
        expect(parseVideoScriptArtifact(input)).toBeNull();
    });
});
