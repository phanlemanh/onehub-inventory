// The decision ledger stands in for the head of design: the machine chooses from the ledger and
// the components, and asks for what only the owner decides. Two checks of the gate hold it.
//
//   decision-sheet  every choice points at a row, and every judgment nobody confirmed waits on the
//                   decision sheet: red for a judgment this branch writes that no person answered
//                   and no question asks, for source that goes around a decided scale, and for a
//                   test that proves a decision the ledger has no row for
//   owner-calls     the wall: a branch that adds a page of a kind of screen, or changes the root
//                   colour line, is red until the waiting list holds the owner's answer that keeps
//                   that very item
//
// What a branch adds is read from git, against where the branch left the main one, with what is
// not committed yet. Outside git nothing is compared, and the checks say so instead of failing.
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

import { parseLedger } from "./ledger.mjs";
import { NOT_A_KIND } from "./screens.mjs";
import { colourItem, STAMP, UNCONFIRMED } from "./waiting.mjs";

// How source goes around a decision about using a scale: a raw value where a role or a step of
// the scale is decided. One detector, read by the audit and by the gate.
export const BYPASS = {
  "color-role": /\[#[0-9a-fA-F]{3,8}\]|["'`\s:]#[0-9a-fA-F]{6}\b/g,
  "type-scale": /\btext-\[[^\]]*(?:px|rem|em)\]/g,
  spacing: /\b(?:p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|space-x|space-y)-\[[^\]]+\]/g,
  radius: /\brounded(?:-[a-z]{1,2})?-\[[^\]]+\]/g,
};
// Code the repository did not write: a vendor's components are not the repository's decisions.
export const VENDOR = /(^|\/)components\/(ui|reui)\//;
const MARKUP = /\.[jt]sx$/;

// For each decision of BYPASS, how many places in source go around it and in which files.
// `sources` maps a file to its text.
export function bypasses(sources) {
  const result = Object.fromEntries(Object.keys(BYPASS).map((id) => [id, { count: 0, files: [] }]));
  for (const [file, text] of Object.entries(sources ?? {})) {
    if (!MARKUP.test(file) || VENDOR.test(file)) continue;
    for (const [id, pattern] of Object.entries(BYPASS)) {
      const hits = (text ?? "").match(pattern)?.length ?? 0;
      if (hits > 0) {
        result[id].count += hits;
        result[id].files.push(`${file} (${hits})`);
      }
    }
  }
  return result;
}

// A repository's own test that names a decision with `decision:<id>` is a proof of it: the tag is
// how a ledger row points at a test. Read from the usual test folder.
export function taggedTests(root, folder = "tests") {
  const found = [];
  const walk = (dir) => {
    const full = path.join(root, dir);
    if (!existsSync(full)) return;
    for (const name of readdirSync(full).sort()) {
      const file = path.posix.join(dir, name);
      if (statSync(path.join(root, file)).isDirectory()) walk(file);
      else if (/\.(test|spec)\.[cm]?[jt]sx?$/.test(name)) {
        const text = readFileSync(path.join(root, file), "utf8");
        const kind = /(^|\/)e2e\/|\.spec\./.test(file) ? "e2e" : "test";
        for (const tag of text.matchAll(/decision:([a-z][a-z0-9-]*)/g)) {
          found.push({ id: tag[1], check: `${kind}:${file}` });
        }
      }
    }
  };
  walk(folder);
  return found;
}

// The root colour line of a stylesheet: the value of the last --primary declared in a top-level
// :root block, as written, its spaces made one. Null when there is none.
export function rootColour(css) {
  let value = null;
  for (const block of String(css ?? "").matchAll(/(?:^|\n)\s*:root\s*\{([^}]*)\}/g)) {
    for (const line of block[1].matchAll(/--primary\s*:\s*([^;]+);/g)) {
      value = line[1].replace(/\s+/g, " ").trim();
    }
  }
  return value;
}

// Where a main branch is, by the first of these names git knows.
// The remote's own names first: a local main that was not pulled lags behind where the branch left.
const MAINS = ["origin/HEAD", "origin/main", "origin/master", "main", "master"];
const NO_MAIN = `name the main branch with "main" on the check in design/theme.json, or fetch it (a checkout in continuous integration needs its history: fetch-depth: 0)`;
const pageName = (file) => path.posix.basename(file, ".md");
const isPage = (name) => name.endsWith(".md") && !NOT_A_KIND.includes(name);

