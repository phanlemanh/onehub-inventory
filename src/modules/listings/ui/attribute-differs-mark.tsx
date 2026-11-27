"use client";

// The mark of a listing's own value that differs from the shared catalog (row 3h): one small block, the same on a grid
// cell and on a line of the unit's record. It is a sign, not an error: the value keeps its colour and nothing is
// blocked. Pressed (pointer or keys), it shows the catalog's value and, for a person who may edit, the way back to it.
// Three looks are offered for the owner to choose at the scope gate (Hỏi-6), switched with `?mark=` outside production:
// a dot with a tooltip (the default), a light badge (after ReUI c-badge-16) or an icon with a tooltip (c-tooltip-3).
import { InfoIcon } from "lucide-react";
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

export function AttributeDiffersMark({
  words,
  catalogShown,
  sourceWord,
  onRevert,
  inGrid = false,
}: {
  words: UnitAttributeWords;
  /** The catalog's value as the screens write it: «68,5 m²». */
  catalogShown: string;
  /** Who wrote the own value, by its word (typed by the company, or from a file). */
  sourceWord?: string;
  /** Takes the catalog's value again; absent for a person who may not edit, or a locked listing. */
  onRevert?: () => void;
  /** Inside a grid cell: a press goes to the mark, not to the cell's selection. */
  inGrid?: boolean;
}) {
  const look = useContext(MarkLookContext);
  const [open, setOpen] = useState(false);
  const name = COPY.markName(words, catalogShown);
  const face =
    look === "badge" ? (
      <Badge variant="info-light">{words.differs.split(" ")[0]!.toLocaleLowerCase("vi")}</Badge>
    ) : look === "icon" ? (
      <InfoIcon aria-hidden="true" className="size-3.5 text-info" />
    ) : (
      <span aria-hidden="true" className="size-1.5 self-start rounded-full bg-info" />
    );
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
      {face}
    </PopoverTrigger>
  );
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
          {onRevert ? (
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
          ) : null}
        </PopoverContent>
      </Popover>
    </span>
  );
}
