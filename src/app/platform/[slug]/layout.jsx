// dashboard/[slug]/layout.jsx
"use client";

import { fetchUser } from "@/apiCalls/authAPI";
import { AppSidebar } from "@/components/appSideBar";
import { SidebarProvider } from "@/components/ui/sidebar";
import useAuthStore from "@/store/authStore";
import { useSideBar } from "@/store/sidebarStore";
import { useHydrationZustand } from "@codebayu/use-hydration-zustand";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useMediaQuery } from "usehooks-ts";
import "./dashboard.css";

export default function DashboardLayout({ children }) {
  const { isSidebarOpen } = useSideBar();
  const pathname = usePathname();

  const isDesktop = useMediaQuery('(min-width: 768px)', { initializeWithValue: false });

  const isHydrated = useHydrationZustand(useAuthStore);
  const router = useRouter();
  const { updateUser } = useAuthStore();

  // Determine if sidebar should be shown based on current route
  const shouldShowSidebar = useMemo(() => {
    if (!pathname) return false;
    
    // Hide sidebar on admin pages and home dashboard pages
    const isAdminPage = pathname.includes('/admin');
    const isHomePage = pathname.match(/^\/platform\/[^\/]+\/?$/); // matches /platform/[slug] or /platform/[slug]/
    
    return !isAdminPage && !isHomePage;
  }, [pathname]);

  useEffect(() => {
    if (!isHydrated) return;

    fetchUser({
      updateUser,
      onUnauthorized: () => router.push("/sign-off"),
    })
  }, [isHydrated]);


  // Render with or without sidebar based on route
  if (!shouldShowSidebar) {
    return (
      <div className="dashboard_wrapper">
        {children}
      </div>
    );
  }

  return (
    <SidebarProvider open={isSidebarOpen}>
      <div className="dashboard_wrapper">
        <AppSidebar />
        {children}
      </div>
    </SidebarProvider>
  );
}
