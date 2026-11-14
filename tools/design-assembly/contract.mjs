// The contract of a repository's design: the ledgers, each with one shape that every tool reading
// it can rely on. This file is the only statement of those shapes; `references/contract.md` says
// the same in words for a person, and a test keeps the two in step.
//
// A shape is checked as data. Its `version` says which shape a file has: a reader of shape N reads
// every file of shape N or older, and a writer that finds a newer shape writes nothing.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { adapterOf } from "./adapters/index.mjs";
import { parseLedger } from "./ledger.mjs";
import { readScreenLedger } from "./screen-ledger.mjs";
import { frontMatter } from "./screens.mjs";

// A field: its type, whether it must be there, the values it may take, and what it holds.
// `fields` describes an object's own keys; `open: true` lets it carry keys of its own besides.
const text = { type: "string" };
const number = { type: "number" };
const list = (items) => ({ type: "array", items });
const required = (spec) => ({ ...spec, required: true });

// The token types the format names, the acceptance kit's list included.
export const TOKEN_TYPES = [
  "color",
  "dimension",
  "fontFamily",
  "fontWeight",
  "number",
  "duration",
  "shadow",
  "typography",
  "string",
];
const ATOMIC_LEVELS = ["atom", "molecule", "organism", "template"];

export const LEDGERS = {
  decisions: {
    file: "design/decisions.yaml",
    question: "what the repository decided, and what holds each decision",
    writer: "people, and the guide for the rows it holds",
    version: 1,
    format: "yaml-ledger",
    root: {
      version: required({ type: "number|string" }),
      decisions: required(
        list({
          type: "object",
          fields: {
            id: required(text),
            layer: required(text),
            kind: required({ ...text, values: ["standard", "formula", "closed", "judgment"] }),
            source: required(text),
            check: { ...text, pattern: `^(test|e2e|tool|${adapterOf("lint").prefix}):` },
            note: text,
          },
        }),
      ),
    },
  },
  blueprint: {
    file: "design/blueprint.json",
    question: "what the person answered, layer by layer",
    writer: "the person, through the guide",
    version: 1,
    root: {
      version: required(number),
      status: text,
      depth: text,
      layers: required({ type: "object", open: true }),
    },
    open: true,
  },
  tokens: {
    file: "design/tokens.json",
    question: "which values exist",
    writer: "make design-tokens, from the stylesheet",
    // The Design Tokens Community Group format carries no version of its own.
    version: null,
    format: "tokens",
  },
  components: {
    file: "design/component-registry.json",
    question: "which components exist, where, and of what",
    writer: "make design-components, from the source",
    version: 2,
    // The acceptance kit reads the version as a string and refuses any key beside these two.
    root: {
      version: required(text),
      components: required(
        list({
          type: "object",
          fields: {
            name: required(text),
            category: required(text),
            file: required(text),
            level: { ...text, values: ATOMIC_LEVELS },
            source: { ...text, values: ["library", "own"] },
            parts: list(text),
            variants: list({ ...text, pattern: "^[^=]+=[^=]+$" }),
            defaults: { type: "object", open: true },
            control: { type: "boolean" },
            min_height: { ...text, pattern: "^\\d+(\\.\\d+)?px$" },
          },
        }),
      ),
    },
  },
  "column-types": {
    file: "design/column-types.json",
    question: "which column types the repository has",
    writer: "a person",
    version: 1,
    root: {
      version: required(number),
      padding_ch: required(number),
      types: required({ type: "object", open: true }),
    },
  },
  columns: {
    file: "design/columns.json",
    question: "how each column type is aligned and how wide it starts, and each field's type",
    writer: "make design-columns, from the data model",
    version: 1,
    root: {
      version: required(number),
      padding_ch: required(number),
      types: required({ type: "object", open: true }),
      fields: required({ type: "object", open: true }),
    },
  },
  states: {
    file: "design/states.json",
    question: "which states every screen declares, and which screens are excused",
    writer: "a person",
    version: 1,
    root: {
      version: required(number),
      required: required(list(text)),
      exempt: required({ type: "object", open: true }),
    },
  },
  "screen-sizes": {
    file: "design/screen-sizes.json",
    question: "the widths every page is checked at",
    writer: "a person",
    version: 1,
    root: { version: required(number), widths: required(list(number)) },
  },
  parts: {
    file: "design/parts.json",
    question: "the parts of the code from the top down, and which may import which",
    writer: "a person",
    version: 1,
    root: {
      version: required(number),
      parts: required(list({ type: "object", fields: { name: required(text) }, open: true })),
    },
  },
  screens: {
    file: "design/screens.yaml",
    question: "which screens exist, of which kind, with which states",
    writer: "a person or an agent, with each new screen",
    version: 1,
    format: "yaml-screens",
    root: {
      version: required({ type: "number|string" }),
      families: { type: "object", open: true },
      audiences: list(text),
      statuses: list(text),
      screens: required(
        list({
          type: "object",
          fields: {
            id: required(text),
            route: required({ ...text, pattern: "^/" }),
            title: required({ type: "string|null" }),
            family: required({ type: "string|null" }),
            audience: text,
            status: required({ ...text, values: ["built", "planned"] }),
            states: list(text),
          },
          // A repository may keep keys of its own on a screen, such as who may open it.
          open: true,
        }),
      ),
    },
    // And keys of its own beside the screens.
    open: true,
  },
  "screen-kinds": {
    folder: "design/patterns",
    question: "how a screen of each kind is built",
    writer: "a person",
    // The acceptance kit defines the page and has no version for it.
    version: null,
    format: "pages",
    // The eight keys the kit requires, and the ones it reads when they are there.
    head: {
      nhom: required(text),
      doi_tuong: required(text),
      khuon: required({ type: "object", fields: { ten: required(text) }, open: true }),
      nhan_dien: required({ type: "array|string|object" }),
      mau_dang_chay: required({ type: "object", open: true }),
      khe_bat_buoc: required({ type: "array" }),
      cam_ngoai_khuon: required({ type: "array" }),
      ngoai_le: required({ type: "array" }),
      don_vi: { ...text, values: ["man", "phan-tu"] },
      cam_ho: { type: "array" },
      thay_cho: { type: "array|string" },
      khe_tuy_chon: { type: "array" },
      luat: { type: "array|object" },
      nhan_viec: text,
      lop_trinh_bay: { type: "array|object|string" },
      thanh_phan_tang_ngan: { type: "array|object" },
    },
  },
};

