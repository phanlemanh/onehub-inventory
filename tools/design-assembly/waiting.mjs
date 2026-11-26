// The waiting list: questions that wait on the owner of a repository, kept as data so that the
// decision sheet can list them and write the answers back, and so that the gate can tell a call a
// building agent queued from one it made alone. It is not one of the ledgers of the contract.
//
// A repository keeps it in one of two shapes, or not at all:
//   design/waiting/<id>.json   one file per question: two branches that each ask add two files
//   design/waiting-list.json   one shared file of rows, the shape before 0.7.0
// Both at once is two sources, and the list cannot be read.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

export const WAITING_LIST = "design/waiting-list.json";
export const WAITING_FOLDER = "design/waiting";
export const LIST_VERSION = 1;

export const ROW_KINDS = ["question", "permission"];
export const ROW_KEYS = [
  "id",
  "kind",
  "group",
  "question",
  "recommendation",
  "basis",
  "hard_to_undo",
  "where",
  "if_refused",
  // What the question is about, when it is one item the gate can name: see ITEMS.
  "item",
  // The day an agent asked it.
  "asked_on",
  // What the owner picks from, when the question is a choice among named things, the one the
  // recommendation names first. See CHOICES.
  "candidates",
  // The questions that waited and that this one takes the place of, by their ids: a question that
  // asks the same thing about more than they did. A question another replaces waits no longer.
  "replaces",
  // What an item of an outside source is let off, each with its rule, file and reason, when the
  // question asks the owner to keep that list before the item is taken in (spec 0015).
  "exemptions",
  "answer",
  "said",
  "by",
  "on",
];
const ROW_TEXTS = ["group", "question", "recommendation", "basis", "where", "if_refused", "said"];
export const ANSWERS = ["keep", "refuse", "value"];

// A row of the decision ledger whose note says this is an answer nobody has made theirs yet: the
// guide proposed it, or it was read off the repository. The decision sheet asks it.
export const UNCONFIRMED = /has not (confirmed|reviewed)/;
// What the note of a row of the decision ledger says once a person answered it on the sheet.
export const STAMP =
  /(?:^|; )(confirmed|refused|answered) by (.+?) on (\d{4}-\d{2}-\d{2})(?:: (.*))?$/;

// The slots of a screen brief a question can be about, by their ids. The plugin's catalogue of
// slots is where each is described; a repository's gate reads the waiting list with no plugin
// beside it, so the ids stand here too, and a test of the plugin holds the two lists equal.
export const SCREEN_SLOTS = [
  "kind",
  "shows",
  "actions",
  "states",
  "components",
  "words",
  "rules",
  "principles",
  "widths-and-checks",
  "model-changes",
  "navigation",
  "touched-screens",
];

// The slots whose question is one for every screen it concerns, by their ids, and whether the
// item names what the question is about: principles and direction are the repository's, the same
// on every sheet; a change to the data model is named by the names it is about, sorted and joined
// with +, and is one question for every screen whose row or branch has those names.
export const SHARED_SLOTS = { principles: false, "model-changes": true };
const NAMES = "[A-Za-z0-9_.-]+(?:\\+[A-Za-z0-9_.-]+)*";
const SHARED = new RegExp(
  `^(?:${Object.entries(SHARED_SLOTS)
    .map(([slot, keyed]) => (keyed ? `${slot}:${NAMES}` : slot))
    .join("|")})$`,
);

// The items a question can name, each written `kind:which`. A row of the decision ledger, a page of
// a kind of screen (its file name, without .md), the root colour line (its value, as written), a
// need a block is taken in for (its key), what a ledger lists as made before it (the ledger's
// name), the block of a need that is retired or merged (the need's key), or one slot of the brief
// of one screen (the screen's id in the ledger of screens, a colon, the slot's id). Pattern and
// colour are the owner's calls: an agent that asks one does not go on. One slot asked for every
// screen it concerns is written `screens:principles`, or `screens:model-changes:NAMES`. A slot of a
// screen is not:
// nothing a branch changes tells the gate that a screen was built on an open slot, so the gate
// could not hold the stop; the agent goes on with its recommendation, as for any question.
export const ITEMS = {
  decision: { which: /^[a-z0-9][a-z0-9-]*$/, owners: false },
  pattern: { which: /^[a-z0-9][a-z0-9._-]*$/i, owners: true },
  "source-color": { which: /^\S(?:.*\S)?$/, owners: true },
  need: { which: /^[a-z0-9]+(-[a-z0-9]+)*$/, owners: false },
  before: { which: /^[a-z0-9]+(-[a-z0-9]+)*$/, owners: false },
  block: { which: /^[a-z0-9]+(-[a-z0-9]+)*$/, owners: false },
  exemptions: { which: /^[a-z0-9]+(-[a-z0-9]+)*$/, owners: false },
  screen: { which: new RegExp(`^[^\\s:,/\\\\]+:(${SCREEN_SLOTS.join("|")})$`), owners: false },
  screens: { which: SHARED, owners: false },
};

