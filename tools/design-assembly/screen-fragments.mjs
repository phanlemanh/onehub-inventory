// A ledger on disk in either shape a repository keeps it in: one file, or a folder with one file
// per entry. Two ledgers may be kept so: the ledger of screens, by default, and the intake ledger,
// with --ledger intake. Keeping the folder is the repository's choice, off until it asks:
// --split cuts the one file into fragments, --join takes that back, and --print gives the ledger
// as one text to whatever still reads one. --copy keeps that text as a file at the old path for the
// repository's own readers, written from the folder and kept out of git; --no-copy takes it back.
// Each says first what it will write, and --split stops when an entry would be lost. Nothing here
// touches git.
// Usage: node tools/design-assembly/screen-fragments.mjs [--ledger screens|intake]
//          [--split | --join] [--dry-run] | --print | --copy | --no-copy [--target DIR]
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  realpathSync,
  rmdirSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { argv, cwd, exit, stderr, stdout } from "node:process";
import { fileURLToPath } from "node:url";

import { UNTRACKED } from "./components.mjs";
import { INTAKE_LEDGER, intakeList, keysLine, readIntakeLedger } from "./intake-ledger.mjs";
import { lineWidth, renderJson } from "./json.mjs";
import {
  FRAGMENTS_SHARED,
  fragmentsFolder,
  isFragment,
  joinLedger,
  lostEntries,
  readScreenLedger,
  SCREEN_LEDGER,
  SCREENS_LIST,
  splitLedger,
} from "./screen-ledger.mjs";

// The ledgers a repository may keep as one file per entry, each with the words its messages use,
// what it is cut by, and how one entry is read. `check` is how a fragment is read on its own:
// with the repository's spelling, when the ledger has one, and nothing else of the shared part.
export const FRAGMENT_LEDGERS = {
  screens: {
    file: SCREEN_LEDGER,
    name: "ledger of screens",
    one: "screen",
    many: "screens",
    by: "id",
    canonical: "screens",
    cut: () => SCREENS_LIST,
    entries: (text) => readScreenLedger(text)?.screens ?? [],
    stub: () => "version: 1\n",
    holds: (id) => `the screen ${id}`,
    named: () => "the screen's id",
    sample: "id: another\nroute: /another\n",
  },
  intake: {
    file: INTAKE_LEDGER,
    name: "intake ledger",
    one: "block",
    many: "blocks",
    by: "need",
    canonical: "blocks",
    cut: (text) => intakeList(text),
    entries: (text) => readIntakeLedger(text)?.blocks ?? [],
    stub: (shared) => `version: 1\n${keysLine(readIntakeLedger(shared)?.spelled)}`,
    holds: (need) => `the block for the need ${need}`,
    named: (by) => (by === "need" ? "the need" : `the need (${by})`),
    sample: "name: Another\nneed: another\n",
  },
};
// The ledger a check of fragments, or of a copy kept out of git, belongs to.
export const ledgerOf = (check) => (check?.of in FRAGMENT_LEDGERS ? check.of : "screens");
// What a check carries to say which ledger it belongs to: nothing for the screens, as before.
const ofField = (kind) => (kind === "screens" ? {} : { of: kind });

// The check that says a repository keeps its ledger of screens as fragments, as the tool data
// lists it. It joins the checks of the decision that holds the shapes of the ledgers: a repository
// the guide built and one that adopted both have that decision.
export const FRAGMENTS = "screen-fragments";
export const SHAPES_DECISION = "ledger-shapes";
const THEME = "design/theme.json";

const read = (root, file) =>
  existsSync(path.join(root, file)) ? readFileSync(path.join(root, file), "utf8") : null;

