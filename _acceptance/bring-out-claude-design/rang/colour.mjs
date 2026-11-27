// The dark value a source colour gives, worked out here from its CSS text (oklch(), color-mix() in
// oklch with white, or a #hex), independently of the tool that wrote the bundle: Björn Ottosson's
// OKLab matrices and the sRGB transfer, clipped to the sRGB range. Returns [r, g, b, a] in 0–255.
const ch = (x) => Math.round(Math.min(1, Math.max(0, x)) * 255);
const toGamma = (x) => (x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055);
const toLinear = (x) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4);

function oklchToRgb(L, C, H, alpha = 1) {
  const h = (H * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bl = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
  return [ch(toGamma(r)), ch(toGamma(g)), ch(toGamma(bl)), Math.round(alpha * 255)];
}

function hexToOklch(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => toLinear(Number.parseInt(hex.slice(i, i + 2), 16) / 255));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return [L, Math.hypot(A, B), (Math.atan2(B, A) * 180) / Math.PI];
}

const num = (t) => (t === "none" ? 0 : t.endsWith("%") ? Number.parseFloat(t) / 100 : Number.parseFloat(t));

export function parseColour(text) {
  const t = String(text).trim();
  let m = t.match(/^#([0-9a-f]{6})([0-9a-f]{2})?$/i);
  if (m) return [0, 2, 4].map((i) => Number.parseInt(m[1].slice(i, i + 2), 16)).concat(m[2] ? Number.parseInt(m[2], 16) : 255);
  m = t.match(/^oklch\(\s*(\S+)\s+(\S+)\s+(\S+)\s*(?:\/\s*(\S+))?\)$/);
  if (m) return oklchToRgb(num(m[1]), num(m[2]), num(m[3]), m[4] ? num(m[4]) : 1);
  // color-mix(in oklch, <hex> p%, white): white has no hue, so the mix keeps the colour's hue.
  m = t.match(/^color-mix\(in oklch,\s*(#[0-9a-f]{6})\s+(\d+(?:\.\d+)?)%,\s*white\)$/i);
  if (m) {
    const p = Number.parseFloat(m[2]) / 100;
    const [L, C, H] = hexToOklch(m[1]);
    return oklchToRgb(p * L + (1 - p), p * C, H);
  }
  return null;
}

// True when two colours differ by at most `tolerance` in every channel (rounding of the two
// converters), alpha included.
export function sameColour(a, b, tolerance = 2) {
  return Boolean(a && b) && a.every((v, i) => Math.abs(v - b[i]) <= tolerance);
}
