// The ledger of screens: every screen of the application, its kind and the names of its states, as
// data every tool reads alike. The code says how each state is reached; this file says what there
// is. The gate holds that the two list the same screens, and the repository's own test that they
// list the same states and titles.
import { readYaml } from "./yaml.mjs";

export const SCREEN_LEDGER = "design/screens.yaml";
export const SCREEN_LEDGER_VERSION = 1;

const HEADER = [
  "# The ledger of screens: every screen of the application, as data every tool reads.",
  "#   id      a stable key for the screen",
  "#   route   the path the application opens it at",
  "#   title   the key of its title among the repository's words, or null",
  "#   family  the `nhom` of the page of its kind under design/patterns, or null",
  "#   status  built (the screen exists) | planned (declared ahead, not built yet)",
  "#   states  the names of the states it shows, as the code that reaches them names them",
  "#   shows   the entities of ontology/ it shows",
  "#   entry   the action of ontology/actions.yaml a role must hold to open it, or null for every role",
  "#   actions the actions of ontology/actions.yaml it has buttons for",
  "# The code that reaches each state is the screen list of the application. Keep this file in",
  "# block style.",
];

// The ledger as data: its version, the families it names, and each screen. Null when there is no
// text.
export function readScreenLedger(text) {
  if (text === null || text === undefined) return null;
  const data = readYaml(text);
  const version = data.version;
  return {
    ...data,
    ...(version === undefined
      ? {}
      : { version: /^\d+$/.test(version) ? Number(version) : version }),
    screens: Array.isArray(data.screens) ? data.screens : [],
  };
}

// The screens that exist, each with its route and the names of its states.
export function builtScreens(ledger) {
  return (ledger?.screens ?? [])
    .filter((screen) => (screen.status ?? "built") === "built")
    .map((screen) => ({
      id: screen.id,
      path: screen.route,
      title: screen.title ?? null,
      family: screen.family ?? null,
      states: Array.isArray(screen.states) ? screen.states.map(String) : [],
    }));
}

const quote = (value) =>
  value === null || value === undefined
    ? "null"
    : /^[\w/.\- ]+$/.test(String(value)) && !/^(null|true|false|~|\d+)$/.test(String(value))
      ? String(value)
      : JSON.stringify(String(value));

// The ledger as the text a person and a formatter both keep.
export function renderScreenLedger({ families = {}, screens = [] }) {
  const lines = [...HEADER, `version: ${SCREEN_LEDGER_VERSION}`];
  const named = Object.entries(families);
  if (named.length > 0) {
    lines.push("families:");
    for (const [key, name] of named) lines.push(`  ${key}: ${quote(name)}`);
  }
  lines.push("statuses:", "  - built", "  - planned", "screens:");
  for (const screen of screens) {
    lines.push(`  - id: ${quote(screen.id)}`);
    lines.push(`    route: ${quote(screen.route)}`);
    lines.push(`    title: ${quote(screen.title)}`);
    lines.push(`    family: ${quote(screen.family)}`);
    lines.push(`    status: ${screen.status ?? "built"}`);
    // What the screen shows, opens with and offers, when it says so.
    for (const key of ["shows", "entry", "actions"]) {
      if (!(key in screen)) continue;
      if (Array.isArray(screen[key])) {
        if (screen[key].length === 0) lines.push(`    ${key}: []`);
        else lines.push(`    ${key}:`, ...screen[key].map((name) => `      - ${quote(name)}`));
      } else lines.push(`    ${key}: ${quote(screen[key])}`);
    }
    if ((screen.states ?? []).length > 0) {
      lines.push("    states:");
      for (const state of screen.states) lines.push(`      - ${quote(state)}`);
    }
  }
  return `${lines.join("\n")}\n`;
}

// ---- one file per screen ------------------------------------------------------------------------
// A repository may keep the ledger as a folder: one file per screen, named after the screen's id,
// and one file for everything that is not a screen. Two changes that each add a screen then write
// two files, and never meet in one. What follows is text in and text out; nothing here reads a
// disk, so a repository's own tests can use it as its tools do.

