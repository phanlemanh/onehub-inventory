// The device's share sheet, or the clipboard when there is none (row 3e). Knows no business: a text and an optional
// link in, how it went out. Call it inside the person's click — the device refuses a share without a user gesture.
export type ShareOutcome = "chia-se" | "da-chep" | "huy" | "loi";

export type ShareDevice = {
  share?: (data: { title?: string; text?: string; url?: string }) => Promise<void>;
  clipboard?: { writeText(text: string): Promise<void> };
};

export async function openShare(
  message: { text: string; url?: string },
  device: ShareDevice,
): Promise<ShareOutcome> {
  if (device.share) {
    try {
      await device.share({ title: message.text.split("\n")[0], text: message.text, url: message.url });
      return "chia-se";
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return "huy";
      // The device refused to share: copy instead.
    }
  }
  if (!device.clipboard) return "loi";
  try {
    await device.clipboard.writeText(message.url ? `${message.text}\n${message.url}` : message.text);
    return "da-chep";
  } catch {
    return "loi";
  }
}
