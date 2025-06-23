import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create()(
  persist(
    (set) => ({
      user: null,
      logout: () => set({ user: null }),
      updateUser: (user) => set({ user }),
    }),
    {
      name: "twiq-auth-storage",
    }
  )
);

export default useAuthStore;
