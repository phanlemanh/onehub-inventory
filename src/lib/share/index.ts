// The device's share sheet, or the clipboard when there is none (row 3e, _acceptance/hoi-dau-chu-bao-sai). Knows no
// business: a text and an optional link in, how it went out. The product never sends anything itself (SP-3): it only
// opens the device's share sheet, and the person picks where to send and presses send.

/** How a share went: the share sheet opened, the text was copied, the person cancelled, or neither way worked. */
export type ShareOutcome = "chia-se" | "da-chep" | "huy" | "loi";

/** What the device offers; `navigator` fits, tests pass a fake. */
export type ShareDevice = {
  share?: (data: { title?: string; text?: string; url?: string }) => Promise<void>;
  clipboard?: { writeText(text: string): Promise<void> };
};

export type ShareMessage = { text: string; url?: string };

/** The text as it is copied: the link on its own line under the text. */
export function sharedText(message: ShareMessage): string {
  return message.url ? `${message.text}\n${message.url}` : message.text;
}

/**
 * Opens the share sheet, or copies when the device has none or refuses. Call it inside the person's click and before
 * any await: a device refuses a share that has lost the person's gesture.
 */
export async function openShare(message: ShareMessage, device: ShareDevice): Promise<ShareOutcome> {
  if (device.share) {
    try {
      await device.share({
        title: message.text.split("\n")[0],
        text: message.text,
        url: message.url,
      });
      return "chia-se";
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return "huy";
      // The device refused to share (no gesture, no target): copy instead.
    }
  }
  if (!device.clipboard) return "loi";
  try {
    await device.clipboard.writeText(sharedText(message));
    return "da-chep";
  } catch {
    return "loi";
  }
}
