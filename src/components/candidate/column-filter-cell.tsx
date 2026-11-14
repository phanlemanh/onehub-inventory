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
        : spec.kind === "date" || spec.kind === "datetime"
          ? GRID_COPY.sheet.datePlaceholder
          : GRID_COPY.sheet.numberPlaceholder;
  const shown = typeof value === "string" ? value : (value ?? []).join(", ");
  return (
    <div data-slot="column-filter" data-filter-mode={mode} className="pt-1">
      {/* A rule longer than the box reads in full as TruncatedText's text does (design/states.md, long text): on hover
          (title), on focus (the box scrolls through it) and to a screen reader (the value). The block wraps a span and
          Input owns its typography, so the box takes the block's rule without its «…». */}
      <Input
        type="text"
        inputMode={mode === "number" ? "decimal" : undefined}
        aria-label={GRID_COPY.sheet.filterLabel(spec.header)}
        aria-invalid={invalid || undefined}
        title={invalid ? GRID_COPY.sheet.invalidRule : shown || undefined}
        placeholder={placeholder}
        value={shown}
        onChange={(event) => column.setFilterValue(event.target.value)}
        // Typing in the box must not move the grid's selected cell.
        onKeyDown={(event) => event.stopPropagation()}
      />
    </div>
  );
}
