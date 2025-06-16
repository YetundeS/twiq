"use client";

import { Button } from "@/components/ui/button";
import { TextEffect } from "@/components/ui/text-effect";
import { Textarea } from "@/components/ui/textarea";
import { SITE_CONTENT } from "@/constants/landingPageContent";
import { Send } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function HeroSection() {
  const [inputValue, setInputValue] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="mt-32 flex items-center justify-center pt-18 pb-24">
      <div className="mx-auto px-4 text-center sm:px-6 lg:px-8">
        <div
          className={`transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
        >
          {/* Greeting */}
          <div className="align-self-start mb-2 flex justify-self-start text-xl text-gray-900 sm:text-2xl lg:text-3xl dark:text-gray-100">
            <TextEffect per="char" preset="fade-in-blur" delay={1}>
              {SITE_CONTENT.hero.greeting}
            </TextEffect>
          </div>

          {/* Main heading */}
          <div className="align-self-center mb-4 flex justify-self-start text-xl leading-tight text-gray-900 sm:text-2xl lg:text-3xl dark:text-gray-100">
            <TextEffect per="char" preset="fade-in-blur" delay={1}>
              {SITE_CONTENT.hero.mainHeading}
            </TextEffect>
          </div>

          {/* Large Input section with textarea */}
          <Link href={"/"}>
            <div className="relative">
              <div className="animate-fade-in-up animation-delay-400 mx-auto max-w-4xl">
                <div className="hover:shadow-3xl relative rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl transition-all duration-400 ease-in hover:scale-[1.02] dark:border-gray-700 dark:bg-gray-800">
                  <div className="flex items-end gap-4">
                    <Textarea
                      placeholder={SITE_CONTENT.hero.inputPlaceholder}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className="min-h-[180px] flex-1 resize-none border-0 bg-transparent text-xl text-[20px] placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 sm:text-xl md:min-w-[400px] lg:min-w-[600px] dark:text-gray-100 dark:placeholder:text-gray-500"
                      rows={4}
                    />
                    <Button
                      size="icon"
                      className="group h-12 w-12 flex-shrink-0 cursor-pointer rounded-2xl bg-purple-600 transition-all duration-200 hover:scale-105 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
                    >
                      <Send className="h-6 w-6 transform transition-transform duration-200 group-hover:rotate-45" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
