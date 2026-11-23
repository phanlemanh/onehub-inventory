// From a source color to a tonal palette and color roles. Pure: the same input gives the same text.
import { asWritten, clipChroma, contrast, formatOklch, luminance, parseColor } from "./color.mjs";
import { adapterOf } from "./adapters/index.mjs";
import { neutralRoles, toneColor } from "./color-formulas.mjs";
import { CORNER_RADII, modularScale, typeDeclarations } from "./scale.mjs";
import { fontCannot, SOURCES_FOLDER } from "./sources-ledger.mjs";
import { themeDeclarations } from "./styles.mjs";

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

const values = adapterOf("values");

// The typeface every device has for its own interface: nothing is loaded for it.
export const SYSTEM_FONT = "ui-sans-serif, system-ui, sans-serif";
// The words each typeface choice takes. Beside them it takes a font of the sources ledger.
export const FONT_CHOICES = { text: ["floor", "system"], heading: ["text", "floor", "system"] };
// A font of the sources ledger as a typeface choice names it: `source:` and the id of its row.
export const FONT_SOURCE = "source:";
const SOURCED = /^source:([a-z0-9]+(?:-[a-z0-9]+)*)$/;
// The id of the row a typeface choice names, or null when the value is a word.
export const sourceFontId = (value) => SOURCED.exec(String(value ?? ""))?.[1] ?? null;
// The file of the row a typeface choice names.
export const sourceFontFile = (value) => `${SOURCES_FOLDER}/${sourceFontId(value)}.json`;

// The value the floor's own theme blocks declare last for a variable, or null: the declaration the
// framework puts into its classes. Read by the reader every check uses.
const floorTheme = (floor, name) =>
  themeDeclarations({ css: floor }).findLast((item) => item.name === name)?.value ?? null;

// The font of the sources ledger a typeface choice names, among the fonts read from the ledger.
// It throws one sentence when the font cannot be chosen: its row is missing, is not whole, waits
// on its licence, or pins what the repository no longer holds.
// The error is marked `font`: the fault is the typeface's, and the gate says it under that row.
export function sourcedFont(value, sources) {
  const id = sourceFontId(value);
  const font = (sources ?? []).find((item) => item.id === id);
  const fault = (message) => Object.assign(new Error(message), { font: true });
  if (!font) {
    throw fault(
      `the sources ledger has no font row ${sourceFontFile(value)}: a font is chosen once its row is there, of the kind font, with its pin and its licence`,
    );
  }
  const cannot = fontCannot(font);
  if (cannot) throw fault(cannot);
  return font;
}

// A font of the sources ledger as the block names it: by the variable a font loader of the build
// sets for it, or by its family; then the system font, which the page shows until it is loaded.
const sourcedValue = (font) =>
  `${font.variable ? `var(${font.variable})` : `"${font.family}"`}, ${SYSTEM_FONT}`;

const oneOf = (words) =>
  `${words.join(", ")}, or ${FONT_SOURCE}<id> for a font of the sources ledger`;

