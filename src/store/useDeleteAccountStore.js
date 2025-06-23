import { create } from "zustand";

const useDeleteAccountStore = create((set) => ({
  isOpen: false,
  openDialog: () => set({ isOpen: true }),
  closeDialog: () => set({ isOpen: false }),
}));


export default useDeleteAccountStore;