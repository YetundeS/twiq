"use client";

import AuhVisitBtn from "@/components/authComponents/authForms/auhVisitBtn";
import ModelOverview from "@/components/modelOverview";
import useCoaches from "@/hooks/useCoaches";
import { generateSignString } from "@/lib/utils";
import useAuthStore from "@/store/authStore";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { modelsOverview, TWIQ_FURTHER_DESC } from "../../../constants/dahsboard";
import CopyrightTxt from "../copyrightTxt";
import PlatformTop from "../platformTop";
import TwiqBg from "../twiqBg";
import UpgradeBanner from "../UpgradeBanner";
import "./dpc.css";

// Maps a backend coach row → the { title, description[], icon, link }
// shape the ModelOverview card expects. Used for admin-created coaches
// whose slug doesn't have a hardcoded entry in constants/dahsboard.js.
// Description is wrapped in an array to match the two-line seed layout.
function adminCoachToOverview(coach) {
  return {
    title: coach.display_name || coach.slug,
    description: coach.description ? [coach.description] : [],
    icon: null,
    link: coach.slug,
  };
}

const DashboardPageContent = () => {
  const [organization, setOrganization] = useState("");
  const { user } = useAuthStore();
  const { coaches } = useCoaches();
  const [twiqDefinition, setTwiqDefinition] = useState(false)

  useEffect(() => {
    if (!user) return;
    const signString = generateSignString(user?.organization_name);
    setOrganization(signString);
  }, [user]);

  // Merge order matters: keep the 7 hardcoded seed cards in their
  // curated order (marketing copy + icons stay pixel-perfect), then
  // append any admin-created coaches the backend returns that aren't
  // in the hardcoded list. Each card also carries its backend `coach`
  // when available so the plan gate can consult allowed_plans instead
  // of the legacy hardcoded starter/proModels arrays.
  const overviewCards = useMemo(() => {
    const bySlug = new Map((coaches || []).map((c) => [c.slug, c]));
    const seedCards = modelsOverview.map((m) => ({
      model: m,
      coach: bySlug.get(m.link) || null,
    }));
    const seedSlugs = new Set(modelsOverview.map((m) => m.link));
    const adminCards = (coaches || [])
      .filter((c) => !seedSlugs.has(c.slug))
      .map((c) => ({ model: adminCoachToOverview(c), coach: c }));
    return [...seedCards, ...adminCards];
  }, [coaches]);

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
        <PlatformTop db={true} twiqDefinition={twiqDefinition} setTwiqDefinition={setTwiqDefinition} />
      </div>
      <TwiqBg />
      <div className="db_pageBody">
        <div className="db_aboveTheFold dashboard">
          <div className="dashboardLogo">
            <>
              {/* Light mode logo (visible only in light mode) */}
              <Image
                src="/images/logo/twiq_method_logo_black.png"
                width={600}
                height={600}
                alt="TWIQ Logo Light"
                className="dl_logo block dark:hidden"
              />

              {/* Dark mode logo (visible only in dark mode) */}
              <Image
                src="/images/logo/twiq_method_logo_white.png"
                width={600}
                height={600}
                alt="TWIQ Logo Dark"
                className="dl_logo hidden dark:block"
              />
            </>
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
          {overviewCards.map(({ model, coach }) => (
            <ModelOverview
              model={model}
              coach={coach}
              key={model.link}
              organizationName={organization}
              subscription_plan={user?.subscription_plan}
            />
          ))}
        </div>
        <div className="downloadPDF_box">
          <AuhVisitBtn red onClick={handleDownload} text="Dowload TWIQ PDF" />
        </div>
        <CopyrightTxt />
        <UpgradeBanner />
      </div>
    </div>
  );
};

export default DashboardPageContent;
