"use client";

import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import type { ReactNode } from "react";

/**
 * The editor of one grid cell (row 4), shaped after the ReUI block data-grid-editing-2 (Hỏi-4): it sits exactly on the
 * selected cell, so the input is where the value was, and what the screen adds below it (a read-back line, a list)
 * hangs right under the cell. The region decides when it opens (F2, typing, double-click — Enter keeps opening the
 * record) and gives focus back to the cell when it closes; the screen gives the content.
 */
export function CellEditor({
  anchor,
  label,
  onClose,
  children,
}: {
  /** The selected cell the editor sits on. */
  anchor: Element;
  /** What is being edited, for screen readers: the field and the row. */
  label: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <PopoverPrimitive.Root
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Positioner
          anchor={anchor}
          side="bottom"
          align="start"
          sideOffset={-anchor.getBoundingClientRect().height}
          className="isolate z-50"
        >
          <PopoverPrimitive.Popup
            data-slot="cell-editor"
            aria-label={label}
            className="flex flex-col items-start text-sm outline-hidden"
          >
            {children}
          </PopoverPrimitive.Popup>
        </PopoverPrimitive.Positioner>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
