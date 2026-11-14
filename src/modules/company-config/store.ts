// The company layer on the server (row 7e, lop-rieng-cua-san; decision 0029): read, add, change and retire a company's
// labels, custom fields, value spellings, pending units and import templates; look a unit code up through four
// sources; match pending units with the catalog. Every statement runs through the identity module's door, withCompany,
// under the API role: migration 010's row rules keep each company to its own rows and the permission table to its
// actions. Nothing is deleted — retiring sets retired_at. The shared catalog is only read.
import { FIELD_DISPLAY } from "@/generated/display";
import { resolveUnitCode } from "@/modules/catalog";
import type { DbClient } from "@/modules/identity/server";

import {
  NAME_LIMIT,
  checkFieldDraft,
  fold,
  templateSignature,
  valueSetOf,
  type FieldDraft,
  type FieldKind,
  type FieldProblem,
} from "./rules";

/** Runs `fn` in one transaction as the person of the opened door. */
export type RunAs = <T>(fn: (client: DbClient) => Promise<T>) => Promise<T>;

export const LAYER_PARTS = ["labels", "fields", "aliases", "pending-units", "templates"] as const;
export type LayerPart = (typeof LAYER_PARTS)[number];

/**
 * Concepts a company may give its own words: the headers of the inventory's standard columns (row 2). The customer
 * page never reads these (SP-4).
 */
export const LABELABLE_CONCEPTS = [
  "Unit",
  "Building",
  "Subdivision",
  "StandardStatus",
  "ListPrice",
  "LivingArea",
  "BedroomsTotal",
  "LastConfirmedAt",
] as const;
export type LabelableConcept = (typeof LABELABLE_CONCEPTS)[number];

export interface LayerLabel {
  id: string;
  concept: LabelableConcept;
  label: string;
}
export interface LayerField {
  code: string;
  name: string;
  kind: FieldKind;
  options: string[];
  position: number;
}
export interface LayerAlias {
  id: string;
  field: string;
  raw: string;
  value: string;
}
export interface LayerPendingUnit {
  id: string;
  rawCode: string;
  unitKey: string | null;
  matchedAt: string | null;
}
/** Where one column of a sheet goes: a standard field, a custom field, or out on purpose. */
export type TemplateTarget = { standard: string } | { custom: string } | { skip: true };
export interface LayerTemplate {
  id: string;
  name: string;
  signature: string[];
  columns: TemplateTarget[];
}
export interface CompanyLayer {
  labels: LayerLabel[];
  fields: LayerField[];
  aliases: LayerAlias[];
  pendingUnits: LayerPendingUnit[];
  templates: LayerTemplate[];
}

export type LayerProblem =
  | FieldProblem
  | "concept-unknown"
  | "label-empty"
  | "label-too-long"
  | "raw-empty"
  | "raw-too-long"
  | "value-not-in-set"
  | "field-no-set"
  | "kind-fixed"
  | "code-empty"
  | "code-too-long"
  | "target-unknown"
  | "columns-mismatch"
  | "taken"
  | "not-found";

export type Write = { ok: true; id: string } | { ok: false; problem: LayerProblem };

const fail = (problem: LayerProblem): Write => ({ ok: false, problem });
const pgCode = (err: unknown) => (err as { code?: string }).code;
const pgMessage = (err: unknown) => String((err as { message?: string }).message ?? "");

/** Turns a database refusal into the layer's own problem; anything else is thrown again. */
function refusal(err: unknown): Write {
  if (pgCode(err) === "23505") return fail("taken");
  if (pgCode(err) === "23503") return fail("target-unknown");
  if (pgMessage(err).includes("company_fields_limit")) return fail("field-limit");
  if (pgMessage(err).includes("company_fields_kind")) return fail("kind-fixed");
  if (pgMessage(err).includes("company_fields_options")) return fail("options-count");
  throw err;
}

// ---- read ----------------------------------------------------------------------------------------------------------

/** Everything the company keeps in use, fields by position. */
export async function readLayer(run: RunAs): Promise<CompanyLayer> {
  return run(async (c) => {
    const live = "retired_at is null";
    const labels = await c.query(
      `select id::text, concept, label from company_labels where ${live} order by concept`,
    );
    const fields = await c.query(
      `select code, name, kind, options, position from company_fields where ${live} order by position, code`,
    );
    const aliases = await c.query(
      `select id::text, field, raw, value from company_value_aliases where ${live} order by field, raw_fold`,
    );
    const pending = await c.query(
      `select id::text, raw_code, unit_key, matched_at::text from company_pending_units where ${live}
        order by created_at, id`,
    );
    const templates = await c.query(
      `select id::text, name, signature, columns from company_import_templates where ${live} order by name, id`,
    );
    return {
      labels: labels.rows as LayerLabel[],
      fields: (fields.rows as LayerField[]).map((f) => ({ ...f, options: f.options ?? [] })),
      aliases: aliases.rows as LayerAlias[],
      pendingUnits: (
        pending.rows as {
          id: string;
          raw_code: string;
          unit_key: string | null;
          matched_at: string | null;
        }[]
      ).map((r) => ({
        id: r.id,
        rawCode: r.raw_code,
        unitKey: r.unit_key,
        matchedAt: r.matched_at,
      })),
      templates: templates.rows as LayerTemplate[],
    };
  });
}

