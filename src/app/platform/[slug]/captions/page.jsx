"use client";

import { useSideBar } from "@/store/sidebarStore";
import './caption.css';
import useAuthStore from "@/store/authStore";
import { useEffect } from "react";
import { useHydrationZustand } from "@codebayu/use-hydration-zustand";
import { PanelRightOpen, SquarePen } from "lucide-react";

const CaptionModel = () => {
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
        <div className="caption-page_content">
          <div className="caption-pageTop">
            {!isSidebarOpen && (
              <>
                <div onClick={toggleSidebar} className="caption-pageTop_iconWrapper">
                  <PanelRightOpen size="22px"/>
                </div>
                <div className="caption-pageTop_iconWrapper">
                  <SquarePen size="22px"/>
                </div>
              </>
            )}
          </div>
          <div className="caption-pageBody"></div>
        </div>
  );
};

export default CaptionModel