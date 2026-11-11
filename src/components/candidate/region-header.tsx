import type { ReactNode } from "react";

import { Input } from "@/components/ui/input";

import { GRID_COPY } from "./grid-copy";

/** The head of a data region: its name, how many rows, a search box and the region's primary action. */
export function RegionHeader({
  title,
  total,
  shown,
  query,
  onQuery,
  action,
  searchId,
}: {
  title: string;
  /** Rows in the region; absent when the viewer may not see the region, so no count is shown. */
  total?: number;
  /** Rows left after the search, when a search is on. */
  shown?: number;
  query: string;
  onQuery: (query: string) => void;
  action?: ReactNode;
  searchId: string;
}) {
  const count =
    total === undefined
      ? null
      : shown !== undefined && shown !== total
        ? GRID_COPY.filteredCount(shown, total)
        : GRID_COPY.rowCount(total);
  return (
    <div data-slot="region-header" className="flex flex-wrap items-center gap-4">
      <div className="flex items-baseline gap-2">
        <h2 className="text-lg font-semibold">{title}</h2>
        {count ? (
          <span data-slot="region-count" className="text-sm text-muted-foreground">
            {count}
          </span>
        ) : null}
      </div>
      <div className="ml-auto flex flex-wrap items-center gap-2">
        {total !== undefined ? (
          <Input
            id={searchId}
            type="search"
            aria-label={GRID_COPY.searchLabel}
            placeholder={GRID_COPY.searchPlaceholder}
            value={query}
            onChange={(event) => onQuery(event.target.value)}
          />
        ) : null}
        {action ? <div data-slot="region-action">{action}</div> : null}
      </div>
    </div>
  );
}
