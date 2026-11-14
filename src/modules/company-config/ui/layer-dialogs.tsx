"use client";

import { useRouter } from "next/navigation";
import { useId, useState, type ReactNode } from "react";

import { FormDialog } from "@/components/candidate/form-dialog";
import { FRAME_COPY } from "@/components/templates/frame-copy";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { ConceptCode } from "@/generated/labels";

import { label } from "../index";
import { FIELD_KINDS, type FieldKind } from "../rules";
import type { LayerProblem } from "../store";

import { LAYER_COPY as C, PROBLEM_COPY } from "./copy";

/** The company layer's write path: the one API of the module (/api/v1 is the only write path). */
export const LAYER_API = "/api/v1/company-layer";

type Errors = Record<string, string>;

/** What a send gave back: done, a refusal under a field or the form, the 403 «not allowed», or a failure. */
type Sent = { ok: true; id: string } | { ok: false; errors: Errors; refused?: boolean };

/** Sends one write and turns its answer into what the form shows; never throws. */
export async function send(path: string, method: "POST" | "PATCH", body?: unknown): Promise<Sent> {
  try {
    const res = await fetch(`${LAYER_API}/${path}`, {
      method,
      headers: { "content-type": "application/json" },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    if (res.ok) return { ok: true, id: ((await res.json()) as { id: string }).id };
    if (res.status === 403)
      return { ok: false, errors: { form: FRAME_COPY.refusedAction }, refused: true };
    const code = ((await res.json().catch(() => ({}))) as { error?: LayerProblem }).error;
    const known = code ? PROBLEM_COPY[code] : undefined;
    return { ok: false, errors: { [known?.at ?? "form"]: known?.text ?? C.failed } };
  } catch {
    return { ok: false, errors: { form: C.failed } };
  }
}

/** The store's select in the form: the five kinds, the concepts, the fields and their values. */
function Choice({
  id,
  value,
  onChange,
  options,
  disabled,
  invalid,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly { value: string; text: string }[];
  disabled?: boolean;
  invalid?: boolean;
}) {
  return (
    <Select
      items={options.map((o) => ({ value: o.value, label: o.text }))}
      value={value || null}
      disabled={disabled ?? false}
      onValueChange={(v) => onChange(typeof v === "string" ? v : "")}
    >
      <SelectTrigger id={id} aria-invalid={invalid || undefined}>
        <SelectValue placeholder={C.pick} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.text}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/** One field of a layer form: label, control, and the refusal that belongs to it under it. */
function Row({
  id,
  text,
  error,
  hint,
  children,
}: {
  id: string;
  text: string;
  error?: string | undefined;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <Field data-invalid={error ? true : undefined} data-field={id.split("-").at(-1)}>
      <FieldLabel htmlFor={id}>{text}</FieldLabel>
      {children}
      {hint ? <FieldDescription>{hint}</FieldDescription> : null}
      {error ? <FieldError>{error}</FieldError> : null}
    </Field>
  );
}

/**
 * The frame every layer form shares: FormDialog, its busy and refused states, and a reload of the frame after a 403
 * so the buttons follow the permission table again (row 9e).
 */
function LayerForm({
  slot,
  trigger,
  open,
  setOpen,
  title,
  description,
  submitLabel,
  busyLabel,
  errors,
  busy,
  refused,
  onSubmit,
  onClosed,
  children,
}: {
  slot: string;
  trigger?: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  description: string;
  submitLabel: string;
  busyLabel: string;
  errors: Errors;
  busy: boolean;
  refused: boolean;
  onSubmit: () => void;
  onClosed: () => void;
  children: ReactNode;
}) {
  const router = useRouter();
  return (
    <FormDialog
      slot={slot}
      {...(trigger ? { trigger: { render: <Button size="sm" />, label: trigger } } : {})}
      title={title}
      description={description}
      submitLabel={submitLabel}
      busyLabel={busyLabel}
      busy={busy}
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          onClosed();
          if (refused) router.refresh();
        }
      }}
      onSubmit={onSubmit}
      formError={errors["form"]}
      refused={refused}
    >
      {children}
    </FormDialog>
  );
}

/** State and send of one form: errors, busy, refused; `submit` closes the dialog on success. */
function useForm(setOpen: (open: boolean) => void, onDone: (id: string) => void) {
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [refused, setRefused] = useState(false);
  return {
    errors,
    busy,
    refused,
    setErrors,
    reset: () => {
      setErrors({});
      setRefused(false);
    },
    submit: async (go: () => Promise<Sent>) => {
      setBusy(true);
      const r = await go();
      setBusy(false);
      if (r.ok) {
        setErrors({});
        setOpen(false);
        onDone(r.id);
        return;
      }
      setErrors(r.errors);
      if (r.refused) setRefused(true);
    },
  };
}

const kindOptions = FIELD_KINDS.map((k) => ({ value: k, text: C.kinds[k] }));
const optionLines = (text: string) =>
  text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

