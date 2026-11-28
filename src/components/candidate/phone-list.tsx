"use client";

// Row 2b (_acceptance/bang-hang-the-dien-thoai): below 768 px the grid region drops its frame and shows its rows as a
// full-width list of the screen's cards. One toolbar sticks under the App Shell's top bar: the count, then three icon
// buttons — filter (with the number of active filters), group, and «…» for the region's own action (save view). The
// filter sheet opens from the bottom with «Sắp theo» first, then every column's filter box; active filters show as
// chips. Filters, sort, grouping, the record and the states stay the region's: this is the same table, drawn as cards.
import { ListTreeIcon, SlidersHorizontalIcon, XIcon } from "lucide-react";
import { useState, type MouseEvent, type ReactElement, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import type { TypedColumn } from "./column-kind";
import { ColumnFilterCell, type FilterOption } from "./column-filter-cell";
import { CornerClose } from "./corner-close";
import { GRID_COPY, GRID_I18N } from "./grid-copy";
import { RECORD_PARAM } from "./record-panel";
import { TouchTarget } from "./touch-target";

/** What the screen gives the region for its phone list. */
export interface RegionPhoneList<Row> {
  /** One row's card; the region wraps it in the link that opens the record, named by the card's own text (WCAG 2.5.3). */
  card: (row: Row) => ReactNode;
  /** The row's short name (the unit's label and code): it names the row's «…». */
  label: (row: Row) => string;
}

/** The phone list's sort: one column, up or down; it is the region's own sort. */
export interface PhoneSort {
  columns: readonly TypedColumn[];
  value: { field: string; desc: boolean } | null;
  set: (value: { field: string; desc: boolean } | null) => void;
}

type PhoneRow = { id: string; group?: { label: string; count: number }; subRows?: PhoneRow[] };

/** The table's column for a field: what a filter box reads and writes. */
type ColumnOf<Row extends object> = (
  field: string,
) => Parameters<typeof ColumnFilterCell<Row>>[0]["column"] | undefined;

/**
 * A toolbar button 44 px high, its name read out and shown on hover or focus (owner, BH session 2026-11-27, «Duyệt cả
 * sáu điểm», L5: the phone's toolbar buttons are 44 px, not 36 px in a 44 px touch target). With `words`, the button
 * also says its name beside its icon.
 */
function IconButton({
  label,
  pressed,
  slot,
  onClick,
  children,
  words = false,
}: {
  label: string;
  pressed?: boolean;
  slot: string;
  onClick: () => void;
  children: ReactElement;
  words?: boolean;
}) {
  return (
    // The 44 px sits on the wrapper, which sizes the kit's button inside it (the button keeps the kit's look).
    <span className={words ? "flex [&>button]:h-11" : "flex [&>button]:size-11"}>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant={pressed ? "secondary" : "ghost"}
              size={words ? "lg" : "icon-lg"}
              aria-label={label}
              aria-pressed={pressed}
              data-slot={slot}
              onClick={onClick}
            />
          }
        >
          {children}
          {words ? label : null}
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
    </span>
  );
}