// The file of the folder that holds what is not a screen: the version, the families, the frame.
export const FRAGMENTS_SHARED = "_shared.yaml";
// The line of that file where the screens stood, and stand again when the ledger is joined.
export const FRAGMENTS_MARKER =
  "# screens: one file per screen beside this one, each named after the screen's id";

// The folder a ledger's fragments are kept in: the ledger's own path without its ending.
export const fragmentsFolder = (file) => file.replace(/\.ya?ml$/, "");

// What a ledger kept as fragments is cut by: the key of its list, and the key whose value names
// each file. The ledger of screens is cut by its screens and their ids; another ledger says its own.
export const SCREENS_LIST = { list: "screens", name: "id" };
const isScreens = (spec) => spec.list === "screens" && spec.name === "id";
// The line of the shared part where the list stood: the screens keep the line they always had.
export const fragmentsMarker = (spec = SCREENS_LIST) =>
  isScreens(spec)
    ? FRAGMENTS_MARKER
    : `# ${spec.list}: one file per entry beside this one, each named after its ${spec.name}`;
const entryWord = (spec) => (isScreens(spec) ? "a screen" : "an entry");
const escaped = (key) => key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// The line that opens a ledger's list, whatever signs its key has.
export const listLine = (list, flags = "") => new RegExp(`^${escaped(list)}:`, flags);

// An id that can be the name of a file on every system: plain letters, digits, dot, dash and
// underscore, not starting with the underscore the shared part is told apart by.
const FILE_NAME = /^[A-Za-z0-9](?:[A-Za-z0-9._-]*[A-Za-z0-9_-])?$/;
// Names one widely used system keeps for itself, whatever ending follows them.
const KEPT_NAME = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(\.|$)/i;
const fileName = (id) => FILE_NAME.test(id) && !KEPT_NAME.test(id);
const FRAGMENT = /^[^_.][^/\\]*\.yaml$/;
// Whether a file of the folder is a screen's fragment, by its name.
export const isFragment = (name) => FRAGMENT.test(name);
const idOf = (name) => name.replace(/\.yaml$/, "");
// Fragments are read in the order of their ids, the same on every machine.
const byId = (a, b) => (idOf(a.name) < idOf(b.name) ? -1 : idOf(a.name) > idOf(b.name) ? 1 : 0);

const indentOf = (line) => line.search(/\S/);
const isNote = (line) => line.trim() === "" || line.trim().startsWith("#");
const trimmed = (lines) => {
  const kept = [...lines];
  while (kept.length > 0 && kept[0].trim() === "") kept.shift();
  while (kept.length > 0 && kept.at(-1).trim() === "") kept.pop();
  return kept;
};

// The lines of a ledger's list, entry by entry, with the notes written above each; and the notes
// left after the last one. `problems` says why the list cannot be cut.
function entriesOf(region, spec) {
  const first = region.find((line) => !isNote(line));
  if (first === undefined) return { entries: [], tail: region, problems: [] };
  if (!/^\s*-(\s|$)/.test(first)) {
    return { entries: [], tail: [], problems: [`the list of ${spec.list} is not in block style`] };
  }
  const depth = indentOf(first);
  const entries = [];
  const problems = [];
  let pending = [];
  for (const line of region) {
    const note = isNote(line);
    // A note at the list's own margin belongs to the entry after it.
    if (note && (line.trim() === "" || indentOf(line) <= depth)) pending.push(line);
    else if (!note && indentOf(line) === depth && /^\s*-(\s|$)/.test(line)) {
      entries.push({ depth, lead: pending, lines: [line] });
      pending = [];
    } else if (!note && indentOf(line) <= depth) {
      problems.push(`the line "${line.trim()}" is neither ${entryWord(spec)} nor part of one`);
    } else {
      entries.at(-1).lines.push(...pending, line);
      pending = [];
    }
  }
  return { entries, tail: pending, problems };
}