// The fragments a repository keeps for the ledger at `file`: the shared part and one text per
// entry, in the order of the names of their files; `beside` says the one file is there as well,
// and `besideText` is what it holds; `ledger` is which ledger it is. Null when the folder does not
// hold the shared part: a folder of that name with other things in it is not a ledger.
export function readFragments(root, file = SCREEN_LEDGER, kind = "screens") {
  const folder = fragmentsFolder(file);
  const shared = read(root, `${folder}/${FRAGMENTS_SHARED}`);
  if (shared === null) return null;
  const names = readdirSync(path.join(root, folder), { withFileTypes: true })
    .filter((entry) => entry.isFile() && isFragment(entry.name))
    .map((entry) => entry.name)
    .sort();
  return {
    folder,
    shared,
    fragments: names.map((name) => ({
      name,
      file: `${folder}/${name}`,
      text: readFileSync(path.join(root, folder, name), "utf8"),
    })),
    beside: existsSync(path.join(root, file)),
    besideText: read(root, file),
    ledger: kind,
  };
}

// What the fragments read give as the text of one ledger.
export function joinFound(found) {
  const cut = FRAGMENT_LEDGERS[found.ledger ?? "screens"].cut(found.shared);
  return joinLedger(found.shared, found.fragments, cut);
}

// A ledger as one text, whichever shape the repository keeps: the folder when it is there, else
// the one file, else null. Every tool of this plugin reads such a ledger through here; a ledger
// that is never kept as fragments is read as its one file.
export function ledgerText(root, file = SCREEN_LEDGER, kind = "screens") {
  if (!(kind in FRAGMENT_LEDGERS)) return read(root, file);
  const found = readFragments(root, file, kind);
  return found ? joinFound(found) : read(root, file);
}

// Whether a check is one of `kind`'s, of the sort given: its fragments, or its copy.
const mine = (sort, kind) => (check) => check?.kind === sort && ledgerOf(check) === kind;

// The checks to list beside the ledger's own when the checks of its decision are built again: the
// repository keeps fragments when its disk has them, or when its tool data already says so, and a
// copy kept out of git when its tool data says so. Each choice is carried, never made here, and the
// copy follows the ledger when its path changes. Each ledger's choices are its own.
export function fragmentsChecks(root, theme, file = SCREEN_LEDGER, kind = "screens") {
  const asked = Object.values(theme?.checks ?? {})
    .flat()
    .some(mine(FRAGMENTS, kind));
  if (!asked && readFragments(root, file, kind) === null) return [];
  const copy = (theme?.checks?.[SHAPES_DECISION] ?? []).some(mine(UNTRACKED, kind));
  return [
    { kind: FRAGMENTS, ...ofField(kind), file, fragments: fragmentsFolder(file) },
    ...(copy ? [{ kind: UNTRACKED, ...ofField(kind), file }] : []),
  ];
}

// The tool data with the ledger kept as fragments, or as one file again. Only the ledger's own
// check changes: another ledger's stays, and data that already says so, or that does not hold the
// ledgers at all, comes back as it was.
export function withFragments(theme, file, on, kind = "screens") {
  const checks = theme?.checks?.[SHAPES_DECISION];
  if (!Array.isArray(checks)) return theme;
  const has = checks.some((check) => mine(FRAGMENTS, kind)(check) && check.file === file);
  if (on === has) return theme;
  const others = checks.filter((check) => !mine(FRAGMENTS, kind)(check));
  const next = on
    ? [...others, { kind: FRAGMENTS, ...ofField(kind), file, fragments: fragmentsFolder(file) }]
    : others;
  return { ...theme, checks: { ...theme.checks, [SHAPES_DECISION]: next } };
}

// The tool data with a copy of the ledger kept out of git at `file`, or with none. As with the
// fragments, only the ledger's own check changes.
export function withCopy(theme, file, on, kind = "screens") {
  const checks = theme?.checks?.[SHAPES_DECISION];
  if (!Array.isArray(checks)) return theme;
  const has = checks.some((check) => mine(UNTRACKED, kind)(check) && check.file === file);
  if (on === has) return theme;
  const others = checks.filter((check) => !mine(UNTRACKED, kind)(check));
  const next = on ? [...others, { kind: UNTRACKED, ...ofField(kind), file }] : others;
  return { ...theme, checks: { ...theme.checks, [SHAPES_DECISION]: next } };
}

