// stores/sidebarStore.js
import { create } from "zustand";

export const useSideBar = create((set) => ({
  isSidebarOpen: true,

  setIsSidebarOpen: (openState) =>
    set(() => ({
      isSidebarOpen: openState,
    })),
}));
