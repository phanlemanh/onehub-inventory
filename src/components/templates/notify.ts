import { toast } from "sonner";

import { FRAME_COPY } from "./frame-copy";
import { showScreenBanner } from "./screen-banner";

/** What happened: a problem with one field, the result of an action, or a problem with the whole screen. */
export type NotifyEvent = "field" | "result" | "screen";
export type NotifyChannel = "inline" | "toast" | "banner";

const CHANNEL: Readonly<Record<NotifyEvent, NotifyChannel>> = {
  field: "inline",
  result: "toast",
  screen: "banner",
};

/** The channel rule of design/behaviors.md: a field at its place, a result in a toast, a screen in a banner. */
export function channelFor(event: NotifyEvent): NotifyChannel {
  return CHANNEL[event];
}

/** Reports the result of an action in a toast; a reversible action carries «Hoàn tác». */
export function notifyResult({ message, undo }: { message: string; undo?: () => void }): void {
  if (undo) toast(message, { action: { label: FRAME_COPY.undo, onClick: undo } });
  else toast(message);
}

export interface Notice {
  message: string;
  detail?: string;
  undo?: () => void;
  retry?: () => void;
}

/**
 * Sends a notice down the channel the rule picks for the event and says which channel it took. `inline` shows
 * nothing here: the screen shows it at the field. `rule` is the channel rule; tests pass a broken one to prove the
 * check turns red.
 */
export function notify(
  event: NotifyEvent,
  notice: Notice,
  rule: (event: NotifyEvent) => NotifyChannel = channelFor,
): NotifyChannel {
  const channel = rule(event);
  if (channel === "toast") notifyResult(notice);
  else if (channel === "banner") {
    showScreenBanner({
      kind: "other",
      title: notice.message,
      detail: notice.detail ?? "",
      retry: notice.retry,
    });
  }
  return channel;
}
