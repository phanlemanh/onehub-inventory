// The measures of this record, one mode per criterion. Each prints its green line, or one line per
// fault and exits 1. Nothing here writes to the repository it measures.
// Usage: node kiem.mjs gate|tool|font|rules|adopt|states|changes [--root <repository or a copy>]
//   rules also takes --page <file> (another page to measure, for the break copies)
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { blobId, git, head, lines, option, pluginAt, ROOT, run, treeId, workClone } from "./lib.mjs";
import {
  ADOPT_AGAIN,
  ADOPT_E7,
  ADOPT_E7_RED,
  BASE,
  BRANCH_MAY_CHANGE,
  DRAWN_PAGES,
  FONT_LOAD,
  GATE,
  GATE_STEP,
  gateLine,
  LEDGER,
  OLD_TYPE_LINE_START,
  PLUGIN,
  RATE,
  READOPT_ROW,
  RELEASE,
  RULES_CHANGES,
  RULES_COMMIT,
  RULES_PAGE,
  STAMP,
  STYLESHEET,
  THEME,
  TOOL_FOLDER,
  TYPE_LINE,
  UPGRADE,
  UPGRADE_CHANGES,
} from "./matrix.mjs";

const mode = process.argv[2];
const root = path.resolve(option("--root", ROOT));
const found = [];
const at = () => {
  try {
    return head(root).slice(0, 12);
  } catch {
    return "no git";
  }
};
function finish(prefix, green) {
  for (const line of found) process.stdout.write(`${prefix}: ${line}\n`);
  if (found.length === 0) process.stdout.write(`${prefix}: ${green} (at ${at()})\n`);
  process.exitCode = found.length ? 1 : 0;
}

// The adopt command of the released plugin, run on `dir`.
function adoptOn(dir, args) {
  const plugin = pluginAt(PLUGIN.repo(), PLUGIN.rev, PLUGIN.folder);
  try {
    return run("node", [path.join(plugin.dir, "scripts/adopt.mjs"), "--target", dir, ...args], dir, {
      CLAUDE_PLUGIN_ROOT: plugin.dir,
    });
  } finally {
    plugin.remove();
  }
}

// The ledger without one row: from its "- id:" line to the next row.
function withoutRow(text, id) {
  const start = text.indexOf(`  - id: ${id}\n`);
  if (start === -1) throw new Error(`no row ${id} in ${LEDGER}`);
  const next = text.indexOf("\n  - id:", start + 5);
  return next === -1 ? text.slice(0, start) : text.slice(0, start) + text.slice(next + 1);
}