// Whether the one file beside the folder is the copy the repository asked for, as it must be.
function isCopy(root, file, found) {
  const kept = (themeOf(root)?.checks?.[SHAPES_DECISION] ?? []).some(
    (check) => check?.kind === UNTRACKED && check.file === file,
  );
  return kept && found.besideText === joinFound(found);
}

// The tool data of the repository, or null when it has none that reads.
function themeOf(root) {
  try {
    return JSON.parse(read(root, THEME) ?? "null");
  } catch {
    return null;
  }
}

// The path the repository's gate names for the ledger, else the usual one.
function ledgerFile(root, kind) {
  const named = (themeOf(root)?.checks?.[SHAPES_DECISION] ?? [])
    .map((check) => check?.ledgers?.[kind])
    .find((file) => typeof file === "string");
  return named ?? FRAGMENT_LEDGERS[kind].file;
}

// Writes the choice into the tool data, and says whether a gate holds the ledger here. One file
// again keeps no copy either.
function record(root, file, on, kind) {
  const theme = themeOf(root);
  const next = on
    ? withFragments(theme, file, true, kind)
    : withCopy(withFragments(theme, file, false, kind), file, false, kind);
  if (next !== theme) writeFileSync(path.join(root, THEME), renderJson(next, lineWidth(root)));
  return Array.isArray(theme?.checks?.[SHAPES_DECISION]);
}

const count = (n, L) => `${n} ${n === 1 ? L.one : L.many}`;
// The key the entries are named by, after "their": the contract's in the plural, a repository's
// own as it spells it.
const their = (name, L) => (name === L.by ? `${L.by}s` : name);

// What cutting the one file into fragments would write, and why it must not.
export function splitPlan(root, file = SCREEN_LEDGER, kind = "screens") {
  const L = FRAGMENT_LEDGERS[kind];
  const folder = fragmentsFolder(file);
  const before = read(root, file);
  const cut = L.cut(before);
  const { shared, fragments, problems } = splitLedger(before, cut);
  const joined = joinLedger(shared, fragments, cut);
  const stops = [...problems];
  if (problems.length === 0) {
    const lost = lostEntries(before, joined, cut);
    const gained = lostEntries(joined, before, cut);
    if (lost.length > 0) stops.push(`read back, the fragments lose ${lost.slice(0, 5).join(", ")}`);
    if (gained.length > 0) {
      stops.push(
        `read back, the fragments say what the file does not: ${gained.slice(0, 5).join(", ")}`,
      );
    }
  }
  // A file already in the folder under a fragment's name would be read as a screen from then on.
  const there = existsSync(path.join(root, folder))
    ? readdirSync(path.join(root, folder)).filter((name) => isFragment(name))
    : [];
  if (there.length > 0) {
    stops.push(
      `${folder} already holds ${there.slice(0, 5).join(", ")}, which would be read as ${there.length === 1 ? `a ${L.one}` : L.many}: move ${there.length === 1 ? "it" : "them"} first`,
    );
  }
  return {
    file,
    folder,
    writes: [
      { file: `${folder}/${FRAGMENTS_SHARED}`, text: shared },
      ...fragments.map((fragment) => ({ file: `${folder}/${fragment.name}`, text: fragment.text })),
    ],
    entries: fragments.length,
    cut,
    stops,
  };
}

