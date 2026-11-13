"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";

import { FRAME_COPY } from "@/components/templates/frame-copy";
import { notify, notifyResult, type NotifyChannel } from "@/components/templates/notify";
import { saveWithBanner } from "@/components/templates/screen-banner";
import { Button } from "@/components/ui/button";
import { writeFailure } from "@/lib/write-failure";
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

/**
 * A change refused because of one field (e.g. «Giá phải lớn hơn 0»). The door sends it down the `field` channel,
 * which is the field itself, and hands it back to the screen with the channel it took: the screen shows it there.
 */
export class FieldError extends Error {
  channel: NotifyChannel | null = null;
  constructor(
    readonly field: string,
    message: string,
  ) {
    super(message);
    this.name = "FieldError";
  }
}

interface ChangeBase {
  /** The verb on the confirm button, verb plus noun from the labels: the button names exactly what happens. */
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
 * is offline goes to the screen banner and leaves the form alone (1a). A `FieldError` goes down the `field` channel —
 * the field itself — and back to the screen, never to a toast. Render `dialog` once in the screen.
 */
export function useChange(): { run: (change: Change) => Promise<boolean>; dialog: ReactNode } {
  const [pending, setPending] = useState<Change | null>(null);
  /** The pending `run` call: it settles when the person confirms (with the save's own outcome) or cancels. */
  const settle = useRef<{
    resolve: (ran: boolean) => void;
    reject: (error: unknown) => void;
  } | null>(null);

  const apply = useCallback(async (change: Change): Promise<boolean> => {
    let saved: boolean;
    try {
      saved = await saveWithBanner(async () => {
        await change.apply();
      });
    } catch (error) {
      if (error instanceof FieldError) error.channel = notify("field", { message: error.message });
      throw error;
    }
    if (!saved) return false;
    const undo = !needsConfirmation(change) && change.reversible ? change.undo : undefined;
    notify("result", { message: change.done, undo: undo ? () => void undo() : undefined });
    return true;
  }, []);

  const run = useCallback(
    (change: Change): Promise<boolean> => {
      if (!needsConfirmation(change)) return apply(change);
      return new Promise<boolean>((resolve, reject) => {
        settle.current = { resolve, reject };
        setPending(change);
      });
    },
    [apply],
  );

  const close = (confirmed: boolean) => {
    const change = pending;
    const pendingRun = settle.current;
    settle.current = null;
    setPending(null);
    if (!change || !pendingRun) return;
    if (!confirmed) pendingRun.resolve(false);
    // A failed save after confirming goes back to the screen exactly like one that ran at once: a field error has
    // taken the `field` channel, anything else is the screen's to report. Cancel alone resolves to false.
    else void apply(change).then(pendingRun.resolve, pendingRun.reject);
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

/** What a write door answers (row 4): the four outcomes of the real write path, never a thrown error. */
export type WriteOutcome = "saved" | "refused" | "offline" | "conflict";
type Failure = Exclude<WriteOutcome, "saved">;

/**
 * One write of an in-place edit (row 4): the screen has already shown the new value; the door says how it went.
 * `undo` is a write like any other and is absent when the change cannot be undone.
 */
export interface DoorChange {
  /** The toast after the save, e.g. «Đã đổi giá căn 1101: 2,8 tỷ.» */
  done: string;
  write: () => Promise<WriteOutcome>;
  undo?: () => Promise<WriteOutcome>;
  /** The toast after an undo that went through. */
  undone: string;
  /** Why the save failed (not refused), e.g. offline; the screen has put the old value back. */
  failed: (why: Failure) => string;
  /** Why the undo failed (not refused), naming what the row still holds. */
  undoFailed: (why: Failure) => string;
}

/**
 * Runs one write; a thrown failure of the real write path becomes its outcome (fetch's TypeError or a device that
 * reports itself offline → offline, 403 → refused, 409 → conflict). Anything else is a fault and is thrown on.
 */
async function attempt(write: () => Promise<WriteOutcome>): Promise<WriteOutcome> {
  try {
    return await write();
  } catch (failure) {
    const why =
      writeFailure(failure) ??
      (typeof navigator !== "undefined" && navigator.onLine === false ? "offline" : null);
    if (why === null) throw failure;
    return why;
  }
}

const STAYS = { duration: Number.POSITIVE_INFINITY } as const;

/**
 * Says a failed write. A failed save names why; a refused save (403) gets the frame's own sentence (row 9e). A failed
 * undo always names what the row still holds, adds the refusal sentence when refused, and stays until «Thử lại».
 */
function sayFailure(why: Failure, sentence: (why: Failure) => string, retry?: () => void): void {
  if (!retry) {
    toast.error(why === "refused" ? FRAME_COPY.refusedAction : sentence(why));
    return;
  }
  const message =
    why === "refused" ? `${sentence(why)} ${FRAME_COPY.refusedAction}` : sentence(why);
  toast.error(message, { ...STAYS, action: { label: FRAME_COPY.retry, onClick: retry } });
}

/**
 * The save rule of design/behaviors.md for a write door: the toast after a save offers «Hoàn tác» when the change can
 * be undone, and an undo that fails is never silent — a notice stays until the person presses «Thử lại» (row 4).
 * Returns the save's outcome so the screen can put the old value back when it is not «saved».
 */
export async function runDoorChange(change: DoorChange): Promise<WriteOutcome> {
  const outcome = await attempt(change.write);
  if (outcome !== "saved") {
    sayFailure(outcome, change.failed);
    return outcome;
  }
  const { undo } = change;
  if (!undo) {
    notifyResult({ message: change.done });
    return outcome;
  }
  const tryUndo = async (): Promise<void> => {
    const back = await attempt(undo);
    if (back === "saved") notifyResult({ message: change.undone });
    else sayFailure(back, change.undoFailed, () => void tryUndo());
  };
  notifyResult({ message: change.done, undo: () => void tryUndo() });
  return outcome;
}
