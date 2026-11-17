// The paste preview of the inventory grid (row 5): every pasted cell read by the listing's rules (../paste-rules, which
// calls ../edit-rules) into a line of the preview — will change, left out and why, words not of the column's kind.
// Pure: the grid hands the pasted cells, this file says what each one means; the write goes through the save door.
import type { PasteChangeLine, PasteOutLine } from "@/components/candidate/paste-preview";
import type { FieldKey } from "@/components/candidate/column-kind";
import type { GridRow, RegionPaste } from "@/components/candidate/data-region";
import { GRID_COPY } from "@/components/candidate/grid-copy";
import { PASTE_COPY } from "@/components/candidate/paste-copy";
import type { ListingStandardStatus } from "@/generated/ontology";
import { formatMoney, statusLabel } from "@/lib/format";

import { readCustomValue, sameCustomValue } from "../custom-rules";
import { readPastePrice, readPasteStatus, readStatusText } from "../paste-rules";
import type { CustomFieldChange, PriceOrStatusChange } from "../save-door";

import { CELL_EDIT_COPY, type CellEditLabels } from "./cell-edit-copy";
import type { CustomCellField } from "./listing-cell-edit";
import { pasteWords } from "./listing-paste-copy";

const PRICE = "Listing.listPrice";
const STATUS = "Listing.standardStatus";
const CONFIRMED = "Listing.lastConfirmedAt";
/** The unit's own facts: fixed on the grid (row 4, a Never the owner signed). */
const UNIT_FACTS: readonly FieldKey[] = [
  "Listing.unitNumber",
  "Listing.buildingName",
  "Listing.subdivisionName",
  "Unit.livingArea",
  "Unit.bedroomsTotal",
];

/** One write the preview may apply, keyed by its line's id. */
export interface PasteWrite {
  row: GridRow;
  field: typeof PRICE | typeof STATUS | `custom.${string}`;
  change: PriceOrStatusChange | CustomFieldChange;
  undoable: boolean;
}

export interface PastePlan {
  /** A new number for each paste, set by the screen: the preview starts afresh. */
  key: number;
  /** «Dán vào 3 căn». */
  title: string;
  changes: PasteChangeLine[];
  skipped: PasteOutLine[];
  wrong: PasteOutLine[];
  same: number;
  writes: ReadonlyMap<string, PasteWrite>;
}

const percent = new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 2 });
/** «+72%», «−25%»: the swing of a big price change, as the cell's ask-again of row 4 says it. */
const swingMark = (swing: number) =>
  `${swing > 0 ? "+" : "−"}${percent.format(Math.abs(swing) * 100)}%`;

/**
 * Reads a pasted region onto the inventory rows. `headerOf` names a column as the grid shows it; `computed` lists the
 * columns the machine works out from others (row 19's net-to-seller column), which a paste never writes.
 */
