"use client";

import {
  createContext,
  useContext,
  useRef,
  type FormEvent,
  type ReactElement,
  type ReactNode,
} from "react";

import { FRAME_COPY } from "@/components/templates/frame-copy";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Whether a part of the screen sits inside an open dialog (row 3g). A FormDialog opened from there is nested, and a
// nested Base UI dialog draws no backdrop of its own, so what is behind stays bright and seems clickable (the
// full-screen record on a phone). The record panel marks its body; FormDialog then asks its backdrop to render anyway.
const InDialogContext = createContext(false);

/** Marks its children as inside an open dialog (the record panel's body). */
export function InDialog({ value, children }: { value: boolean; children: ReactNode }) {
  return <InDialogContext.Provider value={value}>{children}</InDialogContext.Provider>;
}

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
  badge,
  canSubmit = true,
  focusSubmit = false,
  children,
}: {
  /**
   * The button that opens the dialog (e.g. `<Button />`) and its label. Absent when something else opens it through
   * `open` (an item of a «…» menu, row 2c); focus then goes back to what had it before the dialog opened.
   */
  trigger?: { render: ReactElement; label: ReactNode };
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
  /** A short tag beside the title, as in the ReUI block dialog-2 (row 9c); absent by default. */
  badge?: ReactNode;
  /** False while there is nothing to submit (e.g. a paste preview with every change unticked, row 5). */
  canSubmit?: boolean;
  /** Focus starts on the submit button instead of the first field (a paste preview: the fields are its tick boxes). */
  focusSubmit?: boolean;
  children: ReactNode;
}) {
  const submitRef = useRef<HTMLButtonElement>(null);
  // Opened from inside another dialog (the full-screen record on a phone), this dialog is nested and would draw no
  // backdrop: draw it, so what is behind dims and takes no click, as everywhere else (row 3g).
  const nested = useContext(InDialogContext);
  function submit(e: FormEvent) {
    e.preventDefault();
    if (!busy && !refused && canSubmit) onSubmit();
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger ? <DialogTrigger render={trigger.render}>{trigger.label}</DialogTrigger> : null}
      {nested ? (
        <DialogPortal>
          <DialogOverlay forceRender data-slot="form-dialog-backdrop" />
        </DialogPortal>
      ) : null}
      <DialogContent
        data-slot={slot ?? "form-dialog"}
        {...(focusSubmit ? { initialFocus: submitRef } : {})}
      >
        <form onSubmit={submit} noValidate className="flex flex-col gap-4">
          <DialogHeader>
            {badge ? (
              <div className="flex flex-wrap items-center gap-2">
                <DialogTitle>{title}</DialogTitle>
                {badge}
              </div>
            ) : (
              <DialogTitle>{title}</DialogTitle>
            )}
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
              <Button ref={submitRef} type="submit" disabled={busy || !canSubmit}>
                {busy ? busyLabel : formError ? FRAME_COPY.retry : submitLabel}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
