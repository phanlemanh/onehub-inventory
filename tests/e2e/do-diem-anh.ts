// Measures what a screen shows, on pixels, rather than the styles it declares (VP10 khung-luoi-va-ngan-chi-tiet, round
// 2 of the grading: a shadow the record's box clipped still read as declared). The browser decodes the screenshot.
import type { Page } from "@playwright/test";

import { chupAnh, suaTrang } from "./sua-trang";

/** Mean luminance of each pixel column of a page region (0–255), decoded by the browser from a screenshot. */
export async function columnLuminance(
  page: Page,
  clip: { x: number; y: number; width: number; height: number },
): Promise<number[]> {
  const png = (await chupAnh(page, { clip })).toString("base64");
  return suaTrang(
    page,
    async (data: string) => {
      const img = new Image();
      img.src = `data:image/png;base64,${data}`;
      await img.decode();
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const px = ctx.getImageData(0, 0, img.width, img.height).data;
      const cols = Array.from({ length: img.width }, () => 0);
      for (let n = 0; n < px.length; n += 4) {
        const x = (n / 4) % img.width;
        cols[x] = (cols[x] ?? 0) + 0.2126 * px[n]! + 0.7152 * px[n + 1]! + 0.0722 * px[n + 2]!;
      }
      return cols.map((c) => c / img.height);
    },
    png,
  );
}

/** Mean luminance (0–255) of a page region: the mean of its columns, which all have the same height. */
export async function luminance(
  page: Page,
  clip: { x: number; y: number; width: number; height: number },
): Promise<number> {
  const cols = await columnLuminance(page, clip);
  return cols.reduce((a, b) => a + b, 0) / cols.length;
}
