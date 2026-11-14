// Column types: the kind of data a table column holds, which decides how the column is aligned
// and how wide it is at least. A repository lists its column types in one file a person owns; each
// data field names its type once, in the data model; everything a screen needs is derived here.
// Usage: node tools/design-assembly/columns.mjs [--write] [--target DIR]
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

import { literals, openingTag, parts } from "./components.mjs";
import { lineWidth, renderJson } from "./json.mjs";

// The table a person owns: the repository's column types.
export const TYPES_FILE = "design/column-types.json";
// What is derived from it and from the data model, for code to read.
export const COLUMNS_FILE = "design/columns.json";
const MODEL = "ontology/entities";

// The base types, named as data grids name them, and the side each is aligned to. A number is a
// quantity a person compares down a column, so its digits line up on the right. A date or a phone
// number is made of digits and is not a quantity.
export const BASES = {
  text: "left",
  number: "right",
  date: "left",
  datetime: "left",
  boolean: "left",
  select: "left",
};

const read = (root, file) =>
  existsSync(path.join(root, file)) ? readFileSync(path.join(root, file), "utf8") : null;

// The column type each field of the data model names, as `Entity.property`. A property names it
// with a `display` key, written on one line or on a line of its own under the property.
export function readDisplays(root) {
  const found = {};
  const dir = path.join(root, MODEL);
  if (!existsSync(dir)) return found;
  for (const name of readdirSync(dir).sort()) {
    if (!/^[A-Z]\w*\.ya?ml$/.test(name)) continue;
    const entity = name.replace(/\.ya?ml$/, "");
    let inside = false;
    let property = null;
    for (const line of readFileSync(path.join(dir, name), "utf8").split("\n")) {
      if (/^\S/.test(line)) inside = /^properties:\s*$/.test(line);
      if (!inside) continue;
      const head = /^ {2}(\w+):\s*(.*)$/.exec(line);
      if (head) property = head[1];
      const display = /(?:^ {4,}|[{,]\s*)display:\s*["']?([\w-]+)/.exec(head ? head[2] : line);
      if (display && property) found[`${entity}.${property}`] = display[1];
    }
  }
  return found;
}

// Why the table of column types cannot be used, or null: a list of problems joined in one line.
export function typesProblem(text, displays, file = TYPES_FILE) {
  if (text === null || text === undefined) return `${file} is missing`;
  let table;
  try {
    table = JSON.parse(text);
  } catch {
    return `${file} is not valid JSON`;
  }
  const found = [];
  const types = table.types ?? {};
  if (!Number.isInteger(table.padding_ch) || table.padding_ch < 0) {
    found.push("padding_ch must be a whole number of characters, 0 or more");
  }
  if (Object.keys(types).length === 0) found.push("it lists no column type");
  for (const [name, type] of Object.entries(types)) {
    if (!/^[a-z][a-z0-9-]*$/.test(name)) found.push(`'${name}' is not a lower-case name`);
    if (!(type.base in BASES)) {
      found.push(`${name}: base must be one of ${Object.keys(BASES).join(", ")}`);
    }
    if (!Number.isInteger(type.sample) || type.sample < 1) {
      found.push(`${name}: sample must be a whole number of characters, 1 or more`);
    }
  }
  for (const [field, type] of Object.entries(displays)) {
    if (!(type in types)) found.push(`${field} names '${type}', which is not a column type`);
  }
  return found.length > 0 ? `${file}: ${found.join("; ")}` : null;
}

// What code reads: each column type with the side it is aligned to, and each field with its type.
export function buildColumns(table, displays) {
  const types = {};
  for (const [name, type] of Object.entries(table.types)) {
    types[name] = { base: type.base, align: BASES[type.base], sample: type.sample };
  }
  return { version: 1, padding_ch: table.padding_ch, types, fields: { ...displays } };
}

// Why the derived file is not what the table and the data model give, or null.
export function columnsProblem(text, typesText, displays, file = COLUMNS_FILE) {
  const again = "run make design-columns to write the file again";
  if (typesProblem(typesText, displays)) return null; // said once, by the check on the table
  if (text === null || text === undefined) return `${file} is missing: ${again}`;
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    return `${file} is not valid JSON: ${again}`;
  }
  const expected = buildColumns(JSON.parse(typesText), displays);
  if (JSON.stringify(data) === JSON.stringify(expected)) return null;
  const differs = [];
  for (const group of ["types", "fields"]) {
    const [want, have] = [expected[group], data[group] ?? {}];
    for (const key of new Set([...Object.keys(want), ...Object.keys(have)])) {
      if (JSON.stringify(want[key]) !== JSON.stringify(have[key])) differs.push(key);
    }
  }
  const detail = differs.length > 0 ? ` (${differs.slice(0, 3).join(", ")})` : "";
  return `${file} is not what ${TYPES_FILE} and the data model give${detail}: ${again}`;
}

// What a screen may not write on a table itself, by rule: the element it is written on, the class
// names, and where the value comes from instead.
const RULES = {
  align: {
    on: /^(TableCell|TableHead|TypedCell|TypedHead|td|th)$/,
    classes: /^text-(left|right|center|start|end|justify)$/,
    from: "alignment comes from the column type",
  },
  width: {
    on: /^(TableCell|TableHead|TypedCell|TypedHead|td|th|col)$/,
    classes: /^(w|min-w|max-w|basis)-/,
    from: "width comes from the column type and the header",
  },
  density: {
    on: /^(TableRow|TypedRow|tr)$/,
    classes: /^((h|min-h|max-h)-|text-(xs|sm|base|lg|xl|\dxl)$)/,
    from: "row height comes from the table's density",
  },
};

// Places where a screen sets on a table what the column type decides. `files` is source by path;
// paths under `skip` are the system's own components.
export function cellProblems(files, rule, skip = []) {
  const { on, classes, from } = RULES[rule];
  const found = [];
  for (const [file, text] of Object.entries(files)) {
    if (skip.some((prefix) => file.startsWith(prefix))) continue;
    for (const tag of text.matchAll(/<([A-Za-z][\w.]*)(?=[\s/>])/g)) {
      if (!on.test(tag[1])) continue;
      const written = literals(openingTag(text, tag.index + tag[0].length));
      for (const token of written.split(/\s+/).filter(Boolean)) {
        if (classes.test(parts(token).at(-1).replace(/^!|!$/g, ""))) {
          found.push(`${file}: <${tag[1]}> sets ${token} itself`);
        }
      }
    }
  }
  return found.length > 0 ? `${found.slice(0, 5).join("; ")}: ${from}` : null;
}

function main() {
  const args = argv.slice(2);
  const at = args.indexOf("--target");
  const root = at === -1 ? cwd() : path.resolve(args[at + 1] ?? "");
  const typesText = read(root, TYPES_FILE);
  const displays = readDisplays(root);
  const problem = typesProblem(typesText, displays);
  if (problem) {
    stderr.write(`design-assembly: ${problem}\n`);
    exit(1);
  }
  const fields = Object.keys(displays).length;
  if (columnsProblem(read(root, COLUMNS_FILE), typesText, displays) === null) {
    stdout.write(`column types: ${COLUMNS_FILE} is up to date (${fields} fields)\n`);
    return;
  }
  if (!args.includes("--write")) {
    stderr.write(
      `column types: ${COLUMNS_FILE} is not what ${TYPES_FILE} and the data model give\n`,
    );
    exit(1);
  }
  const full = path.join(root, COLUMNS_FILE);
  mkdirSync(path.dirname(full), { recursive: true });
  writeFileSync(full, renderJson(buildColumns(JSON.parse(typesText), displays), lineWidth(root)));
  stdout.write(`column types: wrote ${COLUMNS_FILE} (${fields} fields)\n`);
}

if (argv[1] && realpathSync(argv[1]) === realpathSync(fileURLToPath(import.meta.url))) main();
