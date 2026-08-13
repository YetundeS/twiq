import { describe, expect, test } from "vitest";
import { parseLinkedinPostArtifact } from "./linkedinPostParser.js";

// Ground-truth format verbatim from docs/coaches/linkedin_business.md
// §"Example Post Output". Note: labels on their own line, bodies on the
// following lines. Main Body is multi-paragraph.
const CANONICAL_POST = `TWIQ Pillar: Thought Leadership (T)
Topic: Why Busy ≠ Productive

Hook:
"Most companies celebrate being busy. But here's the truth: busy doesn't equal progress."

Main Body:
"For years, our team equated long hours with success. Endless meetings, packed schedules, and back-to-back deadlines became the norm. But here's what we learned: Being busy often creates the illusion of progress. Real growth happens when you focus on the right priorities.

Here's how we changed our approach:

Cut ruthlessly: We analyzed every project and asked, 'Does this align with our strategic goals?' If not, it was shelved.
Time-block priorities: Critical projects got dedicated focus time on the calendar.
Encourage breaks: We started prioritizing recovery time for our team."

CTA:
"How does your company prioritize impact over busyness? Share your thoughts below."`;

describe("parseLinkedinPostArtifact — happy path (label-on-own-line block format)", () => {
    test("returns 3 sections in canonical order for the ground-truth format", () => {
        const out = parseLinkedinPostArtifact(CANONICAL_POST);
        expect(out).not.toBeNull();
        expect(out.sections).toHaveLength(3);
        expect(out.sections.map((s) => s.key)).toEqual(["hook", "main_body", "cta"]);
    });

    test("captures the single-line Hook body", () => {
        const out = parseLinkedinPostArtifact(CANONICAL_POST);
        expect(out.sections[0].body).toBe(
            '"Most companies celebrate being busy. But here\'s the truth: busy doesn\'t equal progress."'
        );
    });

    test("captures the multi-paragraph Main Body verbatim", () => {
        const out = parseLinkedinPostArtifact(CANONICAL_POST);
        // Multi-paragraph body — must preserve blank lines between paragraphs.
        expect(out.sections[1].body).toContain("For years, our team equated long hours");
        expect(out.sections[1].body).toContain("Cut ruthlessly:");
        expect(out.sections[1].body).toContain("Encourage breaks:");
        // Blank line between paragraphs preserved.
        expect(out.sections[1].body).toMatch(/\n\n/);
    });

    test("captures the CTA body", () => {
        const out = parseLinkedinPostArtifact(CANONICAL_POST);
        expect(out.sections[2].body).toBe(
            '"How does your company prioritize impact over busyness? Share your thoughts below."'
        );
    });
});

describe("parseLinkedinPostArtifact — also tolerates same-line body format", () => {
    test("recognises Hook: body on the same line (LLM collapse variant)", () => {
        const inline = `Hook: "Tight hook."

Main Body:
"Some paragraph."

CTA: "Tight CTA."`;
        const out = parseLinkedinPostArtifact(inline);
        expect(out).not.toBeNull();
        expect(out.sections[0].body).toBe('"Tight hook."');
        expect(out.sections[1].body).toBe('"Some paragraph."');
        expect(out.sections[2].body).toBe('"Tight CTA."');
    });
});

describe("parseLinkedinPostArtifact — tolerant to LLM formatting drift", () => {
    test("recognises markdown-bolded labels (**Hook:**)", () => {
        const drifted = CANONICAL_POST
            .replace(/^Hook:$/m, "**Hook:**")
            .replace(/^Main Body:$/m, "**Main Body:**")
            .replace(/^CTA:$/m, "**CTA:**");
        const out = parseLinkedinPostArtifact(drifted);
        expect(out).not.toBeNull();
        expect(out.sections[0].body).toContain("Most companies celebrate");
    });

    test("recognises heading-style labels (## Hook)", () => {
        const drifted = CANONICAL_POST
            .replace(/^Hook:$/m, "## Hook:")
            .replace(/^Main Body:$/m, "## Main Body:")
            .replace(/^CTA:$/m, "## CTA:");
        const out = parseLinkedinPostArtifact(drifted);
        expect(out).not.toBeNull();
        expect(out.sections[0].body).toContain("Most companies celebrate");
    });

    test("recognises 'Body' as alias for 'Main Body'", () => {
        const aliased = CANONICAL_POST.replace(/^Main Body:$/m, "Body:");
        const out = parseLinkedinPostArtifact(aliased);
        expect(out).not.toBeNull();
        expect(out.sections[1].body).toContain("For years, our team");
    });
});

describe("parseLinkedinPostArtifact — false-positive rejection", () => {
    test("returns null for a generic prose reply with no labels", () => {
        const prose = "Here's my take on LinkedIn posts. Open strong, deliver value, end with a question. That's the whole game.";
        expect(parseLinkedinPostArtifact(prose)).toBeNull();
    });

    test("returns null when only Hook + CTA are present (below MIN_MATCHES=3)", () => {
        // Missing Main Body — the load-bearing section. Refuse rather
        // than render a hollow post.
        const partial = `Hook: "Hi"\n\nCTA: "Bye"`;
        expect(parseLinkedinPostArtifact(partial)).toBeNull();
    });

    test("returns null when Main Body is present but Hook + CTA are missing", () => {
        const partial = `Main Body:\n"Some paragraph."`;
        expect(parseLinkedinPostArtifact(partial)).toBeNull();
    });
});

describe("parseLinkedinPostArtifact — input guards", () => {
    test.each([
        ["null", null],
        ["undefined", undefined],
        ["empty string", ""],
        ["non-string", 42],
        ["object", {}],
    ])("returns null for %s input", (_label, input) => {
        expect(parseLinkedinPostArtifact(input)).toBeNull();
    });
});
