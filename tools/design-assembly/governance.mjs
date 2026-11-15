// Rules about the system itself, read from source: which part of the code may import which, and
// the record of what slipped past the checks.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

import { LAYERS } from "./ledger.mjs";
import { globPattern, KINDS_FOLDER, ofAKind } from "./screens.mjs";

// The file a person owns: the parts of the code, listed from the top down. A file is of the first
// part that names it, and imports only its own part and the parts listed after it.
export const PARTS_FILE = "design/parts.json";
// The file a person owns: one line per fault that every check let through.
export const SLIPS_FILE = "design/escapes.md";
export const SOURCE_FOLDER = "src";

const SOURCE = /\.(?:[cm]?[jt]sx?)$/;

// Every source file of a folder, by path: screens, components and plain modules alike.
export function readSources(root, folder = SOURCE_FOLDER) {
  const found = {};
  const walk = (dir) => {
    const full = path.join(root, dir);
    if (!existsSync(full)) return;
    for (const name of readdirSync(full).sort()) {
      const relative = path.posix.join(dir, name);
      if (statSync(path.join(root, relative)).isDirectory()) walk(relative);
      else if (SOURCE.test(name) && !name.endsWith(".d.ts")) {
        found[relative] = readFileSync(path.join(root, relative), "utf8");
      }
    }
  };
  walk(folder);
  return found;
}

// The parts a repository would start from: the files that start the application, the screens its
// pages of kinds name, its components, and everything else underneath.
export function starterParts(componentsFolder) {
  // The repository's own components, shared by its screens, live beside the component library:
  // above it, below the screens. Where the library has no folder around it there is no such place.
  const around = path.posix.dirname(componentsFolder);
  const shared =
    around !== SOURCE_FOLDER && around !== "."
      ? [{ name: "shared", files: [`${around}/**`], except: [`${componentsFolder}/**`] }]
      : [];
  return {
    version: 1,
    parts: [
      { name: "app", files: [`${SOURCE_FOLDER}/*.ts`, `${SOURCE_FOLDER}/*.tsx`] },
      { name: "screens", kinds: KINDS_FOLDER },
      ...shared,
      { name: "components", files: [`${componentsFolder}/**`] },
      { name: "base", files: [`${SOURCE_FOLDER}/**`] },
    ],
  };
}

const withoutComments = (text) =>
  text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

// The modules a file imports, as written: `from "x"`, `import "x"` and `import("x")`.
export function importsOf(text) {
  const code = withoutComments(text);
  const found = new Set();
  const forms = [
    /\bfrom\s*["']([^"']+)["']/g,
    /\bimport\s*["']([^"']+)["']/g,
    /\bimport\(\s*["']([^"']+)["']\s*\)/g,
  ];
  for (const form of forms) for (const match of code.matchAll(form)) found.add(match[1]);
  return [...found];
}

// The source file an import names, or null when it names a package or something outside the
// sources read.
function resolveImport(from, name, sources) {
  let base;
  if (name.startsWith("@/")) base = `${SOURCE_FOLDER}/${name.slice(2)}`;
  else if (name.startsWith(".")) base = path.posix.join(path.posix.dirname(from), name);
  else return null;
  const endings = [
    "",
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
    ".mjs",
    "/index.ts",
    "/index.tsx",
    "/index.js",
  ];
  return endings.map((ending) => `${base}${ending}`).find((file) => file in sources) ?? null;
}

function readParts(partsText, file) {
  if (partsText === null || partsText === undefined) return { problem: `${file} is missing` };
  let parts;
  try {
    parts = JSON.parse(partsText).parts;
  } catch {
    return { problem: `${file} is not valid JSON` };
  }
  if (!Array.isArray(parts) || parts.length < 2) {
    return { problem: `${file} lists fewer than two parts, so no direction is measured` };
  }
  const names = parts.map((part) => part?.name);
  if (names.some((name) => typeof name !== "string" || name === "")) {
    return { problem: `${file}: every part has a name` };
  }
  if (new Set(names).size !== names.length) return { problem: `${file} names a part twice` };
  const empty = parts.find((part) => !Array.isArray(part.files) && typeof part.kinds !== "string");
  if (empty) return { problem: `${file}: ${empty.name} names no files and no kinds of screen` };
  return { parts };
}

