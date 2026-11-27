"use client";

// Editing the open listing's own unit attributes in its record (row 3h): living area, floor, bedrooms, direction and
// property sub type, at every width. The edit button sits at the head of the record's unit section beside
// ReportUnitError, inside PermittedAction for updateListing (row 9e), and opens the store's FormDialog — the same
// dialog as row 3g's details, not a second one. One save is one unitAttributes change through the grid's save door,
// with «Hoàn tác» that puts back all five as they were. An empty field follows the catalog again.
import { PencilIcon } from "lucide-react";
import { useContext, useState } from "react";

import { FormDialog } from "@/components/candidate/form-dialog";
import { runDoorChange, type WriteOutcome } from "@/components/candidate/use-change";
import { FRAME_COPY } from "@/components/templates/frame-copy";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Listing } from "@/generated/ontology";
import { PermittedAction, usePermitted } from "@/modules/identity/ui";

import { DIRECTION_VALUES } from "../../catalog";
import type { UnitAttributesChange } from "../save-door";
import {
  PROPERTY_SUB_TYPES,
  UNIT_ATTRIBUTE_FIELDS,
  ownAttributesOf,
  effectiveAttributes,
  readBedrooms,
  readFloor,
  readLivingArea,
  sameAttribute,
  type AttributeProblem,
  type CatalogAttributes,
  type OwnAttributes,
  type UnitAttributeField,
} from "../unit-attributes";

import { attributeUndo } from "./attribute-cells";
import { CELL_EDIT_COPY } from "./cell-edit-copy";
import { DetailsEditContext } from "./listing-details-edit";
import { RECORD_COPY } from "./record-copy";
import {
  UNIT_ATTRIBUTE_COPY as COPY,
  attributeInput,
  attributeText,
  type UnitAttributeWords,
} from "./unit-attribute-copy";

/** The own values of one listing: as the grid last saved them, else as the page read them. */
export function useOwnAttributes(id: string, read: OwnAttributes | undefined): OwnAttributes {
  const api = useContext(DetailsEditContext);
  const saved: Listing | undefined = api?.saved(id);
  return saved ? ownAttributesOf(saved) : (read ?? {});
}

const NONE = "__catalog";

type Draft = Record<UnitAttributeField, string>;

const draftOf = (own: OwnAttributes): Draft => ({
  livingArea: attributeInput(own.livingArea),
  floor: own.floor ?? "",
  bedroomsTotal: attributeInput(own.bedroomsTotal),
  directionFaces: own.directionFaces ?? NONE,
  propertySubType: own.propertySubType ?? NONE,
});

type Read = { ok: true; value: string | number | null } | { ok: false; problem: AttributeProblem };

function readDraft(field: UnitAttributeField, draft: Draft): Read {
  const raw = draft[field];
  if (raw === NONE || raw.trim() === "") return { ok: true, value: null };
  if (field === "livingArea") return readLivingArea(raw);
  if (field === "bedroomsTotal") return readBedrooms(raw);
  if (field === "floor") return readFloor(raw);
  return { ok: true, value: raw };
}

/**
 * The change from what the listing holds to the draft: only the attributes that change. An own value equal to the
 * catalog's is still the company's (it stays when the catalog changes later); an empty field drops the own value.
 */
function changeOf(own: OwnAttributes, draft: Draft): UnitAttributesChange | null {
  const change: Record<string, unknown> = { field: "unitAttributes" };
  for (const f of UNIT_ATTRIBUTE_FIELDS) {
    const read = readDraft(f, draft);
    if (!read.ok) continue;
    const had = own[f];
    if (read.value === null) {
      if (had !== undefined) change[f] = null;
    } else if (had === undefined || !sameAttribute(read.value, had)) change[f] = read.value;
  }
  return Object.keys(change).length > 1 ? (change as UnitAttributesChange) : null;
}

