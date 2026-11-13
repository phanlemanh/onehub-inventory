"use client";

import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { useMemo, type ReactNode } from "react";

/**
 * The editor of one grid cell (row 4), shaped after the ReUI block data-grid-editing-2 (Hỏi-4): it sits exactly on the
 * selected cell, so the input is where the value was, and what the screen adds below it (a read-back line, a list)
 * hangs right under the cell. The region decides when it opens (F2, typing, double-click — Enter keeps opening the
 * record) and gives focus back to the cell when it closes; the screen gives the content.
 */
/** The widest thing an editor hangs below its cell (20rem), in px. */
const HANGING_WIDTH = 320;

export function CellEditor({
  anchor,
  find,
  label,
  onClose,
  children,
}: {
  /** The selected cell the editor sits on, as it was when the editor opened. */
  anchor: Element;
  /**
   * Finds the cell again, live: the grid scrolls the cell into view (and may draw it anew) after the editor opens, so
   * the editor follows the cell, not the place it had at first.
   */
  find?: () => Element | null;
  /** What is being edited, for screen readers: the field and the row. */
  label: string;
  onClose: () => void;
  children: ReactNode;
}) {
  // A virtual anchor read afresh on every position update; scrolling any parent of the first cell updates it.
  const live = useMemo(
    () => ({
      getBoundingClientRect: () => (find?.() ?? anchor).getBoundingClientRect(),
      contextElement: anchor,
    }),
    [anchor, find],
  );
  // What hangs below may be up to 20rem wide: near the right edge it lines up with the cell's right side instead.
  const box = anchor.getBoundingClientRect();
  const edge = box.left + HANGING_WIDTH > window.innerWidth ? "end" : "start";
  return (
    <PopoverPrimitive.Root
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Positioner
          anchor={live}
          side="bottom"
          align="start"
          sideOffset={-anchor.getBoundingClientRect().height}
          // The editor is exactly as wide as the cell and never slides off it; what hangs below the cell turns to
          // the side that has room (data-edge), so a cell near the right edge keeps its input on the cell.
          collisionAvoidance={{ side: "none", align: "none" }}
          className="isolate z-50"
        >
          <PopoverPrimitive.Popup
            data-slot="cell-editor"
            aria-label={label}
            data-edge={edge}
            className="group/cell-editor relative flex w-(--anchor-width) flex-col text-sm outline-hidden"
          >
            {children}
          </PopoverPrimitive.Popup>
        </PopoverPrimitive.Positioner>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