/** Adding a label, and editing one: the concept (fixed once made) and the company's words for it. */
export function LabelDialog({
  concepts,
  editing,
  open,
  setOpen,
  onDone,
}: {
  concepts: readonly string[];
  editing?: { id: string; concept: string; label: string };
  open?: boolean;
  setOpen?: (open: boolean) => void;
  onDone: (message: string) => void;
}) {
  const id = useId();
  const [own, setOwn] = useState(false);
  const isOpen = open ?? own;
  const set = setOpen ?? setOwn;
  const [concept, setConcept] = useState(editing?.concept ?? "");
  const [words, setWords] = useState(editing?.label ?? "");
  const f = useForm(set, () => onDone(editing ? C.saved(words.trim()) : C.added(words.trim())));
  const title = editing
    ? `${label("Edit")} ${label("CompanyLabel").toLocaleLowerCase("vi")}`
    : label("AddCompanyLabel");
  return (
    <LayerForm
      slot="label-dialog"
      {...(editing ? {} : { trigger: label("AddCompanyLabel") })}
      open={isOpen}
      setOpen={set}
      title={title}
      description={C.labelWhy(label("Inventory"))}
      submitLabel={editing ? C.save : C.add}
      busyLabel={editing ? C.saving : C.adding}
      errors={f.errors}
      busy={f.busy}
      refused={f.refused}
      onClosed={() => {
        f.reset();
        if (!editing) {
          setConcept("");
          setWords("");
        }
      }}
      onSubmit={() =>
        void f.submit(() =>
          editing
            ? send(`labels/${editing.id}`, "PATCH", { label: words })
            : send("labels", "POST", { concept, label: words }),
        )
      }
    >
      <Row id={`${id}-concept`} text={C.conceptLabel} error={f.errors["concept"]}>
        <Choice
          id={`${id}-concept`}
          value={concept}
          onChange={setConcept}
          disabled={editing !== undefined}
          invalid={Boolean(f.errors["concept"])}
          options={concepts.map((c) => ({ value: c, text: label(c as ConceptCode) }))}
        />
      </Row>
      <Row id={`${id}-words`} text={C.wordsLabel} error={f.errors["words"]}>
        <Input
          id={`${id}-words`}
          value={words}
          aria-invalid={f.errors["words"] ? true : undefined}
          onChange={(e) => setWords(e.target.value)}
        />
      </Row>
    </LayerForm>
  );
}

/** Adding a custom field, and editing one: name, kind (locked when editing), options for «Chọn một». */
export function FieldDialog({
  editing,
  open,
  setOpen,
  onDone,
}: {
  editing?: { code: string; name: string; kind: FieldKind; options: readonly string[] };
  open?: boolean;
  setOpen?: (open: boolean) => void;
  onDone: (message: string) => void;
}) {
  const id = useId();
  const [own, setOwn] = useState(false);
  const isOpen = open ?? own;
  const set = setOpen ?? setOwn;
  const [name, setName] = useState(editing?.name ?? "");
  const [kind, setKind] = useState<string>(editing?.kind ?? "");
  const [options, setOptions] = useState((editing?.options ?? []).join("\n"));
  const f = useForm(set, () => onDone(editing ? C.saved(name.trim()) : C.added(name.trim())));
  const select = kind === "single_select";
  return (
    <LayerForm
      slot="field-dialog"
      {...(editing ? {} : { trigger: label("AddCustomField") })}
      open={isOpen}
      setOpen={set}
      title={editing ? `${label("Edit")} ${editing.name}` : label("AddCustomField")}
      description={editing ? C.fieldEditWhy : C.fieldWhy(label("Inventory"))}
      submitLabel={editing ? C.save : C.add}
      busyLabel={editing ? C.saving : C.adding}
      errors={f.errors}
      busy={f.busy}
      refused={f.refused}
      onClosed={() => {
        f.reset();
        if (!editing) {
          setName("");
          setKind("");
          setOptions("");
        }
      }}
      onSubmit={() => {
        if (!kind) {
          f.setErrors({ kind: PROBLEM_COPY["kind-unknown"]!.text });
          return;
        }
        const body = {
          name,
          ...(select || !editing ? { options: select ? optionLines(options) : [] } : {}),
        };
        void f.submit(() =>
          editing
            ? send(`fields/${editing.code}`, "PATCH", body)
            : send("fields", "POST", { ...body, kind }),
        );
      }}
    >
      <Row id={`${id}-name`} text={C.nameLabel} error={f.errors["name"]}>
        <Input
          id={`${id}-name`}
          value={name}
          aria-invalid={f.errors["name"] ? true : undefined}
          onChange={(e) => setName(e.target.value)}
        />
      </Row>
      <Row
        id={`${id}-kind`}
        text={C.kindLabel}
        error={f.errors["kind"]}
        {...(editing ? { hint: C.kindLocked } : {})}
      >
        <Choice
          id={`${id}-kind`}
          value={kind}
          onChange={setKind}
          disabled={editing !== undefined}
          invalid={Boolean(f.errors["kind"])}
          options={kindOptions}
        />
      </Row>
      {select ? (
        <Row id={`${id}-options`} text={C.optionsLabel} error={f.errors["options"]}>
          <Textarea
            id={`${id}-options`}
            rows={4}
            value={options}
            aria-invalid={f.errors["options"] ? true : undefined}
            onChange={(e) => setOptions(e.target.value)}
          />
        </Row>
      ) : null}
    </LayerForm>
  );
}

