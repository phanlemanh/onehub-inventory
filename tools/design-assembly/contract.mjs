// The contract of a repository's design: the ledgers, each with one shape that every tool reading
// it can rely on. This file is the only statement of those shapes; `references/contract.md` says
// the same in words for a person, and a test keeps the two in step.
//
// A shape is checked as data. Its `version` says which shape a file has: a reader of shape N reads
// every file of shape N or older, and a writer that finds a newer shape writes nothing.
import { Buffer } from "node:buffer";
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

import { ADAPTER_KINDS, adapterOf } from "./adapters/index.mjs";
import { tokenHex } from "./color.mjs";
import {
  INTAKE_LEDGER,
  readIntakeLedger,
  repeatedNeeds,
  spellingProblems,
} from "./intake-ledger.mjs";
import { readYaml } from "./yaml.mjs";
import {
  CORE_ID,
  FONT_FIELDS,
  FONT_STYLES,
  fontRowProblems,
  isCoreSource,
  isFont,
  LADDER_PLACES,
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

// The folder of conform records: one file per need, for an item of an outside source taken down
// and conformed before it is taken in (spec 0015).
export const CONFORM_FOLDER = "design/conform";
// The rules an exemption may name for a whole folder of an item rather than one of its files: the
// formatter's ignore list, the lint configuration, the type check's. Such an exemption names the file
// of the configuration (spec 0015, slice 3).
export const FOLDER_RULES = ["formatter-ignore", "lint-config", "typecheck-exclude"];
// A file of an item, with the hash of its bytes.
const hashedFile = {
  type: "object",
  fields: {
    file: required(text),
    sha256: required({ ...text, pattern: "^[0-9a-f]{64}$" }),
  },
  open: true,
};

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
              // Widened with change --widen (spec 0015): who answered, and the hash of the file as
              // changed, which the inventory holds the file to.
              fields: {
                on: required(day),
                why: required(text),
                by: text,
                sha256: { ...text, pattern: "^[0-9a-f]{64}$" },
              },
              open: true,
            },
            retired: {
              type: "object",
              fields: { on: required(day), by: required(text), why: required(text) },
              open: true,
            },
            merged_into: dashed,
            // The conform record of an item of an outside source, which holds the hash of every
            // file of the item after patching (spec 0015).
            conform: text,
            // Of a block made by hand: the words find was asked with, and the nearest candidate it
            // gave, or `none` when nothing answered (spec 0015, criterion 11).
            searched: text,
            nearest: text,
            // A block taken from the family core that the core retired, once the repository
            // accepted the retiring (spec 0016, criterion 24): the repository's own since that
            // day, with the reason the core gave and who gave it. `from` and `pin` stay, and say
            // where it once came from.
            own: {
              type: "object",
              fields: { since: required(day), by: required(text), why: required(text) },
              open: true,
            },
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
      // The folder of the repository its items' files are installed into: once declared, the gate
      // names a file there that the code uses and no conform record of an item taken in lists.
      folder: text,
      // Where it stands on the ladder find and intake walk: before the starter kit and the family's
      // store, or after them, where a source that says nothing stands (spec 0015).
      ladder_place: { ...text, values: LADDER_PLACES },
      // The plug of the capability table this source is, when its id is not the plug's.
      plug: dashed,
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
    // A source of the kind `core` (spec 0016, answer 4): the family core the repository declared it
    // is of. No catalog: it offers no block of a library. The family's name as the core says it;
    // the folder of the repository its copy of the core is kept in; the pin, each file of that copy
    // with its hash, compared before anything is read from it; and who said the repository is of
    // the family, on which day.
    core: {
      catalog: text,
      family: required({ ...text, pattern: "\\S" }),
      snapshot: required(text),
      pin: required({
        type: "object",
        fields: { files: required(list(hashedFile)), taken_on: day },
        open: true,
      }),
      joined: required({
        type: "object",
        fields: { by: required(text), on: required(day) },
        open: true,
      }),
      // The last time a person accepted changes of the core into the copy (slice 3 of item 7.1):
      // who, on which day, which answers they took, the state of the core's answers then (the
      // first digits of their hash) and which changed answers they left. The copy holds the core's
      // answer for each one taken and its earlier one for each one left, and the pin is its hash.
      accepted: {
        type: "object",
        fields: {
          by: required(text),
          on: required(day),
          answers: required(list(dashed)),
          core: required({ ...text, pattern: "^[0-9a-f]{12}$" }),
          left: required(list(dashed)),
        },
        open: true,
      },
    },
    open: true,
  },
  conform: {
    folder: CONFORM_FOLDER,
    ending: ".json",
    question:
      "for an item of an outside source taken down for a need: every file as taken down and after patching, each patch with its reason, each rule it is let off with its reason",
    born: BORN.firstEntry,
    writer:
      "a person, until the conform command writes it (spec 0015, slice 3); intake reads it before it takes the item in",
    version: 1,
    format: "json-conform",
    root: {
      version: required({ type: "number|string" }),
      // The need it is taken down for, which is the name of its file without `.json`.
      need: required(dashed),
      // The pinned source it comes from, by id, and its name in that source's catalog.
      source: required(dashed),
      item: required(text),
      // Since the conform command, the hash of the source's pin as the item was last taken down:
      // a file that is neither as taken down nor after patching is a newer item only once the
      // source is pinned again, and otherwise a hand edit.
      pin_sha256: { ...text, pattern: "^[0-9a-f]{64}$" },
      // Every file the item brought, with its hash as taken down; then every one after patching.
      taken: required(list(hashedFile)),
      conformed: required(list(hashedFile)),
      // Each change made to the item's code, with why, and since the conform command the change
      // itself: a unified diff from the file before the change to the file after it, applied in
      // order from the file as taken down. Empty when none.
      patches: required(
        list({
          type: "object",
          fields: { file: required(text), reason: required(text), diff: text },
          open: true,
        }),
      ),
      // Each rule the item is let off, in which file, with why; empty when none.
      exemptions: required(
        list({
          type: "object",
          fields: { rule: required(text), file: required(text), reason: required(text) },
          open: true,
        }),
      ),
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

// The core of a family of products (spec 0016): not a ledger of a repository, but a folder of its
// own, on this machine, that the repositories of one family share. It has a fixed shape, versioned
// like a ledger: a tool that knows shape N reads every part of shape N or older, and one that finds
// a newer part writes nothing and says to update the plugin. Every part is a JSON file and carries
// `version`. The family's name, its answers and its blocks are the user's data, kept in the folder;
// none is named by the plugin.
export const CORE_HOLDS = ["locked", "default"];
// What an answer is: a value a member compares, or a rule, whose words are what its row says and
// which its check holds.
export const CORE_KINDS = ["value", "rule"];
// A check as a row of the decision ledger writes it.
const checkText = { ...text, pattern: `^(test|e2e|tool|${adapterOf("lint").prefix}):` };
const settled = {
  type: "object",
  fields: { by: required(text), on: required(day) },
  open: true,
};
// An e-mail address in a text a person gave, which no file of a core keeps: a core keeps names.
export const ADDRESS = /[^\s@<>()]+@[^\s@<>()]+\.[^\s@<>()]+/;
// Text that says something: never blank.
const said = { ...text, pattern: "\\S" };
// What an answer was, or became, at one change: its value and its hold.
const answerState = {
  type: "object",
  fields: {
    value: required({ type: "string|number|boolean|array|object" }),
    hold: required({ ...text, values: CORE_HOLDS }),
  },
};
// One change of an answer after it came into the core (shape 2): what it was, what it became, who
// changed it, on which day, and why. The reason is never blank.
const answerChange = {
  type: "object",
  fields: {
    was: required(answerState),
    became: required(answerState),
    by: required(said),
    on: required(day),
    why: required(said),
  },
};
// One answer of the core, as `answers.json` holds it and as `retired.json` keeps one retired.
const coreAnswer = {
  type: "object",
  fields: {
    id: required(dashed),
    question: required(text),
    kind: required({ ...text, values: CORE_KINDS }),
    value: required({ type: "string|number|boolean|array|object" }),
    hold: required({ ...text, values: CORE_HOLDS }),
    check: required({ ...checkText, type: "string|null" }),
    why: required(text),
    by: required(text),
    on: required(day),
    origin: required({
      type: "object",
      fields: {
        repository: required(text),
        ledger: required(text),
        by: { type: "string|null" },
        on: { ...day, type: "string|null" },
        given: settled,
      },
      open: true,
    }),
    // Each change since the answer came into the core, oldest first: `by`, `on` and
    // `why` above say how it came in and are never rewritten.
    history: list(answerChange),
  },
  open: true,
};
// One replacing of a block's files (slice 3 of item 7.2): the files before and after, each with
// its hash, who replaced them, on which day, and why.
const blockFiles = {
  type: "object",
  fields: { files: required(list(hashedFile)) },
  open: true,
};
const blockChange = {
  type: "object",
  fields: {
    was: required(blockFiles),
    became: required(blockFiles),
    by: required(said),
    on: required(day),
    why: required(said),
  },
  open: true,
};
// One block of the core's store, as `blocks/index.json` holds it and as `retired.json` keeps one
// retired.
const coreBlock = {
  type: "object",
  fields: {
    need: required(dashed),
    name: required(text),
    // What the block is for, in a sentence, where the store says so.
    description: text,
    files: required(list(hashedFile)),
    adapters: required(list(text)),
    used_by: required(list(text)),
    // Who promoted it, on which day, and why where the promotion said so (slice 3 of item 7.2).
    promoted: required(settled),
    second_use: required({ type: "boolean" }),
    // Each time the block's files were replaced since it was promoted, oldest first: the files
    // it had and the files it got, each with its hash, who replaced them, on which day, and why.
    history: list(blockChange),
    // The licence line of the outside source the block was first taken from, and who said it
    // allows passing the block's code on to the family's other repositories, on which day.
    licence: {
      type: "object",
      fields: { source: required(dashed), words: required(said), allowed: required(settled) },
      open: true,
    },
  },
  open: true,
};
// Who retired an answer or a block from the core, on which day, and why: never blank.
const retiredMark = {
  type: "object",
  fields: { by: required(said), on: required(day), why: required(said) },
  open: true,
};
// An answer or a block the core retired, kept whole with its history, and the retiring.
const retiredOne = (entry) => ({
  ...entry,
  fields: { ...entry.fields, retired: required(retiredMark) },
});
// What a proposal of a member asks: for an answer, the value the member holds, and what the core
// held when it was made; for a block, its name and the files as the member has them, each with its
// hash, kept under `proposals/<id>/`, and the hash that named the core's block then.
// A graduation (slice 2 of item 7.2) asks the family's owner to promote a block a repository of the
// family already has, for a need another meets: it carries no value and no file, only which block
// of which repository, by its need, its name and what it is for, as that repository's report says.
export const PROPOSAL_KINDS = ["answer", "block", "graduation"];
export const PROPOSAL_OUTCOMES = ["granted", "refused"];
const proposedAnswer = {
  type: "object",
  fields: {
    value: required({ type: "string|number|boolean|array|object" }),
    was: required(answerState),
  },
  open: true,
};
const proposedBlock = {
  type: "object",
  fields: {
    name: required(text),
    files: required(list(hashedFile)),
    was: required({ ...text, pattern: "^[0-9a-f]{64}$" }),
  },
  open: true,
};
// One block a graduation names: the repository that has it, and what its report tells of it. Never
// code, a path or a value.
const graduationCandidate = {
  type: "object",
  fields: {
    repository: required(text),
    need: required(dashed),
    name: required(text),
    description: required(text),
  },
};
// What a graduation asks: the blocks that answer the need in the family, one or, where two
// repositories answered it in two ways, each of them, for the owner to choose one.
const proposedGraduation = {
  type: "object",
  fields: { candidates: required(list(graduationCandidate)) },
  open: true,
};
const proposalDecided = {
  type: "object",
  fields: {
    outcome: required({ ...text, values: PROPOSAL_OUTCOMES }),
    by: required(said),
    on: required(day),
    why: required(said),
    // For a graduation granted: the repository whose block the owner chose.
    chose: text,
  },
  open: true,
};
// The shape in which an answer first carries its history.
export const CORE_HISTORY_SINCE = 2;
export const CORE = {
  // Shape 2 adds `history` to an answer; a part of shape 1 is read as it is.
  version: 2,
  parts: {
    // Which family the core is of, by the name the person gave it; the repository its answers were
    // first read from; the repositories that declared they are of it, each with the day it joined
    // and the pin it holds (spec 0016, answer 11: the first repository is a member only once it
    // declares so); and who built the core on which day, the family's owner (answer 10).
    declaration: {
      file: "core.json",
      question:
        "which family this core is of, where its answers came from, and which repositories are of it",
      required: true,
      root: {
        version: required(number),
        family: required({ ...text, pattern: "\\S" }),
        first: required({
          type: "object",
          fields: {
            repository: required(text),
            read_on: required(day),
            commit: required({ type: "string|null" }),
          },
          open: true,
        }),
        members: required(
          list({
            type: "object",
            fields: { repository: required(text), joined: required(day), pin: text },
            open: true,
          }),
        ),
        owner: required(settled),
        // The leave to publish the core to a private repository (spec 0016, answer 9): the one
        // place it was given for, as host and path with no user and no secret; who gave it, on
        // which day; and who took it back, when it was. Absent until a person gives it.
        publish: {
          type: "object",
          fields: {
            to: required({ ...text, pattern: "^[^\\s@?#]+$" }),
            allowed: required(settled),
            taken_back: settled,
          },
          open: true,
        },
      },
      open: true,
    },
    // The answers the family shares: for each, the question, whether it is a value or a rule, its
    // value (a rule's words), whether it is locked or a default, the check that holds it (null when
    // none does), why, who settled it in the core on which day, and where it came from, with who
    // settled it there when the ledger says so, and who gave the value on the sheet when the
    // ledgers did not hold it.
    answers: {
      file: "answers.json",
      question: "which answers the family shares, locked or default, and what holds each",
      required: true,
      root: {
        version: required(number),
        answers: required(list(coreAnswer)),
      },
      open: true,
    },
    // The store of graduated blocks: each block by its need, its files kept under
    // `blocks/<need>/` with their hashes, the adapters it needs, the repositories that use it, who
    // promoted it on which day, and whether a second repository has used it yet (answer 13).
    blocks: {
      file: "blocks/index.json",
      // The folder the files of every block are kept under, each block in a folder named after
      // its need.
      folder: "blocks",
      question: "which blocks graduated to the family, with their files, adapters and users",
      required: true,
      root: {
        version: required(number),
        blocks: required(list(coreBlock)),
      },
      open: true,
    },
    // What each member repository has solved, one file per repository named after it: the key of
    // each need, its name and its description, and nothing else: never code, never a file's text.
    // Since slice 2 of item 7.2 a report also tells, under `uses`, the needs of the core whose
    // block the repository took in: a key alone, the block being the core's.
    members: {
      folder: "members",
      ending: ".json",
      question: "which needs each member repository has solved, by key, name and description",
      required: false,
      root: {
        version: required(number),
        repository: required(text),
        needs: required(
          list({
            type: "object",
            fields: {
              need: required(dashed),
              name: required(text),
              description: required(text),
            },
          }),
        ),
        uses: list(dashed),
      },
      open: true,
    },
    // What the core retired (spec 0016, criterion 24, slice 3 of item 7.2): each answer and each
    // block as it was when it was retired, its history included, with `retired`: who, on which day,
    // and why. Nothing is deleted from the record: an answer leaves `answers.json` and a block
    // leaves `blocks/index.json` for this part, and the files of a retired block stay where they
    // were, under `blocks/<need>/`, held to their hashes. Missing until something is retired.
    retired: {
      file: "retired.json",
      question: "which answers and blocks the core retired, who retired each, when and why",
      required: false,
      root: {
        version: required(number),
        answers: required(list(retiredOne(coreAnswer))),
        blocks: required(list(retiredOne(coreBlock))),
      },
      open: true,
    },
    // The proposals of the members to the family's owner (criterion 23), one file per proposal
    // named after its id, so two members never write one file: which repository proposes what, at
    // which pin, who, when and why; for an answer the value it holds, for a block the files as it
    // has them, kept under `proposals/<id>/`; and, once the owner answered, `decided`. Missing
    // until a member proposes.
    proposals: {
      folder: "proposals",
      ending: ".json",
      question: "what each member proposed to the family's owner, and what the owner answered",
      required: false,
      root: {
        version: required(number),
        id: required(dashed),
        kind: required({ ...text, values: PROPOSAL_KINDS }),
        subject: required(dashed),
        repository: required(text),
        pin: required(text),
        by: required(said),
        on: required(day),
        why: required(said),
        answer: proposedAnswer,
        block: proposedBlock,
        graduation: proposedGraduation,
        decided: proposalDecided,
      },
      open: true,
    },
  },
};

// Why a part of a core is of a newer shape than this tool knows, or null.
export function coreNewerProblem(data, file) {
  const found = versionOf(data);
  if (found === null || found <= CORE.version) return null;
  return `${file} has shape ${found} and this tool knows shape ${CORE.version} of a family core: update the design-assembly plugin before it writes there`;
}

// The parts of a core folder, each as { part, file, data } or { part, file, problem } when it
// cannot be read; a part that is not there and must be is { part, file, missing: true }.
export function readCoreParts(dir) {
  const found = [];
  const readOne = (part, file) => {
    try {
      found.push({ part, file, data: JSON.parse(readFileSync(path.join(dir, file), "utf8")) });
    } catch {
      found.push({ part, file, problem: `${file} is not valid JSON` });
    }
  };
  for (const [part, spec] of Object.entries(CORE.parts)) {
    if (spec.file) {
      if (existsSync(path.join(dir, spec.file))) readOne(part, spec.file);
      else if (spec.required) found.push({ part, file: spec.file, missing: true });
      continue;
    }
    const folder = path.join(dir, spec.folder);
    if (!existsSync(folder) || !statSync(folder).isDirectory()) continue;
    for (const name of readdirSync(folder).sort()) {
      if (name.endsWith(spec.ending)) readOne(part, `${spec.folder}/${name}`);
    }
  }
  return found;
}

// Every part of a core folder of a newer shape: the reasons, empty when there is none. A tool that
// writes a core writes nothing while the list is not empty.
export function newerCoreParts(dir) {
  return readCoreParts(dir)
    .filter((entry) => entry.data !== undefined)
    .map((entry) => coreNewerProblem(entry.data, entry.file))
    .filter(Boolean);
}

// What is wrong with a core folder against its shape, each line naming the file and the place:
// empty when the core holds. A part of a newer shape is said once, and its content is not judged.
export function familyCoreProblems(dir) {
  const problems = [];
  for (const entry of readCoreParts(dir)) {
    if (entry.missing) {
      problems.push(`${entry.file} is missing: a family core has it, empty or not`);
      continue;
    }
    if (entry.problem) {
      problems.push(entry.problem);
      continue;
    }
    const shape = corePartShapeProblems(entry.part, entry.data, entry.file);
    problems.push(...shape);
    // The files of the store are read once its list holds its shape: those of the blocks it
    // offers, and those of the blocks it retired, which stay where they were.
    if (["blocks", "retired"].includes(entry.part) && shape.length === 0) {
      problems.push(...coreStoreProblems(dir, entry.data, entry.file));
    }
    if (entry.part === "proposals" && shape.length === 0 && entry.data.block) {
      const folder = path.posix.join(CORE.parts.proposals.folder, entry.data.id);
      problems.push(
        ...heldFilesProblems(dir, folder, entry.data.block.files, `${entry.file}.block`),
      );
    }
  }
  return [...problems, ...retiredClashes(dir), ...useClashes(dir)];
}

// A use a report tells of a need the store neither offers nor retired (slice 2 of item 7.2): the
// block it names is no block of this core. Whether the store's entry names the repository under
// `used_by` is not held here: the move that tells a use writes the store's entry first, and an
// entry that lost the name is written again at the repository's next report or pin, which a core
// that did not hold its shape would refuse.
function useClashes(dir) {
  const parts = readCoreParts(dir);
  const needsOf = (part) => {
    const found = parts.find((entry) => entry.part === part)?.data?.blocks;
    return new Set((Array.isArray(found) ? found : []).map((block) => block?.need));
  };
  const offered = needsOf("blocks");
  const gone = needsOf("retired");
  const problems = [];
  for (const entry of parts.filter((each) => each.part === "members" && each.data)) {
    const uses = Array.isArray(entry.data.uses) ? entry.data.uses : [];
    uses.forEach((need, place) => {
      if (typeof need === "string" && !offered.has(need) && !gone.has(need)) {
        problems.push(
          `${entry.file}.uses[${place}] is ${need}, which the store neither offers nor retired`,
        );
      }
    });
  }
  return problems;
}

// A need the store offers whose files a retired block of that need still keeps in the same
// folder: the two would be one folder's files.
function retiredClashes(dir) {
  const parts = readCoreParts(dir);
  const offered = parts.find((entry) => entry.part === "blocks")?.data?.blocks;
  const retired = parts.find((entry) => entry.part === "retired")?.data?.blocks;
  if (!Array.isArray(offered) || !Array.isArray(retired)) return [];
  const gone = new Set(retired.map((block) => block?.need));
  return offered
    .filter((block) => gone.has(block?.need))
    .map(
      (block) =>
        `${CORE.parts.blocks.file} offers ${block.need}, and ${CORE.parts.retired.file} keeps a retired block of ${block.need} whose files are under the same folder: a retired need is not promoted again`,
    );
}

// Where a file of a block is kept in a core folder, and in a member's copy of it.
export const coreBlockFile = (need, file) =>
  path.posix.join(CORE.parts.blocks.folder, String(need), String(file));

// Whether a block names a file so that it stays in the folder of its need: a path of the folder,
// never one that leads out of it.
export function staysInBlock(file) {
  const name = String(file ?? "");
  if (name.trim() === "" || path.posix.isAbsolute(name) || /^[A-Za-z]:|\\/.test(name)) return false;
  const parts = name.split("/");
  return !parts.includes("..") && !parts.includes(".") && !parts.includes("");
}

// Whether a file of a block is hidden, or lies in a hidden folder: a name that starts with a dot.
// A block is code a member copies into its own folders, and no part of it may land as a file its
// tools read as configuration, or as a folder of its version control.
export const hiddenInBlock = (file) =>
  String(file ?? "")
    .split("/")
    .some((part) => part.startsWith("."));

// Whether bytes are text a command can copy as it is: UTF-8, read and written back the same.
export const isTextFile = (bytes) => Buffer.from(bytes.toString("utf8"), "utf8").equals(bytes);

// What is wrong with the files of the block store of a core folder, beside the shape of its list
// (spec 0016, slice 1 of item 7.2): a block with no file, a file named so that it leaves the
// folder of its need, a file named twice, a file that is not there, one that is not text, and one
// that is not the file listed. Each line names the list, the block and the file.
export function coreStoreProblems(dir, data, file = CORE.parts.blocks.file) {
  const problems = [];
  const blocks = Array.isArray(data?.blocks) ? data.blocks : [];
  blocks.forEach((block, index) => {
    if (typeof block?.need !== "string" || !Array.isArray(block.files)) return;
    const at = `${file}.blocks[${index}]`;
    // An adapter a block needs is a kind this plugin knows: a member that reads another word reads
    // a block it can never have. Held here, where a core is checked and joined, and not in the
    // shape a member's gate reads its copy by, so a tool older than a kind still reads the copy.
    (Array.isArray(block.adapters) ? block.adapters : []).forEach((kind, place) => {
      if (typeof kind === "string" && !Object.hasOwn(ADAPTER_KINDS, kind)) {
        problems.push(
          `${at}.adapters[${place}] is ${kind}, which is no kind of adapter: one of ${Object.keys(ADAPTER_KINDS).join(", ")}`,
        );
      }
    });
    problems.push(
      ...heldFilesProblems(dir, coreBlockFile(block.need, ""), block.files, at, "its need"),
    );
  });
  return problems;
}

// What is wrong with the files of one block, kept under `folder` of a core folder and listed at
// `at`: none named, a name that leaves the folder or is hidden, a name given twice, a file that is
// not there, not text, or not the file listed.
export function heldFilesProblems(dir, folder, files, at, what = folder) {
  if (!Array.isArray(files)) return [];
  if (files.length === 0) return [`${at}.files names no file: a block is its files`];
  const problems = [];
  const seen = new Set();
  const into = `${String(folder).replace(/\/+$/, "")}/`;
  files.forEach((entry, place) => {
    if (typeof entry?.file !== "string") return;
    const where = `${at}.files[${place}]`;
    if (!staysInBlock(entry.file)) {
      problems.push(
        `${where}.file is ${entry.file}, which leaves ${into}: a block's files are kept under ${what}`,
      );
      return;
    }
    if (hiddenInBlock(entry.file)) {
      problems.push(
        `${where}.file is ${entry.file}, a hidden file or one in a hidden folder: a block is code, and no part of its name starts with a dot`,
      );
      return;
    }
    if (seen.has(entry.file)) {
      problems.push(`${where}.file names ${entry.file} twice`);
      return;
    }
    seen.add(entry.file);
    const kept = path.posix.join(into, entry.file);
    const full = path.join(dir, kept);
    if (!existsSync(full) || !statSync(full).isFile()) {
      problems.push(`${where}: ${kept} is not there`);
      return;
    }
    const bytes = readFileSync(full);
    if (!isTextFile(bytes)) {
      problems.push(`${where}: ${kept} is not text: a block's files are code, kept as text`);
      return;
    }
    if (sha256(bytes) !== entry.sha256) {
      problems.push(`${where}: ${kept} is not the file listed: its sha256 differs`);
    }
  });
  return problems;
}

// What is wrong with the data of one part of a core, written at `file` in the core folder.
export function corePartShapeProblems(part, data, file) {
  const spec = CORE.parts[part];
  if (!spec) return [`${part} is not a part of a family core`];
  if (typeOf(data) !== "object") return [`${file} is ${typeOf(data)}, the contract says object`];
  const newer = coreNewerProblem(data, file);
  if (newer) return [newer];
  return [
    ...objectProblems(data, spec.root, spec.open, file),
    ...corePartProblems(part, data, file),
  ];
}

// What a part says that its shape alone does not hold: an answer or a block given twice, a member's
// report not named after its repository.
function corePartProblems(part, data, file) {
  const twice = (items, key) => {
    const seen = new Set();
    return (Array.isArray(items) ? items : [])
      .map((item) => item?.[key])
      .filter((value) => {
        if (typeof value !== "string") return false;
        if (!seen.has(value)) {
          seen.add(value);
          return false;
        }
        return true;
      });
  };
  if (part === "answers") {
    const answers = Array.isArray(data.answers) ? data.answers : [];
    return [
      ...twice(answers, "id").map((id) => `${file} answers ${id} twice: one question, one answer`),
      ...answers.flatMap((answer, index) =>
        historyProblems(answer, `${file}.answers[${index}]`, versionOf(data), file),
      ),
      // A rule's value is the words of its row; a value is what a member compares.
      ...answers.flatMap((answer, index) =>
        answer?.kind === "rule" && typeof answer.value !== "string"
          ? [
              `${file}.answers[${index}].value is a rule's, and a rule's value is the words of its row`,
            ]
          : [],
      ),
    ];
  }
  if (part === "blocks") {
    return [
      ...twice(data.blocks, "need").map(
        (need) => `${file} keeps two blocks for the need ${need}: one need, one block`,
      ),
      ...blockHistoryProblems(data.blocks, file),
    ];
  }
  if (part === "retired") {
    const answers = Array.isArray(data.answers) ? data.answers : [];
    return [
      ...twice(data.blocks, "need").map(
        (need) => `${file} keeps two retired blocks of the need ${need}: a need's folder holds one`,
      ),
      ...answers.flatMap((answer, index) =>
        historyProblems(answer, `${file}.answers[${index}]`, versionOf(data), file),
      ),
      ...blockHistoryProblems(data.blocks, file),
      ...[...answers, ...(Array.isArray(data.blocks) ? data.blocks : [])].flatMap((one) =>
        ["by", "why"]
          .filter((key) => typeof one?.retired?.[key] === "string")
          .filter((key) => ADDRESS.test(one.retired[key]))
          .map(
            (key) =>
              `${file}: the retiring of ${one.id ?? one.need} holds an e-mail address in ${key}: a core keeps names, never an address`,
          ),
      ),
    ];
  }
  if (part === "proposals") {
    const problems = [];
    const name = path.posix.basename(file);
    if (typeof data.id === "string" && name !== `${data.id}.json`) {
      problems.push(
        `${file} is named ${name} and its id is ${data.id}: a proposal is named after its id`,
      );
    }
    if (data.kind === "answer" && !data.answer)
      problems.push(`${file} proposes an answer and says no answer`);
    if (data.kind === "block" && !data.block)
      problems.push(`${file} proposes a block and says no block`);
    if (data.kind === "answer" && data.block)
      problems.push(`${file} proposes an answer and holds a block`);
    if (data.kind === "block" && data.answer)
      problems.push(`${file} proposes a block and holds an answer`);
    problems.push(...graduationProblems(data, file));
    for (const [key, value] of [
      ["by", data.by],
      ["why", data.why],
      ["decided.by", data.decided?.by],
      ["decided.why", data.decided?.why],
    ]) {
      if (typeof value === "string" && ADDRESS.test(value)) {
        problems.push(
          `${file}.${key} holds an e-mail address: a core keeps names, never an address`,
        );
      }
    }
    return problems;
  }
  if (part === "members") {
    const problems = [];
    const name = path.posix.basename(file);
    if (typeof data.repository === "string" && name !== `${data.repository}.json`) {
      problems.push(
        `${file} is named ${name} and its repository is ${data.repository}: a report is named after its repository`,
      );
    }
    const needs = Array.isArray(data.needs) ? data.needs : [];
    problems.push(
      ...twice(needs, "need").map(
        (need) => `${file} tells the need ${need} twice: one need, one block`,
      ),
    );
    needs.forEach((one, index) => {
      for (const key of ["name", "description"]) {
        if (typeof one?.[key] === "string" && ADDRESS.test(one[key])) {
          problems.push(
            `${file}.needs[${index}].${key} holds an e-mail address: a core keeps names, never an address`,
          );
        }
      }
    });
    const uses = Array.isArray(data.uses) ? data.uses : [];
    uses.forEach((need, index) => {
      if (typeof need === "string" && uses.indexOf(need) !== index) {
        problems.push(`${file}.uses[${index}] tells the use of ${need} twice`);
      }
    });
    return problems;
  }
  return [];
}

// What a proposal says about a graduation that its shape alone does not hold: the kind and its
// content go together, every block it names answers the one need it is about, and one granted
// names the repository whose block the owner chose.
function graduationProblems(data, file) {
  const problems = [];
  if (data.kind === "graduation" && !data.graduation) {
    problems.push(`${file} proposes a graduation and names no block`);
  }
  if (data.kind !== "graduation" && data.graduation) {
    problems.push(`${file} proposes ${data.kind} and holds a graduation`);
  }
  if (data.kind === "graduation" && (data.answer || data.block)) {
    problems.push(`${file} proposes a graduation and holds a value or files: it names blocks only`);
  }
  if (data.kind !== "graduation") {
    return data.decided?.chose === undefined
      ? problems
      : [...problems, `${file}.decided.chose is said of a graduation only`];
  }
  const candidates = Array.isArray(data.graduation?.candidates) ? data.graduation.candidates : [];
  if (data.graduation && candidates.length === 0) {
    problems.push(`${file}.graduation.candidates names no block: a graduation is about one`);
  }
  candidates.forEach((one, index) => {
    if (typeof one?.need === "string" && one.need !== data.subject) {
      problems.push(
        `${file}.graduation.candidates[${index}].need is ${one.need}, and the proposal is about ${data.subject}`,
      );
    }
  });
  const chose = data.decided?.chose;
  if (data.decided?.outcome === "granted") {
    if (!candidates.some((one) => one?.repository === chose)) {
      problems.push(
        `${file}.decided.chose is ${chose ?? "missing"}: a graduation granted names the repository whose block was chosen, one of ${candidates.map((one) => one?.repository).join(", ")}`,
      );
    }
  } else if (chose !== undefined) {
    problems.push(`${file}.decided.chose is said of a graduation granted only`);
  }
  return problems;
}

// ---- a member of a family: the core it pinned (spec 0016, slice 2 of item 7.1) -----------------

// Where a repository keeps the family it declared and the copy of that core: the row of the sources
// ledger, and the folder the copy is kept in. The copy holds the declaration, the answers, the list
// of blocks and, since slice 1 of item 7.2, the files of every block, each where the core keeps
// it; since slice 2 of item 7.2 it holds the members' reports too, each byte for byte under
// `members/`, so a repository knows on every machine which needs the family has answered. A copy
// pinned before either holds no file of a block, or no report.
export const PINNED_CORE = { file: `${SOURCES_FOLDER}/${CORE_ID}.json`, snapshot: "design/core" };
export const COPIED_PARTS = ["declaration", "answers", "blocks"];
// The check of the gate that holds the locked answers of the core a repository pinned. It is laid
// under the row `ledger-shapes`, and only on a repository that declares a family.
export const FAMILY_CORE_CHECK = { kind: "family-core" };
// How many hexadecimal digits of the hash of the copied answers name the pin in a note.
const PIN_DIGITS = 12;
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

// The core a repository pinned: null when it declares no family; else the family, the pin (the
// hash of the copied answers, `label` its first digits), the answers, the declaration, and
// `unreadable`, why the copy cannot be trusted, or null. A copy that differs from its hashes, a
// part missing or of a newer shape, is unreadable: the repository then inherits nothing and its
// own answers stand.
export function readPinnedCore(root) {
  const { file } = PINNED_CORE;
  const full = path.join(root, file);
  if (!existsSync(full)) return null;
  let source;
  try {
    source = JSON.parse(readFileSync(full, "utf8"));
  } catch {
    source = undefined;
  }
  // A library someone named `core` is a library, not a family.
  if (source !== undefined && !isCoreSource(source)) return null;
  const said = {
    file,
    family: typeof source?.family === "string" ? source.family : null,
    snapshot: typeof source?.snapshot === "string" ? source.snapshot : null,
    joined: source?.joined ?? null,
    taken_on: source?.pin?.taken_on ?? null,
    sha256: null,
    label: null,
    declaration: null,
    answers: [],
  };
  const unreadable = (why) => ({ ...said, unreadable: why });
  if (source === undefined) return unreadable(`${file} is not valid JSON`);
  const shape = sourceProblems(JSON.stringify(source), file);
  if (shape.length > 0) return unreadable(shape[0]);
  const parts = {};
  for (const entry of source.pin.files) {
    const where = path.posix.join(source.snapshot, entry.file);
    if (path.posix.isAbsolute(entry.file) || where.split("/").includes("..")) {
      return unreadable(`${where}, a file of the pinned core, is outside its copy`);
    }
    const at = path.join(root, where);
    if (!existsSync(at) || !statSync(at).isFile()) {
      return unreadable(`${where}, a file of the pinned core, is not there`);
    }
    const bytes = readFileSync(at);
    if (sha256(bytes) !== entry.sha256) {
      return unreadable(`${where} is not the file the core was pinned with: its sha256 differs`);
    }
    parts[entry.file] = { bytes, sha256: entry.sha256 };
  }
  const data = {};
  for (const part of COPIED_PARTS) {
    const name = CORE.parts[part].file;
    if (!parts[name]) return unreadable(`the pin of ${file} does not list ${name}`);
    try {
      data[part] = JSON.parse(parts[name].bytes.toString("utf8"));
    } catch {
      return unreadable(`${path.posix.join(source.snapshot, name)} is not valid JSON`);
    }
    const wrong = corePartShapeProblems(part, data[part], path.posix.join(source.snapshot, name));
    if (wrong.length > 0) return unreadable(wrong[0]);
  }
  if (data.declaration.family !== source.family) {
    return unreadable(
      `${file} names the family ${source.family}, and its copy of the core is of ${data.declaration.family}`,
    );
  }
  const hash = parts[CORE.parts.answers.file].sha256;
  return {
    ...said,
    sha256: hash,
    label: hash.slice(0, PIN_DIGITS),
    declaration: data.declaration,
    answers: data.answers.answers,
    blocks: data.blocks.blocks,
    // Every file of the copy the pin holds, with its hash: each was compared above.
    files: Object.fromEntries(Object.entries(parts).map(([name, part]) => [name, part.sha256])),
    unreadable: null,
  };
}

// The marks a row of the decision ledger carries about the core, first in its note: an answer
// inherited from the core; a default of the core the repository changed, with why; a locked answer
// the repository keeps against the core, with why. Each names the pin, and the two with a reason
// name who gave it and when. Whatever else the note says follows after "; ".
export const CORE_MARKS = {
  inherited: "inherited from",
  changed: "changed from",
  kept: "kept against",
};
const MARK_OF = Object.fromEntries(
  Object.entries(CORE_MARKS).map(([mark, words]) => [words, mark]),
);
const MARK = new RegExp(
  `^(${Object.values(CORE_MARKS).join("|")}) the family core at ([0-9a-f]{${PIN_DIGITS}})(?:: (.+?) \\(by (.+?) on (\\d{4}-\\d{2}-\\d{2})\\))?(?:; (.*))?$`,
);

// The mark a note carries, and the rest of the note: { mark, pin, why, by, on, rest }, mark null
// when there is none.
export function coreMarkOf(note) {
  const text = String(note ?? "");
  const found = MARK.exec(text);
  // A mark of a family the repository left is no mark of a core: the rest is what follows it, so a
  // repository that joins again writes its new mark in that one's place.
  if (!found) {
    const gone = leftMarkOf(text);
    return gone.left
      ? { mark: null, rest: gone.rest, left: gone.left }
      : { mark: null, rest: text };
  }
  const [, words, pin, why, by, on, rest] = found;
  return {
    mark: MARK_OF[words],
    pin,
    why: why ?? null,
    by: by ?? null,
    on: on ?? null,
    rest: rest ?? "",
  };
}

// A mark as a note writes it.
export function coreMarkText({ mark, pin, why = null, by = null, on = null }) {
  const head = `${CORE_MARKS[mark]} the family core at ${pin}`;
  return why ? `${head}: ${why} (by ${by} on ${on})` : head;
}

// The mark of a row once the repository left its family (spec 0016, criterion 25), first in its
// note: the answer is the repository's own since that day, who said the repository leaves and why,
// and the mark the row carried, word for word, which names the pin the answer once came from and
// never the family. Whatever else the note says follows after "; ".
// The same mark is written when the family core retired the answer and the repository accepted
// the retiring (criterion 24): `when the family core retired it`, the reason and the name the core
// gave, and the mark the row carried. Both are read as no mark of a core.
export const OWN_SINCE = {
  left: "the repository left its family",
  retired: "the family core retired it",
};
const LEFT_MARK = new RegExp(
  `^own since (\\d{4}-\\d{2}-\\d{2}), when (${Object.values(OWN_SINCE).join("|")}): (.+?) \\(by (.+?)\\), once ((?:${Object.values(CORE_MARKS).join("|")}) the family core at [0-9a-f]{${PIN_DIGITS}}(?:: .+? \\(by .+? on \\d{4}-\\d{2}-\\d{2}\\))?)(?:; (.*))?$`,
);

// The mark of a family left that a note carries, and the rest of the note: { left, rest }, where
// `left` has `since`, `why`, `by` and `once`, the mark the row carried in the family; `left` is null
// when the note has none.
export function leftMarkOf(note) {
  const text = String(note ?? "");
  const found = LEFT_MARK.exec(text);
  if (!found) return { left: null, rest: text };
  const [, since, when, why, by, once, rest] = found;
  const [, words, pin, onceWhy, onceBy, onceOn] = MARK.exec(once);
  return {
    left: {
      since,
      // Said only of a retiring: a mark of a family left reads as it did before.
      ...(when === OWN_SINCE.retired ? { how: "retired" } : {}),
      why,
      by,
      once: {
        mark: MARK_OF[words],
        pin,
        why: onceWhy ?? null,
        by: onceBy ?? null,
        on: onceOn ?? null,
      },
    },
    rest: rest ?? "",
  };
}

// The mark of a family left as a note writes it.
export const leftMarkText = ({ since, why, by, once, how = "left" }) =>
  `own since ${since}, when ${OWN_SINCE[how]}: ${why} (by ${by}), once ${coreMarkText(once)}`;

// A note with its mark put first, or taken away when `mark` is null; the rest is kept as it is.
export function withCoreMark(note, mark) {
  const found = coreMarkOf(note);
  // With no mark to write, a note that says the answer is the repository's own, from a family it
  // left, stays as it is.
  if (!mark && found.left) return String(note ?? "");
  const head = mark ? coreMarkText(mark) : "";
  return [head, found.rest].filter((part) => part !== "").join("; ");
}

// Where a repository holds each answer of the catalogue that is a value: the choice of the
// blueprint, where the guide asked it; the token file the plugin writes, for the colour; the widths.
// An answer of another id is not a value the repository is read for.
export const CORE_VALUES = {
  "source-color": { layer: "foundations", key: "source_color", token: ["color", "primary"] },
  "record-panel": { layer: "patterns", key: "record_panel" },
  "type-scale-values": { layer: "foundations", key: "type_scale", ratio: "type_ratio" },
  "test-screen-sizes": { widths: true },
};
const BLUEPRINT_FILE = "design/blueprint.json";
const TOKENS_FILE = "design/tokens.json";
const WIDTHS_FILE = "design/screen-sizes.json";

// How the repository holds one answer: { value, from }, { none } when it holds nothing for it, or
// { unread } when the plugin does not read it as a value. `read` has the blueprint, the token file
// and the widths as data, each null when the repository has none.
export function memberValue(id, { blueprint = null, tokens = null, widths = null } = {}) {
  const place = CORE_VALUES[id];
  if (!place) return { unread: `${id} is not a value this plugin reads in a repository` };
  if (place.widths) {
    const found = widths?.widths;
    return Array.isArray(found) && found.length > 0
      ? { value: found, from: WIDTHS_FILE }
      : { none: true };
  }
  const choice = blueprint?.layers?.[place.layer]?.choice;
  if (choice && Object.hasOwn(choice, place.key)) {
    const value = choice[place.key];
    const ratio = place.ratio ? choice[place.ratio] : undefined;
    return {
      value: value === "modular" && ratio ? `modular ${ratio}` : value,
      from: BLUEPRINT_FILE,
    };
  }
  if (place.token) {
    const token = place.token.reduce((at, key) => at?.[key], tokens);
    if (token?.$value !== undefined) return { value: token.$value, from: TOKENS_FILE };
  }
  return { none: true };
}

// Whether two values of one answer are the same: a colour by its hexadecimal value, whatever the
// notation; anything else as data.
export function sameCoreValue(id, a, b) {
  if (CORE_VALUES[id]?.token) {
    const [x, y] = [tokenHex(String(a)), tokenHex(String(b))];
    if (x && y) return x.slice(0, 7) === y.slice(0, 7);
  }
  return JSON.stringify(a) === JSON.stringify(b);
}

// The blueprint, the token file and the widths of a repository as data, each null when it has none
// or it cannot be read; `files` has texts that stand in for what is on disk.
export function memberFiles(root, files = {}) {
  const json = (file) => {
    const text =
      file in files
        ? files[file]
        : existsSync(path.join(root, file))
          ? readFileSync(path.join(root, file), "utf8")
          : null;
    if (text === null || text === undefined) return null;
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  };
  return { blueprint: json(BLUEPRINT_FILE), tokens: json(TOKENS_FILE), widths: json(WIDTHS_FILE) };
}

// How the repository holds each answer of the core it pinned, by id.
export const memberValues = (pinned, read) =>
  Object.fromEntries(
    (pinned?.answers ?? []).map((answer) => [answer.id, memberValue(answer.id, read)]),
  );

// What the gate reads of a repository that declares a family: the core it pinned and how it holds
// each answer. Null when it declares none.
export function readFamilyCore(root) {
  const pinned = readPinnedCore(root);
  return pinned === null ? null : { pinned, values: memberValues(pinned, memberFiles(root)) };
}

const shownValue = (value) => (typeof value === "string" ? value : JSON.stringify(value));

// The id of the question about a locked answer the repository holds otherwise: it names the
// answer and the pin it was asked at.
export const coreQuestionId = (id, pin) => `core-${id}-${pin}`;

// Why the gate is red about the core a repository pinned, one line each: a copy that cannot be
// read, and each locked answer that is a value, that the repository holds otherwise, with no
// exception recorded against this pin. A default never makes it red, nor does a rule, whose words
// are not compared, nor an answer the repository holds no value for. Where the question about such
// an answer waits on the decision sheet (`waiting`, the rows of the waiting list), the line names
// it: the owner's answer is what turns the row green.
export function lockedCoreProblems(family, rows = []) {
  if (!family) return [];
  const { pinned, values, waiting = [] } = family;
  if (pinned.unreadable) {
    return [
      `the copy of the family core in ${pinned.snapshot ?? PINNED_CORE.snapshot} cannot be read: ${pinned.unreadable}. Pin it again with core --join, so the locked answers hold`,
    ];
  }
  const problems = [];
  for (const answer of pinned.answers) {
    if (answer.hold !== "locked" || answer.kind !== "value") continue;
    const held = values?.[answer.id];
    if (held?.value === undefined || sameCoreValue(answer.id, held.value, answer.value)) continue;
    const row = rows.find((item) => String(item.id) === answer.id);
    const mark = coreMarkOf(row?.note);
    if (mark.mark === "kept" && mark.pin === pinned.label) continue;
    const question = coreQuestionId(answer.id, pinned.label);
    const waits = waiting.some((item) => item?.id === question && !item.answer);
    problems.push(
      `${answer.id}: ${held.from} holds ${shownValue(held.value)}, and the family core this repository pinned locks ${shownValue(answer.value)} (pin ${pinned.label}) with no exception recorded: ${
        waits
          ? `the question ${question} waits on the decision sheet (decide): follow the core, or keep it as an exception with its reason, then core --settle`
          : "follow the core, or keep it as an exception with its reason (core --settle)"
      }`,
    );
  }
  return problems;
}

const typeOf = (value) => (value === null ? "null" : Array.isArray(value) ? "array" : typeof value);

// Whether two states of an answer are one: the same value and the same hold.
const sameState = (a, b) =>
  typeOf(a) === "object" &&
  typeOf(b) === "object" &&
  a.hold === b.hold &&
  JSON.stringify(a.value) === JSON.stringify(b.value);

// What the history of each block says that its shape alone does not hold: a replacing changes the
// files, each goes on from the one before it, the last gave the block the files it has, the days go
// forward from the day it was promoted, and a name or a reason holds no e-mail address.
function blockHistoryProblems(blocks, file) {
  const filesOf = (state) => JSON.stringify(blockFilesKey(state?.files));
  return (Array.isArray(blocks) ? blocks : []).flatMap((block, index) => {
    const history = block?.history;
    if (!Array.isArray(history) || history.length === 0) return [];
    const at = `${file}.blocks[${index}].history`;
    const problems = [];
    history.forEach((step, place) => {
      if (typeOf(step) !== "object") return;
      const here = `${at}[${place}]`;
      if (filesOf(step.was) === filesOf(step.became)) {
        problems.push(`${here} changes nothing: was and became hold the same files`);
      }
      const before = history[place - 1];
      if (typeOf(before) === "object" && filesOf(before.became) !== filesOf(step.was)) {
        problems.push(`${here}.was is not what ${at}[${place - 1}] gave the block`);
      }
      const since = place === 0 ? block.promoted?.on : before?.on;
      if (typeof since === "string" && typeof step.on === "string" && step.on < since) {
        problems.push(`${here}.on is ${step.on}, before ${since}: a history goes forward`);
      }
      for (const key of ["by", "why"]) {
        if (typeof step[key] === "string" && ADDRESS.test(step[key])) {
          problems.push(
            `${here}.${key} holds an e-mail address: a core keeps names, never an address`,
          );
        }
      }
    });
    const last = history.at(-1);
    if (typeOf(last) === "object" && filesOf(last.became) !== filesOf(block)) {
      problems.push(
        `${at}[${history.length - 1}].became is not the block's files: the last replacing gave the block the files it has`,
      );
    }
    return problems;
  });
}

// A block's files as one comparable list: each name with its hash, in the order of the names.
export const blockFilesKey = (files) =>
  (Array.isArray(files) ? files : [])
    .map((entry) => [String(entry?.file), String(entry?.sha256)])
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));

