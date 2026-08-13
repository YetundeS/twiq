// Artifact panel state (Phase 3 track 3 MVP). One store per concern
// (§D-2). Read-only in MVP — `activeArtifact` is set by the "View as
// carousel" button and cleared when the panel closes.

import { create } from "zustand";

/**
 * @typedef {Object} ArtifactPayload
 * @property {"carousel"} kind — artifact type discriminator (only "carousel" in MVP)
 * @property {string | null} sourceMessageId — chat_messages.id the artifact came from (or null on optimistic rows)
 * @property {string} title — human title for the panel header (usually the coach display name)
 * @property {import("@/lib/artifactParser").parseCarouselArtifact["slides"]} slides
 */

const useArtifactStore = create((set) => ({
    /** @type {ArtifactPayload | null} */
    activeArtifact: null,

    /**
     * Open the panel with a specific artifact payload. Replaces whatever
     * was previously shown — the panel is single-artifact by design.
     * @param {ArtifactPayload} payload
     */
    open: (payload) => set({ activeArtifact: payload }),

    /** Close the panel and drop the payload. */
    close: () => set({ activeArtifact: null }),
}));

export default useArtifactStore;
