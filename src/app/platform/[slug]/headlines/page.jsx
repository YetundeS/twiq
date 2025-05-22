"use client";

import { useSideBar } from "@/store/sidebarStore";
import './headlines.css';
import useAuthStore from "@/store/authStore";
import { useEffect } from "react";
import { fetchUser } from "@/apiCalls/authAPI";
import { useHydrationZustand } from "@codebayu/use-hydration-zustand";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/appSideBar";
import { PanelRightOpen, SquarePen } from "lucide-react";

const HeadlinesModel = () => {
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
      <div className="headline-Page_wrapper">
        <AppSidebar />
        <div className="headline-page_content">
          <div className="headline-pageTop">
            {!isSidebarOpen && (
              <>
                <div onClick={toggleSidebar} className="headline-pageTop_iconWrapper">
                  <PanelRightOpen size="22px"/>
                </div>
                <div className="headline-pageTop_iconWrapper">
                  <SquarePen size="22px"/>
                </div>
              </>
            )}
          </div>
          <div className="headline-pageBody"></div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default HeadlinesModel