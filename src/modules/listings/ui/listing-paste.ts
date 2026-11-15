// The paste preview of the inventory grid (row 5): every pasted cell read by the listing's rules (../paste-rules, which
// calls ../edit-rules) into a line of the preview — will change, left out and why, words not of the column's kind.
// Pure: the grid hands the pasted cells, this file says what each one means; the write goes through the save door.
import type { PasteChangeLine, PasteOutLine } from "@/components/candidate/paste-preview";
import type { FieldKey } from "@/components/candidate/column-kind";
import type { GridRow, RegionPaste } from "@/components/candidate/data-region";
import { PASTE_COPY } from "@/components/candidate/paste-copy";
import type { ListingStandardStatus } from "@/generated/ontology";
import { formatMoney, statusLabel } from "@/lib/format";

import {
  readPastePrice,
  readPasteStatus,
  readStatusText,
  statusWords,
  type PasteSkip,
} from "../paste-rules";
import type { ListingChange } from "../save-door";

import { word, type CellEditLabels } from "./cell-edit-copy";

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
  field: typeof PRICE | typeof STATUS;
  change: ListingChange;
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

/** Every sentence of the plan, with the concept words of the label table. */
export function pasteWords(labels: CellEditLabels) {
  const unit = (tx?: GridRow["transaction"]) => word(labels, "Unit", tx);
  const lower = (text: string) => text.toLocaleLowerCase("vi");
  return {
    title: (count: number) => `Dán vào ${count} ${lower(unit())}`,
    where: (row: GridRow) => `${unit(row.transaction)} ${String(row["Listing.unitNumber"] ?? "")}`,
    unitFact: (tx?: GridRow["transaction"]) =>
      `thuộc tính ${lower(unit(tx))} — không sửa trên bảng`,
    confirmed: "máy tự ghi khi giá hay trạng thái đổi",
    custom: "cột riêng của sàn chưa sửa được trên bảng",
    computed: "cột máy tính từ các cột khác — không dán được",
    other: "cột này không sửa trên bảng",
    notAllowed: "vai của bạn không sửa được ô này",
    price: "chưa hiểu — gõ như 4,65 tỷ hoặc 950 triệu",
    status: (tx?: GridRow["transaction"]) =>
      `chưa hiểu — gõ một trong: ${statusWords(tx).join(", ")}`,
    skip: (
      why: PasteSkip,
      from: ListingStandardStatus,
      to: string,
      tx?: GridRow["transaction"],
    ) => {
      const name = (s: ListingStandardStatus) => statusLabel(s, tx);
      if (why === "move") return `từ ${name(from)} không sang ${to} được`;
      if (why === "closed-needs")
        return `${name("Closed")} cần ${lower(word(labels, "ClosePrice", tx))} và ${lower(word(labels, "CloseDate", tx))} — mở ô để đổi`;
      if (why === "withdrawn-needs")
        return `${name("Withdrawn")} cần ${lower(word(labels, "WithdrawnReason", tx))} — mở ô để đổi`;
      return `${name(from)} — giữ nguyên như lúc bán`;
    },
    refused: `Vai của bạn chưa sửa được ${lower(unit())} trên bảng.`,
    records: (count: number) => `${count} ${lower(unit())}`,
  };
}

const percent = new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 2 });
/** «+72%», «−25%»: the swing of a big price change, as the cell's ask-again of row 4 says it. */
const swingMark = (swing: number) =>
  `${swing > 0 ? "+" : "−"}${percent.format(Math.abs(swing) * 100)}%`;

/**
 * Reads a pasted region onto the inventory rows. `headerOf` names a column as the grid shows it; `computed` lists the
 * columns the machine works out from others (row 19's «Về tay»), which a paste never writes.
 */
export function planPaste(
  paste: RegionPaste,
  labels: CellEditLabels,
  headerOf: (field: FieldKey) => string,
  computed: readonly FieldKey[] = [],
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
    if (cell.group !== undefined) {
      skipped.push({ id, where: PASTE_COPY.groupRow(cell.group), raw, why: say.other });
      continue;
    }
    if (field !== PRICE && field !== STATUS) {
      // An empty word on a column that is not edited changes nothing either way.
      if (raw.trim() === "") {
        same += 1;
        continue;
      }
      const why = UNIT_FACTS.includes(field)
        ? say.unitFact(row.transaction)
        : field === CONFIRMED
          ? say.confirmed
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
