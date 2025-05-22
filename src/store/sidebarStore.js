// stores/sidebarStore.js
import { create } from "zustand";

export const useSideBar = create((set) => ({
  isSidebarOpen: false,

  setIsSidebarOpen: (openState) =>
    set(() => ({
      isSidebarOpen: openState,
    })),
}));
