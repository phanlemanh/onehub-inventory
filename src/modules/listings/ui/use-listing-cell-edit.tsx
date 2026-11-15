"use client";

// In-cell edit of the inventory grid (row 4): which cells open, the editors, and every write through the one save door
// with «Hoàn tác». The door today is the sample one in memory (Hỏi-1); row 10 hands in the real /api/v1 door.
import { useCallback, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";

import type { FieldKey } from "@/components/candidate/column-kind";
import type { GridRow, RegionCellEdit, RegionPaste } from "@/components/candidate/data-region";
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

import { CELL_EDIT_COPY as COPY, type CellEditLabels } from "./cell-edit-copy";
import type { InventoryField } from "./inventory-rows";
import { planPaste, type PastePlan } from "./listing-paste";
import { pasteWords } from "./listing-paste-copy";
import {
  ListingCellEdit,
  StatusNeedsDialog,
  lockedReasons,
  type ListingEdit,
  type StatusAsk,
} from "./listing-cell-edit";

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

const toChange = (edit: ListingEdit): ListingChange =>
  edit.field === PRICE
    ? { field: "listPrice", listPrice: edit.value }
    : {
        field: "standardStatus",
        standardStatus: edit.value,
        closePrice: edit.closePrice,
        closeDate: edit.closeDate,
        withdrawnReason: edit.withdrawnReason,
      };

const fromChange = (change: ListingChange): Partial<GridRow> =>
  change.field === "listPrice"
    ? { [PRICE]: change.listPrice }
    : { [STATUS]: change.standardStatus };

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
}): { rows: readonly GridRow[]; cellEdit: RegionCellEdit | undefined; dialogs: ReactNode } {
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
  const [data, setData] = useState<readonly GridRow[]>(() =>
    rows.map((row) => ({ ...row, locked: lockedReasons(row) })),
  );
  const [ask, setAsk] = useState<StatusAsk | null>(null);
  const wide = useSyncExternalStore(
    subscribeWide,
    () => window.matchMedia(WIDE).matches,
    () => false,
  );

  const patch = useCallback((id: string, fields: Partial<GridRow>) => {
    setData((all) =>
      all.map((row) => {
        if (row.id !== id) return row;
        const next = { ...row, ...fields } as GridRow;
        return { ...next, locked: lockedReasons(next) };
      }),
    );
  }, []);

  /** One write through the door; the row's version moves on when it saves. */
  const write = useCallback(
    async (id: string, change: ListingChange, at: string): Promise<WriteOutcome> => {
      const outcome = await door.save({ id, version: versions.get(id) ?? 1, change, at });
      if (outcome.kind === "saved") {
        versions.set(id, outcome.listing.version);
        return "saved";
      }
      // The cell never sends a change the rules refuse; if one slips through, the door refused it.
      return outcome.kind === "invalid" ? "refused" : outcome.kind;
    },
    [door, versions],
  );

  const save = useCallback(
    async (row: GridRow, edit: ListingEdit) => {
      const unit = String(row["Listing.unitNumber"] ?? "");
      const tx = row.transaction;
      const shown = (field: typeof PRICE | typeof STATUS, value: unknown) =>
        field === PRICE
          ? formatMoney(value as number)
          : statusLabel(value as ListingStandardStatus, tx);
      const what = (field: typeof PRICE | typeof STATUS, value: unknown) =>
        `${headers[field]} ${headers["Listing.unitNumber"].toLocaleLowerCase("vi")} ${unit}: ${shown(field, value)}`;
      const before: Partial<GridRow> = {
        [PRICE]: row[PRICE],
        [STATUS]: row[STATUS],
        [CONFIRMED]: row[CONFIRMED],
      };
      const at = new Date().toISOString();
      const change = toChange(edit);
      const undoable = edit.field === PRICE || edit.undoable;
      const back: ListingChange =
        edit.field === PRICE
          ? { field: "listPrice", listPrice: row[PRICE] as number }
          : { field: "standardStatus", standardStatus: row[STATUS] as ListingStandardStatus };
      // The cell shows the new value at once; a save that does not go through puts the old one back.
      patch(row.id, { ...fromChange(change), [CONFIRMED]: at });
      const outcome = await runDoorChange({
        done: COPY.done(what(edit.field, edit.value), undoable),
        undone: COPY.undone(what(edit.field, before[edit.field])),
        write: () => write(row.id, change, at),
        undo: undoable
          ? async () => {
              const result = await write(row.id, back, new Date().toISOString());
              if (result === "saved") patch(row.id, before);
              return result;
            }
          : undefined,
        failed: (why) => COPY.saveFailed(what(edit.field, edit.value).toLocaleLowerCase("vi"), why),
        undoFailed: (why) => COPY.undoFailed(labels!, unit, shown(edit.field, edit.value), why),
      });
      if (outcome !== "saved") patch(row.id, before);
    },
    [headers, labels, patch, write],
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
      );
      setPlan({ ...plan, key: Date.now() });
    },
    [labels, headerOf, headers],
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
          [PRICE]: row[PRICE],
          [STATUS]: row[STATUS],
          [CONFIRMED]: row[CONFIRMED],
        });
      setApplying(true);
      for (const { row, change } of picked)
        patch(row.id, { ...fromChange(change), [CONFIRMED]: at });
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
                    : {
                        field: "standardStatus",
                        standardStatus: was[STATUS] as ListingStandardStatus,
                      };
                const result = await write(row.id, back, new Date().toISOString());
                if (result === "saved")
                  patch(row.id, { [field]: was[field], [CONFIRMED]: was[CONFIRMED] });
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
      // A write that did not go through puts its cell back.
      picked.forEach(({ row, field }, i) => {
        if (outcomes[i] !== "saved") {
          const was = before.get(row.id) ?? {};
          patch(row.id, { [field]: was[field], [CONFIRMED]: was[CONFIRMED] });
        }
      });
      setApplying(false);
      setPlan(null);
    },
    [plan, labels, patch, write],
  );

  const cellEdit = useMemo<RegionCellEdit | undefined>(() => {
    if (!wide || !listings || !labels) return undefined;
    return {
      action: "updateListing",
      fields: [PRICE, STATUS],
      label: (row, field) =>
        COPY.editLabel(
          labels,
          headers[field as InventoryField],
          String(row["Listing.unitNumber"] ?? ""),
        ),
      render: (session) => (
        <ListingCellEdit
          session={session}
          labels={labels}
          onSave={(edit) => void save(session.row, edit)}
          onAsk={setAsk}
        />
      ),
      paste: onPaste,
      pasteRefused: () => notifyResult({ message: pasteWords(labels).refused }),
    };
  }, [wide, listings, labels, headers, save, onPaste]);

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
  return { rows: data, cellEdit, dialogs };
}
