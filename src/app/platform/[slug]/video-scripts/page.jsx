"use client";

import { useSideBar } from "@/store/sidebarStore";
import './video-scripts.css';
import useAuthStore from "@/store/authStore";
import { useEffect } from "react";
import { useHydrationZustand } from "@codebayu/use-hydration-zustand";
import { PanelRightOpen, SquarePen } from "lucide-react";

const VideoScriptsModel = () => {
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
        <div className="vs-page_content">
          <div className="vs-pageTop">
            {!isSidebarOpen && (
              <>
                <div onClick={toggleSidebar} className="vs-pageTop_iconWrapper">
                  <PanelRightOpen size="22px"/>
                </div>
                <div className="vs-pageTop_iconWrapper">
                  <SquarePen size="22px"/>
                </div>
              </>
            )}
          </div>
          <div className="vs-pageBody"></div>
        </div>
  );
};

export default VideoScriptsModel