import { create } from "zustand";

const useLogOutDialogStore = create((set) => ({
  isOpen: false,
  openDialog: () => set({ isOpen: true }),
  closeDialog: () => set({ isOpen: false }),
}));


export default useLogOutDialogStore;