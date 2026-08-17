"use client";

// Small controlled confirm dialog for admin destructive actions.
// Replaces `window.confirm(...)` — the native browser prompt looks
// dated, doesn't match the app's theme, and can't render a title/body
// pair. Uses the same shadcn Dialog primitive as sessionRow.jsx's
// delete-confirm so the visual language is consistent.
//
// Contract:
//   open           — controlled visibility (bool)
//   onOpenChange   — required, called with false on dismiss
//   title          — heading text
//   description    — body copy, one short sentence explaining consequences
//   confirmLabel   — label for the destructive button (default "Confirm")
//   busyLabel      — label while busy (default equals confirmLabel + "…")
//   busy           — disables both buttons; swaps confirm label to busyLabel
//   onConfirm      — async or sync handler. Caller is responsible for
//                    closing the dialog after success (usually by clearing
//                    the item-being-confirmed state).

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  busyLabel,
  busy = false,
  onConfirm,
}) {
  const resolvedBusyLabel = busyLabel ?? `${confirmLabel}…`;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={busy}
          >
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={busy}>
            {busy ? resolvedBusyLabel : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
