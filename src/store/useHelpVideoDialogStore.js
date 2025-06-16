import { create } from "zustand";

const useHelpVideoDialogStore = create((set) => ({
  isOpen: '',
  openDialog: (video) => set({ isOpen: video }),
  closeDialog: () => set({ isOpen: '' }),
}));


export default useHelpVideoDialogStore;