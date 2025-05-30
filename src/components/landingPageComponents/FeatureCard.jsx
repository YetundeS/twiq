"use client";

import { useEffect, useState, useRef } from "react";
import { ThumbsUp } from "lucide-react";
import Image from "next/image";
import placeholderImage from "../../../public/images/placeholder-image.webp";

import { motion } from "framer-motion";

export function FeatureCard({ opacity = 1, blur = 0, zIndex = 1 }) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

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

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <motion.section
      style={{
        opacity,
        filter: `blur(${blur}px)`,
        zIndex,
      }}
      ref={sectionRef}
      className="relative py-32"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <div
            className={`relative w-full max-w-4xl transition-all duration-800 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            {/* Icon  */}
            <div className="absolute -top-8 left-1/2 z-20 -translate-x-1/2 transform">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-purple-200/50 bg-purple-100 shadow-xl backdrop-blur-sm dark:border-purple-600/50 dark:bg-purple-800/50">
                <div className="text-purple-600 dark:text-purple-300">
                  <ThumbsUp className="h-8 w-8" />
                </div>
              </div>
            </div>

            {/* Main white container */}
            <div className="relative overflow-visible rounded-3xl border border-gray-200/50 bg-white/90 px-12 pt-14 pb-12 shadow-2xl backdrop-blur-sm dark:border-gray-500/50 dark:bg-gray-700/90">
              {/* Text content */}
              <div className="mb-20 text-center">
                <h3 className="text-xl leading-tight font-medium text-gray-900 dark:text-gray-100">
                  Saves hours{" "}
                  <span className="text-gray-400 dark:text-gray-400">
                    ideating
                  </span>
                  <br />
                  content and script writing
                </h3>
              </div>

              {/* Image container */}
              <div className="relative -mx-8 -mb-12">
                <div className="relative z-5 scale-110 transform overflow-hidden rounded-3xl shadow-2xl">
                  <Image
                    src={placeholderImage}
                    alt="Content creation interface showing how TWIQ saves time on ideation and script writing"
                    width={1000}
                    height={700}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
