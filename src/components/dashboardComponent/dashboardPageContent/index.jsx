"use client";

import ModelOverview from "@/components/modelOverview";
import { generateSignString } from "@/lib/utils";
import useAuthStore from "@/store/authStore";
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
    <div className="db_page_content">
      <div className="db_pageTop">
        <PlatformTop />
      </div>
      <div className="db_pageBody">
        <div className="db_aboveTheFold">
          <TitleWithUnderline title={`Welcome, ${user?.user_name}`} />
        </div>
        <div className="db_modelsOverview">
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
