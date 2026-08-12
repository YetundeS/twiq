// Structural loading state for the sidebar session list (§10.2 perf
// sprint). Six ghost rows match the real sessionRow layout closely
// enough that the eye locks onto the eventual list shape.

import { Skeleton } from "@/components/ui/skeleton";

const ROW_COUNT = 6;

export default function SessionListSkeleton() {
  return (
    <div
      className="flex flex-col gap-2 px-2 py-1"
      role="status"
      aria-label="Loading chat sessions"
      data-testid="session-list-skeleton"
    >
      {Array.from({ length: ROW_COUNT }).map((_, i) => (
        <div key={i} className="flex items-center gap-2 py-1">
          <Skeleton className="h-4 w-4 shrink-0 rounded-sm" />
          <Skeleton className="h-4 flex-1" />
        </div>
      ))}
    </div>
  );
}
