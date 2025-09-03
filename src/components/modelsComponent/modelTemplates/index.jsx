"use client";

import HelpModelIcon from "@/components/dashboardComponent/helpIcon";
import HelpVidDialog from "@/components/dashboardComponent/helpVideoDialog";
import { assistantDisplayIcons, assistantDisplayNames, assistantPromptTemplates, helpVideoIDs } from "@/constants/model";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { PenTool } from "lucide-react";
import "./mt.css";

const ModelTemplates = ({ setInputValue, assistantSlug }) => {
  const pathname = usePathname();
  const [templates, setTemplates] = useState([]);
  const [assSlug, setAssSlug] = useState('');
  const [assIcon, setAssIcon] = useState('');
  const [helpVideoID, setHelpVideoID] = useState('');

  useEffect(() => {
    const key = assistantSlug ? assistantSlug : pathname?.split("/").pop();
    setAssSlug(assistantDisplayNames[key])
    setAssIcon(assistantDisplayIcons[key])
    setHelpVideoID(helpVideoIDs[key])
    const matchedTemplates = assistantPromptTemplates[key];

    if (matchedTemplates) {
      setTemplates(matchedTemplates);
    } else {
      setTemplates([]);
    }
  }, [pathname, assistantSlug]);

  return (
    <div className="modelTemplates">

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
      <div className="assSlugIcon">
        {assIcon ? (
          <>
            {/* Light mode logo (visible only in light mode) */}
            <Image
              src={`/images/model_icons/${assIcon}_red.png`}
              width={500}
              height={500}
              alt="model icon Light"
              className="modelImg block dark:hidden"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />

            {/* Dark mode logo (visible only in dark mode) */}
            <Image
              src={`/images/model_icons/${assIcon}_light.png`}
              width={500}
              height={500}
              alt="model icon dark"
              className="modelImg hidden dark:block"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </>
        ) : (
          <div className="modelImg w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <PenTool className="text-gray-500 dark:text-gray-400 w-6 h-6" />
          </div>
        )}
        <h3 className="templatesTitle">{assSlug}</h3>
      </div>
      <div className="beginHelp_box">
        <h2 className="shallWeBegin">Shall We Begin?</h2>
        <HelpModelIcon videoID={helpVideoID} />
      </div>
      <div className="modelCard_wrapper">
        {templates.length > 0 &&
          templates.slice(0, 6).map((template, index) => (
            <div key={index} className="modelCard" onClick={() => setInputValue(template)}>
              <p>{template}</p>
            </div>
          ))}
      </div>
      <HelpVidDialog />
    </div>
  );
};

export default ModelTemplates; 