/** The edit button of the record's unit section and its dialog; nothing without the grid's write or the right to edit. */
export function UnitAttributesEdit({
  id,
  unitNumber,
  own,
  catalog,
  words,
}: {
  id: string;
  unitNumber: string;
  own: OwnAttributes;
  catalog: CatalogAttributes | null;
  words: UnitAttributeWords;
}) {
  const api = useContext(DetailsEditContext);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(() => draftOf(own));
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState<Exclude<WriteOutcome, "saved"> | null>(null);
  const [tried, setTried] = useState(false);
  if (!api) return null;
  const effective = effectiveAttributes(own, catalog);
  const openChange = (next: boolean) => {
    if (next) {
      setDraft(draftOf(own));
      setFailed(null);
      setTried(false);
    }
    setOpen(next);
  };
  const what = RECORD_COPY.detailsWhat(words.unit, unitNumber);
  const problems = UNIT_ATTRIBUTE_FIELDS.flatMap((f) => {
    const read = readDraft(f, draft);
    return read.ok ? [] : [[f, read.problem] as const];
  });
  const problemOf = new Map(problems);
  const submit = async () => {
    setTried(true);
    if (problems.length > 0) return;
    const change = changeOf(own, draft);
    if (!change) {
      setOpen(false);
      return;
    }
    setBusy(true);
    const outcome = await api.write(id, change, new Date().toISOString());
    setBusy(false);
    if (outcome !== "saved") {
      setFailed(outcome);
      api.changed();
      return;
    }
    setOpen(false);
    api.changed();
    const back = attributeUndo(
      own,
      UNIT_ATTRIBUTE_FIELDS.filter((f) => change[f] !== undefined),
    );
    await runDoorChange({
      done: RECORD_COPY.detailsDone(what),
      undone: RECORD_COPY.detailsUndone(what),
      write: () => Promise.resolve("saved"),
      undo: async () => {
        const result = await api.write(id, back, new Date().toISOString());
        if (result === "saved") api.changed();
        return result;
      },
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
  /** The catalog's value under a field («…: 68,5 m²») while the field would differ from it. */
  const catalogLine = (f: UnitAttributeField) => {
    const c = effective[f].catalogValue;
    const read = readDraft(f, draft);
    if (c === null || !read.ok || read.value === null || sameAttribute(read.value, c)) return null;
    return (
      <FieldDescription data-slot="attribute-catalog-line">
        {COPY.catalogLine(words, attributeText(words, f, c))}
      </FieldDescription>
    );
  };
  const typed = (f: "livingArea" | "floor" | "bedroomsTotal") => {
    const problem = tried ? problemOf.get(f) : undefined;
    const c = effective[f].catalogValue;
    return (
      <Field data-invalid={problem ? true : undefined}>
        <FieldLabel htmlFor={`attribute-${f}`}>{words.names[f]}</FieldLabel>
        <Input
          id={`attribute-${f}`}
          data-attribute={f}
          value={draft[f]}
          inputMode={f === "livingArea" ? "decimal" : f === "bedroomsTotal" ? "numeric" : undefined}
          placeholder={c === null ? undefined : attributeInput(c)}
          autoFocus={f === "livingArea"}
          aria-invalid={problem ? true : undefined}
          onChange={(event) => setDraft({ ...draft, [f]: event.target.value })}
        />
        {problem ? <FieldError>{COPY.problem(f, problem, draft[f])}</FieldError> : catalogLine(f)}
      </Field>
    );
  };
  const choice = (f: "directionFaces" | "propertySubType", values: readonly string[]) => {
    const c = effective[f].catalogValue;
    const items = [
      ...values.map((v) => ({ value: v, label: attributeText(words, f, v as never) })),
      {
        value: NONE,
        label:
          c === null
            ? COPY.followCatalog(words)
            : `${COPY.followCatalog(words)} · ${attributeText(words, f, c)}`,
      },
    ];
    return (
      <Field>
        <FieldLabel>{words.names[f]}</FieldLabel>
        <Select
          value={draft[f]}
          onValueChange={(value) => setDraft({ ...draft, [f]: String(value) })}
          items={items}
        >
          <SelectTrigger aria-label={words.names[f]} data-attribute={f}>
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
        {catalogLine(f)}
      </Field>
    );
  };
  return (
    <PermittedAction action="updateListing">
      <FormDialog
        trigger={{
          render: (
            <Button
              variant="ghost"
              size="sm"
              data-action="updateListing"
              data-slot="unit-attributes-edit-open"
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
        description={COPY.dialogDescription(words)}
        submitLabel={RECORD_COPY.detailsSubmit}
        busyLabel={RECORD_COPY.detailsBusy}
        busy={busy}
        open={open}
        onOpenChange={openChange}
        onSubmit={() => void submit()}
        formError={formError}
        refused={refused}
        slot="unit-attributes-edit"
      >
        <FieldGroup>
          {typed("livingArea")}
          {typed("floor")}
          {typed("bedroomsTotal")}
          {choice("directionFaces", DIRECTION_VALUES)}
          {choice("propertySubType", PROPERTY_SUB_TYPES)}
        </FieldGroup>
      </FormDialog>
    </PermittedAction>
  );
}

/**
 * «Lấy lại» on one line of the record (row 3h): clears the own value through the grid's door, with «Hoàn tác» that
 * writes it back with its source. Null without the grid's write or the right to edit.
 */
export function useAttributeRevert(
  id: string,
  unitNumber: string,
  own: OwnAttributes,
  words: UnitAttributeWords,
): ((field: UnitAttributeField, catalogShown: string) => void) | null {
  const api = useContext(DetailsEditContext);
  const permitted = usePermitted();
  if (!api || !permitted("updateListing")) return null;
  return (field, catalogShown) => {
    const what = COPY.what(words, field, unitNumber, COPY.backToCatalog(words, catalogShown));
    const back = attributeUndo(own, [field]);
    void runDoorChange({
      done: CELL_EDIT_COPY.done(what, true),
      undone: CELL_EDIT_COPY.undone(what),
      write: async () => {
        const result = await api.write(
          id,
          { field: "unitAttributes", [field]: null },
          new Date().toISOString(),
        );
        api.changed();
        return result;
      },
      undo: async () => {
        const result = await api.write(id, back, new Date().toISOString());
        if (result === "saved") api.changed();
        return result;
      },
      failed: (why) => RECORD_COPY.detailsFailed(why),
      undoFailed: (why) => RECORD_COPY.detailsUndoFailed(what, why),
    });
  };
}
