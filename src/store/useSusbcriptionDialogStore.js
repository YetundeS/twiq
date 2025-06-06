import { create } from "zustand";

const useSusbcriptionDialogStore = create((set) => ({
  isSubOpen: false,
  isSubscribing: false,
  updateIsSubscribing: (val) => set({ isSubscribing: val }),
  openSubDialog: () => set({ isSubOpen: true }),
  closeSubDialog: () => set({ isSubOpen: false }),
}));


export default useSusbcriptionDialogStore;