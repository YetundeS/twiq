"use client";

import ModelOverview from "@/components/modelOverview";
import { Separator } from "@/components/ui/separator";
import { generateSignString } from "@/lib/utils";
import useAuthStore from "@/store/authStore";
import { useSideBar } from "@/store/sidebarStore";
import { PanelRightOpen, SquarePen } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { modelsOverview } from "../../../constants/dahsboard";
import "./dpc.css";

const DashboardPageContent = () => {
 const [organization, setOrganization] = useState("");
  const { isSidebarOpen, setIsSidebarOpen } = useSideBar();

  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;
    const signString = generateSignString(user?.organization_name);
    setOrganization(signString);
  }, [user]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="page_content">
      <div className="pageTop">
        {!isSidebarOpen && (
          <>
            <div onClick={toggleSidebar} className="pageTop_iconWrapper">
              <PanelRightOpen size="22px"/>
            </div>
            <div className="pageTop_iconWrapper">
              <SquarePen size="22px"/>
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
