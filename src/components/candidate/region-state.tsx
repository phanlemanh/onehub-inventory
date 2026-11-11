import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";

import { GRID_COPY } from "./grid-copy";

/** Skeleton rows laid out like the grid; hidden for the first second (src/styles/frame.css). */
export function RegionSkeleton({ columns, rows = 5 }: { columns: number; rows?: number }) {
  return (
    <div
      data-slot="region-skeleton"
      data-columns={columns}
      aria-hidden="true"
      className="onehub-reveal-after-1s flex flex-col gap-2"
    >
      {Array.from({ length: rows }, (_, row) => (
        <div key={row} className="flex gap-2">
          {Array.from({ length: columns }, (_, column) => (
            <div key={column} data-slot="region-skeleton-cell" className="grid h-8 flex-1">
              <Skeleton />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function StateBlock({
  kind,
  title,
  description,
  children,
}: {
  kind: string;
  title: string;
  description?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <Empty data-slot="region-state" data-kind={kind}>
      <EmptyHeader>
        <p className="font-semibold">{title}</p>
        {description ? <EmptyDescription>{description}</EmptyDescription> : null}
      </EmptyHeader>
      {children ? <EmptyContent>{children}</EmptyContent> : null}
    </Empty>
  );
}

/** The region has no rows yet: the screen says why and offers the next step. */
export function RegionEmpty({ why, action }: { why: string; action?: ReactNode }) {
  return (
    <StateBlock kind="empty" title={GRID_COPY.empty.title} description={why}>
      {action}
    </StateBlock>
  );
}

/** The search matched nothing; clearing it is mandatory (design/states.md). */
export function RegionNoMatch({ onClear }: { onClear: () => void }) {
  return (
    <StateBlock kind="no-match" title={GRID_COPY.noMatch.title} description={GRID_COPY.noMatch.why}>
      <Button variant="outline" onClick={onClear}>
        {GRID_COPY.clearFilter}
      </Button>
    </StateBlock>
  );
}

export function RegionError({ onRetry }: { onRetry: () => void }) {
  return (
    <StateBlock
      kind="error"
      title={GRID_COPY.error.title}
      description={
        <>
          <span data-part="why">{GRID_COPY.error.why}</span>{" "}
          <span data-part="next">{GRID_COPY.error.next}</span>
        </>
      }
    >
      <Button onClick={onRetry}>{GRID_COPY.retry}</Button>
    </StateBlock>
  );
}

/** The viewer may not see this region: no rows, no count, nothing that leaks what is there. */
export function RegionForbidden() {
  return (
    <StateBlock
      kind="forbidden"
      title={GRID_COPY.forbidden.title}
      description={
        <>
          <span data-part="why">{GRID_COPY.forbidden.why}</span>{" "}
          <span data-part="next">{GRID_COPY.forbidden.next}</span>
        </>
      }
    />
  );
}

/** Part of the rows failed to load: the loaded rows stay usable, the banner says what is missing. */
export function RegionPartial({ onRetry }: { onRetry: () => void }) {
  return (
    <div
      role="status"
      data-slot="region-state"
      data-kind="partial"
      className="flex flex-wrap items-center justify-between gap-4 rounded-md border border-warning/25 bg-warning/10 px-4 py-3 text-sm"
    >
      <p>
        <span className="font-semibold">{GRID_COPY.partial.title}.</span> {GRID_COPY.partial.detail}
      </p>
      <Button size="sm" variant="outline" onClick={onRetry}>
        {GRID_COPY.retry}
      </Button>
    </div>
  );
}
