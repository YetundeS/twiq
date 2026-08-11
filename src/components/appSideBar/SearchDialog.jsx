"use client";

// Cross-session search dialog (§6.11). Pairs with backend GET /api/chats/search.
//
// UX:
// - Trigger button lives next to the sidebar's NewChat action.
// - Dialog opens; input auto-focuses; typing debounces 200ms then fires.
// - Results are grouped by coach so the user sees which model produced them.
// - <mark> highlights come from the backend (ts_headline) — parsed into
//   React elements so we NEVER dangerouslySetInnerHTML.
// - Click a result → navigates to the session with #message-<id> in the URL
//   so a future scroll-into-view hook on the session page can pick it up.

import { searchChatsAPI } from "@/apiCalls/chatSessions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { models as COACHES } from "@/constants/sidebar";
import { generateSignString } from "@/lib/utils";
import useAuthStore from "@/store/authStore";
import { MessagesSquare, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

const MIN_QUERY = 3;
const DEBOUNCE_MS = 200;

// Backend snippet arrives as plain text with <mark>...</mark> around matches.
// Split-and-render as React elements — safer than dangerouslySetInnerHTML
// even though the string is server-controlled today.
function renderSnippet(text) {
  if (typeof text !== "string" || !text) return null;
  const parts = text.split(/(<mark>[^<]*<\/mark>)/g);
  return parts.map((part, i) => {
    const m = part.match(/^<mark>([^<]*)<\/mark>$/);
    if (m) {
      return (
        <mark
          key={i}
          className="rounded bg-yellow-200 px-0.5 text-inherit"
        >
          {m[1]}
        </mark>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

// Map coach slug → display name. Falls back to the raw slug for custom
// coaches added via the admin surface (§12.1) that aren't in the sidebar
// constants yet.
const COACH_NAME_BY_SLUG = COACHES.reduce((acc, m) => {
  acc[m.url] = m.name;
  return acc;
}, {});

function coachName(slug) {
  return COACH_NAME_BY_SLUG[slug] || slug || "Unknown";
}

function groupByCoach(results) {
  const groups = new Map();
  for (const r of results) {
    const slug = r.assistant_slug || "unknown";
    let arr = groups.get(slug);
    if (!arr) {
      arr = [];
      groups.set(slug, arr);
    }
    arr.push(r);
  }
  return [...groups.entries()].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
}

export function SearchDialog({ trigger, open, onOpenChange } = {}) {
  const { user } = useAuthStore();
  const router = useRouter();
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = typeof open === "boolean";
  const dialogOpen = isControlled ? open : uncontrolledOpen;
  const setDialogOpen = isControlled ? onOpenChange : setUncontrolledOpen;

  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const organization = useMemo(
    () => generateSignString(user?.organization_name),
    [user?.organization_name]
  );

  // Debounce the query
  useEffect(() => {
    if (q.trim().length < MIN_QUERY) {
      setDebouncedQ("");
      return;
    }
    const t = setTimeout(() => setDebouncedQ(q.trim()), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [q]);

  // Fire the search whenever the debounced query changes
  useEffect(() => {
    if (!debouncedQ) {
      setResults([]);
      setError(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      const out = await searchChatsAPI(debouncedQ, 20);
      if (cancelled) return;
      if (out.error) {
        setError(out.error);
        setResults([]);
      } else {
        setResults(out.results || []);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [debouncedQ]);

  // Reset when the dialog closes
  useEffect(() => {
    if (!dialogOpen) {
      setQ("");
      setDebouncedQ("");
      setResults([]);
      setError(null);
    } else {
      // Autofocus the input on open. Radix Dialog handles initial focus but
      // sometimes the input isn't in the DOM the first tick.
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [dialogOpen]);

  const grouped = useMemo(() => groupByCoach(results), [results]);
  const showEmpty = !loading && !error && debouncedQ && results.length === 0;
  const showTooShort = q.length > 0 && q.trim().length < MIN_QUERY;

  const openSession = (r) => {
    if (!organization) return;
    const url = `/platform/${organization}/${r.assistant_slug}/${r.session_id}#message-${r.message_id}`;
    router.push(url);
    setDialogOpen(false);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {trigger !== undefined ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Search chats"
            className="sidebarSearchTrigger"
          >
            <Search className="h-4 w-4" />
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Search chats</DialogTitle>
          <DialogDescription>
            Across every session you own. Minimum {MIN_QUERY} characters.
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Type a phrase, word, or -exclusion…"
            className="pl-9"
            aria-label="Search chats input"
          />
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {showTooShort && (
            <p className="px-1 py-4 text-sm text-gray-500">
              Keep going — need at least {MIN_QUERY} characters.
            </p>
          )}

          {loading && (
            <p className="px-1 py-4 text-sm text-gray-500">Searching…</p>
          )}

          {error && (
            <p className="px-1 py-4 text-sm text-red-600">{error}</p>
          )}

          {showEmpty && (
            <p className="px-1 py-4 text-sm text-gray-500">
              No messages match “{debouncedQ}”.
            </p>
          )}

          {!loading && !error && grouped.length > 0 && (
            <div className="space-y-4 pt-2">
              {grouped.map(([slug, rows]) => (
                <section key={slug}>
                  <h4 className="mb-1 px-1 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                    {coachName(slug)}
                    <span className="ml-1 font-normal text-gray-400">
                      ({rows.length})
                    </span>
                  </h4>
                  <ul className="space-y-1">
                    {rows.map((r) => (
                      <li key={`${r.session_id}:${r.message_id}`}>
                        <button
                          type="button"
                          onClick={() => openSession(r)}
                          className="group flex w-full items-start gap-2 rounded px-2 py-2 text-left hover:bg-gray-100"
                        >
                          <MessagesSquare className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-baseline justify-between gap-2">
                              <span className="truncate text-sm font-medium text-gray-900">
                                {r.session_title || "Untitled chat"}
                              </span>
                              <span className="shrink-0 text-xs text-gray-400">
                                {r.sender}
                              </span>
                            </div>
                            <p className="mt-0.5 line-clamp-2 text-xs text-gray-600">
                              {renderSnippet(r.snippet)}
                            </p>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SearchDialog;
