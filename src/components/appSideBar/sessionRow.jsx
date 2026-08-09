"use client";

import { deleteSession as deleteSessionApi, updateSession as updateSessionApi } from "@/apiCalls/chatSessions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { useSideBar } from "@/store/sidebarStore";
import useModelsStore from "@/store/useModelsStore";
import { Archive, ArchiveRestore, MessagesSquare, MoreHorizontal, Pin, PinOff, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export function SessionRow({ session, organization, activeSessionID }) {
  const router = useRouter();
  const { updateSessionInSideBar, removeFromSideBarSessions } = useSideBar();
  const { activeSessionID: currentActiveId, updateActiveSessionID } = useModelsStore();

  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(session.title || "");
  const [renameSaving, setRenameSaving] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteInFlight, setDeleteInFlight] = useState(false);
  const [pinInFlight, setPinInFlight] = useState(false);
  const [archiveInFlight, setArchiveInFlight] = useState(false);
  const renameInputRef = useRef(null);

  const isActive = activeSessionID === session.id;
  const isPinned = !!session.pinned;
  const isArchived = !!session.archived_at;
  const busy = renameSaving || deleteInFlight || pinInFlight || archiveInFlight;

  useEffect(() => {
    if (isRenaming) {
      renameInputRef.current?.focus();
      renameInputRef.current?.select();
    }
  }, [isRenaming]);

  const commitRename = async () => {
    const next = renameValue.trim();
    if (!next || next === session.title) {
      setIsRenaming(false);
      setRenameValue(session.title || "");
      return;
    }

    setRenameSaving(true);
    // Optimistic
    updateSessionInSideBar(session.id, { title: next });
    const updated = await updateSessionApi(session.id, { title: next });
    setRenameSaving(false);
    setIsRenaming(false);

    if (!updated) {
      // Roll back on failure — toast already fired inside updateSessionApi
      updateSessionInSideBar(session.id, { title: session.title });
      setRenameValue(session.title || "");
    }
  };

  const cancelRename = () => {
    setIsRenaming(false);
    setRenameValue(session.title || "");
  };

  const togglePin = async () => {
    const next = !isPinned;
    setPinInFlight(true);
    updateSessionInSideBar(session.id, { pinned: next });
    const updated = await updateSessionApi(session.id, { pinned: next });
    setPinInFlight(false);
    if (!updated) {
      updateSessionInSideBar(session.id, { pinned: isPinned });
    }
  };

  const toggleArchive = async () => {
    const next = isArchived ? null : new Date().toISOString();
    setArchiveInFlight(true);
    updateSessionInSideBar(session.id, { archived_at: next });
    const updated = await updateSessionApi(session.id, { archived_at: next });
    setArchiveInFlight(false);
    if (!updated) {
      updateSessionInSideBar(session.id, { archived_at: session.archived_at ?? null });
    }
  };

  const confirmDelete = async () => {
    setDeleteInFlight(true);
    const ok = await deleteSessionApi(session.id);
    setDeleteInFlight(false);

    if (!ok) return;

    removeFromSideBarSessions(session.id);
    setConfirmDeleteOpen(false);
    toast.success("Chat deleted");

    if (currentActiveId === session.id) {
      updateActiveSessionID(null);
      router.push(`/platform/${organization}/${session.assistant_slug}/`);
    }
  };

  return (
    <>
      <SidebarMenuItem className="sidebarMenuItem sessionRow" data-pinned={isPinned || undefined}>
        {isRenaming ? (
          <div className="sideBarItem sessionRowRenaming">
            <MessagesSquare />
            <Input
              ref={renameInputRef}
              value={renameValue}
              disabled={renameSaving}
              onChange={(e) => setRenameValue(e.target.value)}
              onBlur={commitRename}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  commitRename();
                } else if (e.key === "Escape") {
                  e.preventDefault();
                  cancelRename();
                }
              }}
              className="sessionRowRenameInput"
              maxLength={120}
            />
          </div>
        ) : (
          <div className="sessionRowShell">
            <SidebarMenuButton className="sidebarMenuBtn sessionRowLink" asChild>
              <Link
                href={`/platform/${organization}/${session.assistant_slug}/${session.id}`}
                className={`sideBarItem ${isActive ? "active" : ""}`}
              >
                {isPinned ? <Pin className="sessionRowPinIcon" /> : <MessagesSquare />}
                <span className="sessionRowTitle">{session.title || "Untitled chat"}</span>
              </Link>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="sessionRowMenuTrigger"
                  aria-label="Session actions"
                  disabled={busy}
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal size={16} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="sessionRowMenuContent">
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    setIsRenaming(true);
                  }}
                >
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    togglePin();
                  }}
                >
                  {isPinned ? (
                    <>
                      <PinOff size={14} /> Unpin
                    </>
                  ) : (
                    <>
                      <Pin size={14} /> Pin
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    toggleArchive();
                  }}
                >
                  {isArchived ? (
                    <>
                      <ArchiveRestore size={14} /> Unarchive
                    </>
                  ) : (
                    <>
                      <Archive size={14} /> Archive
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="sessionRowMenuDelete"
                  onSelect={(e) => {
                    e.preventDefault();
                    setConfirmDeleteOpen(true);
                  }}
                >
                  <Trash2 size={14} /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </SidebarMenuItem>

      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this chat?</DialogTitle>
            <DialogDescription>
              This will permanently delete the chat, its messages, and any uploaded files.
              This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setConfirmDeleteOpen(false)}
              disabled={deleteInFlight}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteInFlight}
            >
              {deleteInFlight ? "Deleting…" : "Delete chat"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
