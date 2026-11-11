"use client";

import { useEffect, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";

import { GRID_COPY } from "./grid-copy";

/** The delay steps of design/behaviors.md (feedback by delay): nothing, then a placeholder, then progress. */
export const LOADING_STEPS_MS = { placeholder: 1000, progress: 10_000 } as const;

/** Which loading step a region is in after `elapsedMs`. */
export function loadingStep(elapsedMs: number): "none" | "placeholder" | "progress" {
  if (elapsedMs >= LOADING_STEPS_MS.progress) return "progress";
  if (elapsedMs >= LOADING_STEPS_MS.placeholder) return "placeholder";
  return "none";
}

function useElapsedStep() {
  const [step, setStep] = useState<ReturnType<typeof loadingStep>>("none");
  useEffect(() => {
    const placeholder = setTimeout(() => setStep("placeholder"), LOADING_STEPS_MS.placeholder);
    const progress = setTimeout(() => setStep("progress"), LOADING_STEPS_MS.progress);
    return () => {
      clearTimeout(placeholder);
      clearTimeout(progress);
    };
  }, []);
  return step;
}

/**
 * The region is loading. Under a second nothing shows (the rows are laid out but invisible, so nothing jumps);
 * from one second, skeleton rows laid out like the grid; from ten seconds, a progress sentence and «Huỷ» when the
 * screen can cancel. Timed on the region's own clock.
 */
export function RegionLoading({
  columns,
  rows = 5,
  onCancel,
}: {
  columns: number;
  rows?: number;
  onCancel?: () => void;
}) {
  const step = useElapsedStep();
  const shown = step !== "none";
  return (
    <div data-slot="region-loading" data-step={step} className="flex flex-col gap-4">
      {step === "progress" ? (
        <div
          role="status"
          data-slot="region-progress"
          className="flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground"
        >
          <p>{onCancel ? GRID_COPY.slow.withCancel : GRID_COPY.slow.withoutCancel}</p>
          {onCancel ? (
            <Button size="sm" variant="outline" onClick={onCancel}>
              {GRID_COPY.cancel}
            </Button>
          ) : null}
        </div>
      ) : null}
      <div
        data-slot="region-skeleton"
        data-columns={columns}
        data-shown={shown ? "true" : "false"}
        aria-hidden="true"
        className={shown ? "flex flex-col gap-2" : "invisible flex flex-col gap-2"}
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

/** The region has no rows yet: says why (the screen's reason, or the general one) and offers the next step. */
export function RegionEmpty({
  why = GRID_COPY.empty.why,
  action,
}: {
  why?: string;
  action?: ReactNode;
}) {
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

/**
 * The region failed to load: a three-part sentence. «Thử lại» shows only when the screen wired a reload; without
 * it the sentence says to reload the page, so there is never a button that does nothing.
 */
export function RegionError({ onRetry }: { onRetry?: () => void }) {
  return (
    <StateBlock
      kind="error"
      title={GRID_COPY.error.title}
      description={
        <>
          <span data-part="why">{GRID_COPY.error.why}</span>{" "}
          <span data-part="next">
            {onRetry ? GRID_COPY.error.next : GRID_COPY.error.nextNoRetry}
          </span>
        </>
      }
    >
      {onRetry ? <Button onClick={onRetry}>{GRID_COPY.retry}</Button> : null}
    </StateBlock>
  );
}

/** Part of the load failed before any row arrived: the data exists, it is not that nobody entered it. */
export function RegionPartialEmpty({ onRetry }: { onRetry?: () => void }) {
  return (
    <StateBlock
      kind="partial-empty"
      title={GRID_COPY.partialEmpty.title}
      description={
        <>
          <span data-part="why">{GRID_COPY.partialEmpty.why}</span>{" "}
          <span data-part="next">
            {onRetry ? GRID_COPY.partialEmpty.next : GRID_COPY.partialEmpty.nextNoRetry}
          </span>
        </>
      }
    >
      {onRetry ? <Button onClick={onRetry}>{GRID_COPY.retry}</Button> : null}
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
export function RegionPartial({ onRetry }: { onRetry?: () => void }) {
  return (
    <div
      role="status"
      data-slot="region-state"
      data-kind="partial"
      className="flex flex-wrap items-center justify-between gap-4 rounded-md border border-warning/25 bg-warning/10 px-4 py-3 text-sm"
    >
      <p>
        <span className="font-semibold">{GRID_COPY.partial.title}.</span>{" "}
        {onRetry ? GRID_COPY.partial.detail : GRID_COPY.partial.detailNoRetry}
      </p>
      {onRetry ? (
        <Button size="sm" variant="outline" onClick={onRetry}>
          {GRID_COPY.retry}
        </Button>
      ) : null}
    </div>
  );
}
