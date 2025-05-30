"use client";

import { useEffect, useRef, useState } from "react";
import { SITE_CONTENT } from "@/constants/landingPageContent";
import { TextEffect } from "../ui/text-effect";
import { useInView, motion } from "framer-motion";

export function HowItWorksSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [playVideo, setPlayVideo] = useState(false);
  const videoRef = useRef(null);
  const isInView = useInView(videoRef, { once: true, margin: "-100px" });

  const videoSrc =
    "https://res.cloudinary.com/dwkqk3925/video/upload/v1746966360/storyCraft/videos/utqktqogfz81ppuyzbev.mp4";

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 },
    );

    const section = document.querySelector(".how-it-works-section");
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="how-it-works-section py-18">
      <div className="mx-auto max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        {/* Text Content Row */}
        <div className="mx-auto mb-20 flex flex-col justify-center gap-12 md:flex-row">
          {/* Left Column - Main Headline */}
          <div
            className={`transition-all duration-800 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <div className="animate-fade-in-up max-w-[500px] text-xl leading-tight font-medium text-gray-900 sm:text-2xl lg:text-3xl dark:text-gray-100">
              <TextEffect per="char" preset="fade-in-blur" delay={1}>
                {SITE_CONTENT.howItWorks.headline}
              </TextEffect>
            </div>
          </div>

          {/* Right Column - Description */}
          <div
            className={`transition-all delay-200 duration-800 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <div className="animate-fade-in-up animation-delay-200 max-w-[400px] space-y-6">
              <div className="leading-relaxed text-gray-700 dark:text-gray-300">
                <TextEffect per="char" preset="fade-in-blur" delay={1}>
                  {SITE_CONTENT.howItWorks.subheading}
                </TextEffect>
              </div>
              <div className="leading-relaxed text-gray-600 dark:text-gray-400">
                <TextEffect per="char" preset="fade-in-blur" delay={1}>
                  {SITE_CONTENT.howItWorks.description}
                </TextEffect>
              </div>
            </div>
          </div>
        </div>

        {/* Video Section */}
        <motion.div
          ref={videoRef}
          initial={{ opacity: 0, filter: "blur(12px)", y: 40 }}
          animate={
            isInView
              ? { opacity: 1, filter: "blur(0px)", y: 0 }
              : { opacity: 0, filter: "blur(12px)", y: 40 }
          }
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mx-auto w-full max-w-5xl"
        >
          <div className="hover:shadow-3xl relative aspect-video overflow-hidden rounded-3xl border border-gray-300/50 shadow-2xl transition-all duration-300 dark:border-gray-600/50">
            {!playVideo ? (
              <>
                <video
                  className="absolute inset-0 h-full w-full object-cover"
                  src={videoSrc}
                  preload="metadata"
                  muted
                  playsInline
                  poster=""
                />
                <div className="absolute inset-0 z-10 flex items-center justify-center">
                  <div
                    onClick={() => setPlayVideo(true)}
                    className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-full border border-gray-300 bg-white transition-transform duration-200 hover:scale-110 dark:border-gray-500"
                  >
                    <svg
                      className="ml-1 h-8 w-8 text-gray-800"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </>
            ) : (
              <video
                className="h-full w-full rounded-3xl"
                controls
                autoPlay
                playsInline
                src={videoSrc}
              />
            )}
          </div>
        </motion.div>
      </div>
      <div className="hero-section-end"></div>
    </section>
  );
}
