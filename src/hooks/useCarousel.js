import useAuthStore from "@/store/authStore";
import { useSideBar } from "@/store/sidebarStore";
import { useHydrationZustand } from "@codebayu/use-hydration-zustand";
import { useEffect } from "react";

export default function useCarousel() {
  const { isSidebarOpen, setIsSidebarOpen } = useSideBar();

  const isHydrated = useHydrationZustand(useAuthStore);
  const { user } = useAuthStore();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (isHydrated && !user) {
      router.push("/auth");
    }
  }, [user, isHydrated]);

  return {
    isSidebarOpen,
    setIsSidebarOpen,
    toggleSidebar
  };
}