// What the history of one answer, at `where`, says that its shape alone does not hold: each change
// goes on from the one before it, the last made the answer what it is, a change changes something,
// a rule is never given another value, the days go forward from the day the answer came in, and a
// name or a reason holds no e-mail address. A history in a part of shape 1 is a part of shape 2.
function historyProblems(answer, where, version, file) {
  const history = answer?.history;
  if (!Array.isArray(history) || history.length === 0) return [];
  const at = `${where}.history`;
  const problems = [];
  if (version !== null && version < CORE_HISTORY_SINCE) {
    problems.push(`${at} is of shape ${CORE_HISTORY_SINCE}, and ${file} says shape ${version}`);
  }
  history.forEach((step, index) => {
    if (typeOf(step) !== "object") return;
    const here = `${at}[${index}]`;
    const before = history[index - 1];
    if (sameState(step.was, step.became)) {
      problems.push(`${here} changes nothing: was and became are the same`);
    }
    if (
      answer.kind === "rule" &&
      typeOf(step.was) === "object" &&
      typeOf(step.became) === "object" &&
      JSON.stringify(step.was.value) !== JSON.stringify(step.became.value)
    ) {
      problems.push(`${here} gives a rule another value: a rule's words are its row's`);
    }
    if (typeOf(before) === "object" && !sameState(before.became, step.was)) {
      problems.push(`${here}.was is not what ${at}[${index - 1}] made the answer`);
    }
    const since = index === 0 ? answer.on : before?.on;
    if (typeof since === "string" && typeof step.on === "string" && step.on < since) {
      problems.push(`${here}.on is ${step.on}, before ${since}: a history goes forward`);
    }
    for (const key of ["by", "why"]) {
      if (typeof step[key] === "string" && ADDRESS.test(step[key])) {
        problems.push(
          `${here}.${key} holds an e-mail address: a core keeps names, never an address`,
        );
      }
    }
  });
  const last = history.at(-1);
  if (typeOf(last) === "object" && !sameState(last.became, answer)) {
    problems.push(
      `${at}[${history.length - 1}].became is not the answer's value and hold: the last change made the answer what it is`,
    );
  }
  return problems;
}

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
  if (ledger.format === "json-conform") return conformProblems(textOfFile, file);
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

