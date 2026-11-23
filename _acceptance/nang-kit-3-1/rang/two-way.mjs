// Two-way check of every measure of nang-kit-3-1: green on the real thing, red with its pinned message on a copy
// broken in exactly what the measure guards. Messages are the ones pinned in evals.yaml.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { appendFileSync, copyFileSync, cpSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { after, test } from "node:test";

import { ciKit } from "./ci-tag.mjs";
import * as docCommands from "./doc-commands.mjs";
import * as dot from "./dot.mjs";
import * as gateBranch from "./gate-branch.mjs";
import * as gateControl from "./gate-control.mjs";
import { commitAll, coreRoot, fetchKit, git, mergeBase, repoRoot, runGate, worktree } from "./kit.mjs";
import { DOC_FILES, NEW_KIT, OLD_KIT } from "./matrix.mjs";
import * as productMap from "./product-map.mjs";
import * as settings from "./settings.mjs";
import * as tag from "./tag.mjs";
import * as troLy from "./tro-ly.mjs";

const ROOT = repoRoot();
const BASE = mergeBase(ROOT);
const lines = (r) => [].concat(r.line);

const green = new Map();
async function greenOnce(name, fn) {
  if (!green.has(name)) green.set(name, await fn());
  const r = green.get(name);
  assert.equal(r.ok, true, `${name} not green on HEAD: ${lines(r).join(" | ")}`);
}

function tempRoot(files) {
  const dir = mkdtempSync(join(tmpdir(), "nk31-copy-"));
  for (const [rel, text] of Object.entries(files)) {
    mkdirSync(dirname(join(dir, rel)), { recursive: true });
    writeFileSync(join(dir, rel), text);
  }
  return dir;
}

// Worktrees this run made; the after hook checks only these, never other runs' worktrees on the machine.
const mine = new Set();

function withWorktree(rev, fn) {
  const wt = worktree(rev);
  mine.add(wt.dir);
  mine.add(realpathSync(wt.dir));
  return Promise.resolve()
    .then(() => fn(wt.dir))
    .finally(() => wt.remove());
}

function redWith(r, prefix) {
  assert.equal(r.ok, false, `expected red, got: ${lines(r).join(" | ")}`);
  assert.ok(
    lines(r).some((l) => l.startsWith(prefix)),
    `expected a line starting «${prefix}», got: ${lines(r).join(" | ")}`,
  );
}

after(() => {
  const listed = git(ROOT, "worktree", "list", "--porcelain")
    .split("\n")
    .filter((l) => l.startsWith("worktree "))
    .map((l) => l.slice("worktree ".length));
  const left = listed.filter((d) => mine.has(d));
  assert.deepEqual(left, [], "temp worktrees left behind");
});

const baseSettings = () => git(ROOT, "show", `${BASE}:.claude/settings.json`);
const market = () => settings.kitMarketplace(fetchKit(NEW_KIT));

test("E1 settings (a): red on the settings of main", async () => {
  await greenOnce("settings", () => settings.measure());
  redWith(settings.judge(baseSettings(), baseSettings(), market(), "v3.0.0"), "settings: marketplace not pinned to v3.1.0");
});

test("E1 settings (b): red when a second line changes", async () => {
  await greenOnce("settings", () => settings.measure());
  const s = JSON.parse(readFileSync(join(ROOT, ".claude/settings.json"), "utf8"));
  s.enabledPlugins["superpowers@claude-plugins-official"] = false;
  redWith(
    settings.judge(`${JSON.stringify(s, null, 2)}\n`, baseSettings(), market(), "v3.0.0"),
    "settings: differs from origin/main in 2 lines",
  );
});

test("E2 tag (a): red when the tag peels to another commit", async () => {
  await greenOnce("tag", () => tag.measure());
  redWith(tag.judge({ peeled: OLD_KIT.sha, kitDir: fetchKit(NEW_KIT) }), "tag: v3.1.0 on phanlemanh/delivery-loop is c16d25db, want 0a93a5b9");
});

test("E2 tag (b): red on the plugin versions of v3.0.0", async () => {
  await greenOnce("tag", () => tag.measure());
  redWith(tag.judge({ peeled: NEW_KIT.sha, kitDir: fetchKit(OLD_KIT) }), "tag: acceptance-gate is 3.0.0, want 3.1.0");
});

