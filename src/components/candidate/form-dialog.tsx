"use client";

import type { FormEvent, ReactElement, ReactNode } from "react";

import { FRAME_COPY } from "@/components/templates/frame-copy";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

/**
 * A short form in a dialog (row 9, the one way a screen asks for a few fields): title, one sentence of what happens,
 * the fields, «Thôi» and the submit button. Enter submits, Esc closes and focus returns to the button that opened
 * it. While `busy` the submit button is disabled and says `busyLabel`; after a failed send (`formError`) it says
 * «Thử lại» and every field keeps what was typed. After a refusal (`refused`, the server said 403) there is nothing to
 * try again: the submit button goes and only «Thôi» stays (row 9e). Screens pass their fields and their own sentences.
 */
export function FormDialog({
  trigger,
  title,
  description,
  submitLabel,
  busyLabel,
  busy,
  open,
  onOpenChange,
  onSubmit,
  formError,
  refused = false,
  slot,
  children,
}: {
  /** The button that opens the dialog (e.g. `<Button />`) and its label. */
  trigger: { render: ReactElement; label: ReactNode };
  title: string;
  description: string;
  submitLabel: string;
  busyLabel: string;
  busy: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  formError?: string | undefined;
  /** The server refused the action (403): `formError` holds the refusal sentence and the form cannot be sent again. */
  refused?: boolean;
  /** data-slot of the dialog, for tests and the proof screenshots. */
  slot?: string;
  children: ReactNode;
}) {
  function submit(e: FormEvent) {
    e.preventDefault();
    if (!busy && !refused) onSubmit();
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger render={trigger.render}>{trigger.label}</DialogTrigger>
      <DialogContent data-slot={slot ?? "form-dialog"}>
        <form onSubmit={submit} noValidate className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {children}
          {formError ? (
            <p role="alert" data-slot="form-error" className="text-sm text-destructive">
              {formError}
            </p>
          ) : null}
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              {FRAME_COPY.confirm.cancel}
            </DialogClose>
            {refused ? null : (
              <Button type="submit" disabled={busy}>
                {busy ? busyLabel : formError ? FRAME_COPY.retry : submitLabel}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
