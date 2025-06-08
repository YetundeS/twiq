"use client";

import AuhVisitBtn from "@/components/authComponents/authForms/auhVisitBtn";
import ModelOverview from "@/components/modelOverview";
import { generateSignString } from "@/lib/utils";
import useAuthStore from "@/store/authStore";
import Image from "next/image";
import { useEffect, useState } from "react";
import { modelsOverview, TWIQ_FURTHER_DESC } from "../../../constants/dahsboard";
import CopyrightTxt from "../copyrightTxt";
import PlatformTop from "../platformTop";
import "./dpc.css";

const DashboardPageContent = () => {
  const [organization, setOrganization] = useState("");
  const { user } = useAuthStore();
  const [twiqDefinition, setTwiqDefinition] = useState(false)

  useEffect(() => {
    if (!user) return;
    const signString = generateSignString(user?.organization_name);
    setOrganization(signString);
  }, [user]);
  
const handleDownload = () => {
  const link = document.createElement('a');
  link.href = '/WHAT-IS-T.W.I.Q+Method.pdf';
  link.download = 'TWIQ-Method.pdf'; // This will rename it on download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


  return (
    <div className="db_page_content">
      <div className="db_pageTop">
        <PlatformTop twiqDefinition={twiqDefinition} setTwiqDefinition={setTwiqDefinition} />
      </div>
      <div className="db_pageBody">
        <div className="db_aboveTheFold">
          <div className="dashboardLogo">
            <Image
              src={"/images/logo/twiq_method_logo_black.png"}
              width={600}
              height={600}
              alt="twiq logo"
              className="dl_logo"
            />
          </div>
          {twiqDefinition && (
            <div className="twiqDef_title">
            <h2 className="title">What is <span>T.W.I.Q.</span> Method</h2>
          </div>
          )}
        </div>
        <div className="twiq_description_container">
          <p className="descTxt">The TWIQ Method™ is a strategic content framework developed by Yetunde Shorters to help coaches, creators, and C-suite executives create content that connects, converts, and actually sounds like you. 10X your know, like and trust factor, so you can focus on being the visionary you are made to be and leave the content creation to TOPE your TWIQ BOT.</p>
        </div>
       {twiqDefinition && (
        <div className="twiq_furtherDescription_container">
          {TWIQ_FURTHER_DESC?.map((tfd, i) => (
            <div key={i} className="tfd_wrapper">
              <h2 className="tfd_letter">{tfd?.letter}</h2>
              <p className="tfd_header">{tfd?.header}</p>
              <p className="tfd_desc">{tfd?.desc}</p>
            </div>
          ))}
        </div>
        )}
        <div className="db_modelsOverview">
          {!twiqDefinition && (
            <ModelOverview
            onClick={() => setTwiqDefinition(true)}
            specialModel={true}
          />)}
          {modelsOverview?.map((model, i) => (
            <ModelOverview
              model={model}
              key={i}
              organizationName={organization}
            />
          ))}
        </div>
        <div className="downloadPDF_box">
          <AuhVisitBtn red onClick={handleDownload} text="Dowload TWIQ PDF" />
        </div>
        <CopyrightTxt />
      </div>
    </div>
  );
};

export default DashboardPageContent;
