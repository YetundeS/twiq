// stores/sidebarStore.js
import { create } from "zustand";

export const useSideBar = create((set) => ({
  isSidebarOpen: false,
  isMobileSidebarOpen: false,
  sidebarSessions: [],
  currentAssistantSlug: '',

  setIsSidebarOpen: (openState) =>
    set(() => ({
      isSidebarOpen: openState,
    })),

  setIsMobileSidebarOpen: (openState) =>
    set(() => ({
      isMobileSidebarOpen: openState,
    })),

  updateSideBarSessions: (newChatSessions) =>
    set(() => ({
      sidebarSessions: [...newChatSessions],
    })),

  addToSideBarSessions: (newChatSession) =>
    set((state) => {
      const exists = state.sidebarSessions.some(
        (chat) => chat.id === newChatSession.id
      );
      return exists
        ? {} // Prevent duplicates
        : {
            sidebarSessions: [newChatSession, ...state.sidebarSessions],
          };
    }),

  setCurrentAssistantSlug: (newAssistantSlug) =>
    set(() => ({
      currentAssistantSlug: newAssistantSlug,
    })),
}));
