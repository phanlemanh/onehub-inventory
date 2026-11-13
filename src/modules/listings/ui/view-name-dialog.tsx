"use client";

import { useRouter } from "next/navigation";
import { useId, useState, type ReactElement, type ReactNode } from "react";

import { FormDialog } from "@/components/candidate/form-dialog";
import { FRAME_COPY } from "@/components/templates/frame-copy";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { SAVED_VIEW_NAME_MAX, checkViewName, normalizeViewName } from "../saved-view";
import type { SaveOutcome } from "./saved-view-api";
import type { SavedViewCopy } from "./saved-view-copy";

/**
 * The dialog that names a saved view (save, save as new, rename): one field checked by the same rule as the server,
 * the error under the field; a failed send keeps the typed name and offers «Thử lại»; a 403 shows the «not allowed»
 * sentence of row 9e and refreshes the page when it closes.
 */
export function ViewNameDialog({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  initialName = "",
  taken,
  send,
  onDone,
  copy: COPY,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: { render: ReactElement; label: ReactNode };
  title: string;
  description: string;
  initialName?: string;
  /** Names of the person's other views of this screen. */
  taken: readonly string[];
  send: (name: string) => Promise<SaveOutcome>;
  onDone: (outcome: Extract<SaveOutcome, { ok: true }>) => void;
  copy: SavedViewCopy;
}) {
  const id = useId();
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [nameError, setNameError] = useState<string | undefined>();
  const [formError, setFormError] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const [refused, setRefused] = useState(false);

  function reset() {
    setName(initialName);
    setNameError(undefined);
    setFormError(undefined);
    setBusy(false);
  }

  async function submit() {
    const problem = checkViewName(name, taken);
    if (problem) {
      setNameError(COPY.nameErrors[problem]);
      return;
    }
    setNameError(undefined);
    setFormError(undefined);
    setBusy(true);
    const outcome = await send(normalizeViewName(name));
    setBusy(false);
    if (outcome.ok) {
      onOpenChange(false);
      reset();
      onDone(outcome);
      return;
    }
    if (outcome.error === "refused") {
      setRefused(true);
      setFormError(FRAME_COPY.refusedAction);
    } else if (outcome.error === "gone" || outcome.error === "failed") setFormError(COPY.failed);
    else setNameError(COPY.nameErrors[outcome.error]);
  }

  return (
    <FormDialog
      slot="view-name-dialog"
      trigger={trigger}
      title={title}
      description={description}
      submitLabel={COPY.submit}
      busyLabel={COPY.busy}
      busy={busy}
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (next) return;
        reset();
        if (refused) {
          setRefused(false);
          router.refresh();
        }
      }}
      onSubmit={() => void submit()}
      formError={formError}
      refused={refused}
    >
      <Field data-invalid={nameError ? true : undefined}>
        <FieldLabel htmlFor={`${id}-name`}>{COPY.nameLabel}</FieldLabel>
        <Input
          id={`${id}-name`}
          autoComplete="off"
          value={name}
          maxLength={SAVED_VIEW_NAME_MAX + 10}
          aria-invalid={nameError ? true : undefined}
          aria-describedby={nameError ? `${id}-error` : undefined}
          onChange={(e) => {
            setName(e.target.value);
            if (nameError) setNameError(undefined);
          }}
        />
        {nameError ? <FieldError id={`${id}-error`}>{nameError}</FieldError> : null}
      </Field>
    </FormDialog>
  );
}
