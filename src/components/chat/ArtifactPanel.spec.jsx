import { describe, expect, test, vi, beforeEach, afterEach } from "vitest";
import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";

// §T-3: mock only at the true external boundary. useCopyToClipboard is
// our own module (has its own spec); the real external surface is
// navigator.clipboard.writeText. Shim it per-test so we assert the
// contract the browser actually sees.

const { default: ArtifactPanel } = await import("./ArtifactPanel");
const { default: useArtifactStore } = await import("@/store/useArtifactStore");

const SAMPLE_ARTIFACT = {
    kind: "carousel",
    sourceMessageId: "42",
    title: "Carousel",
    slides: [
        { index: 1, key: "hook", title: "Hook", body: "The hook body" },
        { index: 2, key: "misstep", title: "Common Misstep", body: "The misstep body" },
        { index: 3, key: "pain", title: "Pain Point", body: "The pain body" },
        { index: 4, key: "tip1", title: "Tip 1", body: "Tip one body" },
        { index: 5, key: "tip2", title: "Tip 2", body: "Tip two body" },
        { index: 6, key: "tip3", title: "Tip 3", body: "Tip three body" },
        { index: 7, key: "analogy", title: "Analogy", body: "The analogy body" },
        { index: 8, key: "mini_shift", title: "Mini Shift", body: "The shift body" },
        { index: 9, key: "cta", title: "CTA", body: "The CTA body" },
        { index: 10, key: "outro", title: "Outro", body: "The outro body" },
    ],
};

const SAMPLE_VIDEO_SCRIPT = {
    kind: "video_script",
    sourceMessageId: "43",
    title: "Video script",
    sections: [
        { index: 1, key: "hook",     title: "Hook",     body: "The hook line" },
        { index: 2, key: "build_up", title: "Build-Up", body: "The build-up paragraph" },
        { index: 3, key: "value",    title: "Value",    body: "The value paragraph" },
        { index: 4, key: "cta",      title: "CTA",      body: "The CTA line" },
    ],
    hashtags: "#foo #bar #baz",
};

const SAMPLE_LINKEDIN_POST = {
    kind: "linkedin_post",
    sourceMessageId: "44",
    title: "LinkedIn post",
    sections: [
        { index: 1, key: "hook",      title: "Hook",      body: "The hook line" },
        { index: 2, key: "main_body", title: "Main Body", body: "Paragraph one.\n\nParagraph two." },
        { index: 3, key: "cta",       title: "CTA",       body: "The CTA line" },
    ],
};

const waitForEl = (selector) =>
    waitFor(() => {
        const el = document.querySelector(selector);
        if (!el) throw new Error(`waiting for ${selector}`);
        return el;
    });

beforeEach(() => {
    // Fresh clipboard spy per test — useCopyToClipboard reads
    // navigator.clipboard at call time so redefining here is safe.
    Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
    useArtifactStore.setState({ activeArtifact: null });
});

afterEach(() => {
    cleanup();
    useArtifactStore.setState({ activeArtifact: null });
});