// The item for one slot of the brief of one screen.
export const screenItem = (screen, slot) => `screen:${screen}:${slot}`;
// The item for one slot asked once for every screen it concerns, with the names it is about where
// the slot takes them.
export const sharedItem = (slot, names = []) =>
  SHARED_SLOTS[slot] ? `screens:${slot}:${names.join("+")}` : `screens:${slot}`;
// The names a shared item is about, or null where it is not one of that slot.
export function sharedNames(item, slot) {
  const head = `screens:${slot}:`;
  return typeof item === "string" && item.startsWith(head) && SHARED.test(item.slice(8))
    ? item.slice(head.length).split("+")
    : null;
}
// Whether a name can stand in a shared item.
export const sharedName = (name) => /^[A-Za-z0-9_.-]+$/.test(String(name));

// How a value answers a question with candidates, by the kind of its item: the name of one
// candidate for a need, the made-by-hand choice included; for what came before a ledger, the names
// of some of them, a comma between each.
const MANY = ["before"];
const kindOf = (item) => (typeof item === "string" ? item.split(":")[0] : null);

// Whether a value may pick several of the candidates of a question.
export const takesMany = (row) => MANY.includes(kindOf(row?.item));

// The names a value picks, for a question with candidates: one, or several split at commas.
export function picked(row, said) {
  const words = String(said ?? "").trim();
  if (!takesMany(row)) return words === "" ? [] : [words];
  return words
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);
}

// Why a value does not answer a question with candidates, or null: it picks at least one, and each
// name it picks is one of them.
export function answerProblem(row, said) {
  if (!Array.isArray(row?.candidates)) return null;
  const names = row.candidates.map((candidate) => candidate?.name);
  const chosen = picked(row, said);
  if (chosen.length === 0) return "the answer names no candidate";
  const strangers = chosen.filter((name) => !names.includes(name));
  if (strangers.length === 0) return null;
  return `${strangers.join(", ")} ${strangers.length === 1 ? "is" : "are"} not among its candidates: ${names.join(", ")}`;
}

// Why the candidates of a question cannot be read, or null: a list of things, each with a name of
// its own.
function candidatesProblem(candidates) {
  if (!Array.isArray(candidates) || candidates.length === 0) {
    return "candidates is a list of the things to pick from, at least one";
  }
  const names = candidates.map((candidate) =>
    candidate && typeof candidate === "object" && !Array.isArray(candidate) ? candidate.name : null,
  );
  if (names.some((name) => typeof name !== "string" || name.trim() === "")) {
    return "each of the candidates is a thing with a name";
  }
  const twice = names.filter((name, index) => names.indexOf(name) !== index);
  return twice.length > 0 ? `candidates names ${twice[0]} twice` : null;
}

// Why the exemptions of a question cannot be read, or null: a list, each with a rule, a file and a
// reason written out.
function exemptionsProblem(exemptions) {
  const written = (value) => typeof value === "string" && value.trim() !== "";
  if (!Array.isArray(exemptions) || exemptions.length === 0) {
    return "exemptions is a list of what an item is let off, at least one";
  }
  return exemptions.every(
    (entry) => written(entry?.rule) && written(entry?.file) && written(entry?.reason),
  )
    ? null
    : "each of the exemptions has a rule, a file and a reason";
}

const DAY = /^\d{4}-\d{2}-\d{2}$/;
// A day that is one: written YYYY-MM-DD, and a date of the calendar (no thirteenth month).
export const isDay = (value) => {
  if (!DAY.test(String(value))) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
};

// Why a written item is not one the gate can name, or null.
export function itemProblem(item) {
  if (typeof item !== "string") return "an item is written kind:which";
  const at = item.indexOf(":");
  const kind = at === -1 ? item : item.slice(0, at);
  // Only a kind of its own: a word every object has, such as constructor, is no kind.
  const rule = Object.hasOwn(ITEMS, kind) ? ITEMS[kind] : undefined;
  if (at === -1 || !rule) {
    return `an item is one of ${Object.keys(ITEMS)
      .map((name) => `${name}:…`)
      .join(", ")}`;
  }
  return rule.which.test(item.slice(at + 1)) ? null : `${item} does not name one ${kind}`;
}

