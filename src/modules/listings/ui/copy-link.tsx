"use client";

import { LinkIcon } from "lucide-react";

import { notifyResult } from "@/components/templates/notify";
import { Button } from "@/components/ui/button";

import { ENTRY_COPY } from "./entry-copy";

/** The link of one listing: the inventory address that opens its record (row 3), absolute so it can be pasted. */
export function recordLink(id: string, origin: string): string {
  return new URL(`/inventory?ho-so=${encodeURIComponent(id)}`, origin).toString();
}

/**
 * «Chép đường dẫn» at the head of a listing's record (row 3f): copies the record's link and says so; when the browser
 * refuses the clipboard it says where to copy from instead. Below wide screens the button shows its icon only, so the head
 * keeps «Trước», «Sau» and «Đóng» on one line beside the name; its name stays readable.
 */
export function CopyLink({ id }: { id: string }) {
  async function copy() {
    try {
      await navigator.clipboard.writeText(recordLink(id, window.location.origin));
      notifyResult({ message: ENTRY_COPY.copied });
    } catch {
      notifyResult({ message: ENTRY_COPY.copyFailed });
    }
  }
  return (
    <Button
      variant="outline"
      size="sm"
      aria-label={ENTRY_COPY.copyLink}
      data-slot="copy-link"
      onClick={() => void copy()}
    >
      <LinkIcon aria-hidden="true" />
      <span className="max-xl:sr-only">{ENTRY_COPY.copyLink}</span>
    </Button>
  );
}