// Ledgers the contract names whose one shape is not settled yet, and why.
export const UNSETTLED = {
  intake: "which need got which block, and who approved it: one repository keeps one so far",
  sources: "which outside libraries blocks come from, in what order, at which pin: likewise",
};

const typeOf = (value) => (value === null ? "null" : Array.isArray(value) ? "array" : typeof value);

// What is wrong with a value against a field, each line naming where.
function fieldProblems(value, spec, where) {
  const allowed = spec.type.split("|");
  if (!allowed.includes(typeOf(value))) {
    return [`${where} is ${typeOf(value)}, the contract says ${spec.type}`];
  }
  const problems = [];
  if (spec.values && !spec.values.includes(value)) {
    problems.push(`${where} is "${value}", not one of ${spec.values.join(", ")}`);
  }
  if (spec.pattern && typeof value === "string" && !new RegExp(spec.pattern).test(value)) {
    problems.push(`${where} is "${value}", which is not written as the contract says`);
  }
  if (typeOf(value) === "array" && spec.items) {
    value.forEach((item, index) =>
      problems.push(...fieldProblems(item, spec.items, `${where}[${index}]`)),
    );
  }
  if (typeOf(value) === "object" && spec.fields) {
    problems.push(...objectProblems(value, spec.fields, spec.open, where));
  }
  return problems;
}

function objectProblems(value, fields, open, where) {
  const problems = [];
  for (const [key, spec] of Object.entries(fields)) {
    if (!(key in value)) {
      if (spec.required) problems.push(`${where}.${key} is missing`);
      continue;
    }
    problems.push(...fieldProblems(value[key], spec, `${where}.${key}`));
  }
  if (!open) {
    for (const key of Object.keys(value)) {
      if (!(key in fields)) problems.push(`${where}.${key} is not in the contract`);
    }
  }
  return problems;
}