// The typeface of running text and of headings as the block writes them, or null when neither is
// decided: a blueprint decided before the choice existed leaves the floor's declarations alone.
// The floor's typeface is copied from the floor's own declaration, so the two say the same; a
// heading in the text's typeface points at the text's variable, as the floor writes it. A font of
// the sources ledger is read from `context.sources`, the fonts of the ledger; `context.faces`, the
// build's own way to write what loads a font kept as files, gives the rules the block carries.
export function fontValues(inputs, css, context = {}) {
  const { textFont, headingFont } = inputs;
  if (textFont === undefined && headingFont === undefined) return null;
  const sourced = [textFont, headingFont].map((value) => sourceFontId(value) !== null);
  if (!sourced[0] && !FONT_CHOICES.text.includes(textFont)) {
    throw new Error(`text typeface must be one of ${oneOf(FONT_CHOICES.text)}`);
  }
  if (!sourced[1] && !FONT_CHOICES.heading.includes(headingFont)) {
    throw new Error(`heading typeface must be one of ${oneOf(FONT_CHOICES.heading)}`);
  }
  const { text: textVariable, heading: headingVariable } = values.fonts;
  const floor = withoutBlock(css);
  const floorText = floorTheme(floor, textVariable);
  if (!floorText && (textFont === "floor" || headingFont === "floor")) {
    throw new Error(
      `the floor's stylesheet names no ${textVariable} to keep: choose the system font`,
    );
  }
  const floorHeading = floorTheme(floor, headingVariable);
  const ofFloor = floorHeading
    ? floorHeading.replace(`var(${textVariable})`, floorText ?? "")
    : floorText;
  const fonts = [textFont, headingFont].map((value, index) =>
    sourced[index] ? sourcedFont(value, context.sources) : null,
  );
  // What loads each chosen font, once, where the build knows how to write it: a font a loader
  // sets under a variable is loaded by that loader, and one that is a package by its own import.
  const faces = [];
  for (const font of new Set(fonts.filter(Boolean))) {
    if (!context.faces || font.variable || !font.pin?.files) continue;
    faces.push(...context.faces(font, context.stylesheet));
  }
  return {
    text: fonts[0] ? sourcedValue(fonts[0]) : textFont === "floor" ? floorText : SYSTEM_FONT,
    heading: fonts[1]
      ? sourcedValue(fonts[1])
      : headingFont === "text"
        ? `var(${textVariable})`
        : headingFont === "floor"
          ? ofFloor
          : SYSTEM_FONT,
    faces,
    // The fonts of the sources ledger the two choices name, each once.
    sources: [...new Set(fonts.filter(Boolean))],
  };
}

// The roles the block writes from its formula, by what each is in a mode. A role that follows one
// of them takes the same value; the table of colour roles says which follow, and the owner's word
// says when.
const FORMULA_ROLES = {
  "--primary": (mode) => mode.primary,
  "--primary-foreground": (mode) => mode.onPrimary,
  "--ring": (mode) => mode.primary,
};

// Each role that follows another, with the value it takes in this mode. `follows` maps a role to
// the role it follows, in the order the block writes them.
function followersOf(follows, mode) {
  return Object.entries(follows ?? {}).map(([role, of]) => {
    if (!FORMULA_ROLES[of]) {
      throw new Error(`${role} follows ${of}, which no formula of the block writes`);
    }
    return { role, color: FORMULA_ROLES[of](mode) };
  });
}

// A brand's own colour as the block writes it: as the owner gave it, the way the repository's
// formatter leaves a colour (hex in small letters, single spaces), so formatting never undoes it.
export const ownWritten = (value) => {
  const text = String(value).trim().replace(/\s+/g, " ");
  return /^#[0-9a-f]+$/i.test(text) ? text.toLowerCase() : text;
};

// The status tones the owner chose, each with its value in this mode: the formula's from the
// closed list of hues, or the brand's own colour where the owner gave one, which must reach the
// threshold on the background as the formula's does. `statusTones` lists the entries of the closed
// list, as the guide copies them; `exceptions` maps a role to its brand colour in each mode.
function tonesOf(inputs, background, min, dark) {
  const mode = dark ? "dark" : "light";
  return (inputs.statusTones ?? []).map((entry) => {
    const own = inputs.exceptions?.[entry.role]?.[mode];
    if (own !== undefined) {
      const color = parseColor(String(own));
      if (!color)
        throw new Error(
          `brand exception ${entry.role} in ${mode} mode must be written as #rrggbb or oklch(L C H)`,
        );
      const ratio = contrast(color, background);
      if (ratio < min) {
        throw new Error(
          `brand exception ${entry.role} in ${mode} mode is ${ratio.toFixed(2)}:1 on --background, below ${min}:1, so nothing is written: the owner gives a colour that reaches it, or lets the formula write the tone`,
        );
      }
      return { role: entry.role, color, own: true, written: ownWritten(own) };
    }
    const tone = { ...entry, light: parseColor(entry.light), dark: parseColor(entry.dark) };
    if (!tone.light || !tone.dark)
      throw new Error(`the ${entry.tone} tone has no colour of the closed list`);
    return { role: entry.role, color: toneColor(tone, background, min, dark) };
  });
}

