"use client";

import HelpModelIcon from "@/components/dashboardComponent/helpIcon";
import HelpVidDialog from "@/components/dashboardComponent/helpVideoDialog";
import { resolveCoachIcon } from "@/constants/coachIconPresets";
import { assistantDisplayIcons, assistantDisplayNames, assistantPromptTemplates, helpVideoIDs } from "@/constants/model";
import { PenTool } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import "./mt.css";

const ModelTemplates = ({ setInputValue, assistantSlug, coach }) => {
  const pathname = usePathname();
  const [templates, setTemplates] = useState([]);
  const [assSlug, setAssSlug] = useState('');
  const [assIcon, setAssIcon] = useState('');
  const [customIconResolved, setCustomIconResolved] = useState({ kind: "none" });
  const [helpVideoID, setHelpVideoID] = useState('');

  useEffect(() => {
    const key = assistantSlug ? assistantSlug : pathname?.split("/").pop();

    // Prefer the coach's server-side fields when present. Falls back to
    // the constants map so seed coaches keep their curated display names,
    // icon set, and prompt starters until an admin overrides them.
    const displayName = coach?.display_name || assistantDisplayNames[key];
    const resolved = resolveCoachIcon(coach?.icon_url);
    const iconKey = resolved.kind === "none" ? assistantDisplayIcons[key] : null;
    const coachPrompts = Array.isArray(coach?.prompt_templates)
      ? coach.prompt_templates.filter((p) => typeof p === "string" && p.trim())
      : null;
    const matchedTemplates =
      coachPrompts && coachPrompts.length > 0
        ? coachPrompts
        : assistantPromptTemplates[key];

    setAssSlug(displayName);
    setAssIcon(iconKey);
    setCustomIconResolved(resolved);
    setHelpVideoID(helpVideoIDs[key]);
    setTemplates(matchedTemplates || []);
  }, [pathname, assistantSlug, coach]);

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
        {customIconResolved.kind === "lucide" ? (
          // Preset picker — render the lucide component. Sized to match the
          // seed coaches' Image dimensions (~120px on the chat surface).
          <customIconResolved.Icon
            aria-label={`${assSlug || "coach"} icon`}
            className="modelImg h-24 w-24"
          />
        ) : customIconResolved.kind === "image" ? (
          // Backwards compat — a legacy URL that pre-dates the preset picker.
          // One image serves both themes because arbitrary URLs don't ship in
          // a red/light pair; falls through to the PenTool placeholder on
          // load failure.
          <Image
            src={customIconResolved.src}
            width={500}
            height={500}
            alt={`${assSlug || "coach"} icon`}
            className="modelImg"
            unoptimized
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : assIcon ? (
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
