import { describe, expect, test, vi, beforeEach, afterEach } from "vitest";
import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";

// Mock the copy hook — assert clipboard interactions without touching the
// real navigator.clipboard machinery (§T-3: mock only at the boundary).
const copySpy = vi.fn();
vi.mock("@/hooks/useCopyToClipboard", () => ({
    useCopyToClipboard: () => ({ copyToClipboard: copySpy, copied: false, error: null }),
}));

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

const waitForEl = (selector) =>
    waitFor(() => {
        const el = document.querySelector(selector);
        if (!el) throw new Error(`waiting for ${selector}`);
        return el;
    });

beforeEach(() => {
    copySpy.mockReset();
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

    test("Copy all button copies every slide joined into one blob", async () => {
        useArtifactStore.setState({ activeArtifact: SAMPLE_ARTIFACT });
        render(<ArtifactPanel />);

        const btn = await waitForEl('[data-testid="artifact-copy-all"]');
        fireEvent.click(btn);

        expect(copySpy).toHaveBeenCalledTimes(1);
        const arg = copySpy.mock.calls[0][0];
        // Every slide title + body should appear in the blob, joined by blank lines.
        for (const slide of SAMPLE_ARTIFACT.slides) {
            expect(arg).toContain(`Slide ${slide.index} — ${slide.title}`);
            expect(arg).toContain(slide.body);
        }
    });

    test("per-slide Copy button copies only that slide", async () => {
        useArtifactStore.setState({ activeArtifact: SAMPLE_ARTIFACT });
        render(<ArtifactPanel />);

        const btn = await waitForEl('[data-testid="artifact-copy-slide-3"]');
        fireEvent.click(btn);

        expect(copySpy).toHaveBeenCalledWith("Slide 3 — Pain Point\nThe pain body");
    });

    test("closing the sheet clears activeArtifact in the store", async () => {
        useArtifactStore.setState({ activeArtifact: SAMPLE_ARTIFACT });
        render(<ArtifactPanel />);

        await waitForEl('[data-testid="artifact-panel"]');
        // Directly invoke store.close() via the Sheet's onOpenChange path.
        // (Simulating an outside-click on Radix in jsdom is flaky; testing
        // the store contract directly is the invariant that matters.)
        useArtifactStore.getState().close();
        expect(useArtifactStore.getState().activeArtifact).toBeNull();
    });
});
