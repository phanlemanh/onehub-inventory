// Two-way check of every measure of nang-kit-3-1-1: green on the real thing, red with its pinned message on a copy
// broken in exactly what the measure guards. Messages are the ones pinned in evals.yaml.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, realpathSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { after, test } from "node:test";

import * as ciLine from "./ci-line.mjs";
import { ciKit } from "./ci-tag.mjs";
import * as gateBranch from "./gate-branch.mjs";
import * as gateControl from "./gate-control.mjs";
import * as kiemBanCai from "./kiem-ban-cai.mjs";
import * as kitDiff from "./kit-diff.mjs";
import { commitAll, coreRoot, fetchKit, git, mergeBase, repoRoot, runGate, worktree } from "./kit.mjs";
import { CI_PATCH, NEW_KIT, OLD_KIT, SLUG } from "./matrix.mjs";
import * as settings from "./settings.mjs";
import * as tag from "./tag.mjs";

const ROOT = repoRoot();
const BASE = mergeBase(ROOT);
const CI = ".github/workflows/ci.yml";
const lines = (r) => [].concat(r.line);

const green = new Map();
async function greenOnce(name, fn) {
  if (!green.has(name)) green.set(name, await fn());
  const r = green.get(name);
  assert.equal(r.ok, true, `${name} not green on HEAD: ${lines(r).join(" | ")}`);
}

