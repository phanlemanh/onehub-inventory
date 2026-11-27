"use client";

// The mark of a listing's own value that differs from the shared catalog (row 3h): the sign (attribute-differs-sign.tsx)
// with, for a person who may edit, the way back to the catalog's value — or, when the listing's status locks its
// attributes, the reason in the command's place. Three looks are offered for the owner to choose at the scope gate
// (Hỏi-6), switched with `?mark=` outside production; the sign holds them.
import { LockIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { AttributeDiffersSign } from "./attribute-differs-sign";
import type { UnitAttributeWords } from "./unit-attribute-copy";

export { MARK_ROOM_CH, MarkLookProvider, useMarkLook } from "./attribute-differs-sign";

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
  const command = lockedReason
    ? () => (
        // Blocked by the listing's status: the reason with the lock in the command's place, never a dimmed button.
        <p
          data-slot="attribute-locked-reason"
          className="flex items-center gap-1 text-xs text-muted-foreground"
        >
          <LockIcon aria-hidden="true" className="size-3" />
          {lockedReason}
        </p>
      )
    : onRevert
      ? (close: () => void) => (
          <Button
            type="button"
            variant="outline"
            size="sm"
            data-action="updateListing"
            data-slot="attribute-revert"
            onClick={() => {
              close();
              onRevert();
            }}
          >
            {words.revert}
          </Button>
        )
      : undefined;
  return (
    <AttributeDiffersSign
      words={words}
      catalogShown={catalogShown}
      {...(sourceWord !== undefined ? { sourceWord } : {})}
      command={command}
      inGrid={inGrid}
      still={still}
    />
  );
}

AttributeDiffersMark.Room = AttributeDiffersSign.Room;
