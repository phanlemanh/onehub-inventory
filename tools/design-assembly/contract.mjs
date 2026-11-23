// The contract of a repository's design: the ledgers, each with one shape that every tool reading
// it can rely on. This file is the only statement of those shapes; `references/contract.md` says
// the same in words for a person, and a test keeps the two in step.
//
// A shape is checked as data. Its `version` says which shape a file has: a reader of shape N reads
// every file of shape N or older, and a writer that finds a newer shape writes nothing.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

import { adapterOf } from "./adapters/index.mjs";
import {
  INTAKE_LEDGER,
  readIntakeLedger,
  repeatedNeeds,
  spellingProblems,
} from "./intake-ledger.mjs";
import { readYaml } from "./yaml.mjs";
import {
  FONT_FIELDS,
  FONT_STYLES,
  fontRowProblems,
  isFont,
  SOURCES_FOLDER,
} from "./sources-ledger.mjs";
import { parseLedger } from "./ledger.mjs";
import { ledgerText, readFragments } from "./screen-fragments.mjs";
import { FRAGMENTS_SHARED, fragmentsFolder, readScreenLedger } from "./screen-ledger.mjs";
import { frontMatter } from "./screens.mjs";

// A field: its type, whether it must be there, the values it may take, and what it holds.
// `fields` describes an object's own keys; `open: true` lets it carry keys of its own besides.
const text = { type: "string" };
const number = { type: "number" };
const list = (items) => ({ type: "array", items });
const required = (spec) => ({ ...spec, required: true });
// A day, `YYYY-MM-DD`; a key in small letters and dashes, as a need or the id of a source is.
const day = { ...text, pattern: "^\\d{4}-\\d{2}-\\d{2}$" };
const dashed = { ...text, pattern: "^[a-z0-9]+(-[a-z0-9]+)*$" };

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

// When a repository has a ledger: from birth, once the floor is laid and the ledgers are laid on
// it without asking anyone (`adopt --starter`), or with its first entry, which only a person or a
// later round brings. A ledger of the first kind that is missing is something to say; one of the
// second kind is not.
export const BORN = { floor: "with-the-floor", firstEntry: "with-its-first-entry" };