test("E3 tro-ly (a): red on kit v3.0.0, which has no decision assistant", async () => {
  await greenOnce("tro-ly", () => troLy.measure());
  redWith(await troLy.measure({ kit: OLD_KIT }), "tro-ly: scripts/tro-ly-quyet-dinh.cjs missing in kit v3.0.0");
});

test("E3 tro-ly (b): red when the count is not the number of records with a contract", async () => {
  await greenOnce("tro-ly", () => troLy.measure());
  const real = troLy.run(NEW_KIT, ROOT);
  const other = tempRoot({ "_acceptance/x/contract.md": "---\nslug: x\n---\n" });
  const n = troLy.records(ROOT);
  redWith(troLy.judge({ ...real, root: other }), `tro-ly: counts ${n} records, want 1`);
});

test("E4 product-map (a): red when PRODUCT-MAP.md drifts", async () => {
  await greenOnce("product-map", () => productMap.measure());
  await withWorktree("HEAD", async (dir) => {
    appendFileSync(join(dir, "PRODUCT-MAP.md"), "\n- a line no record wrote\n");
    redWith(await productMap.measure({ root: dir }), "product-map: kit v3.1.0 product-map.mjs --check exit 1");
  });
});

test("E4 product-map (b): red when an executor calls a script the kit lacks", async () => {
  await greenOnce("product-map", () => productMap.measure());
  const core = coreRoot(NEW_KIT, fetchKit(NEW_KIT));
  const config = readFileSync(join(ROOT, "_acceptance/config.yaml"), "utf8");
  const broken = config.replace("scripts/design-floor-s4.mjs", "scripts/khong-co.mjs");
  assert.notEqual(broken, config, "fixture: design.floor script not found");
  redWith(productMap.executorLine(broken, core), "executor-scripts: design.floor calls scripts/khong-co.mjs, missing in kit v3.1.0");
});

test("E5 doc-commands: red when a living doc names a command kit 3.1 lacks", async () => {
  await greenOnce("doc-commands", () => docCommands.measure());
  const texts = DOC_FILES.map((f) => readFileSync(join(ROOT, f), "utf8"));
  texts[0] = texts[0].replace("/knowledge:ingest", "/knowledge:ghi");
  redWith(await docCommands.measure({ texts }), "doc-commands: /knowledge:ghi not in kit v3.1.0");
});

test("E6 gate-control (a): red when one real run loses an OK line", () => {
  const out = gateControl.recheck(NEW_KIT, BASE);
  assert.ok(gateControl.okRecords(out).length > 0, "fixture: the real run has no OK line");
  assert.equal(gateControl.compareRuns(out, out), null);
  const first = out.split("\n").findIndex((l) => l.startsWith("OK ["));
  const fewer = out
    .split("\n")
    .filter((_, i) => i !== first)
    .join("\n");
  const red = gateControl.compareRuns(out, fewer);
  assert.ok(red?.startsWith("gate-control: OK records differ"), `got: ${red}`);
});

test("E6 gate-control (b): red when both runs OK fewer records than have a contract", () => {
  const out = gateControl.recheck(NEW_KIT, BASE);
  const want = gateControl.contractsAt(BASE);
  assert.equal(gateControl.compareRuns(out, out, want), null, "fixture: the real run is not green against the git count");
  const none = out
    .split("\n")
    .filter((l) => !l.startsWith("OK ["))
    .join("\n");
  assert.equal(gateControl.compareRuns(none, none, want), `gate-control: OK 0 records, want ${want}`);
});

test("E6 gate-control (c): red when the two kits print different verdict lines on HEAD", () => {
  const out = gateControl.headRun(NEW_KIT);
  assert.equal(gateControl.compareHead(out, out), null, "fixture: the real HEAD run is not green against itself");
  const extra = `${out}\nVIOLATION [nang-kit-3-1]: a reason only one kit prints`;
  assert.equal(gateControl.compareHead(out, extra), "gate-control: verdict lines on HEAD differ between kits");
});

