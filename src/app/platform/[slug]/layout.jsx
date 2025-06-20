// dashboard/[slug]/layout.jsx
"use client";

import { fetchUser } from "@/apiCalls/authAPI";
import { AppSidebar } from "@/components/appSideBar/appSideBarResponsive";
import { SidebarProvider } from "@/components/ui/sidebar";
import useAuthStore from "@/store/authStore";
import { useSideBar } from "@/store/sidebarStore";
import { useHydrationZustand } from "@codebayu/use-hydration-zustand";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useMediaQuery } from "usehooks-ts";
import "./dashboard.css";

export default function DashboardLayout({ children }) {
  const { isSidebarOpen } = useSideBar();

  const isDesktop = useMediaQuery('(min-width: 768px)', { initializeWithValue: false });

  const isHydrated = useHydrationZustand(useAuthStore);
  const router = useRouter();
  const { updateUser } = useAuthStore();

  useEffect(() => {
    if (!isHydrated) return;

    fetchUser({
      updateUser,
      onUnauthorized: () => router.push("/sign-off"),
    })
  }, [isHydrated]);


  return (
    <SidebarProvider open={isSidebarOpen}>
      <div className="dashboard_wrapper">
        <AppSidebar />
        {children}
      </div>
    </SidebarProvider>
  );
}