// ---- retire (every part) -------------------------------------------------------------------------------------------

const RETIRE: Record<LayerPart, string> = {
  labels: "update company_labels set retired_at = now() where id::text = $1 and retired_at is null",
  fields: "update company_fields set retired_at = now() where code = $1 and retired_at is null",
  aliases:
    "update company_value_aliases set retired_at = now() where id::text = $1 and retired_at is null",
  "pending-units":
    "update company_pending_units set retired_at = now() where id::text = $1 and retired_at is null",
  templates:
    "update company_import_templates set retired_at = now() where id::text = $1 and retired_at is null",
};

/** Stops using one row; nothing is deleted. A row of another company, or already retired, is not found. */
export async function retireItem(run: RunAs, part: LayerPart, id: string): Promise<Write> {
  return run(async (c) => {
    const r = await c.query(RETIRE[part], [id]);
    return r.rowCount === 1 ? { ok: true, id } : fail("not-found");
  });
}

// ---- labels --------------------------------------------------------------------------------------------------------

function labelProblem(label: string): LayerProblem | null {
  const t = label.trim();
  if (!t) return "label-empty";
  return t.length > NAME_LIMIT ? "label-too-long" : null;
}

export async function addLabel(
  run: RunAs,
  input: { concept: string; label: string },
): Promise<Write> {
  if (!(LABELABLE_CONCEPTS as readonly string[]).includes(input.concept))
    return fail("concept-unknown");
  const problem = labelProblem(input.label);
  if (problem) return fail(problem);
  return run(async (c) => {
    try {
      const { rows } = await c.query(
        `insert into company_labels (company_id, concept, label) values (app.current_company_id(), $1, $2)
         returning id::text`,
        [input.concept, input.label.trim()],
      );
      return { ok: true, id: (rows[0] as { id: string }).id };
    } catch (err) {
      return refusal(err);
    }
  });
}

export async function editLabel(run: RunAs, id: string, input: { label: string }): Promise<Write> {
  const problem = labelProblem(input.label);
  if (problem) return fail(problem);
  return run(async (c) => {
    const r = await c.query(
      "update company_labels set label = $2 where id::text = $1 and retired_at is null",
      [id, input.label.trim()],
    );
    return r.rowCount === 1 ? { ok: true, id } : fail("not-found");
  });
}

// ---- custom fields -------------------------------------------------------------------------------------------------

/** The names a field must not take: the company's labels in use and the inventory's standard headers. */
async function nameContext(c: DbClient, standardHeaders: readonly string[]) {
  const fields = await c.query(
    "select code, name from company_fields where retired_at is null order by position",
  );
  const labels = await c.query("select label from company_labels where retired_at is null");
  return {
    liveFields: fields.rows as { code: string; name: string }[],
    labels: (labels.rows as { label: string }[]).map((r) => r.label),
    standardHeaders,
  };
}

/** A code made from the name, never one the company used before (retired codes are not reused). */
async function freshCode(c: DbClient, name: string): Promise<string> {
  let base = fold(name)
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  if (!/^[a-z]/.test(base)) base = `f_${base}`;
  base = base.slice(0, 28);
  const { rows } = await c.query("select code from company_fields where code like $1", [
    `${base}%`,
  ]);
  const used = new Set((rows as { code: string }[]).map((r) => r.code));
  if (!used.has(base)) return base;
  for (let i = 2; ; i += 1) if (!used.has(`${base}_${i}`)) return `${base}_${i}`;
}

export async function addField(
  run: RunAs,
  draft: FieldDraft,
  standardHeaders: readonly string[],
): Promise<Write> {
  return run(async (c) => {
    const problems = checkFieldDraft(draft, await nameContext(c, standardHeaders));
    if (problems.length) return fail(problems[0]!);
    const code = await freshCode(c, draft.name);
    try {
      await c.query(
        `insert into company_fields (company_id, code, name, kind, options, position)
         values (app.current_company_id(), $1, $2, $3, $4::jsonb,
                 (select coalesce(max(position), 0) + 1 from company_fields))`,
        [
          code,
          draft.name.trim(),
          draft.kind,
          JSON.stringify(draft.kind === "single_select" ? draft.options : []),
        ],
      );
      return { ok: true, id: code };
    } catch (err) {
      return refusal(err);
    }
  });
}

