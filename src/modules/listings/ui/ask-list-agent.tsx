"use client";

import { MessageCircleQuestionIcon } from "lucide-react";
import { useState } from "react";

import { useActionPermission } from "@/components/candidate/action-permission";
import { notifyResult } from "@/components/templates/notify";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { statusLabel } from "@/lib/format";
import { openShare, sharedText } from "@/lib/share";

import type { ListingStandardStatus } from "@/generated/ontology";
import { detailsLocked } from "../edit-rules";
import { askListAgentMessage } from "../messages";

/** Sale or lease, as the status words take it. */
type TransactionKind = NonNullable<Parameters<typeof statusLabel>[1]>;
import type { SampleKeeper } from "../sample";
import { ASK_COPY, type AskWords } from "./ask-copy";
import { RECORD_COPY } from "./record-copy";

/**
 * label(AskListAgent) · [Tên], stuck to the foot of a listing's record (row 3e): the next step with a person. It only writes the
 * message and opens the device's share sheet — the person picks where and presses send (SP-3). It shows when the
 * permission table lets the viewer see listings and the viewer does not keep the unit. When the listing's status or
 * the unit's keeper blocks it — sold, withdrawn, nobody keeps it — its place holds one quiet line saying why, never a
 * dimmed button (row 3h, C2; the shared button rule, sentence 2).
 */
export function AskListAgent({
  listing,
  keeper,
  words,
}: {
  listing: {
    id: string;
    unitNumber: string;
    buildingName: string;
    /** Row 3h: the listing's status, for the line that replaces the button of a sold or withdrawn listing. */
    status?: ListingStandardStatus;
    transaction?: TransactionKind;
  };
  keeper: SampleKeeper;
  words: AskWords;
}) {
  const permitted = useActionPermission();
  const [failed, setFailed] = useState<string | null>(null);
  if (!permitted("viewListings", false) || keeper?.kind === "viewer") return null;
  const blocked =
    listing.status && detailsLocked(listing.status)
      ? RECORD_COPY.blocked(words.unit, statusLabel(listing.status, listing.transaction), words.ask)
      : keeper === null
        ? ASK_COPY.unheld(words.unit, words.listAgent)
        : null;
  if (blocked !== null)
    return (
      <div data-slot="record-footer" className="border-t bg-background p-4">
        <p data-slot="ask-locked-reason" className="text-center text-sm text-muted-foreground">
          {blocked}
        </p>
      </div>
    );

  // The share sheet is opened inside the click, before any await: a device refuses a share that lost the gesture.
  const ask = () => {
    const message = askListAgentMessage(listing, words.unit, window.location.origin);
    void openShare(message, navigator).then((outcome) => {
      if (outcome === "da-chep") notifyResult({ message: ASK_COPY.copied });
      setFailed(outcome === "loi" ? sharedText(message) : null);
    });
  };

  return (
    <div data-slot="record-footer" className="flex flex-col gap-2 border-t bg-background p-4">
      <Button
        size="lg"
        className="w-full"
        data-action="viewListings"
        data-slot="ask-list-agent"
        onClick={ask}
      >
        <MessageCircleQuestionIcon aria-hidden="true" />
        {ASK_COPY.askWith(words.ask, keeper!.name)}
      </Button>
      {failed === null ? null : (
        <>
          <p role="alert" className="text-sm text-destructive">
            {ASK_COPY.failed}
          </p>
          <Textarea readOnly aria-label={ASK_COPY.messageLabel} value={failed} rows={3} />
        </>
      )}
    </div>
  );
}
