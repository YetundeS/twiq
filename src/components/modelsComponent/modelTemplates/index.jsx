"use client";

import { assistantPromptTemplates } from "@/constants/model";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import "./mt.css";

const ModelTemplates = ({ setInputValue, assistantSlug }) => {
  const pathname = usePathname();
  const [templates, setTemplates] = useState([]);
  const [assSlug, setAssSlug] = useState();

  useEffect(() => {
    const key = assistantSlug ? assistantSlug : pathname?.split("/").pop();
    setAssSlug(key)
    const matchedTemplates = assistantPromptTemplates[key];

    if (matchedTemplates) {
      setTemplates(matchedTemplates);
    } else {
      setTemplates([]);
    }
  }, [pathname, assistantSlug]);

  return (
    <div className="modelTemplates">
      <h3 className="templatesTitle">{assSlug} Templates</h3>
      <div className="modelCard_wrapper">
        {templates.length > 0 &&
          templates.map((template, index) => (
            <div key={index} className="modelCard" onClick={() => setInputValue(template)}>
              <p>{template}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ModelTemplates; 