/** Changes a field's name or options; its kind never changes. */
export async function editField(
  run: RunAs,
  code: string,
  input: { name?: string; options?: readonly string[]; kind?: FieldKind },
  standardHeaders: readonly string[],
): Promise<Write> {
  return run(async (c) => {
    const { rows } = await c.query(
      "select name, kind, options from company_fields where code = $1 and retired_at is null",
      [code],
    );
    const current = rows[0] as { name: string; kind: FieldKind; options: string[] } | undefined;
    if (!current) return fail("not-found");
    if (input.kind !== undefined && input.kind !== current.kind) return fail("kind-fixed");
    const draft: FieldDraft = {
      name: input.name ?? current.name,
      kind: current.kind,
      options: input.options ?? current.options,
    };
    const problems = checkFieldDraft(draft, await nameContext(c, standardHeaders), code);
    if (problems.length) return fail(problems[0]!);
    try {
      await c.query("update company_fields set name = $2, options = $3::jsonb where code = $1", [
        code,
        draft.name.trim(),
        JSON.stringify(draft.kind === "single_select" ? draft.options : []),
      ]);
      return { ok: true, id: code };
    } catch (err) {
      return refusal(err);
    }
  });
}

// ---- value spellings -----------------------------------------------------------------------------------------------

async function liveFieldSets(c: DbClient) {
  const { rows } = await c.query(
    "select code, kind, options from company_fields where retired_at is null",
  );
  return rows as { code: string; kind: FieldKind; options: string[] }[];
}

export async function addAlias(
  run: RunAs,
  input: { field: string; raw: string; value: string },
): Promise<Write> {
  const raw = input.raw.trim();
  if (!raw) return fail("raw-empty");
  if (raw.length > NAME_LIMIT) return fail("raw-too-long");
  return run(async (c) => {
    const set = valueSetOf(input.field, await liveFieldSets(c));
    if (!set) return fail("field-no-set");
    if (!set.includes(input.value)) return fail("value-not-in-set");
    try {
      const { rows } = await c.query(
        `insert into company_value_aliases (company_id, field, raw, raw_fold, value)
         values (app.current_company_id(), $1, $2, $3, $4) returning id::text`,
        [input.field, raw, fold(raw), input.value],
      );
      return { ok: true, id: (rows[0] as { id: string }).id };
    } catch (err) {
      return refusal(err);
    }
  });
}

export async function editAlias(run: RunAs, id: string, input: { value: string }): Promise<Write> {
  return run(async (c) => {
    const { rows } = await c.query(
      "select field from company_value_aliases where id::text = $1 and retired_at is null",
      [id],
    );
    const field = (rows[0] as { field: string } | undefined)?.field;
    if (!field) return fail("not-found");
    const set = valueSetOf(field, await liveFieldSets(c));
    if (!set || !set.includes(input.value)) return fail("value-not-in-set");
    await c.query("update company_value_aliases set value = $2 where id::text = $1", [
      id,
      input.value,
    ]);
    return { ok: true, id };
  });
}

/**
 * The standard value a company's spelling stands for in one field, or null. A spelling whose field was retired, or
 * whose option is gone from the field, no longer resolves.
 */
export async function resolveSpelling(
  run: RunAs,
  field: string,
  raw: string,
): Promise<string | null> {
  return run(async (c) => {
    const set = valueSetOf(field, await liveFieldSets(c));
    if (!set) return null;
    const { rows } = await c.query(
      "select value from company_value_aliases where field = $1 and raw_fold = $2 and retired_at is null",
      [field, fold(raw)],
    );
    const value = (rows[0] as { value: string } | undefined)?.value;
    return value !== undefined && set.includes(value) ? value : null;
  });
}

// ---- pending units -------------------------------------------------------------------------------------------------

export async function addPendingUnit(
  run: RunAs,
  input: { rawCode: string; buildingText?: string; unitText?: string },
): Promise<Write> {
  const code = input.rawCode.trim();
  if (!code) return fail("code-empty");
  if (code.length > 80) return fail("code-too-long");
  return run(async (c) => {
    try {
      const { rows } = await c.query(
        `insert into company_pending_units (company_id, raw_code, building_text, unit_text)
         values (app.current_company_id(), $1, $2, $3) returning id::text`,
        [code, input.buildingText?.trim() || null, input.unitText?.trim() || null],
      );
      return { ok: true, id: (rows[0] as { id: string }).id };
    } catch (err) {
      return refusal(err);
    }
  });
}

