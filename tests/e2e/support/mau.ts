// Colour on screen, measured on pixels (VP11 chuan-hoa-he-design, AC-1, AC-2): what a badge's words look like, in CIE
// Lab, and how far apart two colours are by CIEDE2000 — the distance the eye reads as «another colour».
import type { Locator } from "@playwright/test";

import { chupAnh, suaTrang } from "../sua-trang";

export type Rgb = [number, number, number];
export type Lab = { L: number; a: number; b: number };

const lin = (c: number) => {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};

/** sRGB (0–255) to CIE Lab, D65. */
export function toLab([r, g, b]: Rgb): Lab {
  const [R, G, B] = [lin(r), lin(g), lin(b)];
  const X = (0.4124564 * R + 0.3575761 * G + 0.1804375 * B) / 0.95047;
  const Y = 0.2126729 * R + 0.7151522 * G + 0.072175 * B;
  const Z = (0.0193339 * R + 0.119192 * G + 0.9503041 * B) / 1.08883;
  const f = (t: number) => (t > 216 / 24389 ? Math.cbrt(t) : ((24389 / 27) * t + 16) / 116);
  const [fx, fy, fz] = [f(X), f(Y), f(Z)];
  return { L: 116 * fy - 16, a: 500 * (fx - fy), b: 200 * (fy - fz) };
}

/** Chroma of a Lab colour: how far it is from grey. */
export const chroma = ({ a, b }: Lab) => Math.hypot(a, b);

/** Hue angle of a Lab colour, in degrees 0–360. */
export const hue = ({ a, b }: Lab) => ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360;

/** The smaller angle between two hues, 0–180. */
export const hueGap = (h1: number, h2: number) => {
  const d = Math.abs(h1 - h2) % 360;
  return d > 180 ? 360 - d : d;
};

/** CIEDE2000 colour difference (Sharma, Wu, Dalal 2005). */
export function deltaE2000(x: Lab, y: Lab): number {
  const rad = Math.PI / 180;
  const C1 = Math.hypot(x.a, x.b);
  const C2 = Math.hypot(y.a, y.b);
  const Cm = (C1 + C2) / 2;
  const G = 0.5 * (1 - Math.sqrt(Cm ** 7 / (Cm ** 7 + 25 ** 7)));
  const a1 = (1 + G) * x.a;
  const a2 = (1 + G) * y.a;
  const c1 = Math.hypot(a1, x.b);
  const c2 = Math.hypot(a2, y.b);
  const h = (b: number, a: number) =>
    a === 0 && b === 0 ? 0 : (Math.atan2(b, a) / rad + 360) % 360;
  const h1 = h(x.b, a1);
  const h2 = h(y.b, a2);
  const dL = y.L - x.L;
  const dC = c2 - c1;
  let dh = 0;
  if (c1 * c2 !== 0) {
    dh = h2 - h1;
    if (dh > 180) dh -= 360;
    else if (dh < -180) dh += 360;
  }
  const dH = 2 * Math.sqrt(c1 * c2) * Math.sin((dh / 2) * rad);
  const Lm = (x.L + y.L) / 2;
  const cm = (c1 + c2) / 2;
  let hm = h1 + h2;
  if (c1 * c2 !== 0) {
    if (Math.abs(h1 - h2) <= 180) hm = (h1 + h2) / 2;
    else hm = h1 + h2 < 360 ? (h1 + h2 + 360) / 2 : (h1 + h2 - 360) / 2;
  }
  const T =
    1 -
    0.17 * Math.cos((hm - 30) * rad) +
    0.24 * Math.cos(2 * hm * rad) +
    0.32 * Math.cos((3 * hm + 6) * rad) -
    0.2 * Math.cos((4 * hm - 63) * rad);
  const dTheta = 30 * Math.exp(-(((hm - 275) / 25) ** 2));
  const Rc = 2 * Math.sqrt(cm ** 7 / (cm ** 7 + 25 ** 7));
  const Sl = 1 + (0.015 * (Lm - 50) ** 2) / Math.sqrt(20 + (Lm - 50) ** 2);
  const Sc = 1 + 0.045 * cm;
  const Sh = 1 + 0.015 * cm * T;
  const Rt = -Math.sin(2 * dTheta * rad) * Rc;
  return Math.sqrt((dL / Sl) ** 2 + (dC / Sc) ** 2 + (dH / Sh) ** 2 + Rt * (dC / Sc) * (dH / Sh));
}

/**
 * The colour of a badge's words: of the pixels of its screenshot, the one farthest from the badge's own ground (the
 * colour most of its pixels have). Antialiasing only mixes the words toward the ground, so the farthest pixel is the
 * words' colour.
 */
export async function wordsColour(badge: Locator): Promise<Rgb> {
  const png = (await chupAnh(badge)).toString("base64");
  return (await suaTrang(
    badge.page(),
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
      const count = new Map<string, number>();
      for (let n = 0; n < px.length; n += 4) {
        const key = `${px[n]},${px[n + 1]},${px[n + 2]}`;
        count.set(key, (count.get(key) ?? 0) + 1);
      }
      const ground = [...count.entries()]
        .sort((a, b) => b[1] - a[1])[0]![0]
        .split(",")
        .map(Number);
      let best = ground;
      let far = -1;
      for (let n = 0; n < px.length; n += 4) {
        const d = Math.hypot(px[n]! - ground[0]!, px[n + 1]! - ground[1]!, px[n + 2]! - ground[2]!);
        if (d > far) {
          far = d;
          best = [px[n]!, px[n + 1]!, px[n + 2]!];
        }
      }
      return best;
    },
    png,
  )) as Rgb;
}
