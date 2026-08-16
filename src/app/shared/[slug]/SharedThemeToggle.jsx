"use client";

// Small client-side toggle for the /shared/[slug] shell. Reuses the
// global ThemeProvider mounted at app/layout.js:144 (context updates the
// `.dark` class on <html> + persists to localStorage under "twiq-theme"),
// so viewers of a shared link get the same toggle experience as anywhere
// else in the app. Positioned fixed top-right to sit opposite the logo.

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "@/components/ui/theme-provider";

export default function SharedThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Match the mount-guard from landingPageComponents/Header.jsx — the
  // provider hides children until it has read localStorage, so rendering
  // an icon before mount would flash the wrong one.
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div aria-hidden className="fixed top-4 right-4 z-20 h-9 w-9" />;
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="fixed top-4 right-4 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-700 hover:bg-black/5 dark:text-gray-200 dark:hover:bg-white/10"
    >
      {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </button>
  );
}
