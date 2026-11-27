// AC-3: the bundle says what its sources say — every colour role of design/tokens.json with its light
// value and its dark value (worked out from the source's CSS by colour.mjs, within 2 of 255), in the list shape Claude Design reads; the typefaces the stylesheet loads;
// the corner radius steps and the spacing unit; and every component of the component manifest.
// DESIGN.md gives the same light colours. Usage: node bundle.mjs [--root <repository or a copy>]
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { parseColour, sameColour } from "./colour.mjs";
import { derive, head, option, report, ROOT, workClone } from "./lib.mjs";
import {
  COLOURS,
  COMPONENTS,
  FAMILIES,
  LAYOUT,
  LOADED_BY,
  REGISTRY,
  REM,
  SOURCE_TOKENS,
  SPACING_UNIT,
  STYLESHEET,
  THEMES,
} from "./matrix.mjs";

const root = path.resolve(option("--root", ROOT));
const found = [];
const read = (rel) => readFileSync(path.join(root, rel), "utf8");
const json = (rel) => JSON.parse(read(rel));
const hex = /^#[0-9a-f]{6}(?:[0-9a-f]{2})?$/i;

const source = json(SOURCE_TOKENS);
const tokens = json("design/export/system/tokens.json");
const assets = json("design/export/system/assets.json");

// Colours: the list shape, both themes, every role, its light value, a dark value, a use.
const themes = (tokens.color?.themes ?? []).map((t) => t.id);
if (JSON.stringify(themes) !== JSON.stringify(THEMES)) found.push(`the colour themes are ${JSON.stringify(themes)}, not ${JSON.stringify(THEMES)}`);
const list = Array.isArray(tokens.color?.tokens) ? tokens.color.tokens : [];
if (!Array.isArray(tokens.color?.tokens)) found.push("the colours are not a list of tokens");
const roles = Object.keys(source.color ?? {}).sort();
const names = list.map((t) => t.name).sort();
if (roles.length !== COLOURS) found.push(`${SOURCE_TOKENS} has ${roles.length} colour roles, not ${COLOURS}`);
for (const role of roles) if (!names.includes(role)) found.push(`the bundle has no colour ${role}`);
for (const name of names) if (!roles.includes(name)) found.push(`the bundle has a colour ${name} that ${SOURCE_TOKENS} has not`);
for (const t of list) {
  const want = source.color?.[t.name]?.$value;
  if (want && t.value?.light !== want) found.push(`colour ${t.name} is ${t.value?.light} in the light theme, not ${want}`);
  const darkSource = source.color?.[t.name]?.$extensions?.["design-assembly"]?.dark ?? want;
  if (!hex.test(t.value?.dark ?? "")) found.push(`colour ${t.name} has no dark value`);
  else if (darkSource && !sameColour(parseColour(t.value.dark), parseColour(darkSource))) {
    found.push(`colour ${t.name} is ${t.value.dark} in the dark theme, not ${darkSource}`);
  }
  if (!String(t.usage ?? "").trim()) found.push(`colour ${t.name} says no use`);
}
// DESIGN.md gives the same light colours.
const design = read("DESIGN.md");
for (const role of roles) {
  const at = design.match(new RegExp(`^  ${role}: "([^"]*)"$`, "m"))?.[1];
  if (at !== source.color[role].$value) found.push(`DESIGN.md gives ${role} as ${at ?? "nothing"}, not ${source.color[role].$value}`);
}

