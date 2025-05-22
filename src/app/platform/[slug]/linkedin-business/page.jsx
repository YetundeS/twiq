"use client";

import { useSideBar } from "@/store/sidebarStore";
import './lb.css';
import useAuthStore from "@/store/authStore";
import { useEffect } from "react";
import { fetchUser } from "@/apiCalls/authAPI";
import { useHydrationZustand } from "@codebayu/use-hydration-zustand";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/appSideBar";
import { PanelRightOpen, SquarePen } from "lucide-react";

const LinkedInBusinessModel = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useSideBar();

  const { user, updateUser } = useAuthStore();

  const isHydrated = useHydrationZustand(useAuthStore);

  useEffect(() => {
    if (isHydrated && !user) { 
      router.push("/auth");
    }
  }, [user, isHydrated]);

  useEffect(() => {
    fetchUser(updateUser);
  }, []); // Runs only on mount (hard reload)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <SidebarProvider open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
      <div className="lb-Page_wrapper">
        <AppSidebar />
        <div className="lb-page_content">
          <div className="lb-pageTop">
            {!isSidebarOpen && (
              <>
                <div onClick={toggleSidebar} className="lb-pageTop_iconWrapper">
                  <PanelRightOpen size="22px"/>
                </div>
                <div className="lb-pageTop_iconWrapper">
                  <SquarePen size="22px"/>
                </div>
              </>
            )}
          </div>
          <div className="lb-pageBody"></div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default LinkedInBusinessModel