import type { ReactNode } from "react";

import { SearchIcon } from "lucide-react";

import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

import { GRID_COPY } from "./grid-copy";

/** Row count words: «60 dòng», or «12 / 60 dòng» while a search is on; null when the viewer may not see rows. */
function countText(total?: number, shown?: number): string | null {
  if (total === undefined) return null;
  return shown !== undefined && shown !== total
    ? GRID_COPY.filteredCount(shown, total)
    : GRID_COPY.rowCount(total);
}

/** The region's name, alone on the frame's header strip (arrangement after data-grid-editing-6). */
export function RegionTitle({ title }: { title: string }) {
  return <h2 className="text-sm font-semibold">{title}</h2>;
}

/**
 * The region's toolbar: search box and row count on the left, the region's primary action on the right. Without rows
 * to show (loading, error, no permission) the toolbar holds no count and no search box.
 */
export function RegionToolbar({
  total,
  shown,
  query,
  onQuery,
  action,
  tools,
  searchId,
  showCount = true,
}: {
  /** Rows in the region; absent when the viewer may not see the region, so no count is shown. */
  total?: number;
  /** Rows left after the search, when a search is on. */
  shown?: number;
  query: string;
  onQuery: (query: string) => void;
  action?: ReactNode;
  /** The grid's sheet tools (filter row, grouping, columns), after the count. */
  tools?: ReactNode;
  searchId: string;
  /** False when the count sits elsewhere (the grid's footer, row 2), so the region shows it once. */
  showCount?: boolean;
}) {
  const count = showCount ? countText(total, shown) : null;
  if (count === null && total === undefined && !action) return null;
  return (
    <div data-slot="region-toolbar" className="flex flex-wrap items-center gap-x-3 gap-y-2">
      {total !== undefined ? (
        <div className="w-full sm:w-64">
          <InputGroup>
            <InputGroupAddon>
              <SearchIcon aria-hidden="true" />
            </InputGroupAddon>
            <InputGroupInput
              id={searchId}
              type="search"
              aria-label={GRID_COPY.searchLabel}
              placeholder={GRID_COPY.searchPlaceholder}
              value={query}
              onChange={(event) => onQuery(event.target.value)}
            />
          </InputGroup>
        </div>
      ) : null}
      {count ? (
        <span data-slot="region-count" className="text-sm text-muted-foreground">
          {count}
        </span>
      ) : null}
      {tools}
      {action ? (
        <div data-slot="region-action" className="ml-auto">
          {action}
        </div>
      ) : null}
    </div>
  );
}

/** The head of a data region: its name, how many rows, a search box and the region's primary action. */
export function RegionHeader(props: {
  title: string;
  total?: number;
  shown?: number;
  query: string;
  onQuery: (query: string) => void;
  action?: ReactNode;
  searchId: string;
}) {
  const { title, ...toolbar } = props;
  return (
    <div data-slot="region-header" className="flex flex-col gap-3">
      <RegionTitle title={title} />
      <RegionToolbar {...toolbar} />
    </div>
  );
}
