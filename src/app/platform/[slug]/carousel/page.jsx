"use client";

import "./carousel.css";
import { PanelRightOpen, SquarePen } from "lucide-react";
import useCarousel from "@/hooks/useCarousel";

const CarouselPage = () => {
  const { isSidebarOpen, toggleSidebar } = useCarousel();

  return (
        <div className="carousel_page_content">
          <div className="carousel_pageTop">
            {!isSidebarOpen && (
              <>
                <div
                  onClick={toggleSidebar}
                  className="carousel_pageTop_iconWrapper"
                >
                  <PanelRightOpen size="22px" />
                </div>
                <div className="carousel_pageTop_iconWrapper">
                  <SquarePen size="22px" />
                </div>
              </>
            )}
          </div>
          <div className="carousel_pageBody"></div>
        </div>
  );
};

export default CarouselPage;
