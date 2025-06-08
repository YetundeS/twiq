"use client";

import { assistantDisplayNames, assistantPromptTemplates } from "@/constants/model";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import "./mt.css";

const ModelTemplates = ({ setInputValue, assistantSlug }) => {
  const pathname = usePathname();
  const [templates, setTemplates] = useState([]);
  const [assSlug, setAssSlug] = useState();

  useEffect(() => {
    const key = assistantSlug ? assistantSlug : pathname?.split("/").pop();
    setAssSlug(assistantDisplayNames[key])
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
      <h3 className="templatesTitle">{assSlug}</h3>
      <div className="modelCard_wrapper">
        {templates.length > 0 &&
          templates.slice(0, 6).map((template, index) => (
            <div key={index} className="modelCard" onClick={() => setInputValue(template)}>
              <p>{template}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ModelTemplates; 
