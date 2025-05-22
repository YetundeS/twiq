"use client";

import "./dpc.css";
import { PanelRightOpen, SquarePen } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import ModelOverview from "@/components/modelOverview";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useAuthStore from "@/store/authStore";
import { useHydrationZustand } from "@codebayu/use-hydration-zustand";
import { generateSignString } from "@/lib/utils";
import { fetchUser } from "@/apiCalls/authAPI";
import Image from "next/image";
import { useSideBar } from "@/store/sidebarStore";
import { modelsOverview } from "../../../../constants/dahsboard";

const DashboardPageContent = () => {
  const router = useRouter();
  const [organization, setOrganization] = useState("");
  const { isSidebarOpen, setIsSidebarOpen } = useSideBar();

  const { user, updateUser } = useAuthStore();

  const isHydrated = useHydrationZustand(useAuthStore);

  useEffect(() => {
    if (isHydrated && !user) {
      router.push("/");
    }
  }, [user, isHydrated]);

  useEffect(() => {
    if (!user) return;
    const signString = generateSignString(user?.organization_name);
    setOrganization(signString);
  }, [user]);

  useEffect(() => {
    fetchUser(updateUser);
  }, []); // Runs only on mount (hard reload)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="page_content">
      <div className="pageTop">
        {!isSidebarOpen && (
          <>
            <div onClick={toggleSidebar} className="pageTop_iconWrapper">
              <PanelRightOpen size="22px" className="pageTop_icons" />
            </div>
            <div className="pageTop_iconWrapper">
              <SquarePen size="22px" className="pageTop_icons" />
            </div>
          </>
        )}
      </div>
      <div className="pageBody">
        <div className="aboveTheFold">
          <h2 className="dashboardTitle">Welcome, {user?.user_name}</h2>
          {user?.logo_url && (
            <Image
              src={user?.logo_url}
              width={700}
              height={400}
              alt="logo"
              className="userLogo"
            />
          )}
        </div>
        <Separator className="seperatorCss" />
        <div className="modelsOverview">
          {modelsOverview?.map((model, i) => (
            <ModelOverview
              model={model}
              key={i}
              organizationName={organization}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPageContent;
