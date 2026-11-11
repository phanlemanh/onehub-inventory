"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";

import { FRAME_COPY } from "@/components/templates/frame-copy";
import { notifyResult } from "@/components/templates/notify";
import { saveWithBanner } from "@/components/templates/screen-banner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Work = () => Promise<void> | void;

interface ChangeBase {
  /** The verb on the confirm button, e.g. «Xoá căn»: the button names exactly what happens. */
  verb: string;
  /** What will happen, in one sentence, shown before an irreversible change. */
  what: string;
  /** The toast after the change, e.g. «Đã đổi giá căn S1.01-0201.» */
  done: string;
  apply: Work;
  /** The change sends something outside the company (a link, a message): always confirmed. */
  leavesCompany?: boolean;
}

/** What a screen declares about one change; the shared door decides how it behaves. */
export type Change =
  | (ChangeBase & { reversible: true; undo: Work })
  | (ChangeBase & { reversible: false; undo?: never });

/**
 * The save rule of design/behaviors.md: a reversible change inside the company runs at once and the toast offers
 * «Hoàn tác»; an irreversible change, or one that leaves the company, is confirmed first.
 */
export function needsConfirmation(change: Pick<Change, "reversible" | "leavesCompany">): boolean {
  return !change.reversible || change.leavesCompany === true;
}

/**
 * The one door for saving and undoing. `run(change)` applies the rule above; a save that fails because the device
 * is offline goes to the screen banner and leaves the form alone (1a). Field errors are not this door's business:
 * they stay at the field (notification channel `field` → inline). Render `dialog` once in the screen.
 */
export function useChange(): { run: (change: Change) => Promise<boolean>; dialog: ReactNode } {
  const [pending, setPending] = useState<Change | null>(null);
  const settle = useRef<((ran: boolean) => void) | null>(null);

  const apply = useCallback(async (change: Change): Promise<boolean> => {
    const saved = await saveWithBanner(async () => {
      await change.apply();
    });
    if (!saved) return false;
    const undo = !needsConfirmation(change) && change.reversible ? change.undo : undefined;
    notifyResult({ message: change.done, undo: undo ? () => void undo() : undefined });
    return true;
  }, []);

  const run = useCallback(
    (change: Change): Promise<boolean> => {
      if (!needsConfirmation(change)) return apply(change);
      return new Promise<boolean>((resolve) => {
        settle.current = resolve;
        setPending(change);
      });
    },
    [apply],
  );

  const close = (confirmed: boolean) => {
    const change = pending;
    const resolve = settle.current;
    settle.current = null;
    setPending(null);
    if (!change || !resolve) return;
    if (!confirmed) resolve(false);
    else void apply(change).then(resolve, () => resolve(false));
  };

  const dialog = (
    <Dialog
      open={pending !== null}
      onOpenChange={(open) => {
        if (!open) close(false);
      }}
    >
      <DialogContent showCloseButton={false} data-slot="confirm-change">
        <DialogHeader>
          <DialogTitle>{pending ? FRAME_COPY.confirm.title(pending.verb) : null}</DialogTitle>
          <DialogDescription>
            <span data-part="note">{FRAME_COPY.confirm.note}</span>{" "}
            <span data-part="what">{pending?.what}</span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            {FRAME_COPY.confirm.cancel}
          </DialogClose>
          <Button onClick={() => close(true)}>{pending?.verb}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return { run, dialog };
}
