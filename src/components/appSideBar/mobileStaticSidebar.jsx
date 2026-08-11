// AppSidebarDesktopStatic.js
'use client';

import { generateSignString } from "@/lib/utils";
import useAuthStore from "@/store/authStore";
import { useSideBar } from "@/store/sidebarStore";
import { Archive, BadgeHelp, Home, LogOut, Package, PanelRightOpen, Settings, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import "./appSideBar.css";
import { SessionRow } from "./sessionRow";

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
import { SearchDialog } from "./SearchDialog";
import SpinnerLoader from "../dashboardComponent/spinnerLoader";
import { hasAccess } from './index';


export function AppSidebarDesktopStatic() {
    const { sidebarSessions } = useSideBar();
    const [organization, setOrganization] = useState("");
    const [showArchived, setShowArchived] = useState(false);
    const { user } = useAuthStore();
    const { openDialog } = useLogOutDialogStore();
    const { isFetching } = useSidebarChats();
    const { activeSessionID } = useModelsStore();
    const toggleSidebar = useResponsiveSidebarToggle();
    const { openSubDialog } = useSusbcriptionDialogStore();
    const router = useRouter();

    const archivedCount = useMemo(
        () => sidebarSessions.filter((s) => !!s.archived_at).length,
        [sidebarSessions]
    );

    // Sort: pinned first, then most-recent-updated. Filter archived unless user opts in.
    // Same logic as appSidebarDesktop — keeps mobile and desktop in lock-step so the
    // sidebar row menu (rename / pin / archive / delete) behaves identically.
    const sortedSessions = useMemo(() => {
        const source = showArchived
            ? sidebarSessions
            : sidebarSessions.filter((s) => !s.archived_at);

        return [...source].sort((a, b) => {
            const aPinned = a.pinned ? 1 : 0;
            const bPinned = b.pinned ? 1 : 0;
            if (aPinned !== bPinned) return bPinned - aPinned;

            const aStamp = new Date(a.updated_at || a.created_at || 0).getTime();
            const bStamp = new Date(b.updated_at || b.created_at || 0).getTime();
            return bStamp - aStamp;
        });
    }, [sidebarSessions, showArchived]);

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
                        <SearchDialog />
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

                            <p className="chatsLabel"> - Chats</p>
                            {!isFetching ? (
                                <>
                                    {sortedSessions.map((session) => (
                                        <SessionRow
                                            key={session.id}
                                            session={session}
                                            organization={organization}
                                            activeSessionID={activeSessionID}
                                        />
                                    ))}
                                    {archivedCount > 0 && (
                                        <button
                                            type="button"
                                            className="sidebarArchivedToggle"
                                            onClick={() => setShowArchived((v) => !v)}
                                        >
                                            <Archive size={12} />
                                            <span>
                                                {showArchived
                                                    ? "Hide archived"
                                                    : `Show archived (${archivedCount})`}
                                            </span>
                                        </button>
                                    )}
                                </>
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
