// Two-way check of every measure of nang-kit-3-0: green on the real thing, red with its pinned message on a copy
// broken in exactly what the measure guards. Messages are the ones pinned in evals.yaml.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { appendFileSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { after, test } from "node:test";

import * as ciKit from "./ci-kit.mjs";
import * as docCommands from "./doc-commands.mjs";
import * as gateBranch from "./gate-branch.mjs";
import * as gateControl from "./gate-control.mjs";
import { commitAll, coreRoot, fetchKit, git, repoRoot, worktree } from "./kit.mjs";
import * as kitRootCli from "./kit-root-cli.mjs";
import * as leftover from "./leftover.mjs";
import { BASELINE, DOC_FILES, LIFECYCLE_REASONS, NEW_KIT } from "./matrix.mjs";
import * as productMap from "./product-map.mjs";
import * as settings from "./settings.mjs";

const ROOT = repoRoot();
const atBase = (f) => git(ROOT, "show", `${BASELINE}:${f}`);
const lines = (r) => [].concat(r.line);

const green = new Map();
async function greenOnce(name, fn) {
  if (!green.has(name)) green.set(name, await fn());
  const r = green.get(name);
  assert.equal(r.ok, true, `${name} not green on HEAD: ${lines(r).join(" | ")}`);
}

function tempRoot(files) {
  const dir = mkdtempSync(join(tmpdir(), "nk30-copy-"));
  for (const [rel, text] of Object.entries(files)) {
    mkdirSync(dirname(join(dir, rel)), { recursive: true });
    writeFileSync(join(dir, rel), text);
  }
  return dir;
}

function withWorktree(rev, fn) {
  const wt = worktree(rev);
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
  const left = git(ROOT, "worktree", "list").split("\n").filter((l) => l.includes("nk30-wt-"));
  assert.deepEqual(left, [], "temp worktrees left behind");
});

test("E1 ci-kit: red on the baseline ci.yml", async () => {
  await greenOnce("ci-kit", () => ciKit.measure());
  const dir = tempRoot({ ".github/workflows/ci.yml": atBase(".github/workflows/ci.yml") });
  redWith(await ciKit.measure({ root: dir }), "ci-kit: KIT_TAG is v2.38.1, want v3.0.0");
});

test("E2 gate-branch (a): red on baseline + the settings change without a record", async () => {
  await greenOnce("gate-branch", () => gateBranch.measure({ save: false }));
  await withWorktree(BASELINE, async (dir) => {
    const patch = git(ROOT, "diff", BASELINE, "HEAD", "--", ".claude/settings.json");
    execFileSync("git", ["-C", dir, "apply"], { input: `${patch}\n` });
    commitAll(dir, "chore: probe settings without a record");
    redWith(
      await gateBranch.measure({ root: dir, base: BASELINE, save: false }),
      "gate-branch: VIOLATION outside the lifecycle reasons of nang-kit-3-0",
    );
  });
});

test("E2 gate-branch (b): red on HEAD when this record declares a low tier on T3 paths", async () => {
  await greenOnce("gate-branch", () => gateBranch.measure({ save: false }));
  await withWorktree("HEAD", async (dir) => {
    const p = join(dir, "_acceptance/nang-kit-3-0/contract.md");
    const text = readFileSync(p, "utf8");
    const broken = text.replace("risk_tier: T3\n", "risk_tier: T1\n");
    assert.notEqual(broken, text, "fixture: risk_tier of the contract not found");
    writeFileSync(p, broken);
    commitAll(dir, "test: probe a low tier");
    redWith(
      await gateBranch.measure({ root: dir, save: false }),
      "gate-branch: VIOLATION outside the lifecycle reasons of nang-kit-3-0",
    );
  });
});

