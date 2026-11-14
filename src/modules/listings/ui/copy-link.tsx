"use client";

import { LinkIcon } from "lucide-react";

import { notifyResult } from "@/components/templates/notify";
import { Button } from "@/components/ui/button";

import { recordLink } from "../messages";
import { ENTRY_COPY } from "./entry-copy";

export { recordLink };

/**
 * «Chép đường dẫn» at the head of a listing's record (row 3f): copies the record's link and says so; when the browser
 * refuses the clipboard it says where to copy from instead. An icon on every width (owner, 2026-11-13, row 3e): its name
 * stays readable to screen readers and shows as a hint on hover.
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
      size="icon-sm"
      aria-label={ENTRY_COPY.copyLink}
      title={ENTRY_COPY.copyLink}
      data-slot="copy-link"
      onClick={() => void copy()}
    >
      <LinkIcon aria-hidden="true" />
    </Button>
  );
}
