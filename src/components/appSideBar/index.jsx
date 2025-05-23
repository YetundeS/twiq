import { Home, LogOut, Package, PanelRightOpen, Settings, SlidersHorizontal, Sparkles, SquarePen } from "lucide-react";

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
import "./appSideBar.css";
import useAuthStore from "@/store/authStore";
import { useEffect, useState } from "react";
import { generateSignString } from "@/lib/utils";
import { useSideBar } from "@/store/sidebarStore";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu, MenubarTrigger
} from "@/components/ui/menubar";
import { models, ORGANIZATIONAL_ROLES } from "@/constants/sidebar";
import useLogOutDialogStore from "@/store/useLogOutDialogStore";
import LogOutDialog from "../dashboardComponent/logOutDialog";

export function AppSidebar() {
  const { isSidebarOpen, setIsSidebarOpen } = useSideBar();
  const [organization, setOrganization] = useState("");
  const { user } = useAuthStore();
  const { openDialog } = useLogOutDialogStore();

  useEffect(() => {
    if (!user) return;
    const signString = generateSignString(user?.organization_name);
    setOrganization(signString);
  }, [user]);



  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  

  return (
    <Sidebar className="sidebar">
      <SidebarContent>
        <SidebarGroup className="fixedHeight_area">
          <SidebarGroupLabel className="h-max">
            <div className="topAction_box">
              <div onClick={toggleSidebar} className="sidebar_pageTop_iconWrapper">
                <PanelRightOpen size="22px" />
              </div>
              <div className="sidebar_pageTop_iconWrapper">
                <SquarePen size="22px" />
              </div>
            </div>
          </SidebarGroupLabel>
          <div className="scrollableArea">
          <SidebarGroupContent>
            <SidebarMenu className="sidebar_menu">
              {ORGANIZATIONAL_ROLES.includes(user?.user_name) && (
                <SidebarMenuItem className="sidebarMenuItem admin">
                  <SidebarMenuButton asChild>
                    <a
                      href={`/platform/${organization}/admin/`}
                      className="sideBarItem"
                    >
                      <SlidersHorizontal className="admin-icon" />
                      <span>Admin</span>
                    </a>
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
                  <a
                    href={`/platform/${organization}/settings/`}
                    className="sideBarItem"
                  >
                    <Settings className="settings-icon" />
                    <span>Settings</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
          {/* <SidebarGroupContent>
            <SidebarMenu className="sidebar_menu">
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className="sidebarMenuItem">
                  <SidebarMenuButton className="sidebarMenuBtn" asChild>
                    <a
                      href={`/platform/${organization}/${item.url}/`}
                      className="sideBarItem"
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
            </SidebarMenu>
          </SidebarGroupContent> */}
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
