import { motion } from "framer-motion";

export default function GlowEffect({ children, blurAmount = 30 }) {
  return (
    <div className="relative inline-block">
      {/* Animated Gradient Glow */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 rounded-xl blur-[30px] opacity-40 dark:opacity-60"
        style={{
          background: `
            linear-gradient(
              90deg,
              #5A0001 0%,
              #b56c71 25%,
              #bf8487 45%,
              #e1c3c3 65%,
              #ffb3a7 80%,
              #5A0001 100%
            )
          `,
          backgroundSize: "300% 100%",
          filter: `blur(${blurAmount}px)`,
        }}
        animate={{
          backgroundPosition: [
            "100% 0%",
            "50% 0%",
            "0% 0%",
            "50% 0%",
            "100% 0%",
          ],
          opacity: [0.7, 0.95, 0.7], // subtle pulsing
        }}
        transition={{
          duration: 5,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />

      {/* Static radial glow to enhance center focus */}
      <div
        className="pointer-events-none absolute inset-1 z-0 rounded-xl opacity-40 blur-1xl dark:opacity-50"
        style={{
          background: "radial-gradient(circle, #ffffff 0%, transparent 70%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