// The index of the part each source file is of: the first part that names it.
export function partOf(parts, sources, pages) {
  const isScreen = ofAKind(pages);
  const tests = parts.map((part) => {
    const patterns = (part.files ?? []).map(globPattern);
    // `except` leaves out what another part owns inside the same folder.
    const left = (part.except ?? []).map(globPattern);
    return (file) =>
      (patterns.some((pattern) => pattern.test(file)) &&
        !left.some((pattern) => pattern.test(file))) ||
      (Boolean(part.kinds) && isScreen(file));
  });
  return Object.fromEntries(
    Object.keys(sources).map((file) => [file, tests.findIndex((test) => test(file))]),
  );
}

// Why the code does not keep the direction its parts are listed in, or null.
export function importsProblem(partsText, sources, pages, file = PARTS_FILE) {
  const { parts, problem } = readParts(partsText, file);
  if (problem) return problem;
  const of = partOf(parts, sources, pages);
  const none = Object.keys(of).filter((source) => of[source] === -1);
  if (none.length > 0) {
    return `${none.slice(0, 5).join(", ")} ${none.length === 1 ? "is" : "are"} of no part: add ${none.length === 1 ? "it" : "them"} to a part of ${file}`;
  }
  if (new Set(Object.values(of)).size < 2) {
    return `fewer than two parts of ${file} have files, so no direction is measured`;
  }
  const found = [];
  for (const [source, text] of Object.entries(sources)) {
    for (const name of importsOf(text)) {
      const target = resolveImport(source, name, sources);
      if (target === null || of[target] >= of[source]) continue;
      found.push(
        `${source} (${parts[of[source]].name}) imports ${target} (${parts[of[target]].name})`,
      );
    }
  }
  if (found.length === 0) return null;
  return `${found.slice(0, 5).join("; ")}: a part imports only itself and the parts listed after it in ${file}. Move what is shared down, or hand it in from above`;
}

// The same sources with one import that goes against the direction: the lowest part that has a
// file imports a file of the highest.
export function againstDirection(partsText, sources, pages) {
  const { parts } = readParts(partsText, PARTS_FILE);
  if (!parts) return sources;
  const of = partOf(parts, sources, pages);
  const files = Object.keys(sources).filter((file) => of[file] !== -1);
  if (files.length === 0) return sources;
  const by = (pick) => files.reduce((a, b) => (pick(of[b], of[a]) ? b : a));
  const top = by((a, b) => a < b);
  const bottom = by((a, b) => a > b);
  const name = path.posix.relative(path.posix.dirname(bottom), top);
  const written = name.startsWith(".") ? name : `./${name}`;
  return { ...sources, [bottom]: `${sources[bottom]}\nimport "${written}";\n` };
}

// The lines of the record: every row of its table after the heading row.
export function readSlips(text) {
  const rows = (text ?? "").split(/\r?\n/).filter((line) => /^\s*\|/.test(line));
  return rows
    .slice(1)
    .filter((line) => !/^\s*\|[\s:|-]+\|\s*$/.test(line))
    .map((line) =>
      line
        .trim()
        .replace(/^\||\|$/g, "")
        .split(/(?<!\\)\|/)
        .map((cell) => cell.trim()),
    );
}

// Why the record of what slipped past the checks is not one a person can act on, or null. Each
// line says when, what slipped, which layer should have caught it, and what was done about it.
export function slipsProblem(text, file = SLIPS_FILE, layers = LAYERS) {
  if (text === null || text === undefined) return `${file} is missing`;
  if (!/^\s*\|/m.test(text)) return `${file} has no table to write a line in`;
  const found = [];
  readSlips(text).forEach((cells, index) => {
    const [date = "", what = "", layer = "", done = ""] = cells;
    const line = `${file}, line ${index + 1} of the table`;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) found.push(`${line}: no date written as YYYY-MM-DD`);
    else if (what === "") found.push(`${line}: does not say what slipped`);
    else if (!layers.some((name) => new RegExp(`(^|[^\\w-])${name}([^\\w-]|$)`).test(layer))) {
      found.push(
        `${line}: names no layer that should have caught it (one of ${layers.join(", ")})`,
      );
    } else if (done === "") found.push(`${line}: does not say what was done`);
  });
  return found.length > 0 ? found.slice(0, 5).join("; ") : null;
}
