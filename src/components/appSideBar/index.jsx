import {
  Captions,
  Handshake,
  Home,
  LibraryBig,
  LogOut,
  ScanEye,
  Scroll,
  SlidersHorizontal,
  Telescope,
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
import { logOutUser } from "@/apiCalls/authAPI";
import { useEffect, useState } from "react";
import { generateSignString } from "@/lib/utils";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "",
    icon: () => <Home className="home-icon" />,
  },
  {
    title: "Legal Assistant",
    url: "legal-assistant",
    icon: () => <Handshake className="shake-icon" />,
  },
  {
    title: "E-Discovery",
    url: "e-discovery",
    icon: () => <Telescope className="telescope-icon" />,
  },
  {
    title: "Transcription",
    url: "transcription",
    icon: () => <Captions className="caption-icon" />,
  },
  {
    title: "Document Automation",
    url: "document-automation",
    icon: () => <Scroll className="scroll-icon" />,
  },
  {
    title: "Contract Review",
    url: "contract-review",
    icon: () => <ScanEye className="scan-icon" />,
  },
  {
    title: "Company Knowledge Base",
    url: "knowledge-base",
    icon: () => <LibraryBig className="book-icon" />,
  },
];

export const ORGANIZATIONAL_ROLES = [
  "admin", 
  "developer"
]


export function AppSidebar() {
  const updateUser = useAuthStore((state) => state.updateUser);
  const [organization, setOrganization] = useState("");
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;
    const signString = generateSignString(user?.organization_name);
    setOrganization(signString);
  }, [user]);

  const logOut = () => {
    updateUser(null);

    logOutUser();
    router.push("/");
  };

  return (
    <Sidebar className="">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="h-max">
            <div className="userInfo_box">
              <div className="userLetter"><p>{user?.user_name?.[0] || "-"}</p></div>
              <div className="userInfo_subContainer">
                <p className="user_name">{user?.user_name || "username"}</p>
                <p className="user_email">{user?.email || "email"}</p>
              </div>
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="sidebar_menu">
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className="sidebarMenuItem">
                  <SidebarMenuButton asChild>
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
              {ORGANIZATIONAL_ROLES.includes(user?.user_name) && (
                <SidebarMenuItem key={"admin"} className="sidebarMenuItem admin">
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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem onClick={logOut}>
            <SidebarMenuButton className="logOutBar">
              <LogOut /> <span className="logOutTxt">Log Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