// What this branch adds, read from git: its base, the pages of kinds of screen that were not there,
// the root colour line there and now, and the judgments of the ledger it writes or changes.
// Null outside git. With `problem` when git is there and cannot say. With `born` when the base has
// no decision ledger, and nothing else. `main` names the main branch where it has another name.
export function branchFacts(root, { pages, stylesheet, ledger, main: named = null }) {
  const git = (...args) =>
    spawnSync("git", ["-C", root, ...args], { encoding: "utf8", maxBuffer: 1 << 30 });
  const inside = git("rev-parse", "--is-inside-work-tree");
  if (inside.error) return null;
  if (inside.status !== 0) {
    const said = (inside.stderr ?? "").trim();
    if (/not a git repository/i.test(said)) return null;
    return { problem: said.split("\n")[0] || "git gave no reason" };
  }
  // No commit yet: the repository starts here, with the person who answers, and there is nothing
  // before it to compare with.
  if (git("rev-parse", "--verify", "--quiet", "HEAD").status !== 0) return unborn(null, null);
  const known = (name) => git("rev-parse", "--verify", "--quiet", `${name}^{commit}`).status === 0;
  if (named !== null && !known(named)) {
    return {
      problem: `the main branch the tool data names, ${named}, is not one git knows: ${NO_MAIN}`,
    };
  }
  // Each main branch git knows, with where this branch left it. The newest of those is the base: a
  // fork point every other one is an ancestor of.
  const forks = (named === null ? MAINS.filter(known) : [named])
    .map((name) => ({ name, base: git("merge-base", "HEAD", name).stdout.trim() }))
    .filter((fork) => fork.base !== "");
  if (forks.length === 0) {
    const tried = named === null ? MAINS.filter(known) : [named];
    return {
      problem:
        tried.length === 0
          ? `no main branch to compare with (none of ${MAINS.join(", ")}): ${NO_MAIN}`
          : `this branch shares no history with ${tried.join(" or ")}`,
    };
  }
  const isAncestor = (a, b) => git("merge-base", "--is-ancestor", a, b).status === 0;
  const { name: main, base } =
    forks.find((fork) => forks.every((other) => isAncestor(other.base, fork.base))) ?? forks[0];
  // A file at the base, named from the target: its text, or null where the base has no such file.
  // Anything else git says is not an absence, and is thrown, never read as "nothing there".
  const atBase = (file) => {
    const run = git("show", `${base}:./${file}`);
    if (run.status === 0) return run.stdout;
    const listed = git("ls-tree", "--name-only", base, "--", file);
    if (listed.status === 0 && listed.stdout.trim() === "") return null;
    throw new Error(
      `git could not read ${file} at ${base}: ${
        String(run.stderr || listed.stderr)
          .trim()
          .split("\n")[0]
      }`,
    );
  };
  try {
    return compare({ root, git, base, main, pages, stylesheet, ledger, atBase });
  } catch (error) {
    return { problem: error.message };
  }
}

// What the branch adds, once its base is known.
function compare({ root, git, base, main, pages, stylesheet, ledger, atBase }) {
  const read = (file) =>
    existsSync(path.join(root, file)) ? readFileSync(path.join(root, file), "utf8") : null;

  const listed = git("ls-tree", "-r", "--name-only", "-z", base, "--", `${pages}/`);
  if (listed.status !== 0) return { problem: `git could not list ${pages} at ${base}` };
  const before = new Set(
    listed.stdout
      .split("\0")
      .filter((file) => file !== "" && path.posix.dirname(file) === pages)
      .map((file) => path.posix.basename(file))
      .filter(isPage),
  );
  const folder = path.join(root, pages);
  const now = existsSync(folder) ? readdirSync(folder).filter(isPage).sort() : [];
  const pagesAdded = now.filter((name) => !before.has(name)).map(pageName);

  const shape = (row) => JSON.stringify([row.layer, row.kind, row.source, row.note ?? null]);
  const rowsAt = (text) => {
    try {
      return text === null ? [] : parseLedger(text);
    } catch {
      return [];
    }
  };
  const baseLedger = atBase(ledger);
  // No ledger at the base: this branch is where the repository meets the plugin, in the guide or
  // while adopting, with the person who answers. Nothing it writes is compared.
  if (baseLedger === null) return unborn(base, main);
  const was = new Map(rowsAt(baseLedger).map((row) => [String(row.id), row]));
  const judgments = rowsAt(read(ledger))
    .filter((row) => row.kind === "judgment")
    .filter((row) => !was.has(String(row.id)) || shape(was.get(String(row.id))) !== shape(row))
    .map((row) => String(row.id));

  return {
    base,
    main,
    pages_added: pagesAdded,
    colour: { base: rootColour(atBase(stylesheet)), now: rootColour(read(stylesheet)) },
    judgments,
  };
}

// A branch that is where the repository meets the plugin, or a repository with no commit yet:
// nothing it adds is compared.
const unborn = (base, main) => ({
  base,
  main,
  born: true,
  pages_added: [],
  colour: { base: null, now: null },
  judgments: [],
});

