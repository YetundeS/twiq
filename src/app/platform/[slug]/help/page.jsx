'use client';

import NewChatBtn from "@/components/dashboardComponent/newChatBtn";
import PlatformTop from "@/components/dashboardComponent/platformTop";
import TwiqBg from "@/components/dashboardComponent/twiqBg";
import { useSidebar } from "@/components/ui/sidebar";
import { helpVideos } from "@/constants/model";
import { useIsMobile } from "@/hooks/use-mobile";
import useAuthStore from "@/store/authStore";
import { useSideBar } from "@/store/sidebarStore";
import useSusbcriptionDialogStore from "@/store/useSusbcriptionDialogStore";
import "@/styles/platformStyles.css";
import { PanelRightOpen } from "lucide-react";
import './help.css';

const Help = () => {
    const isMobile = useIsMobile();
    const { isSidebarOpen, setIsSidebarOpen } = useSideBar();
    const { openSubDialog } = useSusbcriptionDialogStore();

    const { toggleSidebar: mainToggle } = useSidebar();
    const { user } = useAuthStore();

    const toggleSidebar = () => {
        mainToggle()
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="page_content">
            <div className="pageTop">
                {(!isSidebarOpen || isMobile) && (
                    <>
                        <div
                            onClick={toggleSidebar}
                            className="pageTop_iconWrapper"
                        >
                            <PanelRightOpen className="pageIcon" size="22px" />
                        </div>
                        <NewChatBtn alt />
                    </>
                )}
                <TwiqBg />
                <PlatformTop />
            </div>
            <div className="help_content">
                <h3 className="helpTitle">Help Videos</h3>
                <div className="helpVideosWrapper">
                    {helpVideos?.map((video, i) => (
                        <div key={i} className="w-full aspect-video">
                            <iframe
                                className="w-full h-full rounded-md"
                                src={`https://www.youtube.com/embed/${video}`}
                                title="YouTube video"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Help