"use client";

import { useSideBar } from "@/store/sidebarStore";
import './lp.css';
import useAuthStore from "@/store/authStore";
import { useEffect } from "react";
import { useHydrationZustand } from "@codebayu/use-hydration-zustand";
import { PanelRightOpen, SquarePen } from "lucide-react";

const LinkedInPersonalModel = () => {
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
  );
};

export default LinkedInPersonalModel