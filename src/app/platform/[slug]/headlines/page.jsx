"use client";

import { useSideBar } from "@/store/sidebarStore";
import "./headlines.css";
import useAuthStore from "@/store/authStore";
import { useEffect } from "react";
import { useHydrationZustand } from "@codebayu/use-hydration-zustand";
import { PanelRightOpen, SquarePen } from "lucide-react";

const HeadlinesModel = () => {
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
    <div className="headline-page_content">
      <div className="headline-pageTop">
        {!isSidebarOpen && (
          <>
            <div
              onClick={toggleSidebar}
              className="headline-pageTop_iconWrapper"
            >
              <PanelRightOpen size="22px" />
            </div>
            <div className="headline-pageTop_iconWrapper">
              <SquarePen size="22px" />
            </div>
          </>
        )}
      </div>
      <div className="headline-pageBody"></div>
    </div>
  );
};

export default HeadlinesModel;