test("E7 gate-branch (a): red on main + the settings change without a record", async () => {
  await greenOnce("gate-branch", () => gateBranch.measure({ save: false }));
  await withWorktree(BASE, async (dir) => {
    const patch = git(ROOT, "diff", BASE, "HEAD", "--", ".claude/settings.json");
    execFileSync("git", ["-C", dir, "apply"], { input: `${patch}\n` });
    commitAll(dir, "chore: probe settings without a record");
    redWith(await gateBranch.measure({ root: dir, base: BASE, save: false }), "gate-branch: VIOLATION not naming nang-kit-3-1");
  });
});

test("E7 gate-branch (b): --signed is red on the real gate output while this record is unsigned", () => {
  const kit = ciKit(ROOT);
  const { out } = runGate(coreRoot(kit, fetchKit(kit)), ROOT, ["--base", "origin/main"]);
  assert.equal(gateBranch.judge(out).ok, true, "fixture: the unsigned gate output is not green without --signed");
  redWith(gateBranch.judge(out, { signed: true }), "gate-branch: --signed wants 0 VIOLATION");
});

test("E7 gate-branch (c): red when ci.yml names a kit tag outside the matrix", () => {
  const ci = readFileSync(join(ROOT, ".github/workflows/ci.yml"), "utf8");
  const broken = ci.replace(/KIT_TAG: v3\.[01]\.0/, "KIT_TAG: v9.9.9");
  assert.notEqual(broken, ci, "fixture: KIT_TAG not found");
  const dir = tempRoot({ ".github/workflows/ci.yml": broken });
  assert.throws(() => ciKit(dir), /^Error: ci-tag: KIT_TAG of the gate job is v9\.9\.9, want v3\.0\.0 or v3\.1\.0$/);
});

test("E10 dot (a): red when the hook files changed between the kits are not the matrix's", async () => {
  await greenOnce("dot", () => dot.measure());
  const k = fetchKit(NEW_KIT);
  redWith(await dot.judge({ oldDir: k, newDir: k, dir: dot.batchDir() }), "dot: hook files changed in v3.1.0 are none");
});

test("E10 dot (b): red when the batch folder is missing", async () => {
  await greenOnce("dot", () => dot.measure());
  redWith(await dot.judge({ oldDir: fetchKit(OLD_KIT), newDir: fetchKit(NEW_KIT), dir: null }), "dot: batch folder dieu-phoi-nen not found");
});

test("E10 dot (c): red on a copy of the batch where a lane holds the s4 lock", async () => {
  await greenOnce("dot", () => dot.measure());
  const real = dot.batchDir();
  const copy = mkdtempSync(join(tmpdir(), "nk31-dot-"));
  for (const f of ["dieu-phoi.config.json", "hang-viec.json"]) copyFileSync(join(real, f), join(copy, f));
  mkdirSync(join(copy, "khoa", "s4"), { recursive: true });
  writeFileSync(join(copy, "khoa", "s4", "chu.json"), JSON.stringify({ day: "K" }));
  redWith(await dot.judge({ oldDir: fetchKit(OLD_KIT), newDir: fetchKit(NEW_KIT), dir: copy }), "dot: lock s4 is held");
});

test("E10 dot (d): red when the 3.1 reader of plan groups returns one group fewer", async () => {
  await greenOnce("dot", () => dot.measure());
  const real = fetchKit(NEW_KIT);
  const copy = mkdtempSync(join(tmpdir(), "nk31-kit-pha-"));
  cpSync(join(real, "plugins/dispatch"), join(copy, "plugins/dispatch"), { recursive: true });
  const f = join(copy, "plugins/dispatch/scripts/nguon-hang.mjs");
  const text = readFileSync(f, "utf8");
  assert.ok(text.includes("export function docNhomKeHoach("), "nguon-hang.mjs of v3.1.0 has no docNhomKeHoach");
  writeFileSync(
    f,
    text.replace("export function docNhomKeHoach(", "function docNhomKeHoachThat(") +
      "\nexport function docNhomKeHoach(g) {\n  const m = docNhomKeHoachThat(g);\n  m.delete([...m.keys()][0]);\n  return m;\n}\n",
  );
  redWith(
    await dot.judge({ oldDir: fetchKit(OLD_KIT), newDir: copy, dir: dot.batchDir() }),
    "dot: nguon-hang.mjs docNhomKeHoach reads differently in v3.0.0 and v3.1.0",
  );
});
