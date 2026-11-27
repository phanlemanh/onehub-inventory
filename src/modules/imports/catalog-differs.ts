// Row 3h (tin-rao-giu-gia-tri-rieng, AC-8): in the import's preview, a unit attribute cell whose value differs from the
// catalog unit its row matched carries the catalog's value, for the same mark the grid shows; the value that will be
// written stays the file's. A row on a pending unit has no catalog unit, so no mark; a cell that asks has no value.
// Pure and browser-safe; the server reads the units (store.ts) and calls this.
import { sameAttribute, type CatalogAttributes } from "@/modules/listings";

import type { MarkedTable } from "./table";
import { FILE_VALUE_OF } from "./targets";

/** The marked table with `catalog` on every cell that differs from its row's catalog unit (by unit key). */
export function markCatalogDiffers(
  marked: MarkedTable,
  units: ReadonlyMap<string, CatalogAttributes>,
): MarkedTable {
  if (units.size === 0) return marked;
  const cells = marked.cells.map((row, r) => {
    const outcome = marked.rows[r];
    const unit =
      outcome?.unit && "unitKey" in outcome.unit ? units.get(outcome.unit.unitKey) : undefined;
    if (!unit) return row;
    return row.map((cell, j) => {
      const target = marked.columns[j]?.target;
      const field = target && "standard" in target ? FILE_VALUE_OF[target.standard] : undefined;
      const catalog = field ? unit[field] : undefined;
      if (!field || catalog === undefined || catalog === null) return cell;
      if (cell.mark === "ask" || cell.value === null) return cell;
      return sameAttribute(cell.value, catalog) ? cell : { ...cell, catalog };
    });
  });
  return { ...marked, cells };
}
