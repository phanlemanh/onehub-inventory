// Writes again every derived file a repository keeps out of git: the component manifest from the
// components, and the copy of a ledger kept as fragments (the screens, the intake) as one file
// from the folder that is the ledger.
// A clean checkout has none of them, so whatever reads one runs this first: the gate does, and the
// plugin's make step does before the tests. A repository that keeps none out of git gets nothing.
// Usage: node tools/design-assembly/derived.mjs [--quiet] [--target DIR]
// --quiet says only what it wrote, for a step that runs it every time.
import { existsSync, mkdirSync, readFileSync, realpathSync, writeFileSync } from "node:fs";
import path from "node:path";
import { argv, cwd, exit, stderr, stdout } from "node:process";
import { fileURLToPath } from "node:url";

import { componentsProblem, regenerated, UNTRACKED } from "./components.mjs";
import { newerProblem } from "./contract.mjs";
import { FRAGMENTS, joinFound, ledgerOf, readFragments } from "./screen-fragments.mjs";

const THEME = "design/theme.json";

const read = (root, file) => {
  const full = path.join(root, file);
  return existsSync(full) ? readFileSync(full, "utf8") : null;
};

// The files the repository's tool data keeps out of git, each once.
export function keptOutOfGit(theme) {
  const checks = Object.values(theme?.checks ?? {}).flat();
  return [
    ...new Set(checks.filter((check) => check?.kind === UNTRACKED).map((check) => check.file)),
  ];
}

// Whether a manifest on disk has a shape newer than this tool writes. Text that is not JSON has none.
function newerManifest(text) {
  if (text === null) return false;
  try {
    return newerProblem("components", JSON.parse(text)) !== null;
  } catch {
    return false;
  }
}

// The ledger a copy kept out of git is of: the one whose fragments the tool data keeps at that path.
function copyOf(theme, file) {
  const checks = Object.values(theme?.checks ?? {}).flat();
  const held = checks.find(
    (check) => (check?.kind === FRAGMENTS || check?.kind === UNTRACKED) && check.file === file,
  );
  return ledgerOf(held);
}

// What each file kept out of git should hold, with where it comes from. A file of a newer shape
// is left alone, and so is a copy whose folder is not there: the gate says so.
function wanted(root, files, theme) {
  const plans = [];
  const made = regenerated(root);
  if (made && files.includes(made.file)) {
    const before = read(root, made.file);
    const stale =
      before === null ||
      componentsProblem(before, made.files, made.file, made.read, made.options) !== null;
    if (!newerManifest(before)) {
      plans.push({ file: made.file, from: "the source", text: made.content, stale });
    }
  }
  for (const file of files.filter((name) => name !== made?.file)) {
    const found = readFragments(root, file, copyOf(theme, file));
    if (!found) continue;
    const text = joinFound(found);
    plans.push({ file, from: found.folder, text, stale: read(root, file) !== text });
  }
  return plans;
}

// Writes what is missing or out of date, and says what it wrote: `kept` is how many files the
// repository keeps out of git, `written` the ones written now, each with where it comes from.
// Tool data that is not JSON is named, never read as if it kept nothing.
export function drawDerived(root) {
  const theme = read(root, THEME);
  if (theme === null) return { kept: 0, written: [] };
  let data;
  try {
    data = JSON.parse(theme);
  } catch (error) {
    throw new Error(`${THEME} is not JSON (${String(error?.message ?? error).split("\n")[0]})`, {
      cause: error,
    });
  }
  const files = keptOutOfGit(data);
  if (files.length === 0) return { kept: 0, written: [] };
  const written = [];
  for (const plan of wanted(root, files, data)) {
    if (!plan.stale) continue;
    const full = path.join(root, plan.file);
    mkdirSync(path.dirname(full), { recursive: true });
    writeFileSync(full, plan.text);
    written.push({ file: plan.file, from: plan.from });
  }
  return { kept: files.length, written };
}

const USAGE = "derived.mjs [--quiet] [--target DIR]";

function main(args) {
  const at = args.indexOf("--target");
  const folder = at === -1 ? null : args[at + 1];
  if (at !== -1 && (folder === undefined || folder.startsWith("--"))) {
    stderr.write(`derived files: --target takes a folder. Usage: ${USAGE}\n`);
    return 1;
  }
  // Everything but --quiet, --target and its folder.
  const unknown = args.filter(
    (arg, index) => arg !== "--quiet" && (at === -1 || (index !== at && index !== at + 1)),
  );
  if (unknown.length > 0) {
    stderr.write(`derived files: ${unknown.join(", ")} is not understood. Usage: ${USAGE}\n`);
    return 1;
  }
  const root = folder === null ? cwd() : path.resolve(folder);
  const quiet = args.includes("--quiet");
  let drawn;
  try {
    drawn = drawDerived(root);
  } catch (error) {
    stderr.write(`derived files: ${error.message}. Nothing was written.\n`);
    return 1;
  }
  const { kept, written } = drawn;
  for (const item of written) stdout.write(`derived files: wrote ${item.file} from ${item.from}\n`);
  if (quiet || written.length > 0) return 0;
  stdout.write(
    kept === 0
      ? "derived files: this repository keeps no derived file out of git\n"
      : `derived files: ${kept} kept out of git, all up to date\n`,
  );
  return 0;
}

// Runs only when this file is the script. Real paths on both sides: a folder reached through a
// link would otherwise look like an import.
if (argv[1] && realpathSync(argv[1]) === realpathSync(fileURLToPath(import.meta.url))) {
  exit(main(argv.slice(2)));
}