export const LEDGERS = {
  decisions: {
    file: "design/decisions.yaml",
    question: "what the repository decided, and what holds each decision",
    born: BORN.floor,
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
    born: BORN.firstEntry,
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
    born: BORN.floor,
    writer: "make design-tokens, from the stylesheet",
    // The Design Tokens Community Group format carries no version of its own.
    version: null,
    format: "tokens",
  },
  components: {
    file: "design/component-registry.json",
    question: "which components exist, where, and of what",
    born: BORN.floor,
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
            props: list(text),
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
    born: BORN.floor,
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
    born: BORN.firstEntry,
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
    born: BORN.floor,
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
    born: BORN.floor,
    writer: "a person",
    version: 1,
    root: { version: required(number), widths: required(list(number)) },
  },
  parts: {
    file: "design/parts.json",
    question: "the parts of the code from the top down, and which may import which",
    born: BORN.firstEntry,
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
    born: BORN.floor,
    writer: "a person or an agent, with each new screen",
    version: 1,
    format: "yaml-screens",
    // A repository may keep this ledger as a folder instead: one file per screen, named after the
    // screen's id, and one file for the keys that are not a screen. The data is the same, so the
    // shape and its version are the same; a reader takes the folder when it is there.
    fragments: {
      folder: fragmentsFolder("design/screens.yaml"),
      shared: FRAGMENTS_SHARED,
      named_by: "id",
    },
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
            // The widths this screen is checked at, when they are not the ones every page is.
            sizes: list({ ...text, pattern: "^\\d+$" }),
            // What the screen shows, the action a role must hold to open it (null: every role),
            // and the actions it has buttons for: names of the repository's domain model.
            shows: list(text),
            entry: { type: "string|null" },
            actions: list(text),
          },
          // A repository may keep keys of its own on a screen, such as who may open it.
          open: true,
        }),
      ),
      // The frame around every screen, the actions that have no screen, and the repository's own
      // spelling of these keys.
      frame: {
        type: "object",
        fields: { shows: list(text), actions: list(text) },
        open: true,
      },
      no_screen: { type: "object", open: true },
      keys: { type: "object", open: true },
    },
    // And keys of its own beside the screens.
    open: true,
  },
  intake: {
    file: INTAKE_LEDGER,
    question: "which need got which block, from where, and who approved it on which day",
    born: BORN.firstEntry,
    writer: "the round that takes the block in, once, with its approval",
    version: 1,
    format: "yaml-intake",
    // Kept as a folder, each block is a file named after its need: one need, one answer, held by
    // the names of the files.
    fragments: {
      folder: fragmentsFolder(INTAKE_LEDGER),
      shared: FRAGMENTS_SHARED,
      named_by: "need",
    },
    root: {
      version: required({ type: "number|string" }),
      blocks: required(
        list({
          type: "object",
          fields: {
            // What it is and where its code is, where it came from (an outside library's name for
            // it, or that it was made by hand) and at which pin, which need it answers, the record
            // of the round that took it in, and who approved it on which day.
            name: required(text),
            file: required(text),
            source: required(text),
            pin: text,
            need: required({ ...text, pattern: "^[a-z0-9]+(-[a-z0-9]+)*$" }),
            description: text,
            record: text,
            approved: required({ ...text, pattern: "^\\d{4}-\\d{2}-\\d{2}$" }),
            approved_by: text,
            // The pinned source it came from, the hash of its file when it was taken in, a change
            // the repository made on purpose and why, and whether it was retired or merged into
            // the block of another need.
            from: dashed,
            taken: { ...text, pattern: "^[0-9a-f]{64}$" },
            changed: {
              type: "object",
              fields: { on: required(day), why: required(text) },
              open: true,
            },
            retired: {
              type: "object",
              fields: { on: required(day), by: required(text), why: required(text) },
              open: true,
            },
            merged_into: dashed,
          },
          // A repository may keep keys of its own on a block.
          open: true,
        }),
      ),
      // The repository's own spelling of these keys, such as `{ blocks: <its list>, need: … }`.
      keys: { type: "object", open: true },
      // What the repository made before it kept this ledger, each with why it has no block.
      before: list({
        type: "object",
        fields: { name: required(text), why: required(text), file: text, record: text },
        open: true,
      }),
      // How the repository writes a value of the contract, such as `{ by-hand: <its word> }`.
      values: { type: "object", fields: { "by-hand": text }, open: true },
    },
    open: true,
  },
  sources: {
    folder: SOURCES_FOLDER,
    ending: ".json",
    question:
      "which outside libraries blocks are picked from, in what order, at which pin; and which fonts the product uses, from where, at which pin, under which licence",
    born: BORN.firstEntry,
    writer:
      "a person, or the repository's own tool that pins a source; a font's row, the guide or adopt from what the repository holds, and its licence a person; one file per source",
    version: 1,
    format: "json-sources",
    root: {
      version: required({ type: "number|string" }),
      // The name of its file, without `.json`.
      id: required(dashed),
      title: text,
      // Sources are looked through by this number, the smallest first, then by id.
      order: number,
      // The pin itself, or the file the repository already keeps it in; one of the two.
      pin: {
        type: "object",
        fields: {
          fetched_at: text,
          files: list({
            type: "object",
            fields: {
              file: required(text),
              url: text,
              bytes: number,
              sha256: required({ ...text, pattern: "^[0-9a-f]{64}$" }),
            },
            open: true,
          }),
          version: text,
        },
        open: true,
      },
      pin_file: text,
      // The folder the pinned files are kept in, where they are compared with their hashes.
      snapshot: text,
      // The list of what the source offers, kept in the repository.
      catalog: required(text),
      // How one item is taken in, with `{name}` where its name goes.
      install: text,
      // What taking an item in needs, in a sentence; never a key.
      licence: text,
    },
    // A source of the kind `font`: the same row, with no catalog, the family the stylesheet names,
    // the variable a font loader of the build sets for it when it has one, a pin the row itself
    // holds, and the licence the font is used under, which a person writes. `own` says the
    // repository loaded the font before the row was written; `proposed` says which command wrote
    // the row and when, and that a person has not finished it.
    font: {
      catalog: text,
      family: required({ ...text, pattern: FONT_FIELDS.family }),
      variable: { ...text, pattern: FONT_FIELDS.variable },
      pin: {
        type: "object",
        fields: {
          // The package the lockfile pins, and the version it pins it at.
          package: text,
          version: text,
          // Or each font file, by its path from the repository's root, with its hash; a file may
          // say the weight or the range of weights it holds, and its style.
          files: list({
            type: "object",
            fields: {
              file: required({ ...text, pattern: FONT_FIELDS.file }),
              sha256: required({ ...text, pattern: "^[0-9a-f]{64}$" }),
              weight: { ...text, pattern: FONT_FIELDS.weight },
              style: { ...text, values: FONT_STYLES },
            },
            open: true,
          }),
        },
        open: true,
      },
      own: { type: "boolean" },
      proposed: {
        type: "object",
        fields: { by: required(text), on: required(day) },
        open: true,
      },
    },
    open: true,
  },
  "screen-kinds": {
    folder: "design/patterns",
    question: "how a screen of each kind is built",
    born: BORN.firstEntry,
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
export const UNSETTLED = {};

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
export function newerProblem(kind, data, file = LEDGERS[kind]?.file ?? LEDGERS[kind]?.folder) {
  const known = LEDGERS[kind]?.version;
  const found = versionOf(data);
  if (known === null || known === undefined || found === null || found <= known) return null;
  return `${file} has shape ${found} and this tool knows shape ${known}: update the design-assembly plugin before it writes here`;
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

// Whether a ledger is there: its file, or, for a ledger that may be kept one file per entry, a
// folder that holds at least one file.
function ledgerHere(root, ledger) {
  if (ledger.file && existsSync(path.join(root, ledger.file))) return true;
  const folder = ledger.folder ?? ledger.fragments?.folder;
  if (!folder) return false;
  const full = path.join(root, folder);
  return existsSync(full) && statSync(full).isDirectory() && readdirSync(full).length > 0;
}

// The ledgers a repository has from birth that this one has not, by file, in the contract's order.
// Read at the contract's own paths: a file moved elsewhere by the acceptance kit's settings counts
// as missing here.
export function missingAtBirth(root) {
  return Object.values(LEDGERS)
    .filter((ledger) => ledger.born === BORN.floor && !ledgerHere(root, ledger))
    .map((ledger) => ledger.file ?? ledger.folder);
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
  if (ledger.format === "yaml-intake") return intakeProblems(textOfFile, file);
  if (ledger.format === "json-sources") return sourceProblems(textOfFile, file);
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

// The intake ledger, read in the contract's keys whatever its spelling: a problem names a key the
// repository spells otherwise as both, and a need answered twice is named once.
function intakeProblems(textOfFile, file) {
  const { spelled, ...data } = readIntakeLedger(textOfFile);
  const newer = newerProblem("intake", data);
  if (newer) return [newer];
  const own = Object.entries(spelled).filter(([key, value]) => value !== null && key !== value);
  const named = (line) =>
    own.reduce(
      (said, [key, value]) =>
        said.replace(new RegExp(`\\.${key}( |\\[|$)`, "g"), `.${key} (${value})$1`),
      line,
    );
  return [
    ...spellingProblems(readYaml(textOfFile)).map((line) => `${file}: ${line}`),
    ...objectProblems(data, LEDGERS.intake.root, LEDGERS.intake.open, file).map(named),
    ...repeatedNeeds(data).map(
      (need) => `${file}: two blocks answer the need ${need}: one need, one solution`,
    ),
  ];
}

// One file of the ledger of sources: its shape, a name that is its id, and a pin, kept in the file
// or in the one it names, that says which files or which version it holds.
function sourceProblems(textOfFile, file) {
  let data;
  try {
    data = JSON.parse(textOfFile);
  } catch {
    return [`${file} is not valid JSON`];
  }
  if (typeOf(data) !== "object") return [`${file} is ${typeOf(data)}, the contract says object`];
  const newer = newerProblem("sources", data, file);
  if (newer) return [newer];
  // A font is a source of its own kind: what the row of a library requires, less its catalog,
  // more what a font says of itself.
  const font = isFont(data);
  const root = font ? { ...LEDGERS.sources.root, ...LEDGERS.sources.font } : LEDGERS.sources.root;
  const problems = objectProblems(data, root, LEDGERS.sources.open, file);
  const name = path.basename(file);
  if (typeof data.id === "string" && name !== `${data.id}.json`) {
    problems.push(
      `${file} is named ${name} and its id is ${data.id}: a source's file is named after its id`,
    );
  }
  if (font) return [...problems, ...fontRowProblems(data, file)];
  if (!("pin" in data) && !("pin_file" in data)) {
    problems.push(
      `${file}.pin is missing: a source holds its pin, or names the file it is kept in under pin_file`,
    );
  }
  if (typeof data.install === "string" && !data.install.includes("{name}")) {
    problems.push(`${file}.install has no {name}, where the name of the item to take in goes`);
  }
  if (typeOf(data.pin) === "object" && !("files" in data.pin) && !("version" in data.pin)) {
    problems.push(`${file}.pin names neither the files it was read from nor a version`);
  }
  return problems;
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
          const isFile = statSync(path.join(full, name)).isFile();
          if (isFile && name.endsWith(ledger.ending ?? ".md") && !NOT_A_KIND.includes(name)) {
            files.push(`${ledger.folder}/${name}`);
          }
        }
      }
    } else if (ledger.fragments && readFragments(root, ledger.file, kind)) {
      // Kept as one file per entry: one ledger, named by its folder, read as one text.
      const folder = fragmentsFolder(ledger.file);
      found.push({
        kind,
        file: folder,
        problems: shapeProblems(kind, ledgerText(root, ledger.file, kind), folder),
      });
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