// Typefaces, from their source: the next/font/google loaders of src/app/layout.tsx give a family to a
// CSS variable; the stylesheet maps --font-<key> to one of those variables. «Roboto_Mono» is «Roboto Mono».
const layout = read(LAYOUT);
const stylesheet = read(STYLESHEET);
const loaded = {};
for (const imp of layout.matchAll(/import\s*\{([^}]*)\}\s*from\s*["']next\/font\/google["']/g)) {
  for (const name of imp[1].split(",").map((n) => n.trim().split(/\s+as\s+/).at(-1)).filter(Boolean)) {
    for (const call of layout.matchAll(new RegExp(`\\b${name}\\(\\s*\\{[^}]*variable:\\s*["'](--[\\w-]+)["']`, "g"))) {
      loaded[call[1]] = name.replaceAll("_", " ");
    }
  }
}
const sourceFamily = (key) => {
  let variable = `--font-${key}`;
  for (let hops = 0; hops < 4; hops += 1) {
    if (loaded[variable]) return loaded[variable];
    const next = stylesheet.match(new RegExp(`${variable}:\\s*var\\((--[\\w-]+)\\)`))?.[1];
    if (!next || next === variable) break;
    variable = next;
  }
  return loaded[variable] ?? null;
};
for (const key of Object.keys(FAMILIES)) {
  const fromSource = sourceFamily(key);
  if (fromSource !== FAMILIES[key]) found.push(`${LAYOUT} loads ${fromSource ?? "no family"} for the ${key} family, not ${FAMILIES[key]}`);
  const inBundle = String(tokens.type?.families?.[key] ?? "").replaceAll('"', "").split(",")[0].trim();
  if (fromSource && inBundle !== fromSource) found.push(`the bundle gives the ${key} family as «${inBundle}», its source loads ${fromSource}`);
}
// Typefaces: the families, and what loads them.
for (const [key, family] of Object.entries(FAMILIES)) {
  if (!String(tokens.type?.families?.[key] ?? "").includes(family)) found.push(`the ${key} family is «${tokens.type?.families?.[key] ?? ""}», not ${family}`);
  const face = (assets.typefaces ?? []).find((f) => f.key === key);
  if (face?.family !== family || face?.loaded_by !== LOADED_BY) found.push(`assets.json does not say the ${key} typeface is ${family}, loaded by ${LOADED_BY}`);
}

// Corner radius steps from the source, in pixels; and the spacing unit.
const px = (rem) => `${Number.parseFloat(rem) * REM}px`;
for (const [step, { $value }] of Object.entries(source.radius ?? {})) {
  const got = (tokens.radius?.tokens ?? []).find((t) => t.name === `radius-${step}`)?.value;
  if (got !== px($value)) found.push(`radius-${step} is ${got ?? "missing"}, not ${px($value)} (${$value})`);
}
const unit = (tokens.spacing?.tokens ?? []).find((t) => t.name === "spacing-unit")?.value;
if (unit !== SPACING_UNIT) found.push(`the spacing unit is ${unit ?? "missing"}, not ${SPACING_UNIT}`);
// The spacing unit's source: the stylesheet's own --spacing when it sets one, else Tailwind's theme.
const spacingOf = (css) => css.match(/--spacing:\s*([\d.]+)rem\s*;/)?.[1];
const ownSpacing = spacingOf(stylesheet);
const twTheme = path.join(root, "node_modules/tailwindcss/theme.css");
const spacingRem = ownSpacing ?? (existsSync(twTheme) ? spacingOf(readFileSync(twTheme, "utf8")) : undefined);
if (!spacingRem) found.push(`no source gives the spacing unit (${STYLESHEET} sets no --spacing and Tailwind's theme.css is not there)`);
else if (unit !== px(`${spacingRem}rem`)) found.push(`the spacing unit is ${unit ?? "missing"}, its source gives ${px(`${spacingRem}rem`)} (${spacingRem}rem)`);

// Components: the manifest's, each once. The manifest is kept out of git: write it when absent.
let registryRoot = root;
let clone = null;
if (!existsSync(path.join(root, REGISTRY))) {
  clone = workClone(root);
  derive(clone.dir);
  registryRoot = clone.dir;
}
try {
  const registry = JSON.parse(readFileSync(path.join(registryRoot, REGISTRY), "utf8")).components.map((c) => `${c.name} ${c.file}`).sort();
  const listed = [...read("design/export/system/components.md").matchAll(/^- \*\*([^*]+)\*\* \([^)]*\), `([^`]+)`/gm)].map((m) => `${m[1]} ${m[2]}`).sort();
  if (registry.length !== COMPONENTS) found.push(`the component manifest has ${registry.length} components, not ${COMPONENTS}`);
  for (const c of registry) if (!listed.includes(c)) found.push(`components.md does not list ${c}`);
  for (const c of listed) if (!registry.includes(c)) found.push(`components.md lists ${c}, which the manifest has not`);
} finally {
  clone?.remove();
}
report(
  "bundle",
  found,
  `the bundle gives ${COLOURS} colours in both themes, the typefaces, ${Object.keys(source.radius ?? {}).length} radius steps, the spacing unit and ${COMPONENTS} components, as their sources do (at ${head(root).slice(0, 12)})`,
);
