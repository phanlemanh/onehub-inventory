"use client";

import type { ReactNode } from "react";

import {
  Frame,
  FrameDescription,
  FrameFooter,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@/components/reui/frame";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Item } from "@/components/ui/item";

/**
 * The framed list of the «danh sách khung» family (design/patterns/danh-sach-khung.md, row 9c), laid out after the
 * ReUI block solution-users-8: a frame with a name, a count line and an optional button at its head; one row per item
 * with a main part, a secondary part, tags and the place to change it at the end of the row; an optional footer with a
 * note and a save button. Every row keeps one column spine; the columns follow the width of the frame itself, not the
 * window: the secondary part shows from 56rem, the row keeps one line from 42rem, below that the main part takes its
 * own line.
 */
export interface FramedListRow {
  id: string;
  /** Who or what the row is: usually `ListFace`. */
  main: ReactNode;
  /** A fixed column of plain text beside the main part; hidden when the frame is narrow. */
  secondary?: ReactNode;
  /** Short tags (badges) after the secondary part. */
  tags?: ReactNode;
  /** The place to change the item at the end of the row: a button, a switch or a number field. */
  control?: ReactNode;
  /** Data attributes for the row, e.g. `{ "data-member": email }`. */
  data?: Readonly<Record<`data-${string}`, string>>;
}

const COL = {
  main: "min-w-0 basis-full @2xl:basis-0 @2xl:flex-1",
  secondary: "hidden w-56 shrink-0 text-xs text-muted-foreground @4xl:flex",
  tags: "me-auto flex min-w-0 shrink-0 flex-wrap gap-1 @2xl:me-0 @2xl:w-72",
  control: "flex shrink-0 justify-end @2xl:w-24",
};

/** The initials of a name: first letters of its first and last words; a bracketed placeholder such as «[Tên]» is skipped. */
export function initialsOf(name: string): string {
  const words = name.split(/\s+/).filter((w) => w && !w.startsWith("["));
  const first = words[0]?.[0] ?? "";
  const last = words.length > 1 ? (words.at(-1)?.[0] ?? "") : "";
  return (first + last).toLocaleUpperCase("vi");
}

/** The main part of a row for a person or a named thing: initials, the name, a smaller line under it. */
export function ListFace({ name, sub }: { name: string; sub?: string }) {
  return (
    <span className="flex min-w-0 items-center gap-3">
      <Avatar>
        <AvatarFallback>{initialsOf(name)}</AvatarFallback>
      </Avatar>
      <span className="flex min-w-0 flex-col gap-1">
        <span className="truncate text-sm font-medium" title={name}>
          {name}
        </span>
        {sub ? (
          <span className="truncate text-xs text-muted-foreground" title={sub}>
            {sub}
          </span>
        ) : null}
      </span>
    </span>
  );
}

export function FramedList({
  title,
  count,
  headAction,
  rows,
  footer,
  slot,
}: {
  /** The frame's name and the list's accessible name. */
  title: string;
  /** The line under the name, e.g. «9 người trong sàn». */
  count?: string;
  /** A button at the head of the frame (the screen's main action stays in the page header). */
  headAction?: ReactNode;
  rows: readonly FramedListRow[];
  /** The frame's footer: a note on the left, a save button on the right. */
  footer?: { note?: ReactNode; action?: ReactNode };
  /** data-slot of the frame, for tests and the proof screenshots. */
  slot?: string;
}) {
  return (
    <Frame spacing="default" data-slot={slot ?? "framed-list"}>
      <FrameHeader className="flex-row flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-px">
          <FrameTitle>{title}</FrameTitle>
          {count ? <FrameDescription>{count}</FrameDescription> : null}
        </div>
        {headAction ? <div className="flex flex-wrap items-center gap-3">{headAction}</div> : null}
      </FrameHeader>
      <FramePanel className="@container p-0">
        {/* One line between rows, as the block draws it; Item keeps its own spacing. */}
        <div role="list" aria-label={title} className="flex flex-col divide-y">
          {rows.map((r) => (
            <div key={r.id} role="listitem" className="px-1" {...r.data}>
              <Item size="sm">
                <div className="flex w-full flex-wrap items-center gap-3 @2xl:flex-nowrap @2xl:gap-4">
                  <span data-part="main" className={COL.main}>
                    {r.main}
                  </span>
                  {r.secondary !== undefined ? (
                    <span data-part="secondary" className={COL.secondary}>
                      {r.secondary}
                    </span>
                  ) : null}
                  {r.tags !== undefined ? (
                    <span data-part="tags" className={COL.tags}>
                      {r.tags}
                    </span>
                  ) : null}
                  {r.control !== undefined ? (
                    <span data-part="control" className={COL.control}>
                      {r.control}
                    </span>
                  ) : null}
                </div>
              </Item>
            </div>
          ))}
        </div>
      </FramePanel>
      {footer ? (
        <FrameFooter className="flex-row flex-wrap items-center justify-between gap-3">
          <div className="min-w-0 text-sm text-muted-foreground">{footer.note}</div>
          {footer.action ? <div className="flex items-center gap-3">{footer.action}</div> : null}
        </FrameFooter>
      ) : null}
    </Frame>
  );
}
