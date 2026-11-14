"use client";

import { MessageCircleQuestionIcon } from "lucide-react";
import { useState } from "react";

import { useActionPermission } from "@/components/candidate/action-permission";
import { notifyResult } from "@/components/templates/notify";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { openShare, sharedText } from "@/lib/share";

import { askListAgentMessage } from "../messages";
import type { SampleKeeper } from "../sample";
import { ASK_COPY, type AskWords } from "./ask-copy";

/**
 * label(AskListAgent) · [Tên], stuck to the foot of a listing's record (row 3e): the next step with a person. It only writes the
 * message and opens the device's share sheet — the person picks where and presses send (SP-3). It shows when the
 * permission table lets the viewer see listings and the viewer does not keep the unit; off, with the reason, when
 * nobody keeps it.
 */
export function AskListAgent({
  listing,
  keeper,
  words,
}: {
  listing: { id: string; unitNumber: string; buildingName: string };
  keeper: SampleKeeper;
  words: AskWords;
}) {
  const permitted = useActionPermission();
  const [failed, setFailed] = useState<string | null>(null);
  if (!permitted("viewListings", false) || keeper?.kind === "viewer") return null;
  const unheld = keeper === null;

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
        disabled={unheld}
        data-action="viewListings"
        data-slot="ask-list-agent"
        onClick={ask}
      >
        {unheld ? null : <MessageCircleQuestionIcon aria-hidden="true" />}
        {unheld
          ? ASK_COPY.unheld(words.unit, words.listAgent)
          : ASK_COPY.askWith(words.ask, keeper.name)}
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
