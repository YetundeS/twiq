"use client";

import { useState, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE_CONTENT } from "@/constants/landingPageContent";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export function StickyPrompt() {
  const [inputValue, setInputValue] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target.classList.contains("hero-section-end")) {
            if (entry.isIntersecting) {
              setIsVisible(true);
              if (!hasAnimated) setHasAnimated(true);
            } else if (entry.boundingClientRect.top > 0) {
              setIsVisible(false);
            }
          }
        });
      },
      { threshold: 0.1 },
    );

    const heroEndElement = document.querySelector(".hero-section-end");
    if (heroEndElement) {
      observer.observe(heroEndElement);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="sticky-prompt"
          initial={{ opacity: 0, filter: "blur(12px)", y: 40 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          exit={{ opacity: 0, filter: "blur(12px)", y: 40 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed right-4 bottom-4 left-4 z-50"
        >
          <Link href="/auth">
            <div className="mx-auto max-w-2xl">
              <div className="rounded-full border border-gray-200 bg-white bg-white/95 p-4 shadow-2xl backdrop-blur-md dark:border-gray-700 dark:bg-gray-800 dark:bg-gray-800/95">
                <div className="flex items-center gap-2 border-none">
                  <input
                    placeholder={SITE_CONTENT.hero.inputPlaceholder}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="flex-1 resize-none rounded-full border-0 bg-transparent px-2 py-1 focus:border-none focus:ring-0 focus:outline-none"
                  />
                  <Button
                    size="icon"
                    className="group h-8 w-8 flex-shrink-0 cursor-pointer rounded-xl bg-purple-600 transition-all duration-200 hover:scale-105 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
                  >
                    <Send className="h-4 w-4 transform transition-transform duration-200 group-hover:rotate-45" />
                  </Button>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
