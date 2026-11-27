// What one import teaches the company layer (row 11, nhap-excel; rule learn-on-success of ImportRun): written once,
// after the import's last batch, through the store's own writes so every rule of row 7e holds. An item the company
// already has is left as it is and not counted as learned, so undoing the import never retires it.
import {
  addAlias,
  addField,
  addLabel,
  addPendingUnit,
  retireItem,
  saveTemplate,
  type RunAs,
  type TemplateTarget,
} from "./store";
import type { FieldDraft } from "./rules";

export interface LearnInput {
  template: { name: string; headers: readonly string[]; columns: readonly TemplateTarget[] } | null;
  labels: readonly { concept: string; label: string }[];
  fields: readonly FieldDraft[];
  aliases: readonly { field: string; raw: string; value: string }[];
  pendingUnits: readonly { rawCode: string; buildingText?: string }[];
}

export interface LearnedIds {
  templateId: string | null;
  labelIds: string[];
  fieldCodes: string[];
  aliasIds: string[];
  /** Pending units this import created, by the code as written in the file. */
  pendingUnits: { rawCode: string; id: string }[];
}

/** Custom fields first (a template or a spelling may point at them), then the rest. */
export async function learnFromImport(
  run: RunAs,
  input: LearnInput,
  standardHeaders: readonly string[],
  fieldTemplate: (draft: FieldDraft, code: string) => void = () => {},
): Promise<LearnedIds> {
  const out: LearnedIds = {
    templateId: null,
    labelIds: [],
    fieldCodes: [],
    aliasIds: [],
    pendingUnits: [],
  };
  for (const f of input.fields) {
    const w = await addField(run, f, standardHeaders);
    if (w.ok) {
      out.fieldCodes.push(w.id);
      fieldTemplate(f, w.id);
    }
  }
  for (const l of input.labels) {
    const w = await addLabel(run, l);
    if (w.ok) out.labelIds.push(w.id);
  }
  for (const a of input.aliases) {
    const w = await addAlias(run, a);
    if (w.ok) out.aliasIds.push(w.id);
  }
  for (const p of input.pendingUnits) {
    const w = await addPendingUnit(run, {
      rawCode: p.rawCode,
      ...(p.buildingText ? { buildingText: p.buildingText } : {}),
    });
    if (w.ok) out.pendingUnits.push({ rawCode: p.rawCode, id: w.id });
  }
  if (input.template) {
    const w = await saveTemplate(run, input.template);
    if (w.ok) out.templateId = w.id;
  }
  return out;
}

/** Retire what one import taught (undo); pending units are retired by the caller once no listing sits on them. */
export async function retireLearned(run: RunAs, ids: LearnedIds): Promise<void> {
  if (ids.templateId) await retireItem(run, "templates", ids.templateId);
  for (const id of ids.aliasIds) await retireItem(run, "aliases", id);
  for (const id of ids.labelIds) await retireItem(run, "labels", id);
  for (const code of ids.fieldCodes) await retireItem(run, "fields", code);
}