// The version a file of a ledger says it has, as a number, or null.
export function versionOf(data) {
  const value = data?.version;
  if (value === undefined || value === null) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

// Why a file is of a newer shape than this tool knows, or null. A newer file is never written over:
// the tool that reads it is older than the one that wrote it.
export function newerProblem(kind, data) {
  const known = LEDGERS[kind]?.version;
  const found = versionOf(data);
  if (known === null || known === undefined || found === null || found <= known) return null;
  return `${LEDGERS[kind].file} has shape ${found} and this tool knows shape ${known}: update the design-assembly plugin before it writes here`;
}

// Every ledger of a repository that a newer tool wrote: the reasons, empty when there is none. A
// tool that writes ledgers asks first, and writes nothing when the list is not empty.
export function newerLedgers(root) {
  return Object.entries(LEDGERS)
    .filter(([, ledger]) => ledger.file?.endsWith(".json") && ledger.version)
    .map(([kind, ledger]) => {
      const full = path.join(root, ledger.file);
      if (!existsSync(full)) return null;
      try {
        return newerProblem(kind, JSON.parse(readFileSync(full, "utf8")));
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

// The token file: groups of tokens, nested as deep as a group needs, each token with a known type
// and a value. A colour's value is hexadecimal, the one form every reader takes.
function tokensProblems(data, file) {
  if (typeOf(data) !== "object") return [`${file} is ${typeOf(data)}, the contract says object`];
  const problems = [];
  const walk = (node, where) => {
    if (typeOf(node) !== "object") {
      problems.push(`${where} is ${typeOf(node)}, the contract says a token or a group`);
      return;
    }
    if (!("$value" in node) && !("$type" in node)) {
      for (const [key, child] of Object.entries(node)) walk(child, `${where}.${key}`);
      return;
    }
    if (!TOKEN_TYPES.includes(node.$type)) {
      problems.push(`${where}.$type is "${node.$type}", not a token type the readers know`);
    }
    if (!("$value" in node)) problems.push(`${where}.$value is missing`);
    else if (node.$type === "color" && !/^#[0-9a-f]{6}([0-9a-f]{2})?$/i.test(String(node.$value))) {
      problems.push(
        `${where}.$value is not a hexadecimal colour, which the acceptance kit's gate needs`,
      );
    }
    for (const key of Object.keys(node)) {
      if (!["$type", "$value", "$description", "$extensions"].includes(key)) {
        problems.push(`${where}.${key} is not in the contract`);
      }
    }
  };
  for (const [group, node] of Object.entries(data)) walk(node, group);
  return problems;
}

// What is wrong with the text of one ledger file against its shape: a list, empty when it holds.
export function shapeProblems(kind, textOfFile, file = LEDGERS[kind]?.file) {
  const ledger = LEDGERS[kind];
  if (!ledger) return [`${kind} is not a ledger of the contract`];
  if (textOfFile === null || textOfFile === undefined) return [];
  if (ledger.format === "pages") {
    const head = frontMatter(textOfFile);
    if (!head) return [`${file} has no front matter between --- lines`];
    return objectProblems(head, ledger.head, false, file).map((line) =>
      line.replace(/is not in the contract$/, "is not a key the acceptance kit reads"),
    );
  }
  let data;
  if (ledger.format === "yaml-screens") {
    const { screens, ...rest } = readScreenLedger(textOfFile);
    data = { ...rest, ...(/^screens:/m.test(textOfFile) ? { screens } : {}) };
  } else if (ledger.format === "yaml-ledger") {
    const version = /^version:\s*(\S+)\s*$/m.exec(textOfFile)?.[1];
    data = {
      ...(version === undefined
        ? {}
        : { version: /^\d+$/.test(version) ? Number(version) : version }),
      decisions: parseLedger(textOfFile),
    };
  } else {
    try {
      data = JSON.parse(textOfFile);
    } catch {
      return [`${file} is not valid JSON`];
    }
  }
  if (ledger.format === "tokens") return tokensProblems(data, file);
  if (typeOf(data) !== "object") return [`${file} is ${typeOf(data)}, the contract says object`];
  const newer = newerProblem(kind, data);
  if (newer) return [newer];
  return objectProblems(data, ledger.root, ledger.open, file);
}

// Files in the folder of screen kinds that are not a kind of screen.
const NOT_A_KIND = ["README.md", "lech-lot.md"];

// The ledgers a repository has, each with its file and what is wrong with its shape. A ledger kept
// as one page per item gives one entry per page.
export function presentLedgers(root) {
  const found = [];
  for (const [kind, ledger] of Object.entries(LEDGERS)) {
    const files = [];
    if (ledger.folder) {
      const full = path.join(root, ledger.folder);
      if (existsSync(full)) {
        for (const name of readdirSync(full).sort()) {
          if (name.endsWith(".md") && !NOT_A_KIND.includes(name)) {
            files.push(`${ledger.folder}/${name}`);
          }
        }
      }
    } else if (existsSync(path.join(root, ledger.file))) files.push(ledger.file);
    for (const file of files) {
      const text = readFileSync(path.join(root, file), "utf8");
      found.push({ kind, file, problems: shapeProblems(kind, text, file) });
    }
  }
  return found;
}

// The ways a file differs from its shape, each named once however many entries have it.
export function differences(problems, file) {
  return [
    ...new Set(
      problems.map((line) =>
        line
          .replace(file, "")
          .replace(/\[\d+\]/g, "[]")
          .trim(),
      ),
    ),
  ];
}
