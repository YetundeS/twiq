"use client";

// Tiny client island so parent pages (privacy-policy, terms-of-service, etc.)
// can stay Server Components. Extracted per §10.2.2 "push use client
// boundaries down the tree" — the surrounding prose renders on the server
// and only this button hydrates.

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton({ className, label = "Back" }) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.back()}
      className={
        className ??
        "flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:border-gray-400 hover:text-black dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-white"
      }
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </button>
  );
}
