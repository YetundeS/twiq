"use client";

import { useSideBar } from "@/store/sidebarStore";
import './lb.css';
import useAuthStore from "@/store/authStore";
import { useEffect } from "react";
import { useHydrationZustand } from "@codebayu/use-hydration-zustand";
import { PanelRightOpen, SquarePen } from "lucide-react";

const LinkedInBusinessModel = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useSideBar();

  const { user } = useAuthStore();

  const isHydrated = useHydrationZustand(useAuthStore);

  useEffect(() => {
    if (isHydrated && !user) { 
      router.push("/auth");
    }
  }, [user, isHydrated]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
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
  );
};

export default LinkedInBusinessModel