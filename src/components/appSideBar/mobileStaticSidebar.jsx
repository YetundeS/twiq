// AppSidebarDesktopStatic.js
'use client';

import { generateSignString } from "@/lib/utils";
import useAuthStore from "@/store/authStore";
import { useSideBar } from "@/store/sidebarStore";
import { BadgeHelp, Home, LogOut, MessagesSquare, Package, PanelRightOpen, Settings, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import "./appSideBar.css";

import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu, MenubarTrigger
} from "@/components/ui/menubar";
import { models } from "@/constants/sidebar";
import { useSidebarChats } from "@/hooks/useSideBarHook";
import useLogOutDialogStore from "@/store/useLogOutDialogStore";
import useModelsStore from "@/store/useModelsStore";
import { useResponsiveSidebarToggle } from "@/store/useResponsiveSidebarToggle";
import useSusbcriptionDialogStore from "@/store/useSusbcriptionDialogStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import CrownIcon from "../dashboardComponent/crown";
import LogOutDialog from "../dashboardComponent/logOutDialog";
import NewChatBtn from "../dashboardComponent/newChatBtn";
import SpinnerLoader from "../dashboardComponent/spinnerLoader";

const starterModels = ["LinkedIn Personal", "Headlines", "Storyteller"].map(m => m.toLowerCase());
const proModels = ["LinkedIn Your Business", "Caption", "Video Scripts", "Carousel"].map(m => m.toLowerCase());

export const hasAccess = (plan, title) => {
    if (!plan || !title) return false;
    const normalizedPlan = plan.toLowerCase();
    const normalizedTitle = title.trim().toLowerCase();

    if (normalizedPlan === "none") return false;
    if (normalizedPlan === "starter") return starterModels.includes(normalizedTitle);
    if (normalizedPlan === "pro") return starterModels.includes(normalizedTitle) || proModels.includes(normalizedTitle);
    if (normalizedPlan === "enterprise") return true;

    return false;
};

export function AppSidebarDesktopStatic() {
    const { sidebarSessions } = useSideBar();
    const [sessions, setSession] = useState([]);
    const [organization, setOrganization] = useState("");
    const { user } = useAuthStore();
    const { openDialog } = useLogOutDialogStore();
    const { isFetching } = useSidebarChats();
    const { activeSessionID } = useModelsStore();
    const toggleSidebar = useResponsiveSidebarToggle();
    const { openSubDialog } = useSusbcriptionDialogStore();
    const router = useRouter();

    useEffect(() => {
        setSession([...sidebarSessions]);
    }, [sidebarSessions]);

    useEffect(() => {
        if (!user) return;
        const signString = generateSignString(user?.organization_name);
        setOrganization(signString);
    }, [user]);

    const handleClick = (e, userHasAccess, title) => {
        if (!userHasAccess) {
            e.preventDefault();
            toast.error(`Upgrade to access "${title}" model`, {
                style: { border: "none", color: "red" },
            });
        }
    };
    
  const handleUpgradeClick = () => {
    toggleSidebar()
    openSubDialog();
    router.push(`/platform/${signString}/settings`);
  }

    return (
        <div className="relative z-[20] flex h-full  flex-col sidebar">
            <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-auto">
                <div className={` relative flex w-full min-w-0 flex-col p-2 fixedHeight_area`}>
                    <div className="topAction_box mobile">
                        <div onClick={toggleSidebar} className="sidebar_pageTop_iconWrapper">
                            <PanelRightOpen className="pageIcon" size="22px" />
                        </div>
                        <NewChatBtn mobile />
                    </div>

                    <div className="scrollableArea mobile">
                        <div className="sidebar_menu">
                            <div className="sidebarMenuItem admin">
                                <a href={`/platform/${organization}/`} className="sideBarItem">
                                    <Home className="home-icon" />
                                    <span>Home</span>
                                </a>
                            </div>

                            <div className="sidebarMenuItem">
                                <Menubar className="menuBar">
                                    <MenubarMenu>
                                        <MenubarTrigger className="menubarTrigger">
                                            <div className="sideBarItem">
                                                <Package className="home-icon" />
                                                <span>Models</span>
                                            </div>
                                        </MenubarTrigger>
                                        <MenubarContent align="start"
                                            side="bottom" className="menubarContent z-[999999999999]">
                                            {models?.map((item, i) => {
                                                const userHasAccess = hasAccess(user?.subscription_plan, item.name);
                                                return (
                                                    <MenubarItem key={i} className="menubarItem">
                                                        <a
                                                            href={`/platform/${organization}/${item.url}/`}
                                                            className="menu_sideBarItem mobile"
                                                            onClick={(e) => handleClick(e, userHasAccess, item.name)}
                                                        >
                                                            {userHasAccess ? (<item.icon />) : (<CrownIcon fill="gold" stroke="gold" />)}
                                                            <span>{item.name}</span>
                                                        </a>
                                                    </MenubarItem>
                                                );
                                            })}
                                        </MenubarContent>
                                    </MenubarMenu>
                                </Menubar>
                            </div>

                            <div className="sidebarMenuItem admin">
                                <Link href={`/platform/${organization}/settings/`} className="sideBarItem">
                                    <Settings className="settings-icon" />
                                    <span>Settings</span>
                                </Link>
                            </div>

                            <div className="sidebarMenuItem admin">
                                <Link href={`/help`} className="sideBarItem">
                                    <BadgeHelp />
                                    <span>Help</span>
                                </Link>
                            </div>

                            <p className="chatsLabel"> - Chats</p>{!isFetching ? (
                                sessions?.map((session, i) => (
                                    <div key={i} className="sidebarMenuItem">
                                        <Link
                                            href={`/platform/${organization}/${session?.assistant_slug}/${session?.id}`}
                                            className={`sideBarItem mobile ${activeSessionID === session?.id && 'active'}`}
                                        >
                                            <MessagesSquare />
                                            <span>
                                                {session.title.length > 20
                                                    ? `${session.title.slice(0, 20)}...`
                                                    : session.title}
                                            </span>
                                        </Link>
                                    </div>
                                ))
                            ) : (
                                <div className="loadingIndicator">
                                    <SpinnerLoader className="smaller" />
                                </div>
                            )}

                        </div>
                    </div>

                </div>
            </div>
            <div className=" flex flex-col gap-2 p-2 sidebarFooter">
                <div className="sidebarMenuItem">
                    <div onClick={handleUpgradeClick} className="upgradeBar">
                        <div className="sideBar_iconBox">
                            <Sparkles className="sparkles_icon" />
                        </div>
                        <div className="logOutTxt">
                            <p className="txtHead">Upgrade plan</p>
                            <p className="txtsubHead">More access to best features</p>
                        </div>
                    </div>
                </div>
                <div className="sidebarMenuItem" onClick={openDialog}>
                    <div className="upgradeBar logout">
                        <LogOut className="logout_icon" /> <span className="txtHead">Log Out</span>
                    </div>
                </div>
            </div>
            <LogOutDialog />
        </div>
    );
}