// Whether a person made a judgment row theirs, or a question asks it. Returns null when one did,
// else why not.
function unanswered(row, { waiting, blueprint }) {
  const id = String(row.id);
  const note = String(row.note ?? "");
  if (STAMP.test(note) || UNCONFIRMED.test(note)) return null;
  if ((waiting?.rows ?? []).some((item) => item.item === `decision:${id}`)) return null;
  // The guide writes the row from the blueprint, where a person's answer is the layer's own, or a
  // choice the layer lists as confirmed.
  const key = id.replaceAll("-", "_");
  const layer = Object.values(blueprint?.layers ?? {}).find((entry) =>
    Object.hasOwn(entry?.choice ?? {}, key),
  );
  if (String(row.source ?? "").includes("blueprint") && layer?.status === "decided") {
    if (layer.source === "user" || (layer.confirmed ?? []).includes(key)) return null;
  }
  return `${id}: a judgment this branch writes, which no person answered and no question asks; ask the owner with decide --ask --item decision:${id}, or say in its note that a person has not confirmed it`;
}

const waitingProblem = (waiting) =>
  waiting?.problem ? `the waiting list cannot be read: ${waiting.problem}` : null;

// Why the total comparison fails, or null. `ledger` is the rows of the decision ledger, `branch`
// what this branch adds (null outside git), `waiting` the waiting list as { rows } or { problem },
// `blueprint` the blueprint as data, `sources` the repository's source by file, `tagged` its
// tests that name a decision.
export function sheetProblem({ ledger, branch, waiting, blueprint, sources, tagged }) {
  const rows = ledger ?? [];
  const problems = [];
  const unread = waitingProblem(waiting);
  if (unread) problems.push(unread);
  if (branch?.problem)
    problems.push(`what this branch writes cannot be compared: ${branch.problem}`);
  for (const id of branch?.judgments ?? []) {
    const row = rows.find((item) => String(item.id) === id);
    const why = row ? unanswered(row, { waiting, blueprint }) : null;
    if (why) problems.push(why);
  }
  const decided = new Set(rows.map((row) => String(row.id)));
  for (const [id, around] of Object.entries(bypasses(sources))) {
    if (decided.has(id) && around.count > 0) {
      problems.push(
        `${id}: ${around.count} place(s) in source go around it: ${around.files.slice(0, 5).join(", ")}`,
      );
    }
  }
  const proven = new Map();
  for (const { id, check } of tagged ?? []) {
    if (!decided.has(id) && !proven.has(id)) proven.set(id, check);
  }
  for (const [id, check] of proven) {
    problems.push(
      `decision:${id}: ${check.replace(/^[a-z0-9]+:/, "")} proves it, and the ledger has no row for it`,
    );
  }
  if (problems.length === 0) return null;
  const more = problems.length > 4 ? `; and ${problems.length - 4} more` : "";
  return `${problems.slice(0, 4).join("; ")}${more}`;
}

const WHAT = {
  pattern: (which) => `a new kind of screen (${which})`,
  "source-color": (which) =>
    which === "none" ? "taking the root colour line away" : `a new root colour (${which})`,
};

// The items this branch adds that are the owner's to decide.
export function ownersItems(branch) {
  if (!branch || branch.problem) return [];
  const items = (branch.pages_added ?? []).map((name) => `pattern:${name}`);
  const colour = branch.colour ?? {};
  if (colour.base !== colour.now && (colour.base !== null || colour.now !== null)) {
    items.push(colour.now === null ? "source-color:none" : colourItem(colour.now));
  }
  return items;
}

// Why the wall is shut, or null. `branch` and `waiting` as for sheetProblem.
export function wallProblem({ branch, waiting }) {
  const problems = [];
  const unread = waitingProblem(waiting);
  if (unread) problems.push(unread);
  if (branch?.problem) {
    problems.push(
      `what this branch adds cannot be read, so a new kind of screen or a new brand colour would pass unseen: ${branch.problem}`,
    );
  }
  for (const item of ownersItems(branch)) {
    const [kind, ...rest] = item.split(":");
    const what = WHAT[kind](rest.join(":"));
    const asked = (waiting?.rows ?? []).filter((row) => row.item === item);
    if (asked.some((row) => row.answer === "keep")) continue;
    const answered = asked.find((row) => row.answer);
    if (answered) {
      const said = answered.said ? `: ${answered.said}` : "";
      problems.push(
        `${item}: ${what} is the owner's call, and the owner ${answered.answer === "refuse" ? "refused" : "answered otherwise"} in ${answered.id}${said}`,
      );
    } else if (asked.length > 0) {
      problems.push(
        `${item}: ${what} is the owner's call; ${asked[0].id} waits on the owner's answer`,
      );
    } else {
      problems.push(
        `${item}: ${what} is the owner's call, and the waiting list holds no answer for it: ask with decide --ask --item ${item}, and build on it once the owner keeps it`,
      );
    }
  }
  return problems.length === 0 ? null : problems.join("; ");
}

// What the checks say on a pass that did not compare.
export const branchNotes = (branch) =>
  branch === null
    ? ["not in a git repository: what a branch adds is not compared with the main branch"]
    : branch.born
      ? [
          branch.base === null
            ? "no commit yet: the repository starts here, so what it adds is not compared"
            : "the main branch has no decision ledger: this branch is where the repository meets the plugin, so what it adds is not compared",
        ]
      : [];
