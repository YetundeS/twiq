import { motion } from "framer-motion";

export default function GlowEffect({ children }) {
  return (
    <div className="relative inline-block">
      <motion.div
        className={`pointer-events-none absolute inset-0 z-0 rounded-xl opacity-40 blur-[30px] dark:opacity-60`}
        style={{
          background: `
            linear-gradient(
              90deg,
              #00f0ff 0%,
              #00f0ff 20%,
              #00ff8c 30%,
              #888888 50%,
              #ff6bff 70%,
              #ff00f7 80%,
              #ff003c 100%
            )
          `,
          backgroundSize: "300% 100%",
        }}
        animate={{
          backgroundPosition: [
            "100% 0%",
            "50% 0%",
            "0% 0%",
            "50% 0%",
            "100% 0%",
          ],
          opacity: [0.3, 0.5, 0.3], // pulsing
        }}
        transition={{
          duration: 8,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />

      <div
        className="pointer-events-none absolute inset-1 z-0 rounded-xl opacity-20 blur-2xl dark:opacity-30"
        style={{
          background: "radial-gradient(circle, white 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
}
