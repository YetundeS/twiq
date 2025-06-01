"use client";

import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { FeatureCard } from "./FeatureCard";

export function FeatureCardsSequence() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Transition ranges for 3 cards stacked in the same space
  const card1Opacity = useTransform(
    scrollYProgress,
    [0, 0.25, 0.35],
    [1, 1, 0],
  );
  const card1Blur = useTransform(scrollYProgress, [0.25, 0.35], [0, 10]);

  const card2Opacity = useTransform(
    scrollYProgress,
    [0.3, 0.5, 0.6],
    [0, 1, 0],
  );
  const card2Blur = useTransform(scrollYProgress, [0.5, 0.6], [0, 10]);

  const card3Opacity = useTransform(
    scrollYProgress,
    [0.55, 0.75, 1],
    [0, 1, 1],
  );
  const card3Blur = useTransform(scrollYProgress, [0.55, 0.75], [10, 0]);

  return (
    <div ref={containerRef} className="relative h-[300vh]">
      <div className="sticky top-0 flex h-screen w-full items-center justify-center">
        <motion.div className="absolute z-10 flex h-full w-full items-center justify-center">
          <FeatureCard opacity={card3Opacity} blur={card3Blur} />
        </motion.div>

        <motion.div className="absolute z-20 flex h-full w-full items-center justify-center">
          <FeatureCard opacity={card2Opacity} blur={card2Blur} />
        </motion.div>

        <motion.div className="absolute z-30 flex h-full w-full items-center justify-center">
          <FeatureCard opacity={card1Opacity} blur={card1Blur} />
        </motion.div>
      </div>
    </div>
  );
}
