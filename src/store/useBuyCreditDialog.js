import { create } from 'zustand';

export const useBuyCreditDialog = create((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}));
