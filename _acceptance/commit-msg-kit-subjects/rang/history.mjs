// AC-3: over every non-merge commit of BASE (fixed in the matrix, so main moving on does not change the count), the
// rule of the tree against the rule of BASE (its tools/commit_msg.py, read with git show): there are HISTORY.total,
// the commits the tree accepts in addition are HISTORY.newlyAccepted by kind, no commit BASE accepts is refused
// (should NOT fire), and the commits still refused are HISTORY.stillRefused.
// Usage: node history.mjs [--root <dir>]

import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { git, root, run, show, verdict } from "./lib.mjs";
import { BASE, HISTORY } from "./matrix.mjs";

const NAME = "history";
const dir = root();
const problems = [];
const tmp = mkdtempSync(join(tmpdir(), "cmks-hist-"));
let total = 0;

/** The subject lines a rule accepts, one boolean per message, computed in one python run. */
function accepted(script, messages) {
  const r = run(
    "python3",
    ["-I", "-c", "import json,sys,runpy;m=runpy.run_path(sys.argv[1]);print(json.dumps([m['is_allowed'](x) for x in json.load(sys.stdin)]))", script],
    { input: JSON.stringify(messages) },
  );
  if (r.code !== 0) throw new Error(`cannot run ${script}: ${r.err.trim().split("\n").pop()}`);
  return JSON.parse(r.out);
}

const kind = (s) => (s.startsWith("Gate 2 signoff:") ? "Gate 2 signoff" : s.startsWith("repin(") ? "repin" : s.split(/[:( ]/)[0]);

try {
  const base = BASE;
  const old = join(tmp, "commit_msg_base.py");
  writeFileSync(old, show(dir, base, "tools/commit_msg.py") ?? "");
  const shas = git(dir, "rev-list", "--no-merges", base).split("\n").filter(Boolean);
  const messages = shas.map((sha) => git(dir, "log", "-1", "--format=%B", sha));
  total = messages.length;
  if (total !== HISTORY.total) problems.push(`${BASE.slice(0, 8)} has ${total} non-merge commits, not ${HISTORY.total}`);
  const before = accepted(old, messages);
  const after = accepted(join(dir, "tools/commit_msg.py"), messages);
  const subject = (i) => messages[i].split("\n")[0];

  const gained = {};
  const lost = [];
  const still = [];
  messages.forEach((_, i) => {
    if (!before[i] && after[i]) gained[kind(subject(i))] = (gained[kind(subject(i))] ?? 0) + 1;
    if (before[i] && !after[i]) lost.push(subject(i));
    if (!after[i]) still.push(subject(i));
  });
  if (JSON.stringify(gained) !== JSON.stringify(HISTORY.newlyAccepted)) {
    problems.push(`the tree accepts ${JSON.stringify(gained)} more than the base, not ${JSON.stringify(HISTORY.newlyAccepted)}`);
  }
  if (lost.length !== HISTORY.newlyRefused) problems.push(`the tree refuses ${lost.length} commits the base accepts: ${lost.slice(0, 5).join(" | ")}`);
  if (JSON.stringify(still.sort()) !== JSON.stringify([...HISTORY.stillRefused].sort())) {
    problems.push(`still refused: ${JSON.stringify(still.slice(0, 10))}, not ${JSON.stringify(HISTORY.stillRefused)}`);
  }
} catch (err) {
  problems.push(err.message);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

const n = Object.values(HISTORY.newlyAccepted).reduce((a, b) => a + b, 0);
verdict(
  NAME,
  problems,
  `over the ${total} non-merge commits of ${BASE.slice(0, 8)} the tree accepts ${n} more (${Object.entries(HISTORY.newlyAccepted).map(([k, v]) => `${v} ${k}`).join(", ")}), refuses none the base accepts, and still refuses ${HISTORY.stillRefused.length}: ${HISTORY.stillRefused.join(" | ")}`,
);
