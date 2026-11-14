// Type scale, spacing scale and shape. Pure functions, no dependencies.

// The base size every step is measured from, in CSS pixels: the browser default, which the floor
// keeps as text-base.
export const BASE_PX = 16;
export const SPACING_UNIT_PX = 4;

// The steps the floor's utilities name, with their distance from text-base on the scale.
export const TYPE_STEPS = [
  ["xs", -2],
  ["sm", -1],
  ["base", 0],
  ["lg", 1],
  ["xl", 2],
  ["2xl", 3],
  ["3xl", 4],
  ["4xl", 5],
  ["5xl", 6],
];

// The variables the framework's type scale is made of: a size and a line height per step.
export const TYPE_VARIABLES = TYPE_STEPS.flatMap(([step]) => [
  `--text-${step}`,
  `--text-${step}--line-height`,
]);

// Ratios of a modular scale, named after musical intervals as modular scales name them.
export const RATIOS = {
  "minor-second": 1.067,
  "major-second": 1.125,
  "minor-third": 1.2,
  "major-third": 1.25,
  "perfect-fourth": 1.333,
};

// Line height as a ratio of size: the floor's leading-normal for text-base and below, its
// leading-tight above. Then rounded up to the spacing unit, so lines sit on the 4px grid.
const LEADING = { body: 1.5, heading: 1.25 };

// Corner radius of the floor's --radius. The floor derives every other radius from it.
export const CORNER_RADII = {
  floor: "0.625rem",
  none: "0rem",
  "extra-small": "0.25rem",
  small: "0.5rem",
  medium: "0.75rem",
  large: "1rem",
};

const rem = (px) => `${Number((px / BASE_PX).toFixed(4))}rem`;

// One entry per step: size and line height in pixels, both whole numbers.
export function modularScale(ratioName) {
  const ratio = RATIOS[ratioName];
  if (!ratio) throw new Error(`modular scale ratio must be one of ${Object.keys(RATIOS)}`);
  return TYPE_STEPS.map(([step, power]) => {
    const size = Math.round(BASE_PX * ratio ** power);
    const leading = power <= 0 ? LEADING.body : LEADING.heading;
    const lineHeight = Math.ceil((size * leading) / SPACING_UNIT_PX) * SPACING_UNIT_PX;
    return { step, size, lineHeight };
  });
}

// The declarations for a modular scale, the way the framework's own theme writes a line height.
export function typeDeclarations(scale) {
  return scale.flatMap(({ step, size, lineHeight }) => [
    `--text-${step}: ${rem(size)};`,
    `--text-${step}--line-height: calc(${lineHeight} / ${size});`,
  ]);
}

// Reads a length in rem or px as pixels. Returns null for anything else.
export function toPx(text) {
  const match = /^\s*(-?[\d.]+)(rem|px)\s*$/.exec(text ?? "");
  if (!match) return null;
  return Number(match[1]) * (match[2] === "rem" ? BASE_PX : 1);
}

// Reads `calc(a / b)` or a plain number as a ratio. Returns null for anything else.
export function toRatio(text) {
  const value = (text ?? "").trim();
  const calc = /^calc\(\s*([\d.]+)\s*\/\s*([\d.]+)\s*\)$/.exec(value);
  if (calc) return Number(calc[1]) / Number(calc[2]);
  return /^[\d.]+$/.test(value) ? Number(value) : null;
}
