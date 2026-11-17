"use client";

// In-cell edit of the inventory grid (row 4): which cells open, the editors, and every write through the one save door
// with «Hoàn tác». With a database the door is the real /api/v1 one (row 10); without one, the sample door in memory.
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import type { FieldKey } from "@/components/candidate/column-kind";
import type { GridRow, RegionCellEdit, RegionPaste } from "@/components/candidate/data-region";
import { GRID_COPY } from "@/components/candidate/grid-copy";
import { PASTE_COPY } from "@/components/candidate/paste-copy";
import { PastePreview } from "@/components/candidate/paste-preview";
import { notifyResult } from "@/components/templates/notify";
import { runDoorBatch, runDoorChange, type WriteOutcome } from "@/components/candidate/use-change";
import type { Listing, ListingStandardStatus } from "@/generated/ontology";
import { formatMoney, statusLabel } from "@/lib/format";

import {
  sampleSaveDoor,
  type ListingChange,
  type ListingSaveDoor,
  type SaveRequest,
} from "../save-door";

import { priceUndoable } from "../edit-rules";

import { CELL_EDIT_COPY as COPY, type CellEditLabels } from "./cell-edit-copy";
import {
  detailCellFields,
  detailCells,
  detailChange,
  isDetailColumn,
  type DetailColumnWords,
} from "./detail-cells";
import { FEE_INCLUSION_FIELD, NET_TO_SELLER_FIELD, type InventoryField } from "./inventory-rows";
import { planPaste, type PastePlan } from "./listing-paste";
import { pasteWords } from "./listing-paste-copy";
import { word } from "./cell-edit-copy";
import {
  ListingCellEdit,
  StatusNeedsDialog,
  cellKeyOf,
  lockedReasons,
  type CustomCellField,
  type CustomEdit,
  type ListingEdit,
  type StatusAsk,
} from "./listing-cell-edit";

const PASTE_COMPUTED: readonly FieldKey[] = [NET_TO_SELLER_FIELD];

