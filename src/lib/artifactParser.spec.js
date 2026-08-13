import { describe, expect, test } from "vitest";
import { parseCarouselArtifact } from "./artifactParser.js";

// Real Carousel-coach output shape, verbatim from docs/coaches/carousel.md
// §"Example Carousel Output" — this is the ground-truth format the parser
// exists to recognise.
const CANONICAL_CAROUSEL = `Topic: Why "Post More" is Terrible Advice
TWIQ Pillar: Thought Leadership

Hook: What if posting more is the reason you're stuck?

Misstep: Everyone tells you to "just post every day" to grow

Pain Point: But you're exhausted, burnt out, and still hearing crickets

Tip 1: Posting more doesn't fix unclear messaging

Tip 2: Strategy beats volume—always

Tip 3: You don't need to say more, you need to say it better

Analogy: More noise ≠ more music. You're a symphony, not a siren

Mini Shift: When you're clear, you can do less and convert more

CTA: Tired of burnout content? Drop a 💡 if you're ready for clarity

Outro: @yourhandle | Authority over volume. Always.`;

describe("parseCarouselArtifact — happy path", () => {
    test("returns 10 slides in canonical order for the ground-truth format", () => {
        const out = parseCarouselArtifact(CANONICAL_CAROUSEL);
        expect(out).not.toBeNull();
        expect(out.slides).toHaveLength(10);
        expect(out.slides.map((s) => s.key)).toEqual([
            "hook", "misstep", "pain", "tip1", "tip2", "tip3",
            "analogy", "mini_shift", "cta", "outro",
        ]);
    });

    test("captures body text for each slide", () => {
        const out = parseCarouselArtifact(CANONICAL_CAROUSEL);
        expect(out.slides[0]).toEqual({
            index: 1,
            key: "hook",
            title: "Hook",
            body: "What if posting more is the reason you're stuck?",
        });
        expect(out.slides[9]).toEqual({
            index: 10,
            key: "outro",
            title: "Outro",
            body: "@yourhandle | Authority over volume. Always.",
        });
    });
});

describe("parseCarouselArtifact — tolerant to LLM formatting drift", () => {
    test("recognises markdown-bolded labels (**Hook:**)", () => {
        const drifted = CANONICAL_CAROUSEL.replace(/^(Hook|Misstep|Pain Point|Tip 1|Tip 2|Tip 3|Analogy|Mini Shift|CTA|Outro):/gm, "**$1:**");
        const out = parseCarouselArtifact(drifted);
        expect(out).not.toBeNull();
        expect(out.slides[0].body).toBe("What if posting more is the reason you're stuck?");
    });

    test("recognises markdown-heading labels (## Hook:)", () => {
        const drifted = CANONICAL_CAROUSEL.replace(/^(Hook|Misstep|Pain Point|Tip 1|Tip 2|Tip 3|Analogy|Mini Shift|CTA|Outro):/gm, "## $1:");
        const out = parseCarouselArtifact(drifted);
        expect(out).not.toBeNull();
        expect(out.slides[0].body).toBe("What if posting more is the reason you're stuck?");
    });

    test("recognises emoji-prefixed labels (✍🏽 Hook:)", () => {
        const drifted = CANONICAL_CAROUSEL
            .replace(/^Hook:/m, "✍🏽 Hook:")
            .replace(/^CTA:/m, "🎯 CTA:");
        const out = parseCarouselArtifact(drifted);
        expect(out).not.toBeNull();
        // Emoji-prefixed slides still capture the correct body.
        expect(out.slides[0].body).toBe("What if posting more is the reason you're stuck?");
        expect(out.slides[8].body).toBe("Tired of burnout content? Drop a 💡 if you're ready for clarity");
    });

    test("recognises label aliases: 'Call to action' → CTA", () => {
        const aliased = CANONICAL_CAROUSEL.replace(/^CTA:/m, "Call to action:");
        const out = parseCarouselArtifact(aliased);
        expect(out).not.toBeNull();
        expect(out.slides[8].body).toBe("Tired of burnout content? Drop a 💡 if you're ready for clarity");
    });
});

describe("parseCarouselArtifact — false-positive rejection", () => {
    test("returns null for a generic prose reply with no slide labels", () => {
        const prose = "Here's my thinking on Instagram carousels. Consistency matters, but strategy matters more. Post with intent, not just to fill a slot.";
        expect(parseCarouselArtifact(prose)).toBeNull();
    });

    test("returns null when only 7 of 10 canonical labels appear (below MIN_MATCHES)", () => {
        // Strip 3 slides — parser should reject rather than emit a
        // half-built artifact.
        const stripped = CANONICAL_CAROUSEL
            .replace(/^Analogy:.*$/m, "")
            .replace(/^Mini Shift:.*$/m, "")
            .replace(/^Outro:.*$/m, "");
        expect(parseCarouselArtifact(stripped)).toBeNull();
    });

    test("returns a valid artifact when exactly 8 of 10 canonical labels appear (at MIN_MATCHES)", () => {
        const stripped = CANONICAL_CAROUSEL
            .replace(/^Outro:.*$/m, "")
            .replace(/^Analogy:.*$/m, "");
        const out = parseCarouselArtifact(stripped);
        expect(out).not.toBeNull();
        // Missing slides render as empty-body placeholders so the panel
        // still shows a 10-slot grid.
        expect(out.slides[6].body).toBe(""); // analogy
        expect(out.slides[9].body).toBe(""); // outro
    });
});

describe("parseCarouselArtifact — input guards", () => {
    test.each([
        ["null", null],
        ["undefined", undefined],
        ["empty string", ""],
        ["non-string", 42],
        ["object", {}],
    ])("returns null for %s input", (_label, input) => {
        expect(parseCarouselArtifact(input)).toBeNull();
    });
});