if (mode === "gate") {
  // AC-1 (the gate's own line, for the two-way pair): numbers PR 111 set, unchanged by the tool.
  const gate = run("node", [`${TOOL_FOLDER}/check.mjs`], root);
  if (gate.status !== 0) found.push(`the gate exit ${gate.status}`);
  if (!gate.out.includes(gateLine(GATE))) found.push(`the gate did not say: ${gateLine(GATE)}`);
  const rate = run("node", [`${TOOL_FOLDER}/check.mjs`, "--rate"], root);
  const said = `determinism rate: ${RATE.automatic}/${RATE.all}`;
  if (!rate.out.includes(said)) found.push(`the rate did not say: ${said}`);
  finish("gate", `${GATE.decisions} decisions held by ${GATE.checks} checks; ${said}`);
} else if (mode === "tool") {
  // AC-2: the tool folder is the tree 0.36.2 hands a repository; stamp and gate step agree; the
  // plugin's source at the pinned commit is 0.36.2, records that tree and its templates hold it.
  const tree = treeId(path.join(root, TOOL_FOLDER));
  if (tree.id !== RELEASE.tool || tree.files !== RELEASE.files) {
    found.push(
      `${TOOL_FOLDER} differs from the plugin's version ${RELEASE.version}: ${tree.files} files, tree ${tree.id.slice(0, 12)}; the version's tree is ${RELEASE.tool.slice(0, 12)}, ${RELEASE.files} files`,
    );
  }
  const stamp = existsSync(path.join(root, STAMP)) ? JSON.parse(readFileSync(path.join(root, STAMP), "utf8")) : null;
  if (!stamp) found.push(`no stamp at ${STAMP}`);
  else {
    if (stamp.version !== RELEASE.version) found.push(`the stamp says version ${stamp.version}, not ${RELEASE.version}`);
    if (stamp.tree !== RELEASE.tool) found.push(`the stamp's tree ${String(stamp.tree).slice(0, 12)} is not the tree of ${RELEASE.version}`);
  }
  const step = path.join(root, GATE_STEP.file);
  const stepId = existsSync(step) ? blobId(step) : "missing";
  if (stepId !== GATE_STEP.blob) found.push(`${GATE_STEP.file} is not the plugin's gate step: blob ${stepId.slice(0, 12)}`);
  const repo = PLUGIN.repo();
  try {
    const show = (file) => git(repo, "show", `${PLUGIN.rev}:${file}`);
    const version = JSON.parse(show(PLUGIN.manifest)).version;
    if (version !== RELEASE.version) found.push(`the plugin at ${PLUGIN.rev.slice(0, 7)} is version ${version}, not ${RELEASE.version}`);
    const ledger = JSON.parse(show(PLUGIN.ledger));
    const entry = (Array.isArray(ledger) ? ledger : (ledger.releases ?? [])).find((r) => r.version === RELEASE.version);
    if (!entry) found.push(`the plugin's release ledger has no version ${RELEASE.version}`);
    else if (entry.tool !== RELEASE.tool) found.push(`the plugin's release ledger names tool tree ${entry.tool.slice(0, 12)} for ${RELEASE.version}`);
    const template = git(repo, "rev-parse", `${PLUGIN.rev}:${PLUGIN.toolTemplate}`).trim();
    if (template !== RELEASE.tool) found.push(`the plugin's tool template has tree ${template.slice(0, 12)}, not ${RELEASE.tool.slice(0, 12)}`);
    const stepTemplate = git(repo, "rev-parse", `${PLUGIN.rev}:${PLUGIN.gateStep}`).trim();
    if (stepTemplate !== GATE_STEP.blob) found.push(`the plugin's gate step template is blob ${stepTemplate.slice(0, 12)}`);
  } catch (error) {
    found.push(`cannot read the plugin's source at ${PLUGIN.rev.slice(0, 7)} in ${repo} (${error.message.split("\n")[0]})`);
  }
  finish(
    "tool",
    `${TOOL_FOLDER} is the plugin's version ${RELEASE.version}, ${tree.files} files, tree ${tree.id.slice(0, 12)}; the stamp says the same; ${GATE_STEP.file} is the template's; the plugin at ${PLUGIN.rev.slice(0, 7)} is ${RELEASE.version}, names that tree and its templates hold it`,
  );
} else if (mode === "font") {
  // AC-3: the build's adapter says what loads the running-text typeface by kind and file.
  const fonts = await import(pathToFileURL(path.join(root, TOOL_FOLDER, "fonts.mjs")).href);
  const css = readFileSync(path.join(root, STYLESHEET), "utf8");
  const { loads } = fonts.readLoads(root, css, STYLESHEET);
  const load = loads.find((item) => item.variable === FONT_LOAD.variable);
  if (!load) found.push(`no load of ${FONT_LOAD.variable} (${loads.length} loads)`);
  else {
    for (const key of ["via", "file", "loader"]) {
      if (load[key] !== FONT_LOAD[key]) found.push(`the load of ${FONT_LOAD.variable} has ${key} ${JSON.stringify(load[key])}, not ${JSON.stringify(FONT_LOAD[key])}`);
    }
  }
  finish("font", `${FONT_LOAD.variable} is loaded via ${FONT_LOAD.via}, file ${FONT_LOAD.file}, loader ${FONT_LOAD.loader}`);
} else if (mode === "rules") {
  // AC-4: the Type line as 0.36.2 writes it; the page is the one 0.36.2's adopt writes on a copy of
  // HEAD that re-adopts the typeface row (and that copy's ledgers come back unchanged); and the E7
  // measure of the signed record design-assembly-adopt-checks is red with exactly its one line.
  const pageFile = option("--page") ?? path.join(root, RULES_PAGE);
  const page = readFileSync(pageFile, "utf8");
  const type = page.split("\n## Type\n")[1]?.split("\n").find((line) => line.startsWith("- "));
  if (type !== TYPE_LINE) found.push(`the Type line is not the one 0.36.2 writes: ${type ?? "no Type section"}`);
  const wrong = page.split("\n").filter((line) => line.includes("undefined") || line.includes("design/blueprint.json"));
  if (wrong.length) found.push(`${wrong.length} line(s) still say undefined or cite design/blueprint.json`);
  const clone = workClone(root);
  try {
    const ledger = readFileSync(path.join(clone.dir, LEDGER), "utf8");
    const theme = JSON.parse(readFileSync(path.join(clone.dir, THEME), "utf8"));
    const themeBefore = readFileSync(path.join(clone.dir, THEME), "utf8");
    writeFileSync(path.join(clone.dir, LEDGER), withoutRow(ledger, READOPT_ROW));
    delete theme.checks[READOPT_ROW];
    writeFileSync(path.join(clone.dir, THEME), `${JSON.stringify(theme, null, 2)}\n`);
    rmSync(path.join(clone.dir, RULES_PAGE));
    const adopt = adoptOn(clone.dir, []);
    if (!/^done: 1 row\(s\) added/m.test(adopt.out)) found.push(`adopt on the copy did not re-add the ${READOPT_ROW} row: ${lines(adopt.out).at(-1)}`);
    const written = existsSync(path.join(clone.dir, RULES_PAGE)) ? readFileSync(path.join(clone.dir, RULES_PAGE), "utf8") : null;
    if (written === null) found.push("adopt on the copy wrote no rules page");
    else if (written !== page) found.push("the page differs from the one 0.36.2's adopt writes on a copy of HEAD");
    if (readFileSync(path.join(clone.dir, LEDGER), "utf8") !== ledger) found.push(`re-adopting ${READOPT_ROW} on the copy did not give ${LEDGER} back as it is`);
    if (readFileSync(path.join(clone.dir, THEME), "utf8") !== themeBefore) found.push(`re-adopting ${READOPT_ROW} on the copy did not give ${THEME} back as it is`);
  } finally {
    clone.remove();
  }
  const e7 = run(ADOPT_E7[0], [...ADOPT_E7.slice(1), "--root", root, "--page", pageFile], root);
  if (e7.status !== 1 || lines(e7.out).join("\n") !== ADOPT_E7_RED) {
    found.push(`E7 of the signed record did not go red with exactly '${ADOPT_E7_RED}': exit ${e7.status}, ${lines(e7.out).join(" | ")}`);
  }
  finish(
    "rules",
    `the Type line is the one 0.36.2 writes, no line says undefined or cites design/blueprint.json; the page is the one 0.36.2's adopt writes on a copy that re-adopts ${READOPT_ROW}; E7 of ${ADOPT_E7[1].split("/")[1]} is red with '${ADOPT_E7_RED}' and nothing else`,
  );
} else if (mode === "adopt") {
  // AC-5: adopt run again with 0.36.2, as a preview, adds nothing, writes nothing, asks nothing new.
  // --out-file hands it adopt's output from a file instead (the break copies: the real output, edited).
  const outFile = option("--out-file");
  const adopt = outFile ? { status: 1, out: readFileSync(outFile, "utf8") } : adoptOn(root, ["--dry-run"]);
  if (adopt.status !== 1) found.push(`adopt exit ${adopt.status}, not 1 (one question open)`);
  for (const [key, text] of Object.entries(ADOPT_AGAIN)) if (!adopt.out.includes(text)) found.push(`adopt did not say (${key}): ${text.split("\n").at(-1).trim()}`);
  const asked = adopt.out.split("needs a person:\n")[1]?.split("\n\n")[0].split("\n").filter((line) => /^ {2}\S/.test(line)) ?? [];
  if (asked.length !== 1) found.push(`adopt asks ${asked.length} question(s), not the one font-source question`);
  finish("adopt", "adopt 0.36.2 adds 0 rows, writes nothing, and asks only the font-source question");
} else if (mode === "states") {
  // AC-6: on this ledger the tool at HEAD and the 0.36.1 tool (the tool folder at BASE) give each
  // decision the same state.
  const states = (out) => {
    const map = new Map();
    for (const line of out.split("\n")) {
      if (!line.startsWith("  ") || line.includes("note:") || /held and re-run here/.test(line)) continue;
      const state = line.slice(2, 10).trim();
      const [, id] = line.slice(11).trim().split(/\s+/);
      if (state && id) map.set(id, state);
    }
    return map;
  };
  const oldTheme = option("--old-theme");
  const clone = workClone(root);
  let now;
  let then;
  try {
    now = states(run("node", [`${TOOL_FOLDER}/check.mjs`, "--rate"], clone.dir).out);
    rmSync(path.join(clone.dir, TOOL_FOLDER), { recursive: true, force: true });
    git(clone.dir, "checkout", "-q", BASE, "--", TOOL_FOLDER);
    if (oldTheme) writeFileSync(path.join(clone.dir, THEME), readFileSync(path.resolve(oldTheme)));
    then = states(run("node", [`${TOOL_FOLDER}/check.mjs`, "--rate"], clone.dir).out);
  } finally {
    clone.remove();
  }
  if (now.size !== RATE.all) found.push(`the tool at HEAD listed ${now.size} decisions, not ${RATE.all}`);
  for (const [id, state] of now) if (then.get(id) !== state) found.push(`${id} is ${state} with the tool at HEAD, ${then.get(id) ?? "absent"} with the 0.36.1 tool`);
  finish("states", `the tool at HEAD and the 0.36.1 tool give each of the ${now.size} decisions the same state`);
} else if (mode === "changes") {
  // AC-7: each commit changes exactly its files; the branch changes nothing else.
  const changed = (from, to) => lines(git(root, "diff", "--name-only", "--no-renames", from, to)).sort();
  const same = (a, b) => JSON.stringify(a) === JSON.stringify([...b].sort());
  const u = changed(`${UPGRADE}^`, UPGRADE);
  if (!same(u, UPGRADE_CHANGES)) found.push(`${UPGRADE} changes ${u.join(", ")}`);
  const r = changed(`${RULES_COMMIT}^`, RULES_COMMIT);
  if (!same(r, RULES_CHANGES)) found.push(`${RULES_COMMIT} changes ${r.join(", ")}`);
  const branch = changed(BASE, "HEAD");
  for (const file of branch) {
    const ok = DRAWN_PAGES.includes(file) || BRANCH_MAY_CHANGE.some((p) => (p.endsWith("/") ? file.startsWith(p) : file === p));
    if (!ok) found.push(`file changed outside the matrix: ${file}`);
  }
  finish("changes", `${UPGRADE} changes ${u.length} files, ${RULES_COMMIT} changes ${r.length}; the branch changes ${branch.length} files, all in the matrix`);
} else {
  process.stderr.write("usage: kiem.mjs gate|tool|font|rules|adopt|states|changes [--root DIR]\n");
  process.exitCode = 2;
}
