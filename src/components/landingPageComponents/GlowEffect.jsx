"use client";

import { motion } from "framer-motion";

export function GlowEffect({ children }) {
  return (
    <div className="relative isolate">
      {/* Main animated glow */}
      <motion.div
        className="absolute inset-x-[-12%] inset-y-[-6%] z-0 rounded-[inherit] opacity-40 blur-2xl"
        style={{
          filter: "blur(40px)",
          background:
            "linear-gradient(45deg, #fbcfe8, #e879f9, #c084fc, #93c5fd, #bfdbfe)",
        }}
        animate={{
          scale: [1, 1.05, 0.98, 1.03, 1],
          opacity: [0.3, 0.45, 0.25, 0.4, 0.3],
          rotate: [0, 2, -1, 1, 0],
          x: [0, 3, -2, 1, 0],
          y: [0, -2, 3, -1, 0],
          background: [
            "linear-gradient(45deg, #fbcfe8, #e879f9, #c084fc, #93c5fd)",
            "linear-gradient(90deg, #f8bbd9, #a78bfa, #60a5fa, #bfdbfe)",
            "linear-gradient(135deg, #f0abfc, #8b5cf6, #3b82f6, #dbeafe)",
            "linear-gradient(180deg, #c084fc, #6366f1, #93c5fd, #fbcfe8)",
            "linear-gradient(45deg, #fbcfe8, #e879f9, #c084fc, #93c5fd)",
          ],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.2, 0.5, 0.8, 1],
        }}
      />

      {/* Secondary flowing layer */}
      <motion.div
        className="absolute inset-x-[-8%] inset-y-[-4%] z-0 rounded-[inherit] opacity-25 blur-xl"
        style={{
          filter: "blur(30px)",
          background: "linear-gradient(90deg, #f8bbd9, #a78bfa, #60a5fa)",
        }}
        animate={{
          scale: [0.95, 1.08, 0.92, 1.04, 0.95],
          opacity: [0.2, 0.35, 0.15, 0.3, 0.2],
          rotate: [0, -3, 2, -1, 0],
          x: [0, -4, 3, -2, 0],
          y: [0, 4, -3, 2, 0],
          background: [
            "linear-gradient(90deg, #f8bbd9, #a78bfa, #60a5fa)",
            "linear-gradient(135deg, #fbcfe8, #8b5cf6, #3b82f6)",
            "linear-gradient(180deg, #f0abfc, #6366f1, #93c5fd)",
            "linear-gradient(225deg, #c084fc, #4f46e5, #dbeafe)",
            "linear-gradient(90deg, #f8bbd9, #a78bfa, #60a5fa)",
          ],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.25, 0.5, 0.75, 1],
          delay: 0.5,
        }}
      />

      {/* Tertiary subtle pulse */}
      <motion.div
        className="absolute inset-x-[-6%] inset-y-[-3%] z-0 rounded-[inherit] opacity-20 blur-lg"
        style={{
          filter: "blur(20px)",
          background: "linear-gradient(180deg, #f0abfc, #8b5cf6, #93c5fd)",
        }}
        animate={{
          scale: [1.02, 0.94, 1.06, 0.96, 1.02],
          opacity: [0.15, 0.25, 0.1, 0.2, 0.15],
          x: [0, 2, -3, 1, 0],
          y: [0, -3, 1, -2, 0],
          background: [
            "linear-gradient(180deg, #f0abfc, #8b5cf6, #93c5fd)",
            "linear-gradient(270deg, #e879f9, #6366f1, #bfdbfe)",
            "linear-gradient(0deg, #c084fc, #4f46e5, #dbeafe)",
            "linear-gradient(180deg, #f0abfc, #8b5cf6, #93c5fd)",
          ],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Breathing border glow */}
      <motion.div
        className="absolute inset-x-[-3%] inset-y-[-1.5%] z-0 rounded-[inherit] opacity-30"
        style={{
          filter: "blur(10px)",
          background: "linear-gradient(45deg, #f8bbd9, #a78bfa, #93c5fd)",
        }}
        animate={{
          scale: [1, 1.02, 1],
          opacity: [0.25, 0.35, 0.25],
          background: [
            "linear-gradient(45deg, #f8bbd9, #a78bfa, #93c5fd)",
            "linear-gradient(135deg, #f0abfc, #6366f1, #bfdbfe)",
            "linear-gradient(45deg, #f8bbd9, #a78bfa, #93c5fd)",
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.3,
        }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
}