function SortBlock({ sort }: { sort: PhoneSort }) {
  const up = GRID_I18N.labels?.sortAscending ?? "";
  const down = GRID_I18N.labels?.sortDescending ?? "";
  return (
    <div data-slot="phone-sort" className="flex flex-col gap-2">
      <span className="text-xs text-muted-foreground">{GRID_COPY.phone.sortBy}</span>
      <div className="flex flex-wrap gap-2">
        {sort.columns.map((c) => {
          const on = sort.value?.field === c.field;
          return (
            <Button
              key={c.field}
              size="sm"
              variant={on ? "secondary" : "outline"}
              aria-pressed={on}
              onClick={() => sort.set(on ? null : { field: c.field, desc: false })}
            >
              {c.header}
            </Button>
          );
        })}
      </div>
      {sort.value ? (
        <div className="flex gap-2">
          {[false, true].map((desc) => (
            <Button
              key={String(desc)}
              size="sm"
              variant={sort.value?.desc === desc ? "secondary" : "outline"}
              aria-pressed={sort.value?.desc === desc}
              onClick={() => sort.value && sort.set({ field: sort.value.field, desc })}
            >
              {desc ? down : up}
            </Button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/** The region's rows as a full-width list, grouped as the grid groups them; tapping a row opens the record. */
export function PhoneList<Row extends PhoneRow>({
  list,
  data,
  columns,
  column,
  options,
  activeFields,
  count,
  group,
  more,
  rowAction,
  sort,
  onOpen,
  onClear,
  noMatch,
}: {
  list: RegionPhoneList<Row>;
  data: readonly Row[];
  columns: readonly TypedColumn[];
  column: ColumnOf<Row>;
  options: ReadonlyMap<string, readonly FilterOption[]>;
  /** Columns with a filter on. */
  activeFields: readonly string[];
  /** «60 dòng» or «24 / 60 dòng». */
  count: string;
  group?: { label: string; on: boolean; toggle: () => void };
  /**
   * The region's own actions (save view), shown as they are in the toolbar: by the «…» rule (owner, BH session
   * 2026-11-27) one or two ordinary actions show directly, so a screen with three or more passes its own «…» here.
   */
  more?: ReactNode;
  /** The row's «…» (row 9e), beside the card; absent when the screen has no actions on a row. */
  rowAction?: (row: Row) => ReactNode;
  sort?: PhoneSort;
  onOpen?: (id: string) => void;
  onClear: () => void;
  noMatch: ReactNode;
}) {
  const [sheet, setSheet] = useState<"filters" | null>(null);
  const active = columns.filter((c) => activeFields.includes(c.field));
  const filterName =
    active.length > 0 ? GRID_COPY.sheet.filterOn(active.length) : GRID_COPY.sheet.filter;
  const open = (id: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    // A plain click opens the record in place (the record keeps its own address); a modified click opens a new tab.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    onOpen?.(id);
  };
  const item = (row: Row) => (
    <li key={row.id} className="flex items-center">
      <a
        href={`?${RECORD_PARAM}=${encodeURIComponent(row.id)}`}
        data-slot="phone-card"
        data-row-id={row.id}
        data-record-open={row.id}
        onClick={open(row.id)}
        className="flex min-w-0 flex-1 px-4 py-2.5 outline-none hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
      >
        {list.card(row)}
      </a>
      {rowAction ? (
        <div className="shrink-0 pr-1">
          <TouchTarget>{rowAction(row) as ReactElement}</TouchTarget>
        </div>
      ) : null}
    </li>
  );
  const grouped = data[0]?.group !== undefined;
  return (
    <div data-slot="phone-list" className="flex flex-col">
      <div
        data-slot="phone-toolbar"
        className="sticky top-12 z-10 flex items-center justify-between gap-2 border-b bg-background px-4"
      >
        <span data-slot="region-footer-count" className="text-sm text-muted-foreground">
          {count}
        </span>
        <div className="-mr-1.5 flex items-center">
          {/* «Lọc» says its name and how many columns are filtered (L5; row 2b's «Lọc (kèm số ô đang lọc)»). */}
          <IconButton
            label={filterName}
            pressed={active.length > 0}
            slot="phone-filter-button"
            onClick={() => setSheet("filters")}
            words
          >
            <SlidersHorizontalIcon aria-hidden="true" />
          </IconButton>
          {group ? (
            <IconButton
              label={group.label}
              pressed={group.on}
              slot="group-toggle"
              onClick={group.toggle}
            >
              <ListTreeIcon aria-hidden="true" />
            </IconButton>
          ) : null}
          {more ? (
            // The region's actions straight in the toolbar, 44 px high like its other buttons (L1, L5).
            <div data-slot="phone-actions" className="flex items-center gap-1 [&_button]:h-11">
              {more}
            </div>
          ) : null}
        </div>
      </div>
      {active.length > 0 ? (
        <div
          data-slot="phone-filter-chips"
          className="flex flex-wrap items-center gap-2 border-b px-4 py-2"
        >
          {active.map((c) => (
            <Button
              key={c.field}
              variant="secondary"
              size="sm"
              aria-label={GRID_COPY.phone.removeFilter(c.header)}
              onClick={() => column(c.field)?.setFilterValue(undefined)}
            >
              {c.header}
              <XIcon aria-hidden="true" />
            </Button>
          ))}
          <Button variant="ghost" size="sm" data-slot="clear-filters" onClick={onClear}>
            {GRID_COPY.sheet.clearFilters}
          </Button>
        </div>
      ) : null}
      {data.length === 0 ? (
        <div className="p-4">{noMatch}</div>
      ) : grouped ? (
        data.map((row) => (
          <section key={`g:${row.group?.label}`} data-slot="phone-group">
            <h3 className="flex items-center justify-between bg-muted px-4 py-1.5 text-xs font-medium text-muted-foreground">
              <span>{row.group?.label}</span>
              <span className="tabular-nums">{row.group?.count}</span>
            </h3>
            <ul className="divide-y">{(row.subRows as Row[] | undefined)?.map(item)}</ul>
          </section>
        ))
      ) : (
        <ul className="divide-y">{data.map(item)}</ul>
      )}
      <Sheet open={sheet !== null} onOpenChange={(next) => setSheet(next ? sheet : null)}>
        <SheetContent side="bottom" showCloseButton={false}>
          <SheetHeader>
            <SheetTitle>{GRID_COPY.sheet.filter}</SheetTitle>
          </SheetHeader>
          <div className="max-h-96 overflow-y-auto px-4 pb-6">
            <div className="flex flex-col gap-4">
              {sort ? <SortBlock sort={sort} /> : null}
              <div data-slot="phone-filters" className="flex flex-col gap-3">
                {columns.map((spec) => {
                  const tableColumn = column(spec.field);
                  if (!tableColumn) return null;
                  return (
                    <div key={spec.field} data-field={spec.field} className="flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground">{spec.header}</span>
                      <ColumnFilterCell
                        spec={spec}
                        column={tableColumn}
                        options={options.get(spec.field) ?? []}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <CornerClose of="sheet" />
        </SheetContent>
      </Sheet>
    </div>
  );
}
