// From a source color to a tonal palette and color roles. Pure: the same input gives the same text.
import { asWritten, clipChroma, contrast, formatOklch, luminance, parseColor } from "./color.mjs";
import { CORNER_RADII, modularScale, typeDeclarations } from "./scale.mjs";

export const START = "/* design-assembly:tokens:start";
export const END = "/* design-assembly:tokens:end */";
const HEADER = `${START} - generated from design/blueprint.json. Do not edit: run the guide again. */`;

// What each conformance level asks, from WCAG 2.2: the contrast ratio of text (1.4.3, 1.4.6) and
// of non-text parts such as a focus ring (1.4.11), and the target size of a control in CSS pixels
// (2.5.8, 2.5.5).
export const THRESHOLDS = {
  AA: { text: 4.5, nonText: 3, target: 24 },
  AAA: { text: 7, nonText: 3, target: 44 },
};

// Tones as Material Design lists them: 0 to 100 in tens, plus 95, 98 and 99.
const TONES = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 98, 99, 100];
// The two candidates for text on the primary colour: the floor's own near-white and near-black.
const ON_COLORS = [
  { l: 0.985, c: 0, h: 0 },
  { l: 0.205, c: 0, h: 0 },
];
const FALLBACK_BACKGROUND = { ":root": { l: 1, c: 0, h: 0 }, ".dark": { l: 0.145, c: 0, h: 0 } };

// A tone is CIE lightness (L*). This is the luminance that lightness stands for.
function toneToLuminance(tone) {
  return tone > 8 ? ((tone + 16) / 116) ** 3 : tone / 903.3;
}

// The colour of the source's hue and chroma whose luminance matches the tone. Found by bisection:
// luminance only grows with lightness.
function atTone(source, tone) {
  const target = toneToLuminance(tone);
  let low = 0;
  let high = 1;
  for (let i = 0; i < 40; i += 1) {
    const middle = (low + high) / 2;
    if (luminance(clipChroma({ ...source, l: middle })) < target) low = middle;
    else high = middle;
  }
  return asWritten({ ...source, l: (low + high) / 2 });
}

function tonalPalette(source) {
  return TONES.map((tone) => ({ tone, color: atTone(source, tone) }));
}

function bestOn(primary) {
  return ON_COLORS.map((color) => ({ color, ratio: contrast(color, primary) })).sort(
    (a, b) => b.ratio - a.ratio,
  )[0];
}

// The source color itself when it meets the threshold; otherwise the nearest lightness of the same
// hue that does, moving away from the background. Solved, not nudged.
function solvePrimary(source, background, min) {
  const away = background.l > 0.5 ? -1 : 1;
  const start = Math.min(0.98, Math.max(0.03, source.l));
  for (let l = start; l > 0.02 && l < 0.99; l += away * 0.002) {
    const primary = asWritten({ ...source, l });
    const on = bestOn(primary);
    if (contrast(primary, background) >= min && on.ratio >= min) {
      return { primary, onPrimary: on.color, adjusted: Math.abs(l - source.l) > 1e-9 };
    }
  }
  throw new Error("no lightness of this hue meets the contrast threshold");
}

// Declarations of one variable for one selector, top-level blocks only. The last one wins.
export function readVariable(css, selector, name) {
  const blocks = new RegExp(`(?:^|\\n)${selector.replaceAll(".", "\\.")}\\s*\\{([^}]*)\\}`, "g");
  let value = null;
  for (const block of css.matchAll(blocks)) {
    const found = [...block[1].matchAll(new RegExp(`${name}\\s*:\\s*([^;]+);`, "g"))].pop();
    if (found) value = found[1].trim();
  }
  return value;
}

export function withoutBlock(css) {
  const from = css.indexOf(START);
  const to = css.indexOf(END);
  if (from === -1 || to === -1) return css;
  return css.slice(0, from).trimEnd() + "\n" + css.slice(to + END.length).replace(/^\n+/, "");
}

export function readBlock(css) {
  const from = css.indexOf(START);
  const to = css.indexOf(END);
  return from === -1 || to === -1 ? null : css.slice(from, to + END.length);
}

// Builds the theme from the decided inputs and the backgrounds the repository's own CSS declares.
// `typeScale` and `cornerRadius` are optional: a ledger written before they existed renders as it
// did then, so its generated check still holds.
export function buildTheme(inputs, css) {
  const { sourceColor, conformanceLevel, typeScale, typeRatio, cornerRadius } = inputs;
  const thresholds = THRESHOLDS[conformanceLevel];
  if (!thresholds) throw new Error(`conformance level must be one of ${Object.keys(THRESHOLDS)}`);
  const source = parseColor(String(sourceColor ?? ""));
  if (!source) throw new Error("source color must be written as #rrggbb or oklch(L C H)");
  const floor = withoutBlock(css);
  const modes = Object.keys(FALLBACK_BACKGROUND).map((selector) => {
    const declared = readVariable(floor, selector, "--background");
    const background = (declared && parseColor(declared)) || FALLBACK_BACKGROUND[selector];
    return { selector, background, ...solvePrimary(source, background, thresholds.text) };
  });
  if (cornerRadius !== undefined && !(cornerRadius in CORNER_RADII)) {
    throw new Error(`corner radius must be one of ${Object.keys(CORNER_RADII)}`);
  }
  if (typeScale !== undefined && !["standard", "modular"].includes(typeScale)) {
    throw new Error("type scale must be standard or modular");
  }
  return {
    palette: tonalPalette(source),
    modes,
    thresholds,
    radius: cornerRadius === undefined ? null : CORNER_RADII[cornerRadius],
    type: typeScale === "modular" ? modularScale(typeRatio) : null,
  };
}

// The block as it sits at the end of the stylesheet. Written the way Prettier leaves CSS.
export function renderBlock(theme) {
  const lines = [HEADER];
  theme.modes.forEach((mode, index) => {
    lines.push(`${mode.selector} {`);
    if (index === 0) {
      for (const entry of theme.palette) {
        lines.push(`  --palette-primary-${entry.tone}: ${formatOklch(entry.color)};`);
      }
      if (theme.radius !== null && theme.radius !== undefined) {
        lines.push(`  --radius: ${theme.radius};`);
      }
      for (const declaration of theme.type ? typeDeclarations(theme.type) : []) {
        lines.push(`  ${declaration}`);
      }
    }
    lines.push(`  --primary: ${formatOklch(mode.primary)};`);
    lines.push(`  --primary-foreground: ${formatOklch(mode.onPrimary)};`);
    lines.push(`  --ring: ${formatOklch(mode.primary)};`);
    lines.push("}", "");
  });
  lines.pop();
  lines.push(END);
  return lines.join("\n");
}

export function applyBlock(css, block) {
  return `${withoutBlock(css).trimEnd()}\n\n${block}\n`;
}
