"use client";

import { useSideBar } from "@/store/sidebarStore";
import './lp.css';
import useAuthStore from "@/store/authStore";
import { useEffect } from "react";
import { fetchUser } from "@/apiCalls/authAPI";
import { useHydrationZustand } from "@codebayu/use-hydration-zustand";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/appSideBar";
import { PanelRightOpen, SquarePen } from "lucide-react";

const LinkedInPersonalModel = () => {
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
      <div className="lp-Page_wrapper">
        <AppSidebar />
        <div className="lp-page_content">
          <div className="lp-pageTop">
            {!isSidebarOpen && (
              <>
                <div onClick={toggleSidebar} className="lp-pageTop_iconWrapper">
                  <PanelRightOpen size="22px"/>
                </div>
                <div className="lp-pageTop_iconWrapper">
                  <SquarePen size="22px"/>
                </div>
              </>
            )}
          </div>
          <div className="lp-pageBody"></div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default LinkedInPersonalModel