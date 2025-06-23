import { BadgeHelp, Home, LogOut, MessagesSquare, Package, PanelRightOpen, Settings, Sparkles } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import { generateSignString } from "@/lib/utils";
import useAuthStore from "@/store/authStore";
import { useSideBar } from "@/store/sidebarStore";
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
const proModels = ["LinkedIn Your Business", "Captions", "Video Scripts", "Carousel"].map(m => m.toLowerCase());

export const hasAccess = (plan, title) => {
  if (!plan || !title) return false;

  const normalizedPlan = plan.toLowerCase();
  const normalizedTitle = title.trim().toLowerCase();

  if (normalizedPlan === "none") return false;
  if (normalizedPlan === "starter") return starterModels.includes(normalizedTitle);
  if (normalizedPlan === "pro") return (
    starterModels.includes(normalizedTitle) || proModels.includes(normalizedTitle)
  );
  if (normalizedPlan === "enterprise") return true;

  return false;
};

export function AppSidebarDesktop() {
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
  }, [sidebarSessions])


  useEffect(() => {
    if (!user) return;
    const signString = generateSignString(user?.organization_name);
    setOrganization(signString);
  }, [user]);

  const handleClick = (e, userHasAccess, title) => {
    if (!userHasAccess) {
      e.preventDefault();
      toast.error(`Upgrade to access "${title}" model`, {
        style: {
          border: "none",
          color: "red",
        },
      });
    }
  };

  const handleUpgradeClick = () => {
    openSubDialog();
    const signString = generateSignString(user?.organization_name);
    router.push(`/platform/${signString}/settings`);
  }

  return (
    <Sidebar className="sidebar">
      <SidebarContent>
        <SidebarGroup className="fixedHeight_area">
          <SidebarGroupLabel className="h-max">
            <div className="topAction_box">
              <div onClick={toggleSidebar} className="sidebar_pageTop_iconWrapper">
                <PanelRightOpen className="pageIcon" size="22px" />
              </div>
              <NewChatBtn />
            </div>
          </SidebarGroupLabel>
          <div className="scrollableArea">
            <SidebarGroupContent>
              <SidebarMenu className="sidebar_menu">
                {/* {ORGANIZATIONAL_ROLES.includes(user?.user_name) && (
                  <SidebarMenuItem className="sidebarMenuItem admin">
                    <SidebarMenuButton asChild>
                      <Link
                        href={`/platform/${organization}/admin/`}
                        className="sideBarItem"
                      >
                        <SlidersHorizontal className="admin-icon" />
                        <span>Admin</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )} */}
                <SidebarMenuItem className="sidebarMenuItem admin">
                  <SidebarMenuButton asChild>
                    <a
                      href={`/platform/${organization}/`}
                      className="sideBarItem"
                    >
                      <Home className="home-icon" />
                      <span>Home</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem className="sidebarMenuItem">
                  <Menubar className="menuBar">
                    <MenubarMenu>
                      <SidebarMenuButton className="sidebarMenuBtn" asChild>
                        <MenubarTrigger className="menubarTrigger">
                          <div className="sideBarItem models">
                            <Package className="home-icon" />
                            <span>Models</span>
                          </div>
                        </MenubarTrigger>
                      </SidebarMenuButton>
                      <MenubarContent
                        align="start"
                        side="right" className="menubarContent">
                        {models?.map((item, i) => {
                          const userHasAccess = hasAccess(user?.subscription_plan, item.name);
                          return (
                            <MenubarItem key={i} className="menubarItem">
                              <a
                                href={`/platform/${organization}/${item.url}/`}
                                className="menu_sideBarItem"
                                onClick={(e) => handleClick(e, userHasAccess, item.name)}
                              >
                                {userHasAccess ? (<item.icon />) : (<CrownIcon fill="gold" stroke="gold" />)}
                                <span>{item.name}</span>
                              </a>
                            </MenubarItem>
                          )
                        })}
                      </MenubarContent>
                    </MenubarMenu>
                  </Menubar>
                </SidebarMenuItem>

                <SidebarMenuItem className="sidebarMenuItem admin">
                  <SidebarMenuButton asChild>
                    <Link
                      href={`/platform/${organization}/settings/`}
                      className="sideBarItem"
                    >
                      <Settings className="settings-icon" />
                      <span>Settings</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem className="sidebarMenuItem admin">
                  <SidebarMenuButton asChild>
                    <Link
                      href={`/help`}
                      className="sideBarItem"
                    >
                      <BadgeHelp />
                      <span>Help</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <p className="chatsLabel"> - Chats</p>
                {!isFetching ? (
                  <>
                    {sessions?.map((session, i) => (
                      <SidebarMenuItem key={i} className="sidebarMenuItem">
                        <SidebarMenuButton className="sidebarMenuBtn" asChild>
                          <Link
                            href={`/platform/${organization}/${session?.assistant_slug}/${session?.id}`}
                            className={`sideBarItem ${activeSessionID === session?.id && 'active'}`}
                          >
                            <MessagesSquare />
                            <span>{session.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}</>
                ) : (
                  <div className="loadingIndicator">
                    <SpinnerLoader className="smaller" />
                  </div>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </div>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="sidebarFooter">
        <SidebarMenu>
          <SidebarMenuItem>
            <div onClick={handleUpgradeClick}>
              <SidebarMenuButton className="upgradeBar">
                <div className="sideBar_iconBox">
                  <Sparkles className="sparkles_icon" />
                </div>
                <div className="logOutTxt">
                  <p className="txtHead">Upgrade plan</p>
                  <p className="txtsubHead">More access to best features</p>
                </div>
              </SidebarMenuButton>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem onClick={openDialog}>
            <SidebarMenuButton className="upgradeBar logout">
              <LogOut className="logout_icon" /> <span className="txtHead">Log Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <LogOutDialog />
    </Sidebar>
  );
}