test("E3 gate-control: red when one real run loses an OK line", () => {
  const out = gateControl.recheck(NEW_KIT, BASELINE);
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

test("E4 product-map (a): red when PRODUCT-MAP.md drifts", async () => {
  await greenOnce("product-map", () => productMap.measure());
  await withWorktree("HEAD", async (dir) => {
    appendFileSync(join(dir, "PRODUCT-MAP.md"), "\n- a line no record wrote\n");
    redWith(await productMap.measure({ root: dir }), "product-map: kit v3.0.0 product-map.mjs --check exit 1");
  });
});

test("E4 product-map (b): red when an executor calls a script the kit lacks", async () => {
  await greenOnce("product-map", () => productMap.measure());
  const core = coreRoot(NEW_KIT, fetchKit(NEW_KIT));
  const config = readFileSync(join(ROOT, "_acceptance/config.yaml"), "utf8");
  const broken = config.replace("scripts/design-floor-s4.mjs", "scripts/khong-co.mjs");
  assert.notEqual(broken, config, "fixture: design.floor script not found");
  redWith(
    productMap.executorLine(broken, core),
    "executor-scripts: design.floor calls scripts/khong-co.mjs, missing in kit v3.0.0",
  );
});

test("E6 kit-root cli: red on the baseline kit-root", async () => {
  await greenOnce("kit-root-cli", () => kitRootCli.measure());
  const file = join(mkdtempSync(join(tmpdir(), "nk30-old-kit-root-")), "kit-root.mjs");
  writeFileSync(file, atBase("tools/kit-root.mjs"));
  redWith(await kitRootCli.measure({ kitRoot: file }), "kit-root cli: old-only printed /");
});

test("E7 settings (a): red on the baseline settings", async () => {
  await greenOnce("settings", () => settings.measure());
  const dir = tempRoot({
    ".claude/settings.json": atBase(".claude/settings.json"),
    ".github/workflows/ci.yml": readFileSync(join(ROOT, ".github/workflows/ci.yml"), "utf8"),
  });
  redWith(await settings.measure({ root: dir }), "settings: marketplace is acceptance-gate-kit, want delivery-loop");
});

function headSettings(edit) {
  const s = JSON.parse(readFileSync(join(ROOT, ".claude/settings.json"), "utf8"));
  edit(s);
  return tempRoot({
    ".claude/settings.json": JSON.stringify(s, null, 2),
    ".github/workflows/ci.yml": readFileSync(join(ROOT, ".github/workflows/ci.yml"), "utf8"),
  });
}

test("E7 settings (b): red without dispatch@delivery-loop", async () => {
  await greenOnce("settings", () => settings.measure());
  const dir = headSettings((s) => delete s.enabledPlugins["dispatch@delivery-loop"]);
  redWith(await settings.measure({ root: dir }), "settings: plugins on differ from the kit marketplace");
});

test("E7 settings (c): red without the ref pin", async () => {
  await greenOnce("settings", () => settings.measure());
  const dir = headSettings((s) => delete s.extraKnownMarketplaces["delivery-loop"].source.ref);
  redWith(await settings.measure({ root: dir }), "settings: marketplace not pinned to v3.0.0");
});

test("E8 doc-commands: red on the baseline docs", async () => {
  await greenOnce("doc-commands", () => docCommands.measure());
  redWith(await docCommands.measure({ texts: DOC_FILES.map(atBase) }), "doc-commands: /tri-thuc:ghi not in kit v3.0.0");
});

test("E9 leftover: red when a living file names an old command", async () => {
  await greenOnce("leftover", () => leftover.measure());
  await withWorktree("HEAD", async (dir) => {
    appendFileSync(join(dir, "README.md"), "\nOpen the batch with `/dieu-phoi:mo-dot nen`.\n");
    redWith(await leftover.measure({ root: dir }), "leftover: 1 lines at HEAD");
  });
});

test("kit-root red: installEntries is not exported by the old kit-root", async () => {
  const file = join(mkdtempSync(join(tmpdir(), "nk30-old-kit-root-")), "kit-root.mjs");
  writeFileSync(file, atBase("tools/kit-root.mjs"));
  const oldMod = await import(file);
  const newMod = await import(join(ROOT, "tools/kit-root.mjs"));
  assert.equal(typeof newMod.installEntries, "function");
  assert.equal(oldMod.installEntries, undefined, "kit-root red: installEntries is not exported by the old kit-root");
});

test("E2 gate-branch: every lifecycle reason is written, verbatim, by kit 3.0's gate", () => {
  const gate = readFileSync(join(coreRoot(NEW_KIT, fetchKit(NEW_KIT)), "scripts/pre-merge-check.sh"), "utf8");
  for (const { source } of LIFECYCLE_REASONS)
    assert.ok(gate.includes(source), `gate-branch: lifecycle reason not written by kit 3.0: ${source}`);
  assert.equal(gate.includes('echo "VIOLATION [$slug]: verdict=$verdict (must be PASS to merge)x"'), false);
});