export type CodeLookupResult =
  | { source: "company" | "catalog" | "reader"; unitKeys: string[] }
  | { source: "pending"; pendingId: string; unitKey: string | null }
  | null;

/**
 * Looks a typed code up in the company, in order: its own codes → the catalog's original codes → the shared reader →
 * its pending units. A pending unit already matched answers with its catalog unit.
 */
export async function lookupInCompany(run: RunAs, code: string): Promise<CodeLookupResult> {
  return run(async (c) => {
    const found = await resolveUnitCode(c, code);
    if (found.source) return found;
    const { rows } = await c.query(
      `select id::text, unit_key from company_pending_units
        where retired_at is null and upper(raw_code) = upper(btrim($1))`,
      [code],
    );
    const p = rows[0] as { id: string; unit_key: string | null } | undefined;
    return p ? { source: "pending", pendingId: p.id, unitKey: p.unit_key } : null;
  });
}

/** Matches every waiting pending unit whose code the catalog now resolves to exactly one unit; the catalog never changes. */
export async function matchPendingUnits(run: RunAs): Promise<{ matched: number; waiting: number }> {
  return run(async (c) => {
    const { rows } = await c.query(
      "select id::text, raw_code from company_pending_units where retired_at is null and unit_key is null",
    );
    let matched = 0;
    for (const p of rows as { id: string; raw_code: string }[]) {
      const found = await resolveUnitCode(c, p.raw_code);
      if (found.source && found.unitKeys.length === 1) {
        await c.query(
          "update company_pending_units set unit_key = $2, matched_at = now() where id::text = $1",
          [p.id, found.unitKeys[0]],
        );
        matched += 1;
      }
    }
    return { matched, waiting: rows.length - matched };
  });
}

// ---- import templates ----------------------------------------------------------------------------------------------

const STANDARD_TARGETS = new Set(
  Object.keys(FIELD_DISPLAY).filter((k) => /^(Listing|Unit)\./.test(k)),
);

export async function saveTemplate(
  run: RunAs,
  input: { name: string; headers: readonly string[]; columns: readonly TemplateTarget[] },
): Promise<Write> {
  const name = input.name.trim();
  if (!name) return fail("label-empty");
  if (name.length > 60) return fail("label-too-long");
  if (input.headers.length === 0 || input.headers.length !== input.columns.length)
    return fail("columns-mismatch");
  return run(async (c) => {
    const live = new Set((await liveFieldSets(c)).map((f) => f.code));
    for (const t of input.columns) {
      const ok =
        ("skip" in t && t.skip === true) ||
        ("standard" in t && STANDARD_TARGETS.has(t.standard)) ||
        ("custom" in t && live.has(t.custom));
      if (!ok) return fail("target-unknown");
    }
    try {
      const { rows } = await c.query(
        `insert into company_import_templates (company_id, name, signature, columns)
         values (app.current_company_id(), $1, $2, $3::jsonb) returning id::text`,
        [name, templateSignature(input.headers), JSON.stringify(input.columns)],
      );
      return { ok: true, id: (rows[0] as { id: string }).id };
    } catch (err) {
      return refusal(err);
    }
  });
}

export async function renameTemplate(
  run: RunAs,
  id: string,
  input: { name: string },
): Promise<Write> {
  const name = input.name.trim();
  if (!name) return fail("label-empty");
  if (name.length > 60) return fail("label-too-long");
  return run(async (c) => {
    const r = await c.query(
      "update company_import_templates set name = $2 where id::text = $1 and retired_at is null",
      [id, name],
    );
    return r.rowCount === 1 ? { ok: true, id } : fail("not-found");
  });
}

/**
 * The template of a sheet of the same shape (same folded names, same order), with the columns whose custom field was
 * retired since, for the import to ask again; null when the company has none.
 */
export async function findTemplate(
  run: RunAs,
  headers: readonly string[],
): Promise<{ template: LayerTemplate; retiredColumns: number[] } | null> {
  return run(async (c) => {
    const { rows } = await c.query(
      `select id::text, name, signature, columns from company_import_templates
        where retired_at is null and signature = $1::text[]`,
      [templateSignature(headers)],
    );
    const template = rows[0] as LayerTemplate | undefined;
    if (!template) return null;
    const live = new Set((await liveFieldSets(c)).map((f) => f.code));
    const retiredColumns = template.columns.flatMap((t, i) =>
      "custom" in t && !live.has(t.custom) ? [i] : [],
    );
    return { template, retiredColumns };
  });
}
