// Each measure of this record, seen green on the thing as it is and red, with its pinned message, on
// a copy broken on purpose. Usage: node two-way.mjs [--only <name>] — names: gate-lines, tool-tree,
// decision-states, change-list, lint-scope, choose-first. Prints one line per case; exit 0 only when every case held.
import { appendFileSync, cpSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

import { git, HERE, linkedCopy, option, ROOT, run, scratch, workClone } from "./lib.mjs";
import { BASE, GATE_STEP, LOG, PLUGIN_DIR, PLUGIN_FILES, RELEASE, STAMP, THEME, TOOL_FOLDER, UPGRADE } from "./matrix.mjs";

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
    green("gate-lines on a clone", "gate: the gate holds 22 decisions by 33 checks", "gate-lines.mjs", ["--root", plain.dir]);
    red(
      `gate-lines without one check of ${id}`,
      "gate: the gate did not say: design-assembly: 22 decisions held by 33 checks, each seen failing on a changed copy",
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
    stamp: linkedCopy(ROOT, { replace: { [STAMP]: `${JSON.stringify({ ...stamp, version: "0.36.1" }, null, 2)}\n` } }),
    step: linkedCopy(ROOT, { replace: { [GATE_STEP.file]: `${file(GATE_STEP.file)}# changed\n` } }),
  };
  // A plugin cache whose 0.69.0 folder is the installed one but its release ledger lacks 0.69.0.
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
    red("tool-tree with the stamp at 0.36.1", `the stamp says version 0.36.1, not ${RELEASE.version}`, "tool-tree.mjs", ["--root", copies.stamp.dir]);
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
  const theme = JSON.parse(git(ROOT, "show", `${BASE}:${THEME}`));
  delete theme.checks["raw-table"];
  const file = path.join(dir, "theme.json");
  writeFileSync(file, JSON.stringify(theme, null, 2));
  try {
    green("decision-states as it is", "states: the tool at HEAD and the 0.36.1 tool, each on its own ledger, give each of the 69 decisions the same state", "decision-states.mjs");
    red("decision-states with raw-table unchecked on the 0.36.1 side", "states: raw-table is held with the tool at HEAD, not with the 0.36.1 tool", "decision-states.mjs", ["--old-theme", file]);
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
    green("change-list as it is", "changes: the upgrade commit changes its 31 files; the log commit changes its 1 file; the branch changes nothing beyond the upgrade and this record", "change-list.mjs", root);
    const extra = remade(UPGRADE, () => edit("design/decisions.yaml", "\n"));
    red("change-list with an extra upgrade file", "changes: upgrade commit changed outside the list: design/decisions.yaml", "change-list.mjs", [...root, "--upgrade", extra]);
    const lost = remade(UPGRADE, () => at("checkout", `${UPGRADE}~1`, "--", STAMP));
    red("change-list with a lost upgrade file", "changes: upgrade commit did not change: design/tool-stamp.json", "change-list.mjs", [...root, "--upgrade", lost]);
    const log = remade(LOG, () => edit(THEME, "\n"));
    red("change-list with an extra log-commit file", "changes: log commit changed outside the list: design/theme.json", "change-list.mjs", [...root, "--log", log]);
    branch(() => edit("Makefile", "\n"));
    red("change-list with Makefile on the branch", "changes: branch changed beyond the upgrade and this record: Makefile", "change-list.mjs", root);
    branch(() => edit("design/decisions.yaml", "\n"));
    red("change-list with the ledger on the branch", "changes: branch changed beyond the upgrade and this record: design/decisions.yaml", "change-list.mjs", root);
    // The two drawn pages, each changed by hand in one place; a digit-only case changes one digit and
    // nothing else.
    const page = (rel, from, to) =>
      branch(() => {
        const file = path.join(clone.dir, rel);
        const text = readFileSync(file, "utf8");
        if (!text.includes(from)) throw new Error(`${rel} has no «${from}» to change`);
        writeFileSync(file, text.replace(from, to));
      });
    const notDrawn = (rel) => `changes: ${rel} is not what the records at HEAD draw`;
    page("PRODUCT-MAP.md", "Đầu chủ gõ mã căn", "Đầu chủ nhập mã căn");
    red("change-list with a word changed on another record's map line", notDrawn("PRODUCT-MAP.md"), "change-list.mjs", root);
    page("PRODUCT-MAP.md", "(hàng 3f)", "(hàng 4f)");
    red("change-list with one digit changed on another record's map line", notDrawn("PRODUCT-MAP.md"), "change-list.mjs", root);
    // The count of «Đã giao» as the page has it now, plus one: main moves this count.
    const shipped = readFileSync(path.join(ROOT, "PRODUCT-MAP.md"), "utf8").match(/Đã giao<br\/>(\d+) việc/);
    if (!shipped) throw new Error("PRODUCT-MAP.md has no count for «Đã giao»");
    page("PRODUCT-MAP.md", `Đã giao<br/>${shipped[1]} việc`, `Đã giao<br/>${Number(shipped[1]) + 1} việc`);
    red("change-list with one digit changed on a stage count the records do not give", notDrawn("PRODUCT-MAP.md"), "change-list.mjs", root);
    page("LO-TRINH.html", "<b>2</b> — kế hoạch", "<b>4</b> — kế hoạch");
    red("change-list with one digit changed on another row of the roadmap page", notDrawn("LO-TRINH.html"), "change-list.mjs", root);
    page("LO-TRINH.html", "(hàng 7e) khi danh mục chưa có", "(hàng 8e) khi danh mục chưa có");
    red("change-list with one digit changed beside «chưa có» on another row of the roadmap page", notDrawn("LO-TRINH.html"), "change-list.mjs", root);
    page("LO-TRINH.html", '"ngay":"2026-11-11"', '"ngay":"2026-11-12"');
    red(
      "change-list with one digit changed in another row's summary, which the redraw does not compare",
      "changes: LO-TRINH.html changed the summary of row 1, the one part the redraw does not compare",
      "change-list.mjs",
      root,
    );
    // Another record changed: the drawing would follow it, so the file list must stop it.
    branch(() => edit("_acceptance/du-lieu-mau/contract.md", "\n"));
    red(
      "change-list with another record changed",
      "changes: branch changed beyond the upgrade and this record: _acceptance/du-lieu-mau/contract.md",
      "change-list.mjs",
      root,
    );
    at("checkout", "-q", head);
    at("update-ref", "refs/remotes/origin/main", head);
    green("change-list once merged", "the branch is in origin/main already, so only the commits were compared", "change-list.mjs", root);
  } finally {
    clone.remove();
  }
};

