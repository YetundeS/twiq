import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Cache version - increment this to force cache clear on critical updates
const CACHE_VERSION = 2; // Increment to clear old cached data

// SSR-safe storage adapter
const safeLocalStorage = {
  getItem: (name) => {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(name, value);
    } catch {
      // Ignore storage errors
    }
  },
  removeItem: (name) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(name);
    } catch {
      // Ignore storage errors
    }
  },
};

const useAuthStore = create()(
  persist(
    (set, get) => ({
      user: null,
      isRefreshing: false,
      isInitialLoading: true, // True until first fetch completes
      cacheVersion: CACHE_VERSION,
      logout: () =>
        set({ user: null, isRefreshing: false, isInitialLoading: false }),
      updateUser: (user) =>
        set({ user, isRefreshing: false, isInitialLoading: false }),
      setRefreshing: (isRefreshing) => set({ isRefreshing }),
      setInitialLoading: (isInitialLoading) => set({ isInitialLoading }),
      // Helper function to get data freshness info
      getDataFreshness: () => {
        const user = get().user;
        if (!user?._lastFetched) return null;

        const ageInMinutes = (Date.now() - user._lastFetched) / (1000 * 60);
        return {
          lastFetched: new Date(user._lastFetched),
          ageInMinutes: Math.round(ageInMinutes),
          isStale: ageInMinutes > 5, // Consider data stale after 5 minutes
        };
      },
      // Clear cache if version mismatch
      checkCacheVersion: () => {
        const storedVersion = get().cacheVersion;
        if (storedVersion !== CACHE_VERSION) {
          console.log("[AuthStore] Cache version mismatch, clearing old data");
          set({
            user: null,
            cacheVersion: CACHE_VERSION,
            isInitialLoading: true,
          });
          return true; // Cache was cleared
        }
        return false; // Cache is valid
      },
    }),
    {
      name: "twiq-auth-storage",
      storage: createJSONStorage(() => safeLocalStorage),
      // Only persist user and cache version, not loading states
      partialize: (state) => ({
        user: state.user,
        cacheVersion: state.cacheVersion,
      }),
      // Skip hydration on server
      skipHydration: true,
    },
  ),
);

export default useAuthStore;
