import { Home, LogOut, MessagesSquare, Package, PanelRightOpen, Settings, SlidersHorizontal, Sparkles } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
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
import { models, ORGANIZATIONAL_ROLES } from "@/constants/sidebar";
import { useCurrentSessionID } from "@/hooks/useCurrentSessionID";
import { useSidebarChats } from "@/hooks/useSideBarHook";
import useLogOutDialogStore from "@/store/useLogOutDialogStore";
import useModelsStore from "@/store/useModelsStore";
import Link from "next/link";
import LogOutDialog from "../dashboardComponent/logOutDialog";
import NewChatBtn from "../dashboardComponent/newChatBtn";
import SpinnerLoader from "../dashboardComponent/spinnerLoader";

export function AppSidebar() {
  const { sidebarSessions, isSidebarOpen, setIsSidebarOpen } = useSideBar();
  const [sessions, setSession ] = useState([]);
  const [organization, setOrganization] = useState("");
  const { user } = useAuthStore();
  const { openDialog } = useLogOutDialogStore();
  const { isFetching } = useSidebarChats();
  const sessionId = useCurrentSessionID();
  const { activeSessionID, activeChatMessages: chats, updateActiveSessionID, updateActiveChatMessages, setActiveChatMessages } = useModelsStore();


  useEffect(() => {
    setSession([...sidebarSessions]);
  }, [sidebarSessions])
  

  useEffect(() => {
    if (!user) return;
    const signString = generateSignString(user?.organization_name);
    setOrganization(signString);
  }, [user]);



  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

// useEffect(() => {
//   console.log('sidebarSessions: ', sidebarSessions)
// }, [sidebarSessions])



  return (
    <Sidebar className="sidebar">
      <SidebarContent>
        <SidebarGroup className="fixedHeight_area">
          <SidebarGroupLabel className="h-max">
            <div className="topAction_box">
              <div onClick={toggleSidebar} className="sidebar_pageTop_iconWrapper">
                <PanelRightOpen size="22px" />
              </div>
              <NewChatBtn />
            </div>
          </SidebarGroupLabel>
          <div className="scrollableArea">
            <SidebarGroupContent>
              <SidebarMenu className="sidebar_menu">
                {ORGANIZATIONAL_ROLES.includes(user?.user_name) && (
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
                )}
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
                      <MenubarContent className="menubarContent">
                        {models?.map((item, i) => (
                          <MenubarItem key={i} className="menubarItem">
                            <a
                              href={`/platform/${organization}/${item.url}/`}
                              className="menu_sideBarItem"
                            >
                              <item.icon />
                              <span>{item.name}</span>
                            </a>
                          </MenubarItem>
                        ))}
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
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="upgradeBar">
              <div className="sideBar_iconBox">
                <Sparkles className="sparkles_icon" />
              </div>
              <div className="logOutTxt">
                <p className="txtHead">Upgrade plan</p>
                <p className="txtsubHead">More access to best features</p>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem onClick={openDialog}>
            <SidebarMenuButton className="upgradeBar logout">
              <LogOut /> <span className="txtHead">Log Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <LogOutDialog />
    </Sidebar>
  );
}
