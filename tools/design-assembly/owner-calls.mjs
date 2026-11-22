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
// not committed yet. A shallow checkout fetches the history it needs from the remote named origin.
// Outside git nothing is compared, and the checks say so instead of failing.
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { env } from "node:process";

import { inLibrary, VENDOR } from "./components.mjs";
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
export { VENDOR };
const MARKUP = /\.[jt]sx$/;
const vendor = (file) => VENDOR.test(file);

// For each decision of BYPASS, how many places in source go around it and in which files.
// `sources` maps a file to its text; `isLibrary` says which files are a component library's, by
// the usual folders when not given.
export function bypasses(sources, isLibrary = vendor) {
  const result = Object.fromEntries(Object.keys(BYPASS).map((id) => [id, { count: 0, files: [] }]));
  for (const [file, text] of Object.entries(sources ?? {})) {
    if (!MARKUP.test(file) || isLibrary(file)) continue;
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
const NO_MAIN = `name the main branch with "main" on the check in design/theme.json, or fetch it (a shallow checkout fetches it from the remote named origin)`;
const pageName = (file) => path.posix.basename(file, ".md");
const isPage = (name) => name.endsWith(".md") && !NOT_A_KIND.includes(name);

// Where this branch left the main one, read from git: the commit they share (`base`), the name
// of the main branch, and git itself for what is read next. Null outside git. With `problem` when
// git is there and cannot say. With `unborn` when the repository has no commit yet. `main` names
// the main branch where it has another name. `history` is how a shallow checkout's history is
// fetched, as for HISTORY; with `fetch` false nothing is fetched, and a shallow checkout that
// lacks the main branch is a problem, said as such.
export function branchBase(root, { main: named = null, history = HISTORY, fetch = true } = {}) {
  // Never waits on a prompt for a password or a passphrase: a fetch that needs one fails, and
  // says so. `timed` also gives up after a while, for a call that goes to the remote.
  const quiet = { ...env, GIT_TERMINAL_PROMPT: "0", ...sshOverride(root) };
  const run = (timeout, args) =>
    spawnSync("git", ["-C", root, ...args], {
      encoding: "utf8",
      maxBuffer: 1 << 30,
      timeout,
      env: quiet,
    });
  const git = Object.assign((...args) => run(undefined, args), {
    timed: (timeout, ...args) => run(timeout, args),
  });
  const inside = git("rev-parse", "--is-inside-work-tree");
  if (inside.error) return null;
  if (inside.status !== 0) {
    const said = (inside.stderr ?? "").trim();
    if (/not a git repository/i.test(said)) return null;
    return { problem: said.split("\n")[0] || "git gave no reason" };
  }
  if (git("rev-parse", "--verify", "--quiet", "HEAD").status !== 0) return { unborn: true };
  const known = (name) => git("rev-parse", "--verify", "--quiet", `${name}^{commit}`).status === 0;
  // Each main branch git knows, with where this branch left it. The newest of those is the base: a
  // fork point every other one is an ancestor of.
  const forksOf = (names) =>
    names
      .filter(known)
      .map((name) => ({ name, base: git("merge-base", "HEAD", name).stdout.trim() }))
      .filter((fork) => fork.base !== "");
  let names = named === null ? MAINS : [named];
  // A shallow checkout, as continuous integration makes one, lacks the history: it is fetched, and
  // the main branch is then the one fetched.
  let fetched;
  if (forksOf(names).length === 0 && isShallow(git)) {
    if (!fetch) {
      return {
        problem:
          "a shallow checkout that lacks the main branch, and nothing is fetched to read this",
      };
    }
    const got = fetchMain(git, named, history);
    if (got.problem) return { problem: got.problem };
    fetched = got.fetched;
    names = named === null ? [...new Set([...MAINS, got.ref])] : [got.ref];
  }
  if (named !== null && !names.some(known)) {
    return {
      problem: `the main branch the tool data names, ${named}, is not one git knows: ${NO_MAIN}`,
    };
  }
  const forks = forksOf(names);
  if (forks.length === 0) {
    const tried = names.filter(known);
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
  return { git, base, main, ...(fetched ? { fetched } : {}) };
}

// What this branch adds, read from git: its base, the pages of kinds of screen that were not there,
// the root colour line there and now, and the judgments of the ledger it writes or changes.
// Null outside git. With `problem` when git is there and cannot say. With `born` when the base has
// no decision ledger, and nothing else. `main` names the main branch where it has another name.
// `history` is how a shallow checkout's history is fetched, as for HISTORY.
export function branchFacts(root, { pages, stylesheet, ledger, main: named = null, history }) {
  const found = branchBase(root, { main: named, ...(history ? { history } : {}) });
  if (found === null || found.problem) return found;
  // No commit yet: the repository starts here, with the person who answers, and there is nothing
  // before it to compare with.
  if (found.unborn) return unborn(null, null);
  const { git, base, main, fetched } = found;
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
    const facts = compare({ root, git, base, main, pages, stylesheet, ledger, atBase });
    return fetched && !facts.problem ? { ...facts, fetched } : facts;
  } catch (error) {
    return { problem: error.message };
  }
}

// The ssh command git runs for the remote, told never to ask for a password, only where the machine
// names none of its own. An environment variable wins over git's settings, so setting one over a
// command the machine configured (`GIT_SSH_COMMAND`, `GIT_SSH`, or `core.sshCommand`, such as a
// key a continuous integration checkout names) would drop that command and its key. A configured
// command is left alone: a call to the remote still gives up after NETWORK_MS.
function sshOverride(root) {
  if (env.GIT_SSH_COMMAND || env.GIT_SSH) return {};
  const configured = spawnSync("git", ["-C", root, "config", "--get", "core.sshCommand"], {
    encoding: "utf8",
  });
  if (configured.status === 0 && configured.stdout.trim() !== "") return {};
  return { GIT_SSH_COMMAND: "ssh -o BatchMode=yes" };
}

// How a shallow checkout's history is fetched: `step` commits first, a step doubled each later
// round, and after the last round the whole history.
const HISTORY = Object.freeze({ step: 50, rounds: 5 });
const REMOTE = "origin";
// How long one call to the remote may take before the check gives up and fails.
const NETWORK_MS = 120_000;
const QUIET = ["--quiet", "--no-tags"];

const ok = (run) => run.status === 0 && !run.error;
const isShallow = (git) => git("rev-parse", "--is-shallow-repository").stdout.trim() === "true";
const said = (run) =>
  String(run.error?.message ?? run.stderr ?? "")
    .trim()
    .split("\n")[0] || "git gave no reason";
const cannot = (what, run) => ({
  problem: `a shallow checkout, and git could not fetch ${what} from ${REMOTE}: ${said(run)}`,
});

// The remote's main branch: main, else master. The branch the remote's HEAD points at is never
// taken: the HEAD of a working folder used as a remote is the branch being worked on, and this
// branch compared with itself adds nothing. A main branch of another name is named in the tool data.
function remoteMain(remote) {
  const run = remote("ls-remote", REMOTE, "refs/heads/main", "refs/heads/master");
  if (!ok(run)) return cannot("its branches", run);
  const name = ["main", "master"].find((branch) =>
    new RegExp(`\\trefs/heads/${branch}$`, "m").test(run.stdout),
  );
  return name
    ? { name }
    : { problem: `a shallow checkout, and ${REMOTE} has neither main nor master: ${NO_MAIN}` };
}

// Deepen this commit and the main branch until they meet, then fetch the whole history if they
// have not. This commit may not be on the remote; then only the main branch is deepened.
function deepenUntilMet(git, remote, { ref, spec, step, rounds }) {
  const head = git("rev-parse", "HEAD").stdout.trim();
  const met = () => git("merge-base", "HEAD", ref).stdout.trim() !== "";
  const deepen = (how) => {
    const both = remote("fetch", ...QUIET, how, REMOTE, head, spec);
    return ok(both) ? both : remote("fetch", ...QUIET, how, REMOTE, spec);
  };
  for (let round = 0; round < rounds && !met() && isShallow(git); round += 1) {
    const run = deepen(`--deepen=${step * 2 ** round}`);
    if (!ok(run)) return cannot("more history", run);
  }
  if (met() || !isShallow(git)) return null;
  const run = deepen("--unshallow");
  return ok(run) ? null : cannot("the whole history", run);
}

// Fetch the main branch from the remote into a shallow checkout, then the history back to where
// this branch left it. Returns the ref it fetched and what it did, or a problem with what git said.
function fetchMain(git, named, { step, rounds }) {
  if (!ok(git("remote", "get-url", REMOTE))) {
    return {
      problem: `a shallow checkout with no remote named ${REMOTE} to fetch the main branch from: ${NO_MAIN}`,
    };
  }
  // A call to the remote never waits on a stalled connection.
  const remote = (...args) => git.timed(NETWORK_MS, ...args);
  const branch =
    named === null ? remoteMain(remote) : { name: named.replace(/^(refs\/heads\/|origin\/)/, "") };
  if (branch.problem) return branch;
  const ref = `refs/remotes/${REMOTE}/${branch.name}`;
  const spec = `+refs/heads/${branch.name}:${ref}`;
  const first = remote("fetch", ...QUIET, `--depth=${step}`, REMOTE, spec);
  if (!ok(first)) return cannot(branch.name, first);
  const short = deepenUntilMet(git, remote, { ref, spec, step, rounds });
  if (short) return short;
  return {
    ref: `${REMOTE}/${branch.name}`,
    fetched: `a shallow checkout: ${branch.name} and the history back to where this branch left it were fetched from ${REMOTE}`,
  };
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
  // A design principle the guide writes is the owner's when the blueprint lists it as theirs.
  const context = blueprint?.layers?.context;
  const principle = (Array.isArray(context?.principles) ? context.principles : []).find(
    (item) => `principle-${item?.id}` === id,
  );
  if (String(row.source ?? "").includes("blueprint") && context?.status === "decided") {
    if (principle?.source === "user") return null;
  }
  return `${id}: a judgment this branch writes, which no person answered and no question asks; ask the owner with decide --ask --item decision:${id}, or say in its note that a person has not confirmed it`;
}

const waitingProblem = (waiting) =>
  waiting?.problem ? `the waiting list cannot be read: ${waiting.problem}` : null;

// Why the total comparison fails, or null. `ledger` is the rows of the decision ledger, `branch`
// what this branch adds (null outside git), `waiting` the waiting list as { rows } or { problem },
// `blueprint` the blueprint as data, `sources` the repository's source by file, `tagged` its
// tests that name a decision.
// `library` is the parts of the repository that are a component library's, as libraryParts gives
// them; without it, the usual folders.
export function sheetProblem({ ledger, branch, waiting, blueprint, sources, tagged, library }) {
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
  // The usual folders always, and the parts the settings give where they are known.
  const isLibrary = (file) => vendor(file) || inLibrary(file, library ?? []);
  for (const [id, around] of Object.entries(bypasses(sources, isLibrary))) {
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

// What the checks say on a pass that did not compare. History fetched to compare is work done, not
// a debt: `branchDone` says it.
export function branchNotes(branch) {
  if (branch === null) {
    return ["not in a git repository: what a branch adds is not compared with the main branch"];
  }
  const born = !branch.born
    ? []
    : [
        branch.base === null
          ? "no commit yet: the repository starts here, so what it adds is not compared"
          : "the main branch has no decision ledger: this branch is where the repository meets the plugin, so what it adds is not compared",
      ];
  return born;
}

// What the checks did to compare: in a shallow checkout, the history they fetched.
export function branchDone(branch) {
  return branch?.fetched ? [branch.fetched] : [];
}