function split(root, file, dry, kind) {
  const L = FRAGMENT_LEDGERS[kind];
  const NAME = L.name;
  const folder = fragmentsFolder(file);
  const found = readFragments(root, file, kind);
  if (found?.beside && !isCopy(root, file, found)) {
    stderr.write(
      `${NAME}: ${file} is there beside ${folder}, which already holds the fragments. The folder is what is read: remove ${file}, or take the folder away and split again. Nothing was written.\n`,
    );
    return 1;
  }
  if (found) {
    // The fragments are there; the tool data is brought in line when it did not say so yet.
    if (!dry) record(root, file, true, kind);
    stdout.write(
      `${NAME}: already one file per ${L.one} under ${folder} (${count(found.fragments.length, L)}); nothing to split\n`,
    );
    return 0;
  }
  if (read(root, file) === null) {
    stdout.write(`${NAME}: this repository has no ${NAME} (${file}); nothing to split\n`);
    return 0;
  }
  const plan = splitPlan(root, file, kind);
  if (plan.stops.length > 0) {
    stderr.write(
      `${NAME}: ${file} cannot be cut into one file per ${L.one}: ${plan.stops.join("; ")}. Nothing was written.\n`,
    );
    return 1;
  }
  stdout.write(`${NAME}: ${file} becomes one file per ${L.one} under ${folder}\n`);
  for (const item of plan.writes) stdout.write(`  create ${item.file}\n`);
  stdout.write(`  remove ${file}\n`);
  stdout.write(
    `  ${count(plan.entries, L)}, each in a file named after its ${plan.cut.name}; read back, no entry is lost\n`,
  );
  stdout.write(
    `  the ${L.many} are read in the order of their ${their(plan.cut.name, L)} from now on\n`,
  );
  if (dry) {
    stdout.write("  nothing was written (--dry-run)\n");
    return 0;
  }
  const before = read(root, file);
  const made = !existsSync(path.join(root, folder));
  // Everything this run wrote is taken away again when a step fails, so a repository is never
  // left with half a folder beside its one file.
  const written = [];
  const undo = () => {
    for (const name of written) {
      if (existsSync(path.join(root, name))) unlinkSync(path.join(root, name));
    }
    if (made && existsSync(path.join(root, folder))) rmdirSync(path.join(root, folder));
  };
  try {
    mkdirSync(path.join(root, folder), { recursive: true });
    for (const item of plan.writes) {
      written.push(item.file);
      writeFileSync(path.join(root, item.file), item.text);
    }
    // What the disk now gives is read once more before the one file goes.
    const now = ledgerText(root, file, kind);
    const lost = [...lostEntries(before, now, plan.cut), ...lostEntries(now, before, plan.cut)];
    if (lost.length > 0) {
      undo();
      stderr.write(
        `${NAME}: read back from the disk, the fragments differ from ${file} at ${lost.slice(0, 5).join(", ")}. They were taken away again; nothing was changed.\n`,
      );
      return 1;
    }
    unlinkSync(path.join(root, file));
  } catch (error) {
    try {
      undo();
    } catch {
      // What could not be taken away is named by the gate: the one file beside the folder.
    }
    stderr.write(
      `${NAME}: the fragments could not be written (${String(error?.message ?? error)
        .split("\n")[0]
        .replaceAll(root, ".")}). What was written was taken away again; ${file} is as it was.\n`,
    );
    return 1;
  }
  const held = record(root, file, true, kind);
  stdout.write(
    held
      ? `  the choice is written in ${THEME}: the gate holds each fragment to its name and its shape\n`
      : `  no gate here holds the ${NAME}, so nothing checks the fragments in this repository\n`,
  );
  stdout.write(
    `  to finish: commit the folder and the removal of ${file} in one change. Whatever of the repository's own still reads ${file} must read the folder now; --print gives the ledger as one text\n`,
  );
  return 0;
}