// Whether a question about this item is the owner's to answer before the work goes on.
export const mustAsk = (item) =>
  typeof item === "string" && itemProblem(item) === null && ITEMS[item.split(":")[0]].owners;

// The item for the root colour line of a stylesheet, from the value it holds.
export const colourItem = (value) => `source-color:${String(value).replace(/\s+/g, " ").trim()}`;

// Every way one row cannot be read, one line each. `at` names it.
export function rowProblems(row, at) {
  const found = [];
  for (const key of Object.keys(row)) {
    if (!ROW_KEYS.includes(key)) found.push(`${at}: unknown key '${key}'`);
  }
  if (row.kind !== undefined && !ROW_KINDS.includes(row.kind)) {
    found.push(`${at}: kind must be one of ${ROW_KINDS.join(", ")}`);
  }
  for (const key of ROW_TEXTS) {
    if (row[key] !== undefined && (typeof row[key] !== "string" || row[key].trim() === "")) {
      found.push(`${at}: ${key} is not a written text`);
    }
  }
  if (row.question === undefined) found.push(`${at}: no question`);
  if (row.hard_to_undo !== undefined && typeof row.hard_to_undo !== "boolean") {
    found.push(`${at}: hard_to_undo is true or false`);
  }
  if (row.item !== undefined && itemProblem(row.item)) {
    found.push(`${at}: item: ${itemProblem(row.item)}`);
  }
  if (
    row.replaces !== undefined &&
    !(
      Array.isArray(row.replaces) &&
      row.replaces.length > 0 &&
      row.replaces.every((id) => typeof id === "string" && ID.test(id) && id !== row.id)
    )
  ) {
    found.push(`${at}: replaces is a list of the ids of other questions`);
  }
  const candidates = row.candidates === undefined ? null : candidatesProblem(row.candidates);
  if (candidates) found.push(`${at}: ${candidates}`);
  if (row.exemptions !== undefined && exemptionsProblem(row.exemptions)) {
    found.push(`${at}: ${exemptionsProblem(row.exemptions)}`);
  }
  if (row.asked_on !== undefined && !isDay(row.asked_on)) {
    found.push(`${at}: asked_on is a day written YYYY-MM-DD`);
  }
  const named = row.by !== undefined || row.on !== undefined;
  if (row.kind === "permission") {
    if (row.answer !== undefined || named || row.said !== undefined) {
      found.push(`${at}: a permission carries no answer`);
    }
  } else if (row.answer === undefined) {
    if (named) found.push(`${at}: a name and a date with no answer`);
    if (row.said !== undefined) found.push(`${at}: words with no answer`);
  } else {
    if (!ANSWERS.includes(row.answer)) {
      found.push(`${at}: answer must be one of ${ANSWERS.join(", ")}`);
    }
    if (typeof row.by !== "string" || row.by.trim() === "" || !isDay(row.on)) {
      found.push(`${at}: an answer with no name of who gave it, or no date`);
    }
    if (row.answer === "value" && row.said === undefined) {
      found.push(`${at}: a value with no words`);
    }
    if (row.answer === "value" && row.said !== undefined && row.candidates && !candidates) {
      const problem = answerProblem(row, row.said);
      if (problem) found.push(`${at}: ${problem}`);
    }
  }
  return found;
}

// The id of a question kept as its own file is its file's name: no space, comma or slash, and no
// leading dot, which would hide the file from every reader of the folder. The shared file of
// before 0.7.0 keeps the rule it had, so that a list that was read is still read.
export const ID = /^(?!\.)[^\s,/\\]+$/;
const SHARED_ID = /^[^\s,]+$/;
const byId = (a, b) => a.id.localeCompare(b.id, "en", { numeric: true });

// Every way the rows of a list cannot be read together: ids, and each row on its own. Rows whose
// id a ledger row has are refused, so that an answer names one question.
function rowsProblems(rows, ledgerIds, atOf, rule = ID) {
  const found = [];
  const seen = new Set();
  for (const [index, row] of rows.entries()) {
    const id = typeof row?.id === "string" ? row.id : "";
    const at = atOf(row, index);
    if (row === null || typeof row !== "object" || Array.isArray(row)) {
      found.push(`${at}: is not an object`);
      continue;
    }
    if (!rule.test(id)) {
      found.push(
        `${at}: no id, or an id with a space or a comma in it${rule === ID ? ", a slash, or a dot first" : ""}`,
      );
      continue;
    }
    if (seen.has(id)) found.push(`${at}: a second row has this id`);
    seen.add(id);
    if (ledgerIds.includes(id)) found.push(`${at}: the ledger has a row with this id`);
    found.push(...rowProblems(row, at));
  }
  return found;
}