function tempRoot(files) {
  const dir = mkdtempSync(join(tmpdir(), "nk311-copy-"));
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

// --- E1 settings ---------------------------------------------------------------------------------------------------
const baseSettings = () => git(ROOT, "show", `${BASE}:.claude/settings.json`);
const market = () => settings.kitMarketplace(fetchKit(NEW_KIT));

test("E1 settings (a): red on the settings of the merge-base", async () => {
  await greenOnce("settings", () => settings.measure());
  redWith(settings.judge(baseSettings(), baseSettings(), market()), "settings: marketplace not pinned to v3.1.1");
});

test("E1 settings (b): red when a second line changes", async () => {
  await greenOnce("settings", () => settings.measure());
  const s = JSON.parse(readFileSync(join(ROOT, ".claude/settings.json"), "utf8"));
  s.enabledPlugins["superpowers@claude-plugins-official"] = false;
  redWith(settings.judge(`${JSON.stringify(s, null, 2)}\n`, baseSettings(), market()), "settings: differs from origin/main in 2 lines");
});

// --- E2 tag --------------------------------------------------------------------------------------------------------
test("E2 tag (a): red when the tag peels to another commit", async () => {
  await greenOnce("tag", () => tag.measure());
  redWith(
    tag.judge({ peeled: OLD_KIT.sha, kitDir: fetchKit(NEW_KIT) }),
    "tag: v3.1.1 on phanlemanh/delivery-loop is 0a93a5b9, want 1193bc22",
  );
});

test("E2 tag (b): red on the plugin versions of v3.1.0", async () => {
  await greenOnce("tag", () => tag.measure());
  redWith(tag.judge({ peeled: NEW_KIT.sha, kitDir: fetchKit(OLD_KIT) }), "tag: acceptance-gate is 3.1.0, want 3.1.1");
});

// --- E3 ci-line ----------------------------------------------------------------------------------------------------
const headCi = () => readFileSync(join(ROOT, CI), "utf8");
const baseCi = () => `${git(ROOT, "show", `${BASE}:${CI}`)}\n`;
const patchText = () => readFileSync(join(ROOT, CI_PATCH), "utf8");

test("E3 ci-line (a): red on the ci.yml of the merge-base", async () => {
  await greenOnce("ci-line", () => ciLine.measure());
  redWith(ciLine.judge(baseCi(), baseCi(), patchText()), "ci-line: KIT_TAG of the gate job is v3.1.0, want v3.1.1");
});

test("E3 ci-line (b): red when a second line of ci.yml changes", async () => {
  await greenOnce("ci-line", () => ciLine.measure());
  const broken = headCi().replace("runs-on: ubuntu-latest", "runs-on: ubuntu-24.04");
  assert.notEqual(broken, headCi(), "fixture: runs-on not found");
  redWith(ciLine.judge(broken, baseCi(), patchText()), "ci-line: ci.yml differs from origin/main in 2 lines");
});

test("E3 ci-line (c): red when the kept patch gives another tag", async () => {
  await greenOnce("ci-line", () => ciLine.measure());
  const broken = patchText().replace("+      KIT_TAG: v3.1.1", "+      KIT_TAG: v3.1.2");
  assert.notEqual(broken, patchText(), "fixture: the + line of the patch not found");
  redWith(ciLine.judge(headCi(), baseCi(), broken), "ci-line: ci-kit-tag.patch does not give the ci.yml of HEAD");
});

// --- E4 kiem-ban-cai -----------------------------------------------------------------------------------------------
test("E4 kiem-ban-cai: red when the install source is the tree of v3.1.0", async () => {
  await greenOnce("kiem-ban-cai", () => kiemBanCai.measure());
  const kitDir = kiemBanCai.fetchKitWithTag(NEW_KIT);
  redWith(
    kiemBanCai.judge(kiemBanCai.run(kitDir, ["--nguon-cai", fetchKit(OLD_KIT)])),
    "kiem-ban-cai: kiem-ban-cai.mjs of v3.1.1 --ref v3.1.1 exit 1",
  );
});

// --- E5 kit-diff ---------------------------------------------------------------------------------------------------
function kitDiffInput() {
  const dir = kitDiff.kitPair();
  const configText = readFileSync(join(ROOT, "_acceptance/config.yaml"), "utf8");
  return {
    changed: kitDiff.changedFiles(dir),
    executors: kitDiff.kitExecutors(configText),
    coreFiles: kitDiff.filesAt(dir, NEW_KIT.sha),
    configText,
  };
}

test("E5 kit-diff (a): red when a core script changed between the tags", async () => {
  await greenOnce("kit-diff", () => kitDiff.measure());
  const input = kitDiffInput();
  const changed = [...input.changed, "plugins/acceptance-gate/scripts/pre-merge-check.sh"].sort();
  redWith(
    kitDiff.judge({ ...input, changed }),
    "kit-diff: plugins/acceptance-gate/scripts/pre-merge-check.sh changed between v3.1.0 and v3.1.1",
  );
});

test("E5 kit-diff (b): red when the changed files are not the matrix's", async () => {
  await greenOnce("kit-diff", () => kitDiff.measure());
  const input = kitDiffInput();
  const changed = input.changed.filter((f) => !f.endsWith("/gop.mjs"));
  assert.equal(changed.length, input.changed.length - 1, "fixture: gop.mjs not among the changed files");
  redWith(kitDiff.judge({ ...input, changed }), "kit-diff: changed files differ from the matrix");
});

test("E5 kit-diff (c): red when an executor runs a file outside the core's scripts and lib", async () => {
  await greenOnce("kit-diff", () => kitDiff.measure());
  const input = kitDiffInput();
  const broken = input.configText.replace("scripts/design-floor-s4.mjs", "commands/signoff.md");
  assert.notEqual(broken, input.configText, "fixture: design.floor script not found");
  redWith(
    kitDiff.judge({ ...input, executors: kitDiff.kitExecutors(broken) }),
    "kit-diff: executor design.floor runs commands/signoff.md, outside acceptance-gate/scripts and lib",
  );
});

test("E5 kit-diff (d): red when the repo turns on the merge-by-word switch", async () => {
  await greenOnce("kit-diff", () => kitDiff.measure());
  const input = kitDiffInput();
  const broken = input.configText.replace(/^feature_loop:\s*$/m, "feature_loop:\n  gop_theo_loi_ky: true");
  assert.notEqual(broken, input.configText, "fixture: feature_loop block not found");
  redWith(kitDiff.judge({ ...input, configText: broken }), "kit-diff: feature_loop.gop_theo_loi_ky is on in _acceptance/config.yaml");
});

// --- E6 gate-control -----------------------------------------------------------------------------------------------
let recheckOut = null;
const recheckNew = () => (recheckOut ??= gateControl.recheck(NEW_KIT, BASE));

test("E6 gate-control (a): red when one real run loses an OK line", () => {
  const out = recheckNew();
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
  const out = recheckNew();
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
  const extra = `${out}\nVIOLATION [${SLUG}]: a reason only one kit prints`;
  assert.equal(gateControl.compareHead(out, extra), "gate-control: verdict lines on HEAD differ between kits");
});

// --- E7 gate-branch ------------------------------------------------------------------------------------------------
let headGate = null;
function headGateOut() {
  if (headGate === null) {
    const kit = ciKit(ROOT);
    headGate = runGate(coreRoot(kit, fetchKit(kit)), ROOT, ["--base", "origin/main"]).out;
  }
  assert.equal(gateBranch.judge(headGate).ok, true, "fixture: the unsigned gate output is not green without --signed");
  return headGate;
}

test("E7 gate-branch (a): red on the merge-base + the two pins without a record", async () => {
  await greenOnce("gate-branch", () => gateBranch.measure({ save: false }));
  await withWorktree(BASE, async (dir) => {
    const patch = git(ROOT, "diff", BASE, "HEAD", "--", ".claude/settings.json", CI);
    execFileSync("git", ["-C", dir, "apply"], { input: `${patch}\n` });
    commitAll(dir, "chore: probe the pins without a record");
    redWith(await gateBranch.measure({ root: dir, base: BASE, save: false }), `gate-branch: VIOLATION not naming ${SLUG}`);
  });
});

test("E7 gate-branch (b): --signed is red on the real gate output while this record is unsigned", () => {
  redWith(gateBranch.judge(headGateOut(), { signed: true }), "gate-branch: --signed wants 0 VIOLATION");
});

test("E7 gate-branch (c): red when ci.yml names a kit tag outside the matrix", () => {
  const broken = headCi().replace(/KIT_TAG: v3\.1\.1/, "KIT_TAG: v9.9.9");
  assert.notEqual(broken, headCi(), "fixture: KIT_TAG v3.1.1 not found");
  const dir = tempRoot({ [CI]: broken });
  assert.throws(() => ciKit(dir), /^Error: ci-tag: KIT_TAG of the gate job is v9\.9\.9, want v3\.1\.1$/);
});

test("E7 gate-branch (d): red when the gate ran no rules", () => {
  const out = headGateOut();
  const broken = out.replace(/^pre-merge-check: rules ran=\d+/m, "pre-merge-check: rules ran=0");
  assert.notEqual(broken, out, "fixture: rules ran line not found");
  redWith(gateBranch.judge(broken), "gate-branch: no rules ran");
});

test("E7 gate-branch (e): red before signature when no stop names this record", () => {
  const out = headGateOut();
  const none = out
    .split("\n")
    .filter((l) => !l.startsWith("VIOLATION"))
    .join("\n");
  assert.notEqual(none, out, "fixture: the real unsigned output has no VIOLATION line");
  redWith(gateBranch.judge(none), `gate-branch: before signature wants at least 1 VIOLATION naming ${SLUG}`);
});