function join(root, file, dry, kind) {
  const L = FRAGMENT_LEDGERS[kind];
  const NAME = L.name;
  const folder = fragmentsFolder(file);
  const found = readFragments(root, file, kind);
  if (!found) {
    const one = read(root, file);
    stdout.write(
      one === null
        ? `${NAME}: this repository has no ${NAME} (${file}); nothing to join\n`
        : `${NAME}: already one file, ${file}; nothing to join\n`,
    );
    if (one !== null && !dry) record(root, file, false, kind);
    return 0;
  }
  // The copy the repository asked for is the joined text already, so it is written over; any
  // other file there would be lost.
  const copied = found.beside && isCopy(root, file, found);
  if (found.beside && !copied) {
    stderr.write(
      `${NAME}: ${file} is there beside ${folder}, and joining would write over it. Remove it first; the folder is what is read. Nothing was written.\n`,
    );
    return 1;
  }
  const text = joinFound(found);
  const removes = [`${folder}/${FRAGMENTS_SHARED}`, ...found.fragments.map((item) => item.file)];
  stdout.write(`${NAME}: the fragments under ${folder} become one file again\n`);
  stdout.write(`  create ${file}\n`);
  for (const name of removes) stdout.write(`  remove ${name}\n`);
  stdout.write(
    `  ${count(found.fragments.length, L)}, in the order of their ${their(L.cut(found.shared).name, L)}\n`,
  );
  if (dry) {
    stdout.write("  nothing was written (--dry-run)\n");
    return 0;
  }
  // The fragments are kept in hand until the one file is written and they are all gone: when a
  // step fails they are put back, and the one file is taken away again.
  const kept = removes.map((name) => [name, readFileSync(path.join(root, name), "utf8")]);
  try {
    writeFileSync(path.join(root, file), text);
    for (const name of removes) unlinkSync(path.join(root, name));
  } catch (error) {
    try {
      for (const [name, was] of kept) writeFileSync(path.join(root, name), was);
      if (existsSync(path.join(root, file))) unlinkSync(path.join(root, file));
    } catch {
      // What could not be put back is named by the gate: the one file beside the folder.
    }
    stderr.write(
      `${NAME}: the one file could not be written (${String(error?.message ?? error)
        .split("\n")[0]
        .replaceAll(root, ".")}). The fragments were put back; nothing was changed.\n`,
    );
    return 1;
  }
  // The folder goes when nothing of the repository's own is left in it.
  if (readdirSync(path.join(root, folder)).length === 0) rmdirSync(path.join(root, folder));
  record(root, file, false, kind);
  stdout.write(
    copied
      ? `  to finish: take ${file} out of .gitignore, then commit it and the removal of the fragments in one change\n`
      : `  to finish: commit ${file} and the removal of the fragments in one change\n`,
  );
  return 0;
}

// Keeps a copy of the ledger as one file at its old path, for whatever of the repository's own
// reads that path, or stops keeping it. The copy is written by the gate and by derived.mjs, never
// by hand: the folder is the ledger.
function copy(root, file, on, kind) {
  const NAME = FRAGMENT_LEDGERS[kind].name;
  const folder = fragmentsFolder(file);
  const found = readFragments(root, file, kind);
  const theme = themeOf(root);
  if (on && !found) {
    stderr.write(
      `${NAME}: ${file} is one file, so there is no folder to copy it from: run --split first. Nothing was written.\n`,
    );
    return 1;
  }
  if (on && !Array.isArray(theme?.checks?.[SHAPES_DECISION])) {
    stderr.write(
      `${NAME}: no gate here holds the ${NAME}, so nothing would write the copy. Nothing was written.\n`,
    );
    return 1;
  }
  const next = withCopy(theme, file, on, kind);
  if (next === theme) {
    stdout.write(
      on
        ? `${NAME}: ${file} is kept as a copy of ${folder} already; nothing to change\n`
        : `${NAME}: no copy of ${folder} is kept; nothing to change\n`,
    );
    return 0;
  }
  writeFileSync(path.join(root, THEME), renderJson(next, lineWidth(root)));
  if (on) {
    stdout.write(
      `${NAME}: ${file} is kept as a copy of ${folder} from now on, for whatever of this repository's own reads that path\n`,
    );
    stdout.write(
      "  the gate and derived.mjs write it from the folder, which stays the ledger: a change goes there, and the copy is written over\n",
    );
    stdout.write(
      `  to finish: add ${file} to .gitignore; the gate is red while git tracks the file or does not ignore it\n`,
    );
    return 0;
  }
  // A copy that matches the folder is the tool's own, and goes; one edited by hand is left.
  if (found?.beside && found.besideText === joinFound(found)) {
    unlinkSync(path.join(root, file));
    stdout.write(`${NAME}: the copy of ${folder} is no longer kept; ${file} was taken away\n`);
  } else if (found?.beside) {
    stdout.write(
      `${NAME}: the copy of ${folder} is no longer kept; ${file} differs from the folder, so it was left: remove it, the folder is the ledger\n`,
    );
  } else stdout.write(`${NAME}: the copy of ${folder} is no longer kept\n`);
  stdout.write(`  you may take ${file} out of .gitignore\n`);
  return 0;
}