// Builds the theme from the decided inputs and the backgrounds the repository's own CSS declares.
// `typeScale` and `cornerRadius` are optional: a ledger written before they existed renders as it
// did then, so its generated check still holds. `context` is what a font of the sources ledger is
// read from: see `fontValues`.
export function buildTheme(inputs, css, context = {}) {
  const { sourceColor, conformanceLevel, typeScale, typeRatio, cornerRadius } = inputs;
  const thresholds = THRESHOLDS[conformanceLevel];
  if (!thresholds) throw new Error(`conformance level must be one of ${Object.keys(THRESHOLDS)}`);
  const source = parseColor(String(sourceColor ?? ""));
  if (!source) throw new Error("source color must be written as #rrggbb or oklch(L C H)");
  const floor = withoutBlock(css);
  const modes = Object.keys(FALLBACK_BACKGROUND).map((selector) => {
    const dark = selector !== ":root";
    // The neutral roles first: the primary and the status tones are solved on the background the
    // neutral family writes, where the owner chose one.
    const neutrals =
      inputs.neutralFamily === undefined
        ? null
        : neutralRoles(inputs.neutralFamily, source, thresholds.text, dark);
    const declared = readVariable(floor, selector, "--background");
    const background =
      neutrals?.["--background"] ??
      ((declared && parseColor(declared)) || FALLBACK_BACKGROUND[selector]);
    return {
      selector,
      background,
      neutrals: Object.entries(neutrals ?? {}).map(([role, value]) => ({ role, value })),
      tones: tonesOf(inputs, background, thresholds.text, dark),
      ...solvePrimary(source, background, thresholds.text),
    };
  });
  if (cornerRadius !== undefined && !(cornerRadius in CORNER_RADII)) {
    throw new Error(`corner radius must be one of ${Object.keys(CORNER_RADII)}`);
  }
  if (typeScale !== undefined && !["standard", "modular"].includes(typeScale)) {
    throw new Error("type scale must be standard or modular");
  }
  return {
    palette: tonalPalette(source),
    modes: modes.map((mode) => ({ ...mode, followers: followersOf(inputs.follows, mode) })),
    thresholds,
    radius: cornerRadius === undefined ? null : CORNER_RADII[cornerRadius],
    type: typeScale === "modular" ? modularScale(typeRatio) : null,
    fonts: fontValues(inputs, css, context),
  };
}

// The status roles the floor's own stylesheet already gives the framework's classes.
const FLOOR_TONE_ROLES = ["--destructive"];
// A neutral role as the block writes it: a colour, or a white of a share over the ground.
export const neutralValue = (value) =>
  value.translucent === undefined
    ? formatOklch(value)
    : `oklch(1 0 0 / ${Math.round(value.translucent * 100)}%)`;

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
    for (const follower of mode.followers ?? []) {
      lines.push(`  ${follower.role}: ${formatOklch(follower.color)};`);
    }
    for (const neutral of mode.neutrals ?? []) {
      lines.push(`  ${neutral.role}: ${neutralValue(neutral.value)};`);
    }
    for (const tone of mode.tones ?? []) {
      lines.push(`  ${tone.role}: ${tone.own ? tone.written : formatOklch(tone.color)};`);
    }
    lines.push("}", "");
  });
  lines.pop();
  // A tone the floor has no role for reaches the framework's classes through its theme block.
  const added = (theme.modes[0].tones ?? []).filter(
    (tone) => !FLOOR_TONE_ROLES.includes(tone.role),
  );
  if (added.length > 0) {
    lines.push("", `${values.colors.block} {`);
    for (const tone of added) lines.push(`  ${values.colors.name(tone.role)}: var(${tone.role});`);
    lines.push("}");
  }
  // The typefaces go where the framework reads them, after the floor's own declaration of the same
  // variables: the last declaration is the one in force.
  if (theme.fonts) {
    // What loads a chosen font goes first: a rule of its own, outside every selector.
    for (const face of theme.fonts.faces ?? []) lines.push("", face);
    lines.push(
      "",
      `${values.fonts.block} {`,
      `  ${values.fonts.text}: ${theme.fonts.text};`,
      `  ${values.fonts.heading}: ${theme.fonts.heading};`,
      "}",
    );
  }
  lines.push(END);
  return lines.join("\n");
}

export function applyBlock(css, block) {
  return `${withoutBlock(css).trimEnd()}\n\n${block}\n`;
}