const isFolder = (full) => existsSync(full) && statSync(full).isDirectory();

// The fragments of the folder: one JSON file per question, named after its id. Anything else in
// the folder that is not a .json file is no question, and is left alone.
function readFolder(root) {
  const folder = path.join(root, WAITING_FOLDER);
  const names = readdirSync(folder)
    .filter((name) => name.endsWith(".json") && !name.startsWith("."))
    .sort();
  const problems = [];
  const lower = new Map();
  for (const name of names) {
    const key = name.toLowerCase();
    if (lower.has(key)) {
      problems.push(
        `${WAITING_FOLDER}/${lower.get(key)} and ${WAITING_FOLDER}/${name} differ only by capitals, so a system that does not tell them apart keeps one`,
      );
    }
    lower.set(key, name);
  }
  const rows = [];
  const files = {};
  for (const name of names) {
    const file = `${WAITING_FOLDER}/${name}`;
    let row;
    try {
      row = JSON.parse(readFileSync(path.join(folder, name), "utf8"));
    } catch {
      problems.push(`${file} is not JSON`);
      continue;
    }
    const id = name.slice(0, -".json".length);
    if (row && typeof row === "object" && row.id !== id) {
      problems.push(
        `${file} holds ${row.id === undefined ? "no id" : `the question ${row.id}`}: a question's file is named after its id, so it is ${WAITING_FOLDER}/${row.id ?? "ID"}.json`,
      );
      continue;
    }
    rows.push(row);
    files[id] = file;
  }
  return { rows, files, problems };
}

// The waiting list of a repository, in whichever shape it keeps it. Null when it has none. Throws
// with every reason when it cannot be read. `ledgerIds` are the ids of the decision ledger.
//   shape  "folder" or "file"
//   rows   the questions and permissions, in the order of their ids for a folder, as written for
//          a file
//   files  where each row is written, by id
//   list   the shared file as data, for the file shape
export function readWaiting(root, ledgerIds = []) {
  const hasFile = existsSync(path.join(root, WAITING_LIST));
  const hasFolder = isFolder(path.join(root, WAITING_FOLDER));
  if (hasFile && hasFolder) {
    throw new Error(
      `${WAITING_LIST} is there beside ${WAITING_FOLDER}, so the waiting list has two sources: the folder is one file per question; split the file into it, or take one away`,
    );
  }
  if (hasFolder) {
    const { rows, files, problems } = readFolder(root);
    problems.push(
      ...rowsProblems(rows, ledgerIds, (row) => files[row?.id] ?? `${WAITING_FOLDER}/?`),
    );
    if (problems.length > 0) throw new Error(problems.join("; "));
    return { shape: "folder", rows: [...rows].sort(byId), files, list: null };
  }
  if (!hasFile) return null;
  let list;
  try {
    list = JSON.parse(readFileSync(path.join(root, WAITING_LIST), "utf8"));
  } catch {
    throw new Error(`${WAITING_LIST} is not JSON`);
  }
  const problems = (() => {
    if (list === null || typeof list !== "object" || Array.isArray(list))
      return ["is not an object"];
    if (typeof list.version !== "number") return ["no version"];
    if (list.version > LIST_VERSION) {
      return [`has version ${list.version}, newer than this plugin reads (${LIST_VERSION})`];
    }
    if (!Array.isArray(list.rows)) return ["no rows"];
    return rowsProblems(
      list.rows,
      ledgerIds,
      (row, index) => (typeof row?.id === "string" && row.id !== "" ? row.id : `row ${index + 1}`),
      SHARED_ID,
    );
  })();
  if (problems.length > 0) throw new Error(`${WAITING_LIST}: ${problems.join("; ")}`);
  const files = Object.fromEntries(list.rows.map((row) => [row.id, WAITING_LIST]));
  return { shape: "file", rows: list.rows, files, list };
}

// The questions the folder holds on disk, as each file reads, whatever else is beside it: what a
// split reads back before it takes the shared file away.
export function folderRows(root) {
  const { rows, problems } = readFolder(root);
  return { rows, problems };
}

// The questions another one replaces, each by its id with the id of the one that replaces it: a
// question waits no longer once a newer one takes its place.
export function replacedBy(rows = []) {
  const found = new Map();
  for (const row of rows) {
    if (row?.kind === "permission" || !Array.isArray(row?.replaces)) continue;
    for (const id of row.replaces) if (!found.has(id)) found.set(id, row.id);
  }
  return found;
}

// The file one question is written to when the list is a folder.
export const questionFile = (id) => `${WAITING_FOLDER}/${id}.json`;