function print(root, file, kind) {
  const NAME = FRAGMENT_LEDGERS[kind].name;
  const text = ledgerText(root, file, kind);
  if (text === null) {
    stderr.write(`${NAME}: this repository has no ${NAME} (${file})\n`);
    return 0;
  }
  stdout.write(text);
  return 0;
}

const MODES = ["--split", "--join", "--print", "--copy", "--no-copy"];
const USAGE =
  "screen-fragments.mjs [--ledger screens|intake] [--split | --join] [--dry-run] | --print | --copy | --no-copy [--target DIR]";

function main(args) {
  const at = args.indexOf("--target");
  const folder = at === -1 ? null : args[at + 1];
  const which = args.indexOf("--ledger");
  const kind = which === -1 ? "screens" : args[which + 1];
  const NAME = FRAGMENT_LEDGERS[kind]?.name ?? FRAGMENT_LEDGERS.screens.name;
  if (at !== -1 && (folder === undefined || folder.startsWith("--"))) {
    stderr.write(`${NAME}: --target takes a folder. Usage: ${USAGE}\n`);
    return 1;
  }
  if (!Object.hasOwn(FRAGMENT_LEDGERS, kind ?? "")) {
    stderr.write(
      `${NAME}: --ledger takes one of ${Object.keys(FRAGMENT_LEDGERS).join(", ")}. Usage: ${USAGE}\n`,
    );
    return 1;
  }
  const values = [at, which].filter((index) => index !== -1).map((index) => index + 1);
  const unknown = args.filter(
    (arg, index) =>
      !values.includes(index) && ![...MODES, "--dry-run", "--target", "--ledger"].includes(arg),
  );
  if (unknown.length > 0) {
    stderr.write(`${NAME}: ${unknown.join(", ")} is not understood. Usage: ${USAGE}\n`);
    return 1;
  }
  const root = folder === null ? cwd() : path.resolve(folder);
  const asked = MODES.filter((flag) => args.includes(flag));
  if (asked.length > 1) {
    stderr.write(`${NAME}: give one of ${MODES.join(", ")}, not ${asked.join(" and ")}\n`);
    return 1;
  }
  const dry = args.includes("--dry-run");
  if (dry && !["--split", "--join"].includes(asked[0])) {
    stderr.write(`${NAME}: --dry-run goes with --split or --join. Usage: ${USAGE}\n`);
    return 1;
  }
  const file = ledgerFile(root, kind);
  if (asked[0] === "--split") return split(root, file, dry, kind);
  if (asked[0] === "--join") return join(root, file, dry, kind);
  if (asked[0] === "--print") return print(root, file, kind);
  if (asked[0] === "--copy") return copy(root, file, true, kind);
  if (asked[0] === "--no-copy") return copy(root, file, false, kind);
  // Asked nothing: which shape the repository keeps.
  const L = FRAGMENT_LEDGERS[kind];
  const found = readFragments(root, file, kind);
  const one = read(root, file);
  if (found) {
    stdout.write(
      `${NAME}: one file per ${L.one}, ${found.folder} (${count(found.fragments.length, L)}); --join makes it one file again\n`,
    );
  } else if (one !== null) {
    stdout.write(
      `${NAME}: one file, ${file} (${count(L.entries(one).length, L)}); --split keeps it as one file per ${L.one}\n`,
    );
  } else stdout.write(`${NAME}: this repository has no ${NAME} (${file})\n`);
  return 0;
}

// Runs only when this file is the script. Real paths on both sides: a folder reached through a
// link would otherwise look like an import.
if (argv[1] && realpathSync(argv[1]) === realpathSync(fileURLToPath(import.meta.url))) {
  exit(main(argv.slice(2)));
}
