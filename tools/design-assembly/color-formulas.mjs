// The two formulas that write the colour roles beyond the primary: the neutral family, and the
// status tones. Pure: the same input gives the same values, and a value is only ever written once
// every pair it is read in reaches its threshold. Where none can, the formula says so in one
// sentence and writes nothing.
import { asWritten, clipChroma, contrast, hexToOklch, toHex } from "./color.mjs";

// The neutral roles, each with its lightness on the floor's own ladder in light and in dark mode,
// and, for a role read as text, the grounds it is read on: the floor's neutral ladder, read from
// its stylesheet, with nothing moved. A plugin test holds the grounds to the table of colour
// roles, so the two never say different things. A role `translucent` in a mode is drawn by the
// floor as a white of that share over the ground under it, so it takes the ground's hue, and the
// formula writes it the same way.
export const NEUTRAL_ROLES = [
  { role: "--background", light: 1, dark: 0.145 },
  { role: "--foreground", light: 0.145, dark: 0.985, on: ["--background"] },
  { role: "--card", light: 1, dark: 0.205 },
  { role: "--card-foreground", light: 0.145, dark: 0.985, on: ["--card"] },
  { role: "--popover", light: 1, dark: 0.205 },
  { role: "--popover-foreground", light: 0.145, dark: 0.985, on: ["--popover"] },
  { role: "--secondary", light: 0.97, dark: 0.269 },
  { role: "--secondary-foreground", light: 0.205, dark: 0.985, on: ["--secondary"] },
  { role: "--muted", light: 0.97, dark: 0.269 },
  { role: "--muted-foreground", light: 0.556, dark: 0.708, on: ["--muted", "--background"] },
  { role: "--accent", light: 0.97, dark: 0.269 },
  { role: "--accent-foreground", light: 0.205, dark: 0.985, on: ["--accent"] },
  { role: "--border", light: 0.922, dark: { translucent: 0.1 } },
  { role: "--input", light: 0.922, dark: { translucent: 0.15 } },
  { role: "--sidebar", light: 0.985, dark: 0.205 },
  { role: "--sidebar-foreground", light: 0.145, dark: 0.985, on: ["--sidebar"] },
  { role: "--sidebar-accent", light: 0.97, dark: 0.269 },
  { role: "--sidebar-accent-foreground", light: 0.205, dark: 0.985, on: ["--sidebar-accent"] },
  { role: "--sidebar-border", light: 0.922, dark: { translucent: 0.1 } },
];

// The values of the neutral family: pure grey, or grey leaning to the source colour.
export const NEUTRAL_FAMILIES = ["grey", "tinted"];
// How far a tinted grey leans: a share of the source colour's chroma at its hue, never more than
// the cap. Grounds and edges lean less than text, so a large surface stays quiet; a grey source
// gives a grey family.
const TINT = { ground: { share: 0.06, most: 0.012 }, text: { share: 0.2, most: 0.04 } };
// One step of the solver, in OKLCH lightness.
const STEP = 0.002;

// The colour of a lightness in the family: no chroma for pure grey; for a tinted grey, the share of
// the source's chroma the role takes, at the source's hue, as far as the screen can show it.
function inFamily(family, source, l, text) {
  if (family === "grey") return { l, c: 0, h: 0 };
  const lean = text ? TINT.text : TINT.ground;
  const c = Math.min(lean.most, source.c * lean.share);
  if (c < 1e-4) return { l, c: 0, h: 0 };
  return asWritten(clipChroma({ l, c, h: source.h }));
}

const modeName = (dark) => (dark ? "dark" : "light");

// The text colour of a role, solved: its lightness on the ladder when every ground it is read on
// reaches the threshold, else the nearest lightness away from its grounds that does. Null when
// none does.
function solveText(entry, grounds, family, source, min, dark) {
  const away = dark ? 1 : -1;
  for (let l = entry[modeName(dark)]; l >= 0 && l <= 1; l += away * STEP) {
    const color = inFamily(family, source, Number(l.toFixed(3)), true);
    if (entry.on.every((ground) => contrast(color, grounds[ground]) >= min)) return color;
  }
  return null;
}

// Every neutral role of one mode, written by the formula of the family. Each value is a colour,
// or, for a role the floor draws translucent, `{ translucent }`: a white of that share over the
// ground. Throws one sentence when a role read as text cannot reach the threshold on its grounds.
export function neutralRoles(family, source, min, dark) {
  if (!NEUTRAL_FAMILIES.includes(family)) {
    throw new Error(`the neutral family must be one of ${NEUTRAL_FAMILIES.join(", ")}`);
  }
  const values = {};
  for (const entry of NEUTRAL_ROLES.filter((item) => !item.on)) {
    const at = entry[modeName(dark)];
    values[entry.role] =
      typeof at === "number"
        ? inFamily(family, source, at, false)
        : { translucent: at.translucent };
  }
  for (const entry of NEUTRAL_ROLES.filter((item) => item.on)) {
    const color = solveText(entry, values, family, source, min, dark);
    if (!color) {
      throw new Error(
        `the neutral family ${family} cannot give ${entry.role} a lightness that reaches ${min}:1 on ${entry.on.join(" and ")} in ${modeName(dark)} mode, so nothing is written: choose the other family, or keep the neutral roles from the floor`,
      );
    }
    values[entry.role] = color;
  }
  return values;
}

// How the floor's components draw a status tone on a ground of its own: the tone at this share
// over the background, in light and in dark mode (`bg-destructive/10`, `dark:bg-destructive/20`).
// A tone is read as text on the background and on that tint.
export const TONE_TINT = { light: 0.1, dark: 0.2 };
// How far the solver may move a tone's lightness before it is no longer its hue: below the first
// in light mode it reads brown or black, above the second in dark mode it reads white.
export const TONE_BAND = { light: 0.35, dark: 0.9 };

// A colour drawn at a share over a ground, as a browser composites a translucent colour: each
// channel of the encoded sRGB colour mixed by the share. What the tint of a tone is.
export function over(top, share, ground) {
  const channels = (color) =>
    [1, 3, 5].map((at) => parseInt(toHex(color).slice(at, at + 2), 16) / 255);
  const [a, b] = [channels(top), channels(ground)];
  const mixed = a.map((value, index) => value * share + b[index] * (1 - share));
  const hex = mixed.map((value) =>
    Math.round(value * 255)
      .toString(16)
      .padStart(2, "0"),
  );
  return hexToOklch(`#${hex.join("")}`);
}

// The value of one status tone in one mode. `tone` is its entry of the closed list, its colour of
// the mode read as { l, c, h }: that colour itself when it reaches the threshold on the background
// and on its own tint, else the nearest lightness of its hue and chroma away from the background
// that does, inside the band. Throws one sentence when no lightness of the band does.
export function toneColor(tone, background, min, dark) {
  const mode = modeName(dark);
  const start = tone[mode];
  const away = dark ? 1 : -1;
  const edge = TONE_BAND[mode];
  const inside = (l) => (dark ? l <= edge : l >= edge);
  for (let l = start.l; inside(l); l += away * STEP) {
    const color = asWritten(clipChroma({ ...start, l: Number(l.toFixed(3)) }));
    const tint = over(color, TONE_TINT[mode], background);
    if (contrast(color, background) >= min && contrast(color, tint) >= min) return color;
  }
  throw new Error(
    `the ${tone.tone} tone cannot reach ${min}:1 on the background and on its own tint in ${mode} mode without leaving its hue, so nothing is written for it: ${tone.always ? "keep its role from the floor" : "leave the tone out"}, or choose a lower conformance level`,
  );
}