describe("ArtifactPanel", () => {
    test("renders nothing visible when there is no active artifact", () => {
        render(<ArtifactPanel />);
        expect(document.querySelector('[data-testid="artifact-panel"]')).toBeNull();
    });

    test("renders all 10 slide cards when an artifact is active", async () => {
        useArtifactStore.setState({ activeArtifact: SAMPLE_ARTIFACT });
        render(<ArtifactPanel />);

        // Sheet renders via portal — wait for the panel then count slides.
        await waitForEl('[data-testid="artifact-panel"]');
        const slides = document.querySelectorAll('[data-testid^="artifact-slide-"]');
        expect(slides.length).toBe(10);
    });

    test("Copy all button writes every slide joined into one blob to the clipboard", async () => {
        useArtifactStore.setState({ activeArtifact: SAMPLE_ARTIFACT });
        render(<ArtifactPanel />);

        const btn = await waitForEl('[data-testid="artifact-copy-all"]');
        fireEvent.click(btn);

        await waitFor(() =>
            expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1)
        );
        const arg = navigator.clipboard.writeText.mock.calls[0][0];
        // Every slide title + body should appear in the blob, joined by blank lines.
        for (const slide of SAMPLE_ARTIFACT.slides) {
            expect(arg).toContain(`Slide ${slide.index} — ${slide.title}`);
            expect(arg).toContain(slide.body);
        }
    });

    test("per-slide Copy button writes only that slide to the clipboard", async () => {
        useArtifactStore.setState({ activeArtifact: SAMPLE_ARTIFACT });
        render(<ArtifactPanel />);

        const btn = await waitForEl('[data-testid="artifact-copy-slide-3"]');
        fireEvent.click(btn);

        await waitFor(() =>
            expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
                "Slide 3 — Pain Point\nThe pain body"
            )
        );
    });

    test("store.close() unmounts the sheet contents", async () => {
        useArtifactStore.setState({ activeArtifact: SAMPLE_ARTIFACT });
        render(<ArtifactPanel />);

        // Sheet is mounted with slides while activeArtifact is set…
        await waitForEl('[data-testid="artifact-panel"]');

        // …and closing the store clears both the store state AND the DOM.
        // (Radix's outside-click close path is flaky in jsdom; asserting
        // that the store→DOM contract holds is the invariant that matters
        // — the Sheet's own onOpenChange wiring is one line and easy to
        // eyeball verify.)
        useArtifactStore.getState().close();
        await waitFor(() =>
            expect(document.querySelector('[data-testid="artifact-panel"]')).toBeNull()
        );
    });

    // -------------------------------------------------------------------------
    // Video-script kind — same panel, different body renderer.
    // -------------------------------------------------------------------------

    test("renders 4 section cards + a hashtags footer for a video_script artifact", async () => {
        useArtifactStore.setState({ activeArtifact: SAMPLE_VIDEO_SCRIPT });
        render(<ArtifactPanel />);

        const panel = await waitForEl('[data-testid="artifact-panel"]');
        expect(panel.getAttribute("data-artifact-kind")).toBe("video_script");
        expect(document.querySelectorAll('[data-testid^="artifact-section-"]').length).toBe(4);
        expect(document.querySelector('[data-testid="artifact-hashtags"]')).not.toBeNull();
    });

    test("hashtags footer is hidden when the video_script artifact has no hashtags", async () => {
        useArtifactStore.setState({
            activeArtifact: { ...SAMPLE_VIDEO_SCRIPT, hashtags: null },
        });
        render(<ArtifactPanel />);

        await waitForEl('[data-testid="artifact-panel"]');
        expect(document.querySelector('[data-testid="artifact-hashtags"]')).toBeNull();
    });

    test("Copy full script writes every section + hashtags to the clipboard", async () => {
        useArtifactStore.setState({ activeArtifact: SAMPLE_VIDEO_SCRIPT });
        render(<ArtifactPanel />);

        const btn = await waitForEl('[data-testid="artifact-copy-all"]');
        fireEvent.click(btn);

        await waitFor(() =>
            expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1)
        );
        const arg = navigator.clipboard.writeText.mock.calls[0][0];
        for (const section of SAMPLE_VIDEO_SCRIPT.sections) {
            expect(arg).toContain(section.title);
            expect(arg).toContain(section.body);
        }
        expect(arg).toContain("Hashtags: #foo #bar #baz");
    });

    test("per-section Copy button writes only that section to the clipboard", async () => {
        useArtifactStore.setState({ activeArtifact: SAMPLE_VIDEO_SCRIPT });
        render(<ArtifactPanel />);

        const btn = await waitForEl('[data-testid="artifact-copy-section-3"]');
        fireEvent.click(btn);

        await waitFor(() =>
            expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
                "Value\nThe value paragraph"
            )
        );
    });

    test("Copy hashtags button writes only the hashtags line", async () => {
        useArtifactStore.setState({ activeArtifact: SAMPLE_VIDEO_SCRIPT });
        render(<ArtifactPanel />);

        const btn = await waitForEl('[data-testid="artifact-copy-hashtags"]');
        fireEvent.click(btn);

        await waitFor(() =>
            expect(navigator.clipboard.writeText).toHaveBeenCalledWith("#foo #bar #baz")
        );
    });

    // -------------------------------------------------------------------------
    // LinkedIn post kind — reuses the sections renderer, no hashtags footer.
    // -------------------------------------------------------------------------

    test("renders 3 section cards + NO hashtags footer for a linkedin_post artifact", async () => {
        useArtifactStore.setState({ activeArtifact: SAMPLE_LINKEDIN_POST });
        render(<ArtifactPanel />);

        const panel = await waitForEl('[data-testid="artifact-panel"]');
        expect(panel.getAttribute("data-artifact-kind")).toBe("linkedin_post");
        expect(document.querySelectorAll('[data-testid^="artifact-section-"]').length).toBe(3);
        // LinkedIn posts don't carry hashtags — footer must NOT render even
        // though the SectionsArtifactBody renderer is capable of showing one.
        expect(document.querySelector('[data-testid="artifact-hashtags"]')).toBeNull();
    });

    test("Copy full post writes every section joined into one blob", async () => {
        useArtifactStore.setState({ activeArtifact: SAMPLE_LINKEDIN_POST });
        render(<ArtifactPanel />);

        const btn = await waitForEl('[data-testid="artifact-copy-all"]');
        fireEvent.click(btn);

        await waitFor(() =>
            expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1)
        );
        const arg = navigator.clipboard.writeText.mock.calls[0][0];
        for (const section of SAMPLE_LINKEDIN_POST.sections) {
            expect(arg).toContain(section.title);
            expect(arg).toContain(section.body);
        }
        // No hashtags trailer for linkedin_post.
        expect(arg).not.toContain("Hashtags:");
    });

    test("per-section Copy button on linkedin_post writes only that section", async () => {
        useArtifactStore.setState({ activeArtifact: SAMPLE_LINKEDIN_POST });
        render(<ArtifactPanel />);

        const btn = await waitForEl('[data-testid="artifact-copy-section-2"]');
        fireEvent.click(btn);

        await waitFor(() =>
            expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
                "Main Body\nParagraph one.\n\nParagraph two."
            )
        );
    });
});
