// Structural loading state for the chat message window (§10.2 perf sprint).
// Renders alternating user/assistant message bubbles matching the real
// layout's widths so the user's eye locks onto the eventual message shape
// immediately — perceived-perf win vs a spinning circle.

import { Skeleton } from "@/components/ui/skeleton";

// Alternating widths + alignments to hint at "user asks short, coach
// answers longer". Four bubbles is enough to fill the visible area
// without looking padded.
const BUBBLES = [
  { align: "user",      widthClass: "w-40 sm:w-52" },
  { align: "assistant", widthClass: "w-full max-w-lg" },
  { align: "user",      widthClass: "w-56 sm:w-64" },
  { align: "assistant", widthClass: "w-full max-w-xl" },
];

export default function MessageListSkeleton() {
  return (
    <div
      className="flex flex-col gap-6 px-4 py-6"
      role="status"
      aria-label="Loading messages"
      data-testid="message-list-skeleton"
    >
      {BUBBLES.map((b, i) => (
        <div
          key={i}
          className={`flex ${b.align === "user" ? "justify-end" : "justify-start"}`}
        >
          <div className={`flex flex-col gap-2 ${b.widthClass}`}>
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            {b.align === "assistant" && <Skeleton className="h-4 w-5/6" />}
          </div>
        </div>
      ))}
    </div>
  );
}
