// Two-way check of every measure of nang-kit-3-1: green on the real thing, red with its pinned message on a copy
// broken in exactly what the measure guards. Messages are the ones pinned in evals.yaml.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { appendFileSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { after, test } from "node:test";

import { ciKit } from "./ci-tag.mjs";
import * as docCommands from "./doc-commands.mjs";
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

test("E4 doc-commands: red when a living doc names a command kit 3.1 lacks", async () => {
  await greenOnce("doc-commands", () => docCommands.measure());
  const texts = DOC_FILES.map((f) => readFileSync(join(ROOT, f), "utf8"));
  texts[0] = texts[0].replace("/knowledge:ingest", "/knowledge:ghi");
  redWith(await docCommands.measure({ texts }), "doc-commands: /knowledge:ghi not in kit v3.1.0");
});

test("E5 gate-control: red when one real run loses an OK line", () => {
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

test("E6 gate-branch (a): red on main + the settings change without a record", async () => {
  await greenOnce("gate-branch", () => gateBranch.measure({ save: false }));
  await withWorktree(BASE, async (dir) => {
    const patch = git(ROOT, "diff", BASE, "HEAD", "--", ".claude/settings.json");
    execFileSync("git", ["-C", dir, "apply"], { input: `${patch}\n` });
    commitAll(dir, "chore: probe settings without a record");
    redWith(await gateBranch.measure({ root: dir, base: BASE, save: false }), "gate-branch: VIOLATION not naming nang-kit-3-1");
  });
});

test("E6 gate-branch (b): --signed is red on the real gate output while this record is unsigned", () => {
  const kit = ciKit(ROOT);
  const { out } = runGate(coreRoot(kit, fetchKit(kit)), ROOT, ["--base", "origin/main"]);
  assert.equal(gateBranch.judge(out).ok, true, "fixture: the unsigned gate output is not green without --signed");
  redWith(gateBranch.judge(out, { signed: true }), "gate-branch: --signed wants 0 VIOLATION");
});

test("E6 gate-branch (c): red when ci.yml names a kit tag outside the matrix", () => {
  const ci = readFileSync(join(ROOT, ".github/workflows/ci.yml"), "utf8");
  const broken = ci.replace(/KIT_TAG: v3\.[01]\.0/, "KIT_TAG: v9.9.9");
  assert.notEqual(broken, ci, "fixture: KIT_TAG not found");
  const dir = tempRoot({ ".github/workflows/ci.yml": broken });
  assert.throws(() => ciKit(dir), /^Error: ci-tag: KIT_TAG of the gate job is v9\.9\.9, want v3\.0\.0 or v3\.1\.0$/);
});