export function planPaste(
  paste: RegionPaste,
  labels: CellEditLabels,
  headerOf: (field: FieldKey) => string,
  computed: readonly FieldKey[] = [],
  /** The company's own fields the cells edit (row 3g): a paste takes them by their kind. */
  customs: ReadonlyMap<string, CustomCellField> = new Map(),
): PastePlan {
  const say = pasteWords(labels);
  const changes: PasteChangeLine[] = [];
  const skipped: PasteOutLine[] = [];
  const wrong: PasteOutLine[] = [];
  const writes = new Map<string, PasteWrite>();
  let same = 0;
  const rows = new Set<string>();
  for (const cell of paste.cells) {
    const { row, field, raw } = cell;
    const id = `${row.id}|${field}`;
    const line = { id, where: say.where(row), field: headerOf(field), raw };
    // An empty word changes nothing, wherever it lands: it is only counted.
    if (raw.trim() === "" && (cell.group !== undefined || (field !== PRICE && field !== STATUS))) {
      same += 1;
      continue;
    }
    if (cell.group !== undefined) {
      skipped.push({ id, where: PASTE_COPY.groupRow(cell.group), raw, why: say.other });
      continue;
    }
    const custom = customs.get(field);
    if (custom) {
      // A company's own field takes a pasted word by its kind (row 3g), with the cell's one rule.
      const read = readCustomValue(custom.kind, raw, custom.options);
      if (!read.ok) {
        wrong.push({ ...line, why: CELL_EDIT_COPY.customProblem(read.problem) });
        continue;
      }
      if (sameCustomValue(read.value, row[field])) {
        same += 1;
        continue;
      }
      if (!cell.open) {
        skipped.push({ ...line, why: row.locked?.[field] ?? say.notAllowed });
        continue;
      }
      const shown = (v: unknown) =>
        v === null || v === undefined
          ? "—"
          : typeof v === "boolean"
            ? v
              ? GRID_COPY.yes
              : GRID_COPY.no
            : CELL_EDIT_COPY.customShown(custom.kind, v);
      changes.push({
        id,
        where: line.where,
        field: line.field,
        from: shown(row[field]),
        to: shown(read.value),
      });
      writes.set(id, {
        row,
        field: `custom.${custom.code}`,
        change: { field: "customField", code: custom.code, value: read.value },
        undoable: true,
      });
      rows.add(row.id);
      continue;
    }
    if (field !== PRICE && field !== STATUS) {
      const why = UNIT_FACTS.includes(field)
        ? say.unitFact(row.transaction)
        : field === CONFIRMED
          ? say.confirmed(row.transaction)
          : computed.includes(field)
            ? say.computed
            : field.startsWith("custom.")
              ? say.custom
              : say.other;
      skipped.push({ ...line, why });
      continue;
    }
    const target = {
      standardStatus: row[STATUS] as ListingStandardStatus,
      listPrice: row[PRICE] as number | null | undefined,
      transaction: row.transaction,
    };
    const read = field === PRICE ? readPastePrice(target, raw) : readPasteStatus(target, raw);
    if (read.kind === "same") {
      same += 1;
      continue;
    }
    if (read.kind === "wrong") {
      wrong.push({ ...line, why: field === PRICE ? say.price : say.status(row.transaction) });
      continue;
    }
    if (!cell.open) {
      // The grid would not open this cell: locked for the row (row 4) or not the session's to edit.
      skipped.push({ ...line, why: row.locked?.[field] ?? say.notAllowed });
      continue;
    }
    if (read.kind === "skip") {
      const to =
        read.why === "move"
          ? statusLabel(
              readStatusText(raw, row.transaction) ?? target.standardStatus,
              row.transaction,
            )
          : "";
      skipped.push({
        ...line,
        why: say.skip(read.why, target.standardStatus, to, row.transaction),
      });
      continue;
    }
    const change = read.change;
    const shown =
      change.field === "listPrice"
        ? {
            from: target.listPrice ? formatMoney(target.listPrice) : "—",
            to: formatMoney(change.listPrice),
          }
        : {
            from: statusLabel(target.standardStatus, row.transaction),
            to: statusLabel(change.standardStatus, row.transaction),
          };
    changes.push({
      id,
      where: line.where,
      field: line.field,
      ...shown,
      // A price far from the old one is the ask-again of row 4: shown, and left unticked until the person ticks it.
      ...(read.swing !== undefined ? { mark: swingMark(read.swing), held: true } : {}),
      ...(read.undoable ? {} : { final: true }),
    });
    writes.set(id, { row, field, change, undoable: read.undoable });
    rows.add(row.id);
  }
  const beyond = paste.beyond;
  if (beyond.rows > 0)
    skipped.push({ id: "beyond-rows", where: PASTE_COPY.beyondRows(beyond.rows), why: "" });
  if (beyond.columns > 0)
    skipped.push({
      id: "beyond-columns",
      where: PASTE_COPY.beyondColumns(beyond.columns),
      why: "",
    });
  const touched = new Set(paste.cells.filter((c) => c.group === undefined).map((c) => c.row.id))
    .size;
  return { key: 0, title: say.title(touched), changes, skipped, wrong, same, writes };
}