// One entry as the text of a file of its own: its keys at the left margin, its notes above them.
function fragmentText({ depth, lead, lines }) {
  const body = lines.map((line, index) => {
    if (index === 0) return line.slice(depth).replace(/^-\s?/, "");
    if (line.trim() === "") return "";
    return line.slice(Math.min(indentOf(line), depth + 2));
  });
  const notes = lead.map((line) => line.trim());
  return `${trimmed([...notes, ...body]).join("\n")}\n`;
}

// A ledger kept as one file, cut into the shared part and one fragment per entry, by `spec`. Lines
// are moved, never written again, so a comment or a key of the repository's own goes where its
// entry goes. `problems` is not empty when an entry could not stand as a file of its own; then
// nothing of the result is to be written.
export function splitLedger(text, spec = SCREENS_LIST) {
  const lines = String(text ?? "").split(/\r?\n/);
  const key = listLine(spec.list);
  const at = lines.findIndex((line) => key.test(line));
  if (at === -1) {
    return { shared: "", fragments: [], problems: [`the ledger has no list of ${spec.list}`] };
  }
  const after = lines[at].slice(`${spec.list}:`.length).trim();
  // The reader takes whatever follows the key on its line as the value, a note included: such a
  // ledger already reads as having no screen, and is not cut until the note has a line of its own.
  if (after.startsWith("#")) {
    return {
      shared: "",
      fragments: [],
      problems: [
        `the line of the key ${spec.list} carries a note, which the reader takes for its value: give the note a line of its own`,
      ],
    };
  }
  if (after !== "" && after !== "[]") {
    return {
      shared: "",
      fragments: [],
      problems: [`the list of ${spec.list} is written on one line, not in block style`],
    };
  }
  // The list ends at the next key at the left margin.
  const next = lines.findIndex((line, index) => index > at && /^[^\s#-]/.test(line));
  const end = next === -1 ? lines.length : next;
  const { entries, tail, problems } = entriesOf(lines.slice(at + 1, end), spec);
  const fragments = entries.map((entry) => {
    const own = fragmentText(entry);
    const id = readYaml(own)[spec.name];
    return { id: typeof id === "string" ? id : null, text: own };
  });
  const ids = fragments.map((fragment) => fragment.id);
  if (ids.includes(null)) problems.push(`an entry has no ${spec.name}, so its file has no name`);
  const named = ids.filter((id) => id !== null);
  for (const id of new Set(named)) {
    const count = named.filter((other) => other === id).length;
    if (count > 1)
      problems.push(`${count} entries share the ${spec.name} ${id}, and would be one file`);
    if (!fileName(id)) problems.push(`the ${spec.name} ${id} cannot be the name of a file`);
  }
  // A file system that does not tell capitals from small letters would keep one of the two.
  const folded = [...new Set(named)].sort();
  for (const id of folded) {
    const twin = folded.find((other) => other > id && other.toLowerCase() === id.toLowerCase());
    if (twin)
      problems.push(`${id} and ${twin} would be one file where capitals are not told apart`);
  }
  return {
    shared: [...lines.slice(0, at), fragmentsMarker(spec), ...tail, ...lines.slice(end)].join("\n"),
    fragments: fragments
      .filter((fragment) => fragment.id !== null)
      .map((fragment) => ({ ...fragment, name: `${fragment.id}.yaml` }))
      .sort(byId),
    problems,
  };
}

// The names among `names` that another one equals but for capitals: where capitals are not told
// apart, only one file of each pair can be checked out.
export function twinNames(names) {
  const sorted = [...names].sort();
  return sorted.filter((name) =>
    sorted.some((other) => other !== name && other.toLowerCase() === name.toLowerCase()),
  );
}

// One fragment as an entry of the list: its first key opens the entry, the rest sits under it.
function entryLines(fragment) {
  let opened = false;
  return trimmed(String(fragment.text ?? "").split(/\r?\n/)).map((line) => {
    if (line.trim() === "") return "";
    if (opened) return `    ${line}`;
    if (line.trim().startsWith("#")) return `  ${line}`;
    opened = true;
    return `  - ${line}`;
  });
}

// The shared part and the fragments as the text of one ledger, the entries in the order of the
// names of their files. The list stands where the shared part says it stood, else last.
export function joinLedger(shared, fragments, spec = SCREENS_LIST) {
  const entries = [...(fragments ?? [])].sort(byId).flatMap(entryLines);
  const list = entries.length === 0 ? [`${spec.list}: []`] : [`${spec.list}:`, ...entries];
  const lines = String(shared ?? "").split(/\r?\n/);
  const at = lines.indexOf(fragmentsMarker(spec));
  if (at !== -1) return [...lines.slice(0, at), ...list, ...lines.slice(at + 1)].join("\n");
  return [...trimmed(lines), ...list, ""].join("\n");
}

// The text of the ledger among files given by path, in whichever shape they hold: the folder when
// it has its shared part, else the one file, else null. One reader for both shapes: the tools pass
// the files of a disk, a repository's own test the files its bundler found.
export function ledgerOfFiles(files, file = SCREEN_LEDGER, spec = SCREENS_LIST) {
  const folder = `${fragmentsFolder(file)}/`;
  const entries = Object.entries(files ?? {}).map(([name, text]) => {
    const full = name.replaceAll("\\", "/");
    const at = full.lastIndexOf(folder);
    return { full, text, inFolder: at === -1 ? null : full.slice(at + folder.length) };
  });
  const shared = entries.find((entry) => entry.inFolder === FRAGMENTS_SHARED);
  if (shared) {
    return joinLedger(
      shared.text,
      entries
        .filter((entry) => entry.inFolder !== null && isFragment(entry.inFolder))
        .map((entry) => ({ name: entry.inFolder, text: entry.text })),
      spec,
    );
  }
  return entries.find((entry) => entry.full.endsWith(file))?.text ?? null;
}

// The entries of a ledger's list, and everything beside them.
function listOf(text, spec) {
  if (isScreens(spec)) {
    const { screens, ...rest } = readScreenLedger(text) ?? { screens: [] };
    return { entries: screens, rest };
  }
  const { [spec.list]: entries, ...rest } = readYaml(text ?? "");
  return { entries: Array.isArray(entries) ? entries : [], rest };
}

// Every value a ledger holds, each under a key a person can read: an entry by the key that names
// it, a word of a list by the word, with its place in the list.
function valuesOf(text, spec) {
  const { entries, rest } = listOf(text, spec);
  const found = new Map();
  const walk = (value, at) => {
    if (value === null || typeof value !== "object") found.set(at, JSON.stringify(value));
    else if (Array.isArray(value)) {
      if (value.length === 0) found.set(at, "[]");
      value.forEach((item, index) => {
        if (item === null || typeof item !== "object") found.set(`${at}[${item}]`, String(index));
        else walk(item, `${at}[${index}]`);
      });
    } else {
      if (Object.keys(value).length === 0) found.set(at, "{}");
      for (const [key, item] of Object.entries(value)) walk(item, at === "" ? key : `${at}.${key}`);
    }
  };
  walk(rest, "");
  entries.forEach((entry, index) => {
    const { [spec.name]: id, ...own } = entry ?? {};
    found.set(`${spec.list}[${id ?? index}]`, "listed");
    walk(own, `${spec.list}[${id ?? index}]`);
  });
  return found;
}

// What a ledger holds that another text of it does not, or holds otherwise: the keys, in order.
// Empty when nothing of `before` is lost in `after`.
export function lostEntries(before, after, spec = SCREENS_LIST) {
  const was = valuesOf(before, spec);
  const now = valuesOf(after, spec);
  return [...was.keys()].filter((key) => now.get(key) !== was.get(key)).sort();
}