/** Phones do not edit in a cell (the quick phone edit is row 3d): cells open from 768 px. */
const WIDE = "(min-width: 768px)";
const subscribeWide = (onChange: () => void) => {
  const query = window.matchMedia(WIDE);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

const NO_LINES: never[] = [];
const PRICE = "Listing.listPrice";
const STATUS = "Listing.standardStatus";
const CONFIRMED = "Listing.lastConfirmedAt";
const FEE = FEE_INCLUSION_FIELD;
type EditedField = typeof PRICE | typeof STATUS | typeof FEE;

const toChange = (edit: ListingEdit): ListingChange =>
  edit.field === PRICE
    ? { field: "listPrice", listPrice: edit.value }
    : edit.field === FEE
      ? { field: "feeInclusion", feeInclusion: edit.value }
      : {
          field: "standardStatus",
          standardStatus: edit.value,
          closePrice: edit.closePrice,
          closeDate: edit.closeDate,
          withdrawnReason: edit.withdrawnReason,
        };

/** The words of the two fee inclusions, as the fee column shows them. */
const feeWord = (
  labels: CellEditLabels | undefined,
  value: Listing["feeInclusion"],
  tx?: GridRow["transaction"],
) =>
  !labels || !value ? null : word(labels, value === "Included" ? "FeeIncluded" : "FeeExcluded", tx);

/** What a listing as the server keeps it shows in the row's edited cells (row 10: a conflict shows the latest). */
const cellsOf = (
  l: Listing,
  labels: CellEditLabels | undefined,
  tx?: GridRow["transaction"],
): Partial<GridRow> => ({
  [PRICE]: l.listPrice ?? null,
  [STATUS]: l.standardStatus,
  [CONFIRMED]: l.lastConfirmedAt ?? null,
  [FEE]: feeWord(labels, l.feeInclusion, tx),
});

/**
 * The cell edit of the inventory grid over `rows`. `listings` are the listings the rows show (the sample door holds
 * them); `door` replaces the sample door (tests, and row 10's real write path).
 */
export function useListingCellEdit({
  rows,
  listings,
  headers,
  labels,
  door: given,
  headerOf,
  noActivate,
  feeEditable = false,
  onServerWork,
  customFields,
  detailWords,
  onSaved,
}: {
  rows: readonly GridRow[];
  /** Absent: the grid is read-only. */
  listings: readonly Listing[] | undefined;
  headers: Readonly<Record<InventoryField, string>>;
  /** Words of the editors from the label table; absent with `listings` absent. */
  labels: CellEditLabels | undefined;
  door?: ListingSaveDoor;
  /** A column's header as the grid shows it (custom columns included), for the paste preview (row 5). */
  headerOf?: (field: FieldKey) => string;
  /** Rows whose status cell does not offer Active to this person (row 10, AC-5: someone else keeps the unit). */
  noActivate?: readonly string[];
  /** Whether the fee inclusion column is shown and edited on its cell (row 10, AC-7). */
  feeEditable?: boolean;
  /** Called after a saved change whose other cells the server works out (the net to seller): the page reads again. */
  onServerWork?: () => void;
  /** The company's own fields whose cells edit by their kind (row 3g). */
  customFields?: readonly CustomCellField[];
  /** Words of the four detail columns (row 3g, «lối C»): with them those cells edit one part at a time. */
  detailWords?: DetailColumnWords;
  /** Told after every write that saved (the open record shows what the grid saved). */
  onSaved?: () => void;
}): {
  rows: readonly GridRow[];
  cellEdit: RegionCellEdit | undefined;
  dialogs: ReactNode;
  /** One write of a listing through the same door and versions (row 3g: the record's details). */
  writeListing: (id: string, change: ListingChange, at: string) => Promise<WriteOutcome>;
  /** The listing as the door last saved it, when it did (row 3g: the record shows it). */
  savedListing: (id: string) => Listing | undefined;
} {
  // Typed cells (row 3g): the company's own fields, then the four details when their words are given.
  const typedFields = useMemo(
    () => [...(customFields ?? []), ...(detailWords ? detailCellFields(detailWords) : [])],
    [customFields, detailWords],
  );
  const customKeys = useMemo(() => typedFields.map(cellKeyOf), [typedFields]);
  const lock = useCallback((row: GridRow) => lockedReasons(row, customKeys), [customKeys]);
  const [door] = useState<ListingSaveDoor & { current?: (id: string) => Listing | undefined }>(
    () =>
      given ??
      sampleSaveDoor(listings ?? [], {
        online: () => navigator.onLine,
        // Outside production the browser tests read every request the sample door got (row 4, E2, E3, E5).
        seen:
          process.env.NODE_ENV === "production"
            ? undefined
            : (request) => {
                const log = window as unknown as { __sampleSaves?: SaveRequest[] };
                (log.__sampleSaves ??= []).push(request);
              },
      }),
  );
  const [versions] = useState(() => new Map((listings ?? []).map((l) => [l.id, l.version])));
  const [saved] = useState(() => new Map<string, Listing>());
  const customs = useMemo(
    () => new Map<FieldKey, CustomCellField>(typedFields.map((f) => [cellKeyOf(f) as FieldKey, f])),
    [typedFields],
  );
  /** The change a typed cell sends: one detail of the listing, or one value of the company's own field. */
  const changeFor = useCallback(
    (field: CustomCellField, value: CustomEdit["value"]): ListingChange =>
      field.key && isDetailColumn(field.key) && detailWords
        ? detailChange(field.key, value === null ? null : String(value), detailWords)
        : { field: "customField", code: field.code, value },
    [detailWords],
  );
  const [data, setData] = useState<readonly GridRow[]>(() =>
    rows.map((row) => ({ ...row, locked: lock(row) })),
  );
  // The page reads the rows again after a change the server works out (the net to seller of a fee change, row 10): the
  // new rows and versions replace the ones held here. Only for rows the server hands in (stable between renders).
  const seen = useRef({ rows, listings });
  useEffect(() => {
    if (!onServerWork || (seen.current.rows === rows && seen.current.listings === listings)) return;
    seen.current = { rows, listings };
    setData(rows.map((row) => ({ ...row, locked: lock(row) })));
    for (const l of listings ?? [])
      versions.set(l.id, Math.max(versions.get(l.id) ?? 0, l.version));
  }, [onServerWork, rows, listings, versions, lock]);
  const [ask, setAsk] = useState<StatusAsk | null>(null);
  const wide = useSyncExternalStore(
    subscribeWide,
    () => window.matchMedia(WIDE).matches,
    () => false,
  );

  const patch = useCallback(
    (id: string, fields: Partial<GridRow>) => {
      setData((all) =>
        all.map((row) => {
          if (row.id !== id) return row;
          const next = { ...row, ...fields } as GridRow;
          return { ...next, locked: lock(next) };
        }),
      );
    },
    [lock],
  );

  /** One write through the door; the row's version moves on when it saves. */
  const write = useCallback(
    async (id: string, change: ListingChange, at: string): Promise<WriteOutcome> => {
      const outcome = await door.save({ id, version: versions.get(id) ?? 1, change, at });
      if (outcome.kind === "saved") {
        versions.set(id, outcome.listing.version);
        saved.set(id, outcome.listing);
        onSaved?.();
        return "saved";
      }
      if (outcome.kind === "conflict" && outcome.current) {
        // Someone changed the listing since: the row shows it as the server keeps it now, never the edit over it.
        const current = outcome.current;
        versions.set(id, current.version);
        saved.set(id, current);
        setData((all) =>
          all.map((row) => {
            if (row.id !== id) return row;
            const next = {
              ...row,
              ...cellsOf(current, labels, row.transaction),
              ...(detailWords ? detailCells(current, detailWords) : {}),
            } as GridRow;
            return { ...next, locked: lock(next) };
          }),
        );
        return "conflict";
      }
      // The cell never sends a change the rules refuse; if one slips through, the door refused it (row 4).
      return outcome.kind === "invalid" ? "refused" : outcome.kind;
    },
    [door, versions, labels, saved, lock, onSaved, detailWords],
  );

  const save = useCallback(
    async (row: GridRow, edit: ListingEdit) => {
      const unit = String(row["Listing.unitNumber"] ?? "");
      const tx = row.transaction;
      const shown = (field: EditedField, value: unknown) =>
        field === PRICE
          ? formatMoney(value as number)
          : field === FEE
            ? String(feeWord(labels, value as Listing["feeInclusion"], tx) ?? value ?? "")
            : statusLabel(value as ListingStandardStatus, tx);
      const what = (field: EditedField, value: unknown) =>
        `${field === FEE ? (labels ? word(labels, "FeeInclusion", tx) : "") : headers[field]} ${headers["Listing.unitNumber"].toLocaleLowerCase("vi")} ${unit}: ${shown(field, value)}`;
      // Only the edited cell and the confirmed time: undoing it never puts another cell back (row 10, AC-6).
      const before: Partial<GridRow> = {
        [edit.field]: row[edit.field],
        [CONFIRMED]: row[CONFIRMED],
      };
      const at = new Date().toISOString();
      const change = toChange(edit);
      const wasFee = listings?.find((l) => l.id === row.id)?.feeInclusion;
      const undoable =
        edit.field === PRICE
          ? priceUndoable(row[PRICE] as number | null)
          : edit.field === FEE
            ? wasFee !== undefined
            : edit.undoable;
      const back: ListingChange =
        edit.field === PRICE
          ? { field: "listPrice", listPrice: row[PRICE] as number }
          : edit.field === FEE
            ? { field: "feeInclusion", feeInclusion: wasFee ?? "Included" }
            : { field: "standardStatus", standardStatus: row[STATUS] as ListingStandardStatus };
      const shownNow =
        edit.field === FEE ? feeWord(labels, edit.value, row.transaction) : edit.value;
      // The cell shows the new value at once; a save that does not go through puts the old one back.
      patch(row.id, { [edit.field]: shownNow, [CONFIRMED]: at });
      const outcome = await runDoorChange({
        done: COPY.done(what(edit.field, edit.value), undoable),
        undone: COPY.undone(
          edit.field === FEE ? what(FEE, wasFee) : what(edit.field, before[edit.field]),
        ),
        write: () => write(row.id, change, at),
        undo: undoable
          ? async () => {
              const result = await write(row.id, back, new Date().toISOString());
              if (result === "saved") {
                patch(row.id, before);
                if (edit.field === FEE) onServerWork?.();
              }
              return result;
            }
          : undefined,
        failed: (why) => COPY.saveFailed(what(edit.field, edit.value).toLocaleLowerCase("vi"), why),
        undoFailed: (why) => COPY.undoFailed(labels!, unit, shown(edit.field, edit.value), why),
      });
      if (outcome === "saved" && edit.field === FEE) onServerWork?.();
      // A conflict already shows the listing as the server keeps it.
      if (outcome !== "saved" && outcome !== "conflict") patch(row.id, before);
    },
    [headers, labels, listings, patch, write, onServerWork],
  );

  /** One value of a company's own field (row 3g): the cell shows it at once, the door saves it, «Hoàn tác» puts it back. */
  const saveCustom = useCallback(
    async (row: GridRow, edit: CustomEdit) => {
      const field = customs.get(edit.field as FieldKey);
      if (!field || !labels) return;
      const unit = String(row["Listing.unitNumber"] ?? "");
      const shown = (v: unknown) =>
        v === null || v === undefined
          ? COPY.customNone
          : typeof v === "boolean"
            ? v
              ? GRID_COPY.yes
              : GRID_COPY.no
            : COPY.customShown(field.kind, v);
      const what = (v: unknown) =>
        `${field.header} ${headers["Listing.unitNumber"].toLocaleLowerCase("vi")} ${unit}: ${shown(v)}`;
      const key = edit.field as FieldKey;
      const was = (row[key] ?? null) as CustomEdit["value"];
      const before: Partial<GridRow> = {
        [key]: row[key],
        [CONFIRMED]: row[CONFIRMED],
      };
      const at = new Date().toISOString();
      patch(row.id, { [key]: edit.value, [CONFIRMED]: at });
      const outcome = await runDoorChange({
        done: COPY.done(what(edit.value), true),
        undone: COPY.undone(what(was)),
        write: () => write(row.id, changeFor(field, edit.value), at),
        undo: async () => {
          const result = await write(row.id, changeFor(field, was), new Date().toISOString());
          if (result === "saved") patch(row.id, before);
          return result;
        },
        failed: (why) => COPY.saveFailed(what(edit.value).toLocaleLowerCase("vi"), why),
        undoFailed: (why) => COPY.undoFailed(labels, unit, shown(edit.value), why),
      });
      if (outcome !== "saved" && outcome !== "conflict") patch(row.id, before);
    },
    [customs, labels, headers, patch, write, changeFor],
  );

  // Pasting a region (row 5): the preview first, then every ticked cell through the same door, undone at once.
  const [plan, setPlan] = useState<PastePlan | null>(null);
  const [applying, setApplying] = useState(false);
  const onPaste = useCallback(
    (paste: RegionPaste) => {
      if (!labels) return;
      const plan = planPaste(
        paste,
        labels,
        (field) => headerOf?.(field) ?? headers[field as InventoryField] ?? field,
        // Row 19's net-to-seller column is worked out from the price and the fees: a paste never writes it.
        PASTE_COMPUTED,
        customs,
        changeFor,
      );
      setPlan({ ...plan, key: Date.now() });
    },
    [labels, headerOf, headers, customs, changeFor],
  );
  const applyPaste = useCallback(
    async (ids: readonly string[]) => {
      if (!plan || !labels) return;
      const say = pasteWords(labels);
      const picked = ids.flatMap((id) => {
        const w = plan.writes.get(id);
        return w ? [{ id, ...w }] : [];
      });
      const at = new Date().toISOString();
      // Each row's values before the paste, to put back on a failed write and on undo.
      const before = new Map<string, Partial<GridRow>>();
      for (const { row } of picked)
        before.set(row.id, {
          ...before.get(row.id),
          [PRICE]: row[PRICE],
          [STATUS]: row[STATUS],
          [CONFIRMED]: row[CONFIRMED],
        });
      for (const { row, field } of picked)
        if (field.startsWith("custom."))
          before.set(row.id, { ...before.get(row.id), [field]: row[field] });
      // How many pasted cells of each row hold a saved value, to know when the row's confirmed time goes back.
      const holding = new Map<string, number>();
      setApplying(true);
      for (const { row, field, change, cell } of picked)
        patch(row.id, {
          ...(change.field === "listPrice"
            ? { [PRICE]: change.listPrice }
            : change.field === "standardStatus"
              ? { [STATUS]: change.standardStatus }
              : { [field]: cell ?? null }),
          [CONFIRMED]: at,
        });
      const lines = new Map(plan.changes.map((c) => [c.id, c]));
      const outcomes = await runDoorBatch({
        writes: picked.map(({ id, row, field, change, undoable }) => ({
          what: `${lines.get(id)?.where ?? ""} · ${lines.get(id)?.field ?? ""}`,
          write: () => write(row.id, change, at),
          undo: undoable
            ? async () => {
                const was = before.get(row.id) ?? {};
                const back: ListingChange =
                  field === PRICE
                    ? { field: "listPrice", listPrice: was[PRICE] as number }
                    : field === STATUS
                      ? {
                          field: "standardStatus",
                          standardStatus: was[STATUS] as ListingStandardStatus,
                        }
                      : changeFor(
                          customs.get(field as FieldKey)!,
                          (was[field as FieldKey] ?? null) as CustomEdit["value"],
                        );
                const result = await write(row.id, back, new Date().toISOString());
                if (result === "saved") {
                  // The confirmed time goes back only with the row's last cell that still held a pasted value.
                  const left = (holding.get(row.id) ?? 1) - 1;
                  holding.set(row.id, left);
                  patch(row.id, {
                    [field]: was[field],
                    ...(left === 0 ? { [CONFIRMED]: was[CONFIRMED] } : {}),
                  });
                }
                return result;
              }
            : undefined,
        })),
        done: (saved) =>
          PASTE_COPY.done(saved, say.records(new Set(picked.map((p) => p.row.id)).size)),
        partly: (saved, failed, why) => PASTE_COPY.partly(saved, failed, PASTE_COPY.why[why]),
        noneSaved: (why) => PASTE_COPY.noneSaved(PASTE_COPY.why[why]),
        undone: (count, kept) =>
          kept > 0 ? PASTE_COPY.undoneExcept(count, kept) : PASTE_COPY.undone(count),
        undoFailed: (still, why) => PASTE_COPY.undoFailed(still.join(", "), PASTE_COPY.why[why]),
      });
      // A write that did not go through puts its cell back; the confirmed time too, unless another cell of the row saved.
      picked.forEach(({ row }, i) => {
        if (outcomes[i] === "saved") holding.set(row.id, (holding.get(row.id) ?? 0) + 1);
      });
      picked.forEach(({ row, field }, i) => {
        if (outcomes[i] !== "saved") {
          const was = before.get(row.id) ?? {};
          const kept = (holding.get(row.id) ?? 0) > 0;
          patch(row.id, { [field]: was[field], ...(kept ? {} : { [CONFIRMED]: was[CONFIRMED] }) });
        }
      });
      setApplying(false);
      setPlan(null);
    },
    [plan, labels, patch, write],
  );

  const blocked = useMemo(() => new Set(noActivate ?? []), [noActivate]);
  const cellEdit = useMemo<RegionCellEdit | undefined>(() => {
    if (!wide || !listings || !labels) return undefined;
    return {
      action: "updateListing",
      fields: [
        ...((feeEditable ? [PRICE, STATUS, FEE] : [PRICE, STATUS]) as FieldKey[]),
        ...customs.keys(),
      ],
      label: (row, field) =>
        COPY.editLabel(
          labels,
          headers[field as InventoryField] ?? headerOf?.(field) ?? field,
          String(row["Listing.unitNumber"] ?? ""),
        ),
      render: (session) => (
        <ListingCellEdit
          session={session}
          labels={labels}
          onSave={(edit) => void save(session.row, edit)}
          onAsk={setAsk}
          canActivate={!blocked.has(session.row.id)}
          custom={(() => {
            const field = customs.get(session.field);
            return field
              ? { field, onSave: (edit: CustomEdit) => void saveCustom(session.row, edit) }
              : undefined;
          })()}
        />
      ),
      paste: onPaste,
      pasteRefused: () => notifyResult({ message: pasteWords(labels).refused }),
    };
  }, [
    wide,
    listings,
    labels,
    headers,
    headerOf,
    save,
    saveCustom,
    customs,
    onPaste,
    feeEditable,
    blocked,
  ]);

  const dialogs = labels ? (
    <>
      <StatusNeedsDialog
        labels={labels}
        ask={ask}
        onClose={() => setAsk(null)}
        onSave={(row, edit) => void save(row, edit)}
      />
      <PastePreview
        key={plan?.key ?? 0}
        open={plan !== null}
        title={plan?.title ?? ""}
        changes={plan?.changes ?? NO_LINES}
        skipped={plan?.skipped ?? NO_LINES}
        wrong={plan?.wrong ?? NO_LINES}
        same={plan?.same ?? 0}
        busy={applying}
        onApply={(ids) => void applyPaste(ids)}
        onClose={() => setPlan(null)}
      />
    </>
  ) : null;
  const savedListing = useCallback((id: string) => saved.get(id), [saved]);
  // The record's details (row 3g) are no column of the grid; their save moves the row's confirmed time like any edit.
  const writeListing = useCallback(
    async (id: string, change: ListingChange, at: string) => {
      const outcome = await write(id, change, at);
      const now = saved.get(id);
      if (outcome === "saved")
        patch(id, {
          [CONFIRMED]: now?.lastConfirmedAt ?? at,
          // The record's dialog saved details: their columns show them too (row 3g).
          ...(now && detailWords ? detailCells(now, detailWords) : {}),
        });
      return outcome;
    },
    [write, patch, saved, detailWords],
  );
  return { rows: data, cellEdit, dialogs, writeListing, savedListing };
}
