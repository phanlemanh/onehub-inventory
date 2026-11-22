// Each measure of this record, seen green on the thing as it is and red, with its pinned message, on
// a copy broken on purpose. Usage: node two-way.mjs [--only <name>] — names: gate-lines, tool-tree,
// decision-states, change-list. Prints one line per case; exit 0 only when every case held.
import { appendFileSync, cpSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

import { git, HERE, linkedCopy, option, ROOT, run, scratch, workClone } from "./lib.mjs";
import { GATE_STEP, PLUGIN_DIR, PLUGIN_FILES, RELEASE, RERUN, STAMP, THEME, TOOL_FOLDER, UPGRADE } from "./matrix.mjs";

const only = option("--only");
let failed = 0;

// Runs a measure of this folder; `want` is a line it must print, `exit` the code it must end with.
function expect(label, want, exit, script, args = [], env = {}) {
  const r = run("node", [path.join(HERE, script), ...args], ROOT, env);
  const ok = r.status === exit && r.out.includes(want);
  if (!ok) failed += 1;
  process.stdout.write(`${ok ? "held" : "FAILED"}: ${label}\n`);
  if (!ok) process.stdout.write(`  wanted exit ${exit} and «${want}»; got exit ${r.status}:\n${r.out}\n`);
}
const green = (label, want, script, args, env) => expect(`${label} (green)`, want, 0, script, args, env);
const red = (label, want, script, args, env) => expect(`${label} (red)`, want, 1, script, args, env);
const cases = {};

cases["gate-lines"] = () => {
  // Real checkouts: the gate reads git, and a copy made of links shows git every file as changed.
  const plain = workClone(ROOT);
  const broken = workClone(ROOT);
  const theme = JSON.parse(readFileSync(path.join(ROOT, THEME), "utf8"));
  const [id] = Object.entries(theme.checks).find(([, list]) => list.length > 1);
  theme.checks[id] = theme.checks[id].slice(1);
  writeFileSync(path.join(broken.dir, THEME), `${JSON.stringify(theme, null, 2)}\n`);
  try {
    green("gate-lines on a clone", "gate: the gate holds 19 decisions by 27 checks", "gate-lines.mjs", ["--root", plain.dir]);
    red(
      `gate-lines without one check of ${id}`,
      "gate: the gate did not say: design-assembly: 19 decisions held by 27 checks, each seen failing on a changed copy",
      "gate-lines.mjs",
      ["--root", broken.dir],
    );
  } finally {
    plain.remove();
    broken.remove();
  }
};

cases["tool-tree"] = () => {
  const file = (rel) => readFileSync(path.join(ROOT, rel), "utf8");
  const stamp = JSON.parse(file(STAMP));
  const copies = {
    tool: linkedCopy(ROOT, { replace: { [`${TOOL_FOLDER}/probes.mjs`]: `${file(`${TOOL_FOLDER}/probes.mjs`)}// changed\n` } }),
    stamp: linkedCopy(ROOT, { replace: { [STAMP]: `${JSON.stringify({ ...stamp, version: "0.33.0" }, null, 2)}\n` } }),
    step: linkedCopy(ROOT, { replace: { [GATE_STEP.file]: `${file(GATE_STEP.file)}# changed\n` } }),
  };
  // A plugin cache whose 0.36.1 folder is the installed one but its release ledger lacks 0.36.1.
  const cache = scratch("cache");
  const empty = scratch("empty");
  const version = path.join(cache, RELEASE.version);
  cpSync(PLUGIN_DIR(), version, { recursive: true });
  const ledgerFile = path.join(version, PLUGIN_FILES.ledger);
  const ledger = JSON.parse(readFileSync(ledgerFile, "utf8"));
  const drop = (list) => list.filter((r) => r.version !== RELEASE.version);
  writeFileSync(ledgerFile, JSON.stringify(Array.isArray(ledger) ? drop(ledger) : { ...ledger, releases: drop(ledger.releases) }));
  try {
    green("tool-tree as it is", `tool: ${TOOL_FOLDER} is the plugin's version ${RELEASE.version}, ${RELEASE.files} files`, "tool-tree.mjs");
    red("tool-tree with a tool file changed", `differs from the plugin's version ${RELEASE.version}`, "tool-tree.mjs", ["--root", copies.tool.dir]);
    red("tool-tree with the stamp at 0.33.0", `the stamp says version 0.33.0, not ${RELEASE.version}`, "tool-tree.mjs", ["--root", copies.stamp.dir]);
    red("tool-tree with another gate step", "is not the plugin's gate step", "tool-tree.mjs", ["--root", copies.step.dir]);
    red("tool-tree when the ledger lacks the version", `the installed plugin's release ledger has no version ${RELEASE.version}`, "tool-tree.mjs", [], { PLUGIN_CACHE: cache });
    red("tool-tree without the plugin folder", "cannot read", "tool-tree.mjs", [], { PLUGIN_CACHE: empty });
  } finally {
    for (const copy of Object.values(copies)) copy.remove();
    rmSync(cache, { recursive: true, force: true });
    rmSync(empty, { recursive: true, force: true });
  }
};

cases["decision-states"] = () => {
  const dir = scratch("theme");
  const theme = JSON.parse(readFileSync(path.join(ROOT, THEME), "utf8"));
  delete theme.checks["raw-table"];
  const file = path.join(dir, "theme.json");
  writeFileSync(file, JSON.stringify(theme, null, 2));
  try {
    green("decision-states as it is", "states: on this ledger the tool at HEAD and the 0.7.1 tool give each of the 67 decisions the same state", "decision-states.mjs");
    red("decision-states with raw-table unchecked on the 0.7.1 side", "states: raw-table is held with the tool at HEAD, not with the 0.7.1 tool", "decision-states.mjs", ["--old-theme", file]);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
};

cases["change-list"] = () => {
  const clone = workClone(ROOT);
  const at = (...args) => git(clone.dir, ...args);
  const mainNow = git(ROOT, "rev-parse", "origin/main").trim();
  at("update-ref", "refs/remotes/origin/main", mainNow);
  const head = at("rev-parse", "HEAD").trim();
  const edit = (rel, text) => appendFileSync(path.join(clone.dir, rel), text);
  // A commit with the changes of `rev`, edited by `change`, on `rev`'s parent.
  const remade = (rev, change) => {
    at("checkout", "-q", rev);
    change();
    at("add", "-A");
    at("reset", "-q", "--soft", `${rev}~1`);
    at("-c", "user.name=t", "-c", "user.email=t@t", "commit", "-q", "-m", "break");
    return at("rev-parse", "HEAD").trim();
  };
  // A branch: HEAD with one more commit made by `change`.
  const branch = (change) => {
    at("checkout", "-q", head);
    change();
    at("add", "-A");
    at("-c", "user.name=t", "-c", "user.email=t@t", "commit", "-q", "-m", "break");
  };
  try {
    const root = ["--root", clone.dir];
    green("change-list as it is", "changes: the upgrade commit changes its 28 files; the 0.36.1 rerun changes its 10 files; the branch changes nothing beyond the upgrades and this record", "change-list.mjs", root);
    const extra = remade(UPGRADE, () => edit(THEME, "\n"));
    red("change-list with an extra upgrade file", "changes: upgrade commit changed outside the list: design/theme.json", "change-list.mjs", [...root, "--upgrade", extra]);
    const lost = remade(UPGRADE, () => at("checkout", `${UPGRADE}~1`, "--", STAMP));
    red("change-list with a lost upgrade file", "changes: upgrade commit did not change: design/tool-stamp.json", "change-list.mjs", [...root, "--upgrade", lost]);
    const rerun = remade(RERUN, () => edit(THEME, "\n"));
    red("change-list with an extra rerun file", "changes: rerun commit changed outside the list: design/theme.json", "change-list.mjs", [...root, "--rerun", rerun]);
    branch(() => edit("Makefile", "\n"));
    red("change-list with Makefile on the branch", "changes: branch changed beyond the upgrade and this record: Makefile", "change-list.mjs", root);
    branch(() => edit("design/decisions.yaml", "\n"));
    red("change-list with the ledger on the branch", "changes: branch changed beyond the upgrade and this record: design/decisions.yaml", "change-list.mjs", root);
    branch(() => {
      const map = path.join(clone.dir, "PRODUCT-MAP.md");
      writeFileSync(map, readFileSync(map, "utf8").replace("Đầu chủ gõ mã căn", "Đầu chủ nhập mã căn"));
    });
    red("change-list with another record's map line", "changes: PRODUCT-MAP.md changed a line that is not this record's", "change-list.mjs", root);
    branch(() => {
      const map = path.join(clone.dir, "PRODUCT-MAP.md");
      writeFileSync(map, readFileSync(map, "utf8").replace("(hàng 3f)", "(hàng 3g)").replace("ở hàng 7 trước", "ở hàng 8 trước"));
    });
    red("change-list with a digit changed on another record's map line", "changes: PRODUCT-MAP.md changed a line that is not this record's", "change-list.mjs", root);
    branch(() => {
      const page = path.join(clone.dir, "LO-TRINH.html");
      writeFileSync(page, readFileSync(page, "utf8").replace("<b>1h</b>", "<b>1i</b>").replace("<b>2</b> — kế hoạch", "<b>4</b> — kế hoạch"));
    });
    red("change-list with a digit changed on another row of the roadmap page", "changes: LO-TRINH.html changed a line that is not this record's", "change-list.mjs", root);
    at("checkout", "-q", head);
    at("update-ref", "refs/remotes/origin/main", head);
    green("change-list once merged", "the branch is in origin/main already, so only the commits were compared", "change-list.mjs", root);
  } finally {
    clone.remove();
  }
};

for (const [name, body] of Object.entries(cases)) if (!only || only === name) body();
process.exitCode = failed ? 1 : 0;
