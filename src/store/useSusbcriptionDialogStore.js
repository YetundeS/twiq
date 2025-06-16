import { create } from "zustand";

const useSusbcriptionDialogStore = create((set) => ({
  isSubOpen: false,
  subscribingPlanId: null,
  setSubscribingPlanId: (val) => set({ subscribingPlanId: val }),
  openSubDialog: () => set({ isSubOpen: true }),
  closeSubDialog: () => set({ isSubOpen: false }),
}));


export default useSusbcriptionDialogStore;