"use client";

import { XIcon } from "lucide-react";

import { DialogClose } from "@/components/ui/dialog";
import { SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

import { GRID_COPY } from "./grid-copy";

/**
 * The × in the corner of a dialog or a sheet, read «Đóng» (owner, BH session 2026-11-27, «Duyệt cả sáu điểm», L2): the
 * kit's own × reads «Close» and takes no label, so its content is opened with `showCloseButton={false}` and this one
 * stands in its place — the same button, the same corner, our word.
 */
export function CornerClose({ of }: { of: "dialog" | "sheet" }) {
  const Close = of === "dialog" ? DialogClose : SheetClose;
  return (
    <span className={of === "dialog" ? "absolute top-2 right-2" : "absolute top-3 right-3"}>
      <Close
        data-slot={`${of}-close`}
        render={<Button variant="ghost" size="icon-sm" title={GRID_COPY.record.close} />}
      >
        <XIcon aria-hidden="true" />
        <span className="sr-only">{GRID_COPY.record.close}</span>
      </Close>
    </span>
  );
}
