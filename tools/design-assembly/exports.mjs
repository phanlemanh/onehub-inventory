// The exports of the design ledgers, for tools that do not read them (specification 0014, the
// bridge out): a DESIGN.md, and a design system bundle of a README, tokens of both themes, the
// components and the assets. Each is written from the ledgers and carries the stamp of the state
// they were in; the gate goes red when a ledger changes and an export is not written again. The
// ledgers stay where a value is changed: an export is never read back as one.
// Usage: node tools/design-assembly/exports.mjs --write [--target DIR]
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  realpathSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { argv, cwd, exit, stderr, stdout } from "node:process";
import { fileURLToPath } from "node:url";

import { tokenHex } from "./color.mjs";
import { regenerated } from "./components.mjs";
import { BASE_PX, CORNER_RADII } from "./scale.mjs";

export const DESIGN_MD = "DESIGN.md";
export const SYSTEM_FOLDER = "design/export/system";
export const SYSTEM_PARTS = ["README.md", "tokens.json", "components.md", "assets.json"];
export const EXPORTS_DECISION = "design-exports";
const SOURCES = {
  tokens: "design/tokens.json",
  blueprint: "design/blueprint.json",
  registry: "design/component-registry.json",
  sources: "design/sources",
  theme: "design/theme.json",
};
const AGAIN = "write it again with make design-exports";
const STAMP = /written from the design ledgers at ([0-9a-f]{12})/i;
const OWNER = "design-assembly";
// The steps of the type scale from which a size is a heading's.
const HEADING_STEPS = ["xl", "2xl", "3xl", "4xl", "5xl"];
const SECTIONS = ["Overview", "Colors", "Typography", "Layout", "Shapes", "Do's and Don'ts"];

const parse = (text) => {
  try {
    return text === null || text === undefined ? null : JSON.parse(text);
  } catch {
    return null;
  }
};
const px = (value) => {
  const found = /^(-?\d*\.?\d+)(px|rem)$/.exec(String(value).trim());
  if (!found) return null;
  return Number((Number(found[1]) * (found[2] === "rem" ? BASE_PX : 1)).toFixed(4));
};
const quoted = (text) => JSON.stringify(String(text));
// A key of the front matter: as it is where YAML reads it as itself, else quoted.
const yamlKey = (text) =>
  /^[A-Za-z0-9_][A-Za-z0-9_-]*$/.test(String(text)) ? String(text) : quoted(text);
