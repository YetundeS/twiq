// dashboard/[slug]/layout.jsx
"use client";

import { AppSidebar } from "@/components/appSideBar";
import { SidebarProvider } from "@/components/ui/sidebar";
import useAuthStore from "@/store/authStore";
import { useSideBar } from "@/store/sidebarStore";
import { useHydrationZustand } from "@codebayu/use-hydration-zustand";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import "./dashboard.css";

export default function DashboardLayout({ children }) {
  const { isSidebarOpen, setIsSidebarOpen } = useSideBar();
  const { user } = useAuthStore();

  const isHydrated = useHydrationZustand(useAuthStore);
    const router = useRouter();

  useEffect(() => {
    if (isHydrated && !user) {
      router.push("/auth");
    }
  }, [user, isHydrated]);

  return (
    <SidebarProvider open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
      <div className="dashboard_wrapper">
        <AppSidebar />
        {children}
      </div>
    </SidebarProvider>
  );
}
