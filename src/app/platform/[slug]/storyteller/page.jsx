"use client";

import { useSideBar } from "@/store/sidebarStore";
import './storyteller.css';
import useAuthStore from "@/store/authStore";
import { useEffect } from "react";
import { useHydrationZustand } from "@codebayu/use-hydration-zustand";
import { PanelRightOpen, SquarePen } from "lucide-react";


const StorytellerModel = () => {
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
        <div className="storytelling-page_content">
          <div className="storytelling-pageTop">
            {!isSidebarOpen && (
              <>
                <div onClick={toggleSidebar} className="storytelling-pageTop_iconWrapper">
                  <PanelRightOpen size="22px"/>
                </div>
                <div className="storytelling-pageTop_iconWrapper">
                  <SquarePen size="22px"/>
                </div>
              </>
            )}
          </div>
          <div className="storytelling-pageBody"></div>
        </div>
  );
};

export default StorytellerModel