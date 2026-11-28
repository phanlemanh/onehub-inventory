"use client";

// Editing the four details of the open listing in its record (row 3g): legal status, furnished, financing and occupant
// type. The edit button sits at the head of the record's listing section, right side (design/behaviors.md, «Việc trên một mục
// của hồ sơ»), inside PermittedAction for updateListing (row 9e); it opens the store's FormDialog (row 9). One save is
// one change through the grid's save door, with undo (row 4's rule). A save that does not go through keeps what
// was typed and says why in the dialog.
import { PencilIcon } from "lucide-react";
import {
  createContext,
  useContext,
  useImperativeHandle,
  useState,
  type ReactNode,
  type Ref,
} from "react";

import { FormDialog } from "@/components/candidate/form-dialog";
import { runDoorChange, type WriteOutcome } from "@/components/candidate/use-change";
import { FRAME_COPY } from "@/components/templates/frame-copy";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Listing, ListingFurnished, ListingOccupantType } from "@/generated/ontology";
import { PermittedAction } from "@/modules/identity/ui";

import { confirmationAge } from "../record";
import {
  DETAILS_TEXT_LIMIT,
  FURNISHED_VALUES,
  OCCUPANT_VALUES,
  detailText,
  detailUndoable,
} from "../edit-rules";
import type { DetailsChange, ListingChange } from "../save-door";

import { RECORD_COPY } from "./record-copy";

/** The four details as the record holds them. */
export interface ListingDetails {
  /** Days since the last confirmation with the owner, when a save moved it (the record's confirmation line). */
  confirmedDays?: number | null | undefined;
  legalStatus?: string | undefined;
  furnished?: ListingFurnished | undefined;
  financing?: string | undefined;
  occupantType?: ListingOccupantType | undefined;
}

/** What the grid lends the record to edit details: its one write, and the listing as last saved. */
export interface DetailsEditApi {
  write: (id: string, change: ListingChange, at: string) => Promise<WriteOutcome>;
  saved: (id: string) => Listing | undefined;
  /** Tells the record a listing changed, so it shows the saved details. */
  changed: () => void;
  /** Moves on with every change: a new value of the context, so every open record reads `saved` again. */
  tick: number;
}

/** The grid's write lent to its records (row 3g); row 3h's unit attributes edit through it too. */
export const DetailsEditContext = createContext<DetailsEditApi | null>(null);

/** Lends the grid's write to every record it opens; without it a record is read-only. */
export function DetailsEditProvider({
  api,
  children,
}: {
  api: DetailsEditApi | null;
  children: ReactNode;
}) {
  return <DetailsEditContext.Provider value={api}>{children}</DetailsEditContext.Provider>;
}

/** The record's details of one listing: the saved ones when the grid saved it since the page was read. */
export function useListingDetails(id: string, read: ListingDetails): ListingDetails {
  const api = useContext(DetailsEditContext);
  const saved = api?.saved(id);
  return saved
    ? {
        confirmedDays: confirmationAge(saved.lastConfirmedAt, new Date()),
        legalStatus: saved.legalStatus,
        furnished: saved.furnished,
        financing: saved.financing,
        occupantType: saved.occupantType,
      }
    : read;
}

/** The words of the dialog, from the label table through the page (this module never hard-codes a concept word). */
export interface DetailsWords {
  edit: string;
  unit: string;
  legalStatus: string;
  furnished: string;
  financing: string;
  occupantType: string;
  furnishedValues: Readonly<Record<ListingFurnished, string>>;
  occupantValues: Readonly<Record<ListingOccupantType, string>>;
}

const NONE = "__none";

type Draft = { legalStatus: string; furnished: string; financing: string; occupantType: string };

const draftOf = (d: ListingDetails): Draft => ({
  legalStatus: d.legalStatus ?? "",
  furnished: d.furnished ?? NONE,
  financing: d.financing ?? "",
  occupantType: d.occupantType ?? NONE,
});

/** The change from what the record shows to the draft: only the parts that differ; null when nothing differs. */
function changeOf(from: ListingDetails, draft: Draft): DetailsChange | null {
  const change: DetailsChange = { field: "details" };
  const legal = detailText(draft.legalStatus);
  const financing = detailText(draft.financing);
  if (legal.ok && legal.value !== (from.legalStatus ?? null)) change.legalStatus = legal.value;
  if (financing.ok && financing.value !== (from.financing ?? null))
    change.financing = financing.value;
  const furnished = draft.furnished === NONE ? null : (draft.furnished as ListingFurnished);
  if (furnished !== (from.furnished ?? null)) change.furnished = furnished;
  const occupant = draft.occupantType === NONE ? null : (draft.occupantType as ListingOccupantType);
  if (occupant !== (from.occupantType ?? null)) change.occupantType = occupant;
  return Object.keys(change).length > 1 ? change : null;
}

/** The change that puts back what `change` replaced. */
function undoOf(from: ListingDetails, change: DetailsChange): DetailsChange {
  const back: DetailsChange = { field: "details" };
  if ("legalStatus" in change) back.legalStatus = from.legalStatus ?? null;
  if ("financing" in change) back.financing = from.financing ?? null;
  if ("furnished" in change) back.furnished = from.furnished ?? null;
  if ("occupantType" in change) back.occupantType = from.occupantType ?? null;
  return back;
}

/**
 * The four detail fields of a dialog, their draft and what a save sends: the record's edit button of the listing section uses
 * it, and so does row 3h's one-button variant (`?edit=one`) beside the unit's fields.
 */
export function useDetailsForm(
  details: ListingDetails,
  words: DetailsWords,
  /** The field the dialog opens on (row 3h: a missing part named in «Còn thiếu»); the legal status otherwise. */
  first: DetailKey = "legalStatus",
) {
  const [draft, setDraft] = useState<Draft>(() => draftOf(details));
  const [tried, setTried] = useState(false);
  // Only a part the person changed is checked: words already longer from an imported sheet do not block the save.
  const tooLong = (text: string, key: "legalStatus" | "financing") =>
    text.trim() !== (details[key] ?? "") && !detailText(text).ok;
  const text = (key: "legalStatus" | "financing", label: string) => {
    const long = tried && tooLong(draft[key], key);
    return (
      <Field data-invalid={long || undefined}>
        <FieldLabel htmlFor={`details-${key}`}>{label}</FieldLabel>
        <Input
          id={`details-${key}`}
          data-detail={key}
          value={draft[key]}
          autoFocus={key === first}
          aria-invalid={long || undefined}
          onChange={(event) => setDraft({ ...draft, [key]: event.target.value })}
        />
        {long ? <FieldError>{RECORD_COPY.detailsTooLong(DETAILS_TEXT_LIMIT)}</FieldError> : null}
      </Field>
    );
  };
  const choice = <V extends string>(
    key: "furnished" | "occupantType",
    label: string,
    values: readonly V[],
    names: Readonly<Record<V, string>>,
  ) => {
    const items = [
      ...values.map((v) => ({ value: v as string, label: names[v] })),
      { value: NONE, label: RECORD_COPY.detailsNone },
    ];
    return (
      <Field>
        <FieldLabel>{label}</FieldLabel>
        <Select
          value={draft[key]}
          onValueChange={(value) => setDraft({ ...draft, [key]: String(value) })}
          items={items}
        >
          <SelectTrigger aria-label={label} data-detail={key} autoFocus={key === first}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {items.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
    );
  };
  return {
    /** Starts the draft afresh from what the record shows. */
    reset: () => {
      setDraft(draftOf(details));
      setTried(false);
    },
    /** Marks the fields tried; true when a field must be fixed before anything is sent. */
    blocked: (): boolean => {
      setTried(true);
      return tooLong(draft.legalStatus, "legalStatus") || tooLong(draft.financing, "financing");
    },
    change: (): DetailsChange | null => changeOf(details, draft),
    undo: (change: DetailsChange): DetailsChange => undoOf(details, change),
    /** Words longer than the limit, kept from an imported sheet, cannot be written back: no undo then (row 3g). */
    undoable: (back: DetailsChange): boolean =>
      detailUndoable(back.legalStatus) && detailUndoable(back.financing),
    fields: (
      <FieldGroup>
        {text("legalStatus", words.legalStatus)}
        {choice("furnished", words.furnished, FURNISHED_VALUES, words.furnishedValues)}
        {text("financing", words.financing)}
        {choice("occupantType", words.occupantType, OCCUPANT_VALUES, words.occupantValues)}
      </FieldGroup>
    ),
  };
}

/** The four details by their field (row 3h: «Còn thiếu» names them). */
export type DetailKey = "legalStatus" | "furnished" | "financing" | "occupantType";

/** Row 3h: what the record may ask of the listing section's dialog. */
export interface DetailsEditHandle {
  openOn: (field: DetailKey) => void;
}

/** The edit button of the record's listing section and its dialog; nothing without the grid's write or for an earlier listing. */
export function ListingDetailsEdit({
  id,
  unitNumber,
  details,
  words,
  ref,
}: {
  id: string;
  unitNumber: string;
  details: ListingDetails;
  words: DetailsWords;
  /** Row 3h: opens the dialog on one field, for a missing part the person pressed in «Còn thiếu». */
  ref?: Ref<DetailsEditHandle>;
}) {
  const api = useContext(DetailsEditContext);
  const [open, setOpen] = useState(false);
  const [first, setFirst] = useState<DetailKey>("legalStatus");
  const form = useDetailsForm(details, words, first);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState<Exclude<WriteOutcome, "saved"> | null>(null);
  const openChange = (next: boolean) => {
    if (next) {
      form.reset();
      setFailed(null);
    } else setFirst("legalStatus");
    setOpen(next);
  };
  useImperativeHandle(ref, () => ({
    openOn: (field: DetailKey) => {
      setFirst(field);
      openChange(true);
    },
  }));
  if (!api) return null;
  const what = RECORD_COPY.detailsWhat(words.unit, unitNumber);
  const submit = async () => {
    if (form.blocked()) return;
    const change = form.change();
    if (!change) {
      setOpen(false);
      return;
    }
    setBusy(true);
    const at = new Date().toISOString();
    const outcome = await api.write(id, change, at);
    setBusy(false);
    if (outcome !== "saved") {
      setFailed(outcome);
      api.changed();
      return;
    }
    setOpen(false);
    api.changed();
    const back = form.undo(change);
    const undoable = form.undoable(back);
    // The save already went through: the shared door says it and offers undo by row 4's one rule.
    await runDoorChange({
      done: RECORD_COPY.detailsDone(what),
      undone: RECORD_COPY.detailsUndone(what),
      write: () => Promise.resolve("saved"),
      undo: undoable
        ? async () => {
            const result = await api.write(id, back, new Date().toISOString());
            if (result === "saved") api.changed();
            return result;
          }
        : undefined,
      failed: (why) => RECORD_COPY.detailsFailed(why),
      undoFailed: (why) => RECORD_COPY.detailsUndoFailed(what, why),
    });
  };
  const refused = failed === "refused";
  const formError =
    failed === null
      ? undefined
      : refused
        ? FRAME_COPY.refusedAction
        : RECORD_COPY.detailsFailed(failed);
  return (
    <PermittedAction action="updateListing">
      <FormDialog
        trigger={{
          render: (
            <Button
              variant="ghost"
              size="sm"
              data-action="updateListing"
              data-slot="listing-details-edit-open"
            />
          ),
          label: (
            <>
              <PencilIcon aria-hidden="true" />
              {words.edit}
            </>
          ),
        }}
        title={RECORD_COPY.detailsTitle(words.edit, what)}
        description={RECORD_COPY.detailsDescription([
          words.legalStatus,
          words.furnished,
          words.financing,
          words.occupantType,
        ])}
        submitLabel={RECORD_COPY.detailsSubmit}
        busyLabel={RECORD_COPY.detailsBusy}
        busy={busy}
        open={open}
        onOpenChange={openChange}
        onSubmit={() => void submit()}
        formError={formError}
        refused={refused}
        slot="listing-details-edit"
      >
        {form.fields}
      </FormDialog>
    </PermittedAction>
  );
}
