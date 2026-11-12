"use client";

import type { Column } from "@tanstack/react-table";

import type { DataGridFeatures } from "@/components/reui/data-grid/data-grid";
import { DataGridColumnFilter } from "@/components/reui/data-grid/data-grid-column-filter";
import { Input } from "@/components/ui/input";

import type { TypedColumn } from "./column-kind";
import { GRID_COPY } from "./grid-copy";
import { filterIsInvalid, filterModeFor, type ColumnFilter } from "./grid-view";

/** One value a value column can be filtered to: what is stored and the words the cell shows. */
export interface FilterOption {
  value: string;
  label: string;
}

/**
 * The filter box under one column header, chosen by the column's kind: words contain (text), one or more values
 * (status, select, yes/no — ReUI's faceted filter), or a number rule (money in tỷ, area, count). A rule that cannot
 * be read is marked and filters nothing.
 */
export function ColumnFilterCell<TData extends object>({
  spec,
  column,
  options,
}: {
  spec: TypedColumn;
  column: Column<DataGridFeatures, TData, unknown>;
  options: readonly FilterOption[];
}) {
  const value = column.getFilterValue() as ColumnFilter | undefined;
  const mode = filterModeFor(spec.kind);
  if (mode === "values") {
    return (
      <div
        data-slot="column-filter"
        data-filter-mode={mode}
        className="min-w-0 overflow-hidden pt-1"
      >
        <DataGridColumnFilter
          column={column}
          title={GRID_COPY.sheet.valuesPlaceholder}
          options={[...options]}
        />
      </div>
    );
  }
  const invalid = filterIsInvalid(spec, value);
  const placeholder =
    mode === "text"
      ? GRID_COPY.sheet.textPlaceholder
      : spec.kind === "money"
        ? GRID_COPY.sheet.moneyPlaceholder
        : GRID_COPY.sheet.numberPlaceholder;
  return (
    <div data-slot="column-filter" data-filter-mode={mode} className="pt-1">
      <Input
        type="text"
        inputMode={mode === "number" ? "decimal" : undefined}
        aria-label={GRID_COPY.sheet.filterLabel(spec.header)}
        aria-invalid={invalid || undefined}
        title={invalid ? GRID_COPY.sheet.invalidRule : undefined}
        placeholder={placeholder}
        value={typeof value === "string" ? value : ""}
        onChange={(event) => column.setFilterValue(event.target.value)}
        // Typing in the box must not move the grid's selected cell.
        onKeyDown={(event) => event.stopPropagation()}
      />
    </div>
  );
}
