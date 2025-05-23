// dashboard/[slug]/layout.jsx
"use client";

import { useEffect } from "react";
import { fetchUser } from "@/apiCalls/authAPI";
import useAuthStore from "@/store/authStore";
import { useSideBar } from "@/store/sidebarStore";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/appSideBar";
import "./dashboard.css";

export default function DashboardLayout({ children }) {
  const { isSidebarOpen, setIsSidebarOpen } = useSideBar();
  const { updateUser } = useAuthStore();

  useEffect(() => {
    fetchUser(updateUser);
  }, []);

  return (
    <SidebarProvider open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
      <div className="dashboard_wrapper">
        <AppSidebar />
        {children}
      </div>
    </SidebarProvider>
  );
}
