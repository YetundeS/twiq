// Artifact panel state (Phase 3 track 3 MVP). One store per concern
// (§D-2). Read-only in MVP — `activeArtifact` is set by the "View as
// carousel" button and cleared when the panel closes.

import { create } from "zustand";

/**
 * @typedef {Object} ArtifactPayload
 * @property {"carousel" | "video_script" | "linkedin_post"} kind — artifact type discriminator
 * @property {string | null} sourceMessageId — chat_messages.id the artifact came from (or null on optimistic rows)
 * @property {string} title — human title for the panel header
 * @property {Array<{index: number, key: string, title: string, body: string}>} [slides] — carousel only
 * @property {Array<{index: number, key: string, title: string, body: string}>} [sections] — video_script only
 * @property {string | null} [hashtags] — video_script only; the coach's trailing hashtags line
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
