"use client";

// The mark of a listing's own value that differs from the shared catalog (row 3h): one small block, the same on a grid
// cell, on a line of the unit's record and on a phone card, always right after the value. It is a sign, not an error:
// the value keeps its colour and nothing is blocked. Pressed (pointer or keys), it shows the catalog's value and, for a
// person who may edit, the way back to it. Three looks are offered for the owner to choose at the scope gate (Hỏi-6),
// switched with `?mark=` outside production: a dot with a tooltip (the default), a light badge (after ReUI c-badge-16)
// or an icon with a tooltip (c-tooltip-3). Its colour is the design system's info token (`--info`), in both themes.
import { InfoIcon, LockIcon } from "lucide-react";
import { createContext, useContext, useState } from "react";

import { Badge } from "@/components/reui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import {
  UNIT_ATTRIBUTE_COPY as COPY,
  type MarkLook,
  type UnitAttributeWords,
} from "./unit-attribute-copy";

const MarkLookContext = createContext<MarkLook>("dot");
/** Every mark under it takes this look (the inventory sets it once from the address). */
export const MarkLookProvider = MarkLookContext.Provider;
/** The look the marks under the inventory take. */
export const useMarkLook = (): MarkLook => useContext(MarkLookContext);

/** Room a grid column keeps for the mark after its value, in ch, by look: the 24 px control, a badge's word. */
export const MARK_ROOM_CH: Readonly<Record<MarkLook, number>> = { dot: 3.5, icon: 3.5, badge: 7 };

/**
 * The mark's room on a cell that has no mark: the same face, unseen and out of reach (no focus, no name), so a column's
 * values stay on one edge whether a row carries the mark or not.
 */
function MarkRoom({ words }: { words: UnitAttributeWords }) {
  const look = useContext(MarkLookContext);
  return (
    <span
      aria-hidden="true"
      data-slot="attribute-differs-room"
      className="invisible -my-1 flex shrink-0"
    >
      <Button
        type="button"
        variant="ghost"
        size={look === "badge" ? "xs" : "icon-xs"}
        tabIndex={-1}
      >
        {face(look, words)}
      </Button>
    </span>
  );
}

function face(look: MarkLook, words: UnitAttributeWords) {
  return look === "badge" ? (
    <Badge variant="info-light">{words.differs.split(" ")[0]!.toLocaleLowerCase("vi")}</Badge>
  ) : look === "icon" ? (
    <InfoIcon aria-hidden="true" className="size-3.5 text-info" />
  ) : (
    <span aria-hidden="true" className="size-1.5 self-start rounded-full bg-info" />
  );
}

export function AttributeDiffersMark({
  words,
  catalogShown,
  sourceWord,
  onRevert,
  lockedReason,
  inGrid = false,
  still = false,
}: {
  words: UnitAttributeWords;
  /** The catalog's value as the screens write it: «68,5 m²». */
  catalogShown: string;
  /** Who wrote the own value, by its word (typed by the company, or from a file). */
  sourceWord?: string;
  /** Takes the catalog's value again; absent for a person who may not edit. */
  onRevert?: (() => void) | undefined;
  /**
   * Why the listing's attributes cannot change now (a sold or withdrawn listing, in row 3g's words): the command shows
   * disabled with this reason under it. Only for a person who may edit.
   */
  lockedReason?: string | undefined;
  /** Inside a grid cell: a press goes to the mark, not to the cell's selection. */
  inGrid?: boolean;
  /** A sign only, never pressed (the phone card is itself the link to the record): always the dot. */
  still?: boolean;
}) {
  const chosen = useContext(MarkLookContext);
  const [open, setOpen] = useState(false);
  const name = COPY.markName(words, catalogShown);
  if (still)
    return (
      <span
        role="img"
        data-slot="attribute-differs"
        data-look="dot"
        aria-label={name}
        title={name}
        className="ml-1 inline-block size-1.5 shrink-0 -translate-y-1 rounded-full bg-info"
      />
    );
  const look = chosen;
  const trigger = (
    <PopoverTrigger
      render={
        <Button
          type="button"
          variant="ghost"
          size={look === "badge" ? "xs" : "icon-xs"}
          data-slot="attribute-differs"
          data-look={look}
          data-cell-interactive={inGrid ? "" : undefined}
          tabIndex={inGrid ? -1 : undefined}
          aria-label={name}
        />
      }
    >
      {face(look, words)}
    </PopoverTrigger>
  );
  const command = lockedReason ? (
    // Blocked by the listing's status: the reason with the lock in the command's place, never a dimmed button.
    <p
      data-slot="attribute-locked-reason"
      className="flex items-center gap-1 text-xs text-muted-foreground"
    >
      <LockIcon aria-hidden="true" className="size-3" />
      {lockedReason}
    </p>
  ) : onRevert ? (
    <Button
      type="button"
      variant="outline"
      size="sm"
      data-action="updateListing"
      data-slot="attribute-revert"
      onClick={() => {
        setOpen(false);
        onRevert();
      }}
    >
      {words.revert}
    </Button>
  ) : null;
  return (
    // The negative margin keeps a grid row at its density height: the 24 px control is taller than the text.
    <span className="-my-1 flex shrink-0">
      <Popover open={open} onOpenChange={setOpen}>
        {look === "badge" ? (
          trigger
        ) : (
          // The dot and the icon say their name on hover too (c-tooltip-3); the badge says it in its own word.
          <Tooltip>
            <TooltipTrigger render={trigger} />
            <TooltipContent>{name}</TooltipContent>
          </Tooltip>
        )}
        <PopoverContent align="end" data-slot="attribute-differs-popover">
          <p className="text-sm">{COPY.catalogLine(words, catalogShown)}</p>
          {sourceWord ? <p className="text-xs text-muted-foreground">{sourceWord}</p> : null}
          {command}
        </PopoverContent>
      </Popover>
    </span>
  );
}

AttributeDiffersMark.Room = MarkRoom;
