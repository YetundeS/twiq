"use client";

// Tiny client island so parent pages (privacy-policy, terms-of-service, etc.)
// can stay Server Components. Extracted per §10.2.2 "push use client
// boundaries down the tree" — the surrounding prose renders on the server
// and only this button hydrates.

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const DEFAULT_CLASSES =
  "flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:border-gray-400 hover:text-black dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-white";

export default function BackButton({ className, label = "Back", fallbackHref = "/" }) {
  const router = useRouter();

  // router.back() with no history (direct-link visit from a bookmark or
  // shared URL) navigates to whatever the browser holds — could be blank.
  // Fall back to fallbackHref when the user has no in-app history.
  // qcheck L2 fix.
  const handleClick = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  };

  // `||` (not `??`) so an explicit "" from a caller falls back to the
  // default — an unstyled button is almost certainly not the intent
  // (qcheck L1).
  return (
    <button
      type="button"
      onClick={handleClick}
      className={className || DEFAULT_CLASSES}
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </button>
  );
}
