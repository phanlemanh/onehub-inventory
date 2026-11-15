// Colour maths for design-assembly. Pure functions, no dependencies.
// A colour is { l, c, h }: OKLCH lightness 0..1, chroma, hue in degrees.

const round = (value, places) => Number(value.toFixed(places));

function toLinear(channel) {
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

// OKLCH to linear sRGB, unclamped: values outside 0..1 mean the colour is out of gamut.
export function oklchToLinear({ l, c, h }) {
  const a = c * Math.cos((h * Math.PI) / 180);
  const b = c * Math.sin((h * Math.PI) / 180);
  const L = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const M = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const S = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S,
    -1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S,
    -0.0041960863 * L - 0.7034186147 * M + 1.707614701 * S,
  ];
}

export function hexToOklch(hex) {
  const match = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!match) throw new Error(`"${hex}" is not a #rrggbb colour`);
  const [r, g, b] = [0, 2, 4].map((at) => toLinear(parseInt(match[1].slice(at, at + 2), 16) / 255));
  const L = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const M = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const S = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const l = 0.2104542553 * L + 0.793617785 * M - 0.0040720468 * S;
  const a = 1.9779984951 * L - 2.428592205 * M + 0.4505937099 * S;
  const bb = 0.0259040371 * L + 0.7827717662 * M - 0.808675766 * S;
  const c = Math.hypot(a, bb);
  const h = c < 1e-6 ? 0 : ((Math.atan2(bb, a) * 180) / Math.PI + 360) % 360;
  return { l, c, h };
}

export function inGamut(color) {
  return oklchToLinear(color).every((v) => v >= -0.0005 && v <= 1.0005);
}

// The same lightness and hue with the highest chroma the screen can show, never above the asked one.
export function clipChroma(color) {
  if (inGamut(color)) return color;
  let low = 0;
  let high = color.c;
  for (let i = 0; i < 24; i += 1) {
    const middle = (low + high) / 2;
    if (inGamut({ ...color, c: middle })) low = middle;
    else high = middle;
  }
  return { ...color, c: low };
}

