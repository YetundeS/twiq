"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import "./mt.css";
import { assistantPromptTemplates } from "@/constants/model";

const ModelTemplates = ({ setInputValue }) => {
  const pathname = usePathname();
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    const key = pathname?.split("/").pop(); // gets 'carousel' from '/carousel'
    const matchedTemplates = assistantPromptTemplates[key];

    if (matchedTemplates) {
      setTemplates(matchedTemplates);
    } else {
      setTemplates([]);
    }
  }, [pathname]);

  return (
    <div className="modelTemplates">
      <h3 className="templatesTitle">Templates</h3>
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
