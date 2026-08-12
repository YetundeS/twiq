"use client";

// Per-session model picker (§6.9). Rendered above the chat message window.
//
// UX:
// - "Default (Coach's pick)" is always the first option and clears the
//   override server-side (model_override = null).
// - Other options are the models the caller's plan allows (GET /api/models).
// - Selection triggers PATCH /api/chats/:id — optimistic sidebar update, toast
//   on failure with rollback.
// - Hidden when there's no active session yet (fresh chat pane, pre-first-turn).

import { updateSession } from "@/apiCalls/chatSessions";
import { getModelsAPI } from "@/apiCalls/userAPI";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSideBar } from "@/store/sidebarStore";
import useModelsStore from "@/store/useModelsStore";
import { Check, ChevronDown, Cpu } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

// Strip provider prefix for display: openai/gpt-4o → gpt-4o.
function shortModelId(id) {
  if (!id || typeof id !== "string") return id;
  const parts = id.split("/");
  return parts[parts.length - 1];
}

// Module-scoped cache — GET /api/models is capped 5min in the backend cache
// too, but avoiding the round-trip on every session switch is a nice touch.
let cachedModels = null;
let cachedAt = 0;
const CACHE_MS = 5 * 60 * 1000;

async function loadModelsCached() {
  const now = Date.now();
  if (cachedModels && now - cachedAt < CACHE_MS) return cachedModels;
  const out = await getModelsAPI();
  cachedModels = out.models || [];
  cachedAt = now;
  return cachedModels;
}

export function ModelPicker({ coach }) {
  const { activeSessionID } = useModelsStore();
  const { sidebarSessions, updateSessionInSideBar } = useSideBar();
  const [models, setModels] = useState([]);
  const [busy, setBusy] = useState(false);

  const session = useMemo(
    () => sidebarSessions.find((s) => String(s.id) === String(activeSessionID)) || null,
    [sidebarSessions, activeSessionID]
  );

  useEffect(() => {
    let cancelled = false;
    loadModelsCached()
      .then((m) => { if (!cancelled) setModels(m); })
      .catch(() => { /* silent — picker falls back to coach default */ });
    return () => { cancelled = true; };
  }, []);

  // Hide until there's a session to modify.
  if (!session) return null;

  const currentOverride = session.model_override || null;
  const coachDefault = coach?.default_model || null;
  const effectiveId = currentOverride || coachDefault;
  const effectiveLabel = currentOverride
    ? (models.find((m) => m.model_id === currentOverride)?.display_name
       || shortModelId(currentOverride))
    : `Default${coachDefault ? ` (${shortModelId(coachDefault)})` : ""}`;

  async function pick(nextOverride) {
    if (busy) return;
    // No-op if the click matches the current state.
    if ((nextOverride || null) === currentOverride) return;

    setBusy(true);
    const prev = session.model_override ?? null;
    // Optimistic update.
    updateSessionInSideBar(session.id, { model_override: nextOverride });
    const updated = await updateSession(session.id, { model_override: nextOverride });
    setBusy(false);

    if (!updated) {
      // Rollback on failure. updateSession already toasted the error.
      updateSessionInSideBar(session.id, { model_override: prev });
      return;
    }
    toast.success(
      nextOverride
        ? `Model set to ${models.find((m) => m.model_id === nextOverride)?.display_name || shortModelId(nextOverride)}`
        : "Reverted to coach's default model",
      { style: { border: "none", color: "green" } }
    );
  }

  return (
    <div className="modelPickerWrap flex items-center justify-end gap-2 px-2 py-1 text-xs text-gray-600">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            disabled={busy}
            className="h-7 gap-1 px-2 text-xs font-medium"
            aria-label="Change model for this session"
          >
            <Cpu className="h-3.5 w-3.5 opacity-70" />
            <span className="max-w-[220px] truncate">{effectiveLabel}</span>
            <ChevronDown className="h-3.5 w-3.5 opacity-70" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[240px]">
          <DropdownMenuLabel className="text-xs text-gray-500">
            Model for this session
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => pick(null)}>
            <span className="flex-1">
              Default {coachDefault ? `(${shortModelId(coachDefault)})` : ""}
            </span>
            {currentOverride === null && <Check className="ml-2 h-4 w-4" />}
          </DropdownMenuItem>
          {models.length > 0 && <DropdownMenuSeparator />}
          {models.map((m) => (
            <DropdownMenuItem key={m.model_id} onSelect={() => pick(m.model_id)}>
              <span className="flex-1 truncate">
                {m.display_name}
                <span className="ml-1 text-[11px] text-gray-400">
                  {shortModelId(m.model_id)}
                </span>
              </span>
              {m.model_id === effectiveId && <Check className="ml-2 h-4 w-4" />}
            </DropdownMenuItem>
          ))}
          {models.length === 0 && (
            <DropdownMenuLabel className="text-xs text-gray-400">
              No extra models available for your plan.
            </DropdownMenuLabel>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default ModelPicker;
