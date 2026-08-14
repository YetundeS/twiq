import { describe, expect, test, beforeEach } from "vitest";
import useArtifactStore from "./useArtifactStore.js";

const SAMPLE = {
    kind: "carousel",
    sourceMessageId: "42",
    title: "Carousel",
    slides: [
        { index: 1, key: "hook", title: "Hook", body: "..." },
    ],
};

beforeEach(() => {
    useArtifactStore.setState({ activeArtifact: null });
});

describe("useArtifactStore", () => {
    test("starts with no active artifact", () => {
        expect(useArtifactStore.getState().activeArtifact).toBeNull();
    });

    test("open(payload) sets activeArtifact to that payload", () => {
        useArtifactStore.getState().open(SAMPLE);
        expect(useArtifactStore.getState().activeArtifact).toEqual(SAMPLE);
    });

    test("close() clears activeArtifact back to null", () => {
        useArtifactStore.getState().open(SAMPLE);
        useArtifactStore.getState().close();
        expect(useArtifactStore.getState().activeArtifact).toBeNull();
    });
});