/** A field a spelling can stand for, with its closed set of values and how people read its name. */
export interface SpellingField {
  field: string;
  name: string;
  values: readonly { value: string; text: string }[];
}

/** Adding a spelling, and editing one: the field (fixed once made), the company's spelling, the standard value. */
export function AliasDialog({
  fields,
  editing,
  open,
  setOpen,
  onDone,
}: {
  fields: readonly SpellingField[];
  editing?: { id: string; field: string; raw: string; value: string };
  open?: boolean;
  setOpen?: (open: boolean) => void;
  onDone: (message: string) => void;
}) {
  const id = useId();
  const [own, setOwn] = useState(false);
  const isOpen = open ?? own;
  const set = setOpen ?? setOwn;
  const [field, setField] = useState(editing?.field ?? "");
  const [raw, setRaw] = useState(editing?.raw ?? "");
  const [value, setValue] = useState(editing?.value ?? "");
  const f = useForm(set, () => onDone(editing ? C.saved(raw.trim()) : C.added(raw.trim())));
  const values = fields.find((x) => x.field === field)?.values ?? [];
  return (
    <LayerForm
      slot="alias-dialog"
      {...(editing ? {} : { trigger: label("AddValueAlias") })}
      open={isOpen}
      setOpen={set}
      title={editing ? `${label("Edit")} ${editing.raw}` : label("AddValueAlias")}
      description={C.aliasWhy}
      submitLabel={editing ? C.save : C.add}
      busyLabel={editing ? C.saving : C.adding}
      errors={f.errors}
      busy={f.busy}
      refused={f.refused}
      onClosed={() => {
        f.reset();
        if (!editing) {
          setField("");
          setRaw("");
          setValue("");
        }
      }}
      onSubmit={() =>
        void f.submit(() =>
          editing
            ? send(`aliases/${editing.id}`, "PATCH", { value })
            : send("aliases", "POST", { field, raw, value }),
        )
      }
    >
      <Row id={`${id}-field`} text={C.fieldLabel} error={f.errors["field"]}>
        <Choice
          id={`${id}-field`}
          value={field}
          onChange={(v) => {
            setField(v);
            setValue("");
          }}
          disabled={editing !== undefined}
          invalid={Boolean(f.errors["field"])}
          options={fields.map((x) => ({ value: x.field, text: x.name }))}
        />
      </Row>
      <Row id={`${id}-raw`} text={C.rawLabel} error={f.errors["raw"]}>
        <Input
          id={`${id}-raw`}
          value={raw}
          disabled={editing !== undefined}
          aria-invalid={f.errors["raw"] ? true : undefined}
          onChange={(e) => setRaw(e.target.value)}
        />
      </Row>
      <Row id={`${id}-value`} text={C.valueLabel} error={f.errors["value"]}>
        <Choice
          id={`${id}-value`}
          value={value}
          onChange={setValue}
          invalid={Boolean(f.errors["value"])}
          options={values}
        />
      </Row>
    </LayerForm>
  );
}

/** Renaming an import template: the template's name only; its columns change only by importing again. */
export function RenameDialog({
  editing,
  open,
  setOpen,
  onDone,
}: {
  editing: { id: string; name: string };
  open: boolean;
  setOpen: (open: boolean) => void;
  onDone: (message: string) => void;
}) {
  const id = useId();
  const [name, setName] = useState(editing.name);
  const f = useForm(setOpen, () => onDone(C.saved(name.trim())));
  return (
    <LayerForm
      slot="rename-dialog"
      open={open}
      setOpen={setOpen}
      title={label("RenameTemplate")}
      description={C.renameWhy}
      submitLabel={C.save}
      busyLabel={C.saving}
      errors={f.errors}
      busy={f.busy}
      refused={f.refused}
      onClosed={f.reset}
      onSubmit={() => void f.submit(() => send(`templates/${editing.id}`, "PATCH", { name }))}
    >
      <Row id={`${id}-words`} text={C.templateNameLabel} error={f.errors["words"]}>
        <Input
          id={`${id}-words`}
          value={name}
          aria-invalid={f.errors["words"] ? true : undefined}
          onChange={(e) => setName(e.target.value)}
        />
      </Row>
    </LayerForm>
  );
}