cases["lint-scope"] = () => {
  const dir = scratch("eslint");
  const text = readFileSync(path.join(ROOT, "eslint.config.js"), "utf8");
  const override = '{ files: ["tools/design-assembly/**"], rules: { "react-hooks/rules-of-hooks": "off" } },';
  if (!text.includes(override)) throw new Error("eslint.config.js has no tool-folder override to break");
  const without = path.join(dir, "without.js");
  writeFileSync(without, text.replace(override, ""));
  const wide = path.join(dir, "wide.js");
  writeFileSync(wide, text.replace('files: ["tools/design-assembly/**"]', 'files: ["**"]'));
  const tools = path.join(dir, "tools.js");
  writeFileSync(tools, text.replace('files: ["tools/design-assembly/**"]', 'files: ["tools/**"]'));
  try {
    green("lint-scope as it is", "lint: tools/design-assembly/contract.mjs has no react-hooks/rules-of-hooks error", "lint-scope.mjs");
    red("lint-scope without the override", "lint: tools/design-assembly/contract.mjs: 1 react-hooks/rules-of-hooks error(s)", "lint-scope.mjs", ["--config", without]);
    red("lint-scope with the override on every file", "lint: src/lib/format/hook-probe.ts: react-hooks/rules-of-hooks is not an error there", "lint-scope.mjs", ["--config", wide]);
    red("lint-scope with the override on all of tools/", "lint: tools/hook-probe.mjs: react-hooks/rules-of-hooks is not an error there", "lint-scope.mjs", ["--config", tools]);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
};

cases["choose-first"] = () => {
  const dir = scratch("theme");
  const theme = JSON.parse(readFileSync(path.join(ROOT, THEME), "utf8"));
  theme.checks["ledger-shapes"] = theme.checks["ledger-shapes"].filter((check) => check?.kind !== "choose-first");
  const file = path.join(dir, "theme.json");
  writeFileSync(file, `${JSON.stringify(theme, null, 2)}\n`);
  try {
    green("choose-first as it is", "choose-first: on a clone of", "choose-first.mjs");
    red("choose-first with the check left out of design/theme.json", "choose-first: the gate let src/components/candidate/probe-badge.tsx through (exit 0)", "choose-first.mjs", ["--theme", file]);
    red(
      "choose-first with the intake row naming another file",
      "choose-first: the gate stayed red with an intake row for src/components/candidate/other-badge.tsx",
      "choose-first.mjs",
      ["--row-file", "src/components/candidate/other-badge.tsx"],
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
};

for (const [name, body] of Object.entries(cases)) if (!only || only === name) body();
process.exitCode = failed ? 1 : 0;