// Relative luminance as WCAG defines it, from linear sRGB.
export function luminance(color) {
  const [r, g, b] = oklchToLinear(color).map((v) => Math.min(1, Math.max(0, v)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(first, second) {
  const [high, low] = [luminance(first), luminance(second)].sort((x, y) => y - x);
  return (high + 0.05) / (low + 0.05);
}

// The value as it is written to CSS. Rounded here once, so what is checked is what is shipped.
export function formatOklch(color) {
  return `oklch(${round(color.l, 3)} ${round(color.c, 3)} ${round(color.h, 2)})`;
}

// Splits the arguments of a function at the commas that are not inside brackets.
function splitArguments(text) {
  const parts = [];
  let depth = 0;
  let from = 0;
  for (let i = 0; i < text.length; i += 1) {
    if (text[i] === "(") depth += 1;
    else if (text[i] === ")") depth -= 1;
    else if (text[i] === "," && depth === 0) {
      parts.push(text.slice(from, i));
      from = i + 1;
    }
  }
  return [...parts, text.slice(from)].map((part) => part.trim());
}

// `color-mix(in oklch, A 60%, B)` as the colour the browser computes: each colour's share of
// lightness and chroma, and the hue along the shorter arc. A colour with no chroma has no hue of
// its own and takes the other's. Null for another colour space, or a colour that cannot be read.
function mixed(value) {
  const call = /^color-mix\(\s*in\s+oklch\s*,(.*)\)$/is.exec(value);
  if (!call) return null;
  const sides = splitArguments(call[1]).map((side) => {
    const share = /\s+([\d.]+)%$/.exec(side);
    return {
      color: parseColor(share ? side.slice(0, share.index) : side),
      share: share ? Number(share[1]) / 100 : null,
    };
  });
  if (sides.length !== 2 || sides.some((side) => side.color === null)) return null;
  const [a, b] = sides;
  if (a.share === null && b.share === null) a.share = b.share = 0.5;
  else if (a.share === null) a.share = 1 - b.share;
  else if (b.share === null) b.share = 1 - a.share;
  // Shares that add up to less than the whole leave the mix partly transparent: not read.
  const total = a.share + b.share;
  if (total < 0.9999) return null;
  const [wa, wb] = [a.share / total, b.share / total];
  const grey = (color) => color.c < 1e-4;
  const ha = grey(a.color) ? b.color.h : a.color.h;
  const hb = grey(b.color) ? a.color.h : b.color.h;
  const turn = ((hb - ha + 540) % 360) - 180;
  return {
    l: a.color.l * wa + b.color.l * wb,
    c: a.color.c * wa + b.color.c * wb,
    h: (ha + turn * wb + 360) % 360,
  };
}

// Reads `oklch(L C H)`, `#rrggbb`, `#rgb`, `white`, `black`, and a mix of two such colours in
// oklch. A hue written `none` is read as 0: it only appears with zero chroma. Returns null for
// anything else, such as a value with alpha or a mix in another colour space.
export function parseColor(text) {
  const value = text.trim();
  if (/^white$/i.test(value)) return { l: 1, c: 0, h: 0 };
  if (/^black$/i.test(value)) return { l: 0, c: 0, h: 0 };
  if (/^color-mix\(/i.test(value)) return mixed(value);
  const short = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(value);
  if (short)
    return hexToOklch(`#${short[1]}${short[1]}${short[2]}${short[2]}${short[3]}${short[3]}`);
  if (/^#[0-9a-f]{6}$/i.test(value)) return hexToOklch(value);
  const match = /^oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+|none)\s*\)$/i.exec(value);
  if (!match) return null;
  const l = Number(match[1]) / (match[2] === "%" ? 100 : 1);
  return { l, c: Number(match[3]), h: match[4].toLowerCase() === "none" ? 0 : Number(match[4]) };
}

// `#rrggbb` for a colour as a browser paints it: a colour the screen cannot show has each channel
// cut to the range, which is what a browser does with it.
export function toHex(color) {
  const encode = (v) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);
  return `#${oklchToLinear(color)
    .map((v) => Math.round(encode(Math.min(1, Math.max(0, v))) * 255))
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("")}`;
}

// A colour as a token file writes it for every reader: `#rrggbb`, or `#rrggbbaa` with an alpha.
// Reads what `parseColor` reads, plus an alpha written `/ 50%` or `/ 0.5`; null for anything
// else, such as a color-mix().
export function tokenHex(text) {
  const value = String(text).trim();
  const alpha = /^(oklch\([^/)]*?)\s*\/\s*([\d.]+)(%?)\s*\)$/i.exec(value);
  const color = parseColor(alpha ? `${alpha[1]})` : value);
  if (!color) return null;
  const short = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(value);
  if (short)
    return `#${short[1]}${short[1]}${short[2]}${short[2]}${short[3]}${short[3]}`.toLowerCase();
  if (/^#[0-9a-f]{6}$/i.test(value)) return value.toLowerCase();
  const opacity = alpha ? Number(alpha[2]) / (alpha[3] === "%" ? 100 : 1) : 1;
  const pair =
    opacity >= 1
      ? ""
      : Math.round(opacity * 255)
          .toString(16)
          .padStart(2, "0");
  return `${toHex(color)}${pair}`;
}

// The colour exactly as CSS will hold it. Lightness and hue are rounded first, then chroma is cut to
// what the screen shows at those rounded values and rounded down, so rounding never pushes the
// written colour out of gamut: the browser renders the value the checks computed with.
export function asWritten(color) {
  const l = round(color.l, 3);
  const h = round(color.h, 2);
  let c = Math.floor(clipChroma({ l, c: color.c, h }).c * 1000) / 1000;
  while (c > 0 && !inGamut({ l, c, h })) c = round(c - 0.001, 3);
  return { l, c, h };
}
