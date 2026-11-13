"use client";

// In-cell edit of the inventory grid (row 4): which cells open, the editors, and every write through the one save door
// with «Hoàn tác». The door today is the sample one in memory (Hỏi-1); row 10 hands in the real /api/v1 door.
import { useCallback, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";

import type { GridRow, RegionCellEdit } from "@/components/candidate/data-region";
import { runDoorChange, type WriteOutcome } from "@/components/candidate/use-change";
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
}: {
  rows: readonly GridRow[];
  /** Absent: the grid is read-only. */
  listings: readonly Listing[] | undefined;
  headers: Readonly<Record<InventoryField, string>>;
  /** Words of the editors from the label table; absent with `listings` absent. */
  labels: CellEditLabels | undefined;
  door?: ListingSaveDoor;
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
    [headers, patch, write],
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
    };
  }, [wide, listings, labels, headers, save]);

  const dialogs = labels ? (
    <StatusNeedsDialog
      labels={labels}
      ask={ask}
      onClose={() => setAsk(null)}
      onSave={(row, edit) => void save(row, edit)}
    />
  ) : null;
  return { rows: data, cellEdit, dialogs };
}
