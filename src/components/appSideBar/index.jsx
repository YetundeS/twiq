import {
  Home, PanelRightOpen, Settings, SlidersHorizontal, Sparkles, SquarePen
} from "lucide-react";

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
import { useRouter } from "next/navigation";
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

export function AppSidebar() {
  const updateUser = useAuthStore((state) => state.updateUser);
  const { isSidebarOpen, setIsSidebarOpen } = useSideBar();
  const [organization, setOrganization] = useState("");
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;
    const signString = generateSignString(user?.organization_name);
    setOrganization(signString);
  }, [user]);

  // const logOut = () => {
  //   updateUser(null);

  //   logOutUser();
  //   router.push("/auth");
  // };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Sidebar className="sidebar">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="h-max">
            <div className="topAction_box">
              <div onClick={toggleSidebar} className="pageTop_iconWrapper">
                <PanelRightOpen size="22px" className="pageTop_icons" />
              </div>
              <div className="pageTop_iconWrapper">
                <SquarePen size="22px" className="pageTop_icons" />
              </div>
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="sidebar_menu">
              {!ORGANIZATIONAL_ROLES.includes(user?.user_name) && (
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
              <SidebarMenuItem className="sidebarMenuItem">
                <Menubar className="menuBar">
                  <MenubarMenu>
                    <SidebarMenuButton className="sidebarMenuBtn" asChild>
                      <MenubarTrigger className="menubarTrigger">
                        <div className="sideBarItem models">
                          <Home className="home-icon" />
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
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="logOutBar">
              <div className="sideBar_iconBox">
                <Sparkles className="sparkles_icon" />
              </div>
              <div className="logOutTxt">
                <p className="txtHead">Upgrade plan</p>
                <p className="txtsubHead">More access to best features</p>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