// One conform record: its shape, a name that is its need, at least one file, every file taken down
// again after patching, and patches and exemptions about files of the item only.
function conformProblems(textOfFile, file) {
  let data;
  try {
    data = JSON.parse(textOfFile);
  } catch {
    return [`${file} is not valid JSON`];
  }
  if (typeOf(data) !== "object") return [`${file} is ${typeOf(data)}, the contract says object`];
  const newer = newerProblem("conform", data, file);
  if (newer) return [newer];
  const problems = objectProblems(data, LEDGERS.conform.root, LEDGERS.conform.open, file);
  const name = path.basename(file);
  if (typeof data.need === "string" && name !== `${data.need}.json`) {
    problems.push(
      `${file} is named ${name} and its need is ${data.need}: a record is named after its need`,
    );
  }
  if (problems.length > 0) return problems;
  const taken = data.taken.map((entry) => entry.file);
  if (taken.length === 0) {
    return [`${file}.taken names no file: a record holds every file of its item as taken down`];
  }
  const conformed = new Set(data.conformed.map((entry) => entry.file));
  for (const each of taken.filter((one) => !conformed.has(one))) {
    problems.push(
      `${file}.conformed leaves out ${each}, which taken holds: a record holds every file after patching`,
    );
  }
  for (const each of [...conformed].filter((one) => !taken.includes(one))) {
    problems.push(`${file}.conformed holds ${each}, which taken does not: no file of another item`);
  }
  for (const key of ["patches", "exemptions"]) {
    data[key].forEach((entry, index) => {
      // An exemption for a whole folder names the file of the configuration that lets it off.
      const folderRule = key === "exemptions" && FOLDER_RULES.includes(entry.rule);
      if (!folderRule && !taken.includes(entry.file)) {
        problems.push(
          `${file}.${key}[${index}].file is ${entry.file}, which is no file of the item`,
        );
      }
    });
  }
  return problems;
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
  // more what a font says of itself. So is the family core the repository pinned.
  const font = isFont(data);
  const core = isCoreSource(data);
  const variant = font ? LEDGERS.sources.font : core ? LEDGERS.sources.core : {};
  const root = { ...LEDGERS.sources.root, ...variant };
  const problems = objectProblems(data, root, LEDGERS.sources.open, file);
  const name = path.basename(file);
  if (typeof data.id === "string" && name !== `${data.id}.json`) {
    problems.push(
      `${file} is named ${name} and its id is ${data.id}: a source's file is named after its id`,
    );
  }
  if (font) return [...problems, ...fontRowProblems(data, file)];
  if (core) {
    if (data.id !== CORE_ID) {
      problems.push(
        `${file} is a family core, and a repository is of one family: its id is ${CORE_ID}`,
      );
    }
    return problems;
  }
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