// A text set in Markdown as itself: the characters that mark text inside a line are escaped.
const markdown = (text) => String(text).replace(/[\\`*_[\]<>]/g, "\\$&");
// A path set in Markdown as itself: a code span, wide enough for any backtick inside it.
const codeSpan = (text) => {
  const ticks = "`".repeat(
    Math.max(0, ...[...String(text).matchAll(/`+/g)].map((run) => run[0].length)) + 1,
  );
  return `${ticks}${ticks.length > 1 ? " " : ""}${text}${ticks.length > 1 ? " " : ""}${ticks}`;
};

// ---- what an export is made from ----------------------------------------------------------------

// The inputs of every export, as data: the tokens file, the blueprint, the inputs of the tool data,
// the component manifest and the sources, each read as the data it holds.
export function inputsOf({ files, theme, sources }) {
  return {
    tokens: parse(files[SOURCES.tokens]),
    blueprint: parse(files[SOURCES.blueprint]),
    inputs: theme?.inputs ?? {},
    registry: parse(files[SOURCES.registry]),
    sources: Object.entries(sources ?? {})
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, text]) => parse(text))
      .filter(Boolean),
  };
}

// The state of the ledgers the exports are written from: a hash of their data, so a file laid out
// again by a formatter is the same state.
export const stampOf = (inputs) =>
  createHash("sha256").update(JSON.stringify(inputs)).digest("hex").slice(0, 12);

// The stamp a written export carries, or null.
export const stampIn = (text) => STAMP.exec(String(text ?? ""))?.[1] ?? null;

// The colours of the tokens, light and dark, and the roles that follow another.
function coloursOf({ tokens, inputs }) {
  const follows = Object.fromEntries(
    Object.entries(inputs.follows ?? {}).map(([role, other]) => [role.slice(2), other.slice(2)]),
  );
  const roles = Object.entries(tokens?.color ?? {}).sort(([a], [b]) => a.localeCompare(b));
  const dark = (token) => tokenHex(token.$extensions?.[OWNER]?.dark ?? "") ?? token.$value;
  return {
    light: roles.map(([role, token]) => [role, follows[role] ?? null, token.$value]),
    dark: roles.map(([role, token]) => [role, follows[role] ?? null, dark(token)]),
  };
}

// The sizes of the type scale in pixels, the families, the corner radii and the spacing unit.
function shapeOf({ tokens, inputs, blueprint }) {
  const sizes = Object.entries(tokens?.text ?? {}).map(([step, token]) => [step, px(token.$value)]);
  const radii = Object.entries(tokens?.radius ?? {}).map(([step, token]) => [
    step,
    px(token.$value),
  ]);
  const base = px(CORNER_RADII[inputs.cornerRadius] ?? CORNER_RADII.floor);
  const kept = radii.filter(([, size]) => size !== null);
  return {
    sizes: sizes.filter(([, size]) => size !== null),
    // The base corner first, unless the tokens name a step base of their own.
    radii: kept.some(([step]) => step === "base") ? kept : [["base", base], ...kept],
    text: tokens?.font?.sans?.$value ?? null,
    heading: tokens?.font?.heading?.$value ?? tokens?.font?.sans?.$value ?? null,
    unit: blueprint?.layers?.foundations?.choice?.spacing_unit ?? "4px",
  };
}

// ---- the DESIGN.md ------------------------------------------------------------------------------

const yamlColours = (rows, indent, prefix) =>
  rows.map(
    ([role, follows, value]) =>
      `${indent}${yamlKey(role)}: ${quoted(follows ? `{${prefix}${follows}}` : value)}`,
  );

// The front matter: name, the stamp, colours of both themes, the type scale, corners and spacing.
function frontMatter(inputs, name, stamp) {
  const colours = coloursOf(inputs);
  const shape = shapeOf(inputs);
  const family = (step) => (HEADING_STEPS.includes(step) ? shape.heading : shape.text);
  return [
    "---",
    "version: alpha",
    `name: ${quoted(name)}`,
    `description: ${quoted(`The design system of ${name}, written from the design ledgers at ${stamp}. Do not change it here: change a ledger, then ${AGAIN}.`)}`,
    "colors:",
    ...yamlColours(colours.light, "  ", "colors."),
    "  dark:",
    ...yamlColours(colours.dark, "    ", "colors.dark."),
    "typography:",
    ...shape.sizes.flatMap(([step, size]) => [
      `  ${yamlKey(step)}:`,
      ...(family(step) ? [`    fontFamily: ${quoted(family(step))}`] : []),
      `    fontSize: ${size}px`,
    ]),
    "rounded:",
    ...shape.radii.map(([step, size]) => `  ${yamlKey(step)}: ${size}px`),
    "spacing:",
    `  unit: ${quoted(shape.unit)}`,
    "---",
  ];
}

// The sections after the front matter, in the order the specification fixes.
function sectionsOf(inputs, name, stamp) {
  const context = inputs.blueprint?.layers?.context ?? {};
  const principles = (Array.isArray(context.principles) ? context.principles : [])
    .map((item) => item?.statement ?? item?.name)
    .filter(Boolean);
  const followed = Object.entries(inputs.inputs.follows ?? {});
  const shape = shapeOf(inputs);
  return [
    "## Overview",
    "",
    `The design system of ${name}, as its design ledgers hold it at ${stamp}. Product type: ${context.choice?.product_type ?? "not decided"}; conformance level: ${context.choice?.conformance_level ?? "not decided"}.`,
    ...(principles.length > 0 ? ["", ...principles.map((item) => `- ${item}`)] : []),
    "",
    "## Colors",
    "",
    "Each role is written light at the top and dark under `dark`. A role that follows another is written as a reference to it, so a change to the one reaches the other.",
    ...(followed.length > 0
      ? [
          "",
          ...followed.map(
            ([role, other]) => `- \`${role.slice(2)}\` follows \`${other.slice(2)}\``,
          ),
        ]
      : []),
    "",
    "## Typography",
    "",
    `Running text is set in ${shape.text ?? "the floor's font"}, headings in ${shape.heading ?? "the same"}. The scale is ${inputs.inputs.typeScale ?? "standard"}.`,
    "",
    "## Layout",
    "",
    `Every distance is a multiple of the spacing unit, ${shape.unit}.`,
    "",
    "## Shapes",
    "",
    `The base corner radius is ${shape.radii[0][1]}px; the other steps derive from it.`,
    "",
    "## Do's and Don'ts",
    "",
    "- Do take every colour, size and corner from these tokens.",
    "- Don't write a value these tokens do not hold: ask the owner of the ledgers for a decision.",
    "",
  ];
}

// The DESIGN.md of the ledgers.
export function designMd(inputs, name) {
  const stamp = stampOf(inputs);
  return [...frontMatter(inputs, name, stamp), "", ...sectionsOf(inputs, name, stamp)].join("\n");
}

