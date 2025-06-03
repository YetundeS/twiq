"use client";

import ModelOverview from "@/components/modelOverview";
import { generateSignString } from "@/lib/utils";
import useAuthStore from "@/store/authStore";
import Image from "next/image";
import { useEffect, useState } from "react";
import { modelsOverview } from "../../../constants/dahsboard";
import PlatformTop from "../platformTop";
import TitleWithUnderline from "../titleWithUnderline";
import "./dpc.css";

const DashboardPageContent = () => {
 const [organization, setOrganization] = useState("");
  const { user } = useAuthStore();
 
  useEffect(() => {
    if (!user) return;
    const signString = generateSignString(user?.organization_name);
    setOrganization(signString);
  }, [user]);
  

  return (
    <div className="page_content ">
      <div className="pageTop">
        <PlatformTop />
      </div>
      <div className="pageBody">
        <div className="aboveTheFold">
          <TitleWithUnderline title={`Welcome, ${user?.user_name}`} />
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
