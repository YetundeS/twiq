// dashboard/[slug]/layout.jsx
"use client";

import { useEffect } from "react";
import { fetchUser } from "@/apiCalls/authAPI";
import useAuthStore from "@/store/authStore";
import { useSideBar } from "@/store/sidebarStore";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/appSideBar";
import "./dashboard.css";
import { useHydrationZustand } from "@codebayu/use-hydration-zustand";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }) {
  const { isSidebarOpen, setIsSidebarOpen } = useSideBar();
  const { user, updateUser } = useAuthStore();

  const isHydrated = useHydrationZustand(useAuthStore);
    const router = useRouter();

  useEffect(() => {
    fetchUser(updateUser);
  }, []);

  
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