// What a DESIGN.md says wrongly for its specification, one line each: front matter, a primary
// colour, references that resolve, the sections in their order.
export function designMdProblems(text, file = DESIGN_MD) {
  const front = /^---\n([\s\S]*?)\n---\n/.exec(text);
  if (!front) return [`${file}: it has no front matter between two lines of ---`];
  const found = [];
  const paths = new Map();
  const stack = [];
  for (const line of front[1].split("\n")) {
    const entry = /^( *)("(?:[^"\\]|\\.)*"|[^:#"]+):\s*(.*)$/.exec(line);
    if (!entry) continue;
    const depth = entry[1].length / 2;
    stack.length = depth;
    stack[depth] = entry[2].startsWith('"') ? JSON.parse(entry[2]) : entry[2].trim();
    if (entry[3] !== "") {
      paths.set(stack.join("."), /^".*"$/.test(entry[3]) ? JSON.parse(entry[3]) : entry[3]);
    }
  }
  if (!paths.has("colors.primary")) found.push(`${file}: its colours have no primary`);
  for (const [key, value] of paths) {
    const reference = /^\{(.+)\}$/.exec(value)?.[1];
    if (reference && !paths.has(reference)) {
      found.push(`${file}: ${key} refers to {${reference}}, which is no token`);
    }
  }
  const headings = [...text.matchAll(/^## (.+)$/gm)].map((match) => match[1]);
  const order = headings.map((heading) => SECTIONS.indexOf(heading));
  if (order.some((at, index) => at === -1 || (index > 0 && at < order[index - 1]))) {
    found.push(`${file}: its sections are not ${SECTIONS.join(", ")}, in that order`);
  }
  return found;
}

// ---- the system bundle ---------------------------------------------------------------------------

const token = (type, value) => ({ $type: type, $value: value });
const colourTokens = (rows, prefix) =>
  Object.fromEntries(
    rows.map(([role, follows, value]) => [
      role,
      token("color", follows ? `{${prefix}${follows}}` : value),
    ]),
  );

// The tokens of the bundle: colours of both themes, the dark ones under `color.dark`, the type scale
// and its families, the corners and the spacing unit.
function systemTokens(inputs, stamp) {
  const colours = coloursOf(inputs);
  const shape = shapeOf(inputs);
  return {
    $description: `Written from the design ledgers at ${stamp}. Do not change it here: change a ledger, then ${AGAIN}.`,
    color: {
      ...colourTokens(colours.light, "color."),
      dark: colourTokens(colours.dark, "color.dark."),
    },
    font: {
      family: {
        ...(shape.text ? { body: token("fontFamily", shape.text) } : {}),
        ...(shape.heading ? { heading: token("fontFamily", shape.heading) } : {}),
      },
      size: Object.fromEntries(
        shape.sizes.map(([step, size]) => [step, token("dimension", `${size}px`)]),
      ),
    },
    radius: Object.fromEntries(
      shape.radii.map(([step, size]) => [step, token("dimension", `${size}px`)]),
    ),
    spacing: { unit: token("dimension", shape.unit) },
  };
}

// The files of the bundle, by their name in its folder.
export function systemBundle(inputs, name) {
  const stamp = stampOf(inputs);
  const components = Array.isArray(inputs.registry?.components) ? inputs.registry.components : [];
  const line = `Written from the design ledgers at ${stamp}. Do not change it here: change a ledger, then ${AGAIN}.`;
  return {
    "README.md": [
      `# ${name}`,
      "",
      line,
      "",
      "- `tokens.json`: colours of both themes (dark under `color.dark`), type, corners and spacing.",
      "- `components.md`: the components of the product, from its component manifest, listed and not drawn.",
      "- `assets.json`: the fonts of its sources ledger, each with its pin and licence.",
      "",
    ].join("\n"),
    "tokens.json": `${JSON.stringify(systemTokens(inputs, stamp), null, 2)}\n`,
    "components.md": [
      "# Components",
      "",
      line,
      "",
      ...components.map(
        (item) =>
          `- **${markdown(item.name)}** (${markdown(item.level ?? item.category ?? "component")}), ${codeSpan(item.file)}${Array.isArray(item.props) && item.props.length > 0 ? `: ${item.props.map(markdown).join(", ")}` : ""}`,
      ),
      "",
    ].join("\n"),
    "assets.json": `${JSON.stringify(
      {
        $description: line,
        fonts: inputs.sources
          .filter((source) => source.kind === "font")
          .map(({ id, family, pin, licence }) => ({
            id,
            family,
            pin: pin ?? null,
            licence: licence ?? null,
          })),
      },
      null,
      2,
    )}\n`,
  };
}

// Every export file of a repository's exports, by its path, with its text.
export function exportFiles(inputs, name) {
  return {
    [DESIGN_MD]: `${designMd(inputs, name)}`,
    ...Object.fromEntries(
      Object.entries(systemBundle(inputs, name)).map(([part, text]) => [
        `${SYSTEM_FOLDER}/${part}`,
        text,
      ]),
    ),
  };
}

// A text with its whitespace taken out: a document a formatter laid out again is the same document.
const bare = (text) => String(text).replace(/\s+/g, "");

// Why one export file is not what the ledgers give, or null: written from another state of the
// ledgers (its stamp says which), or changed by hand. A document is compared without its
// whitespace, so a formatter may lay it out again; a data file is compared by its data.
export function exportProblem(inputs, name, file, text) {
  if (text === null || text === undefined) return `${file} is missing: ${AGAIN}`;
  const expected = exportFiles(inputs, name)[file];
  if (expected === undefined) return `${file} is no export of the design ledgers`;
  const now = stampOf(inputs);
  const was = stampIn(text);
  if (was !== now) {
    return `${file} was written from the design ledgers at ${was ?? "no stamp"}; they are now at ${now}: ${AGAIN}`;
  }
  const same = file.endsWith(".json")
    ? JSON.stringify(parse(text)) === JSON.stringify(parse(expected))
    : bare(text) === bare(expected);
  return same
    ? null
    : `${file} differs from what the design ledgers give: it was changed by hand; ${AGAIN}`;
}

// The exports the tool data does not hold, one line each: every export is held by a check of its
// own, so none can be dropped from the gate while the others stay.
export function unlistedProblems(listed) {
  return Object.keys(exportFiles(EMPTY_INPUTS, ""))
    .filter((file) => !listed.includes(file))
    .map(
      (file) =>
        `${file} is an export the tool data does not hold: write the exports again with the plugin's bring-out`,
    );
}
const EMPTY_INPUTS = { tokens: null, blueprint: null, inputs: {}, registry: null, sources: [] };

// ---- on disk ------------------------------------------------------------------------------------

// The manifest the source gives, or null; tool data that cannot be read gives none here, and the
// command that needs it says why.
function derivedManifest(root) {
  try {
    return regenerated(root);
  } catch {
    return null;
  }
}

// The files with the component manifest in them: the one on disk, or, where it is not written yet
// (it is a derived file a repository may keep out of git, written by the gate), the one the source
// gives, so the exports are the same on a clean clone as after the gate ran.
export function withManifest(root, files) {
  if (files[SOURCES.registry] !== null && files[SOURCES.registry] !== undefined) return files;
  const made = derivedManifest(root);
  return { ...files, [SOURCES.registry]: made ? made.content : null };
}

// The inputs of a repository, read from disk; `files` has texts, by path, that stand in for what is
// on disk, for a command about to write them.
export function readInputs(root, files = {}) {
  const read = (file) =>
    file in files
      ? files[file]
      : existsSync(path.join(root, file))
        ? readFileSync(path.join(root, file), "utf8")
        : null;
  const folder = path.join(root, SOURCES.sources);
  const names = [
    ...(existsSync(folder) ? readdirSync(folder).map((name) => `${SOURCES.sources}/${name}`) : []),
    ...Object.keys(files).filter((file) => file.startsWith(`${SOURCES.sources}/`)),
  ];
  const sources = Object.fromEntries(
    [...new Set(names)].filter((file) => file.endsWith(".json")).map((file) => [file, read(file)]),
  );
  return inputsOf({
    files: withManifest(
      root,
      Object.fromEntries(
        [SOURCES.tokens, SOURCES.blueprint, SOURCES.registry].map((file) => [file, read(file)]),
      ),
    ),
    theme: parse(read(SOURCES.theme)),
    sources,
  });
}

// The name the tool data gives the exports, or null when it holds none.
export function exportsName(theme) {
  return (
    (theme?.checks?.[EXPORTS_DECISION] ?? []).find((check) => check.kind === "export")?.name ?? null
  );
}

function main() {
  const args = argv.slice(2);
  if (!args.includes("--write")) {
    stderr.write("usage: node tools/design-assembly/exports.mjs --write [--target DIR]\n");
    exit(2);
  }
  const at = args.indexOf("--target");
  if (at !== -1 && (args[at + 1] === undefined || args[at + 1].startsWith("--"))) {
    stderr.write("usage: node tools/design-assembly/exports.mjs --write [--target DIR]\n");
    exit(2);
  }
  const root = path.resolve(at === -1 ? cwd() : args[at + 1]);
  const theme = parse(
    existsSync(path.join(root, SOURCES.theme))
      ? readFileSync(path.join(root, SOURCES.theme), "utf8")
      : null,
  );
  const name = exportsName(theme);
  if (!name) {
    stderr.write(
      `design-assembly: ${SOURCES.theme} names no exports; write them first with the plugin's bring-out\n`,
    );
    exit(2);
  }
  for (const [file, text] of Object.entries(exportFiles(readInputs(root), name))) {
    mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    writeFileSync(path.join(root, file), text);
    stdout.write(`wrote ${file}\n`);
  }
}

if (argv[1] && realpathSync(argv[1]) === realpathSync(fileURLToPath(import.meta.url))) main();
