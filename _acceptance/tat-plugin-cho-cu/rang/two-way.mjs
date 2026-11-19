// AC-7: each tpc measure is green on the sound object and red, with the message pinned in evals.yaml, on a broken copy.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

import { git, mergeBase, repoRoot } from "./kit.mjs";
import * as settings from "./settings.mjs";

const ROOT = repoRoot();
const HEAD_SETTINGS = JSON.parse(readFileSync(join(ROOT, ".claude/settings.json"), "utf8"));
const BASE_SETTINGS = JSON.parse(git(ROOT, "show", `${mergeBase(ROOT)}:.claude/settings.json`));
const copy = (o) => structuredClone(o);

function red(result, pinned) {
  assert.equal(result.ok, false, `expected red, got green: ${result.line}`);
  assert.equal(result.line, pinned);
}

// E1 — each test: green on the sound object first, then red with the pinned message on the broken copy.
const greenE1 = () => assert.equal(settings.judge(HEAD_SETTINGS, BASE_SETTINGS).ok, true, "E1 not green on HEAD");

test("E1 red (a): a false key dropped", () => {
  greenE1();
  const s = copy(HEAD_SETTINGS);
  delete s.enabledPlugins[`tri-thuc@${settings.OLD_MARKET}`];
  red(settings.judge(s, BASE_SETTINGS), "settings: false keys differ from the six old-marketplace plugins");
});

test("E1 red (b): a false key turned on", () => {
  greenE1();
  const s = copy(HEAD_SETTINGS);
  s.enabledPlugins[`feature-loop@${settings.OLD_MARKET}`] = true;
  red(settings.judge(s, BASE_SETTINGS), "settings: false keys differ from the six old-marketplace plugins");
});

test("E1 red (c): permissions changed", () => {
  greenE1();
  const s = copy(HEAD_SETTINGS);
  s.permissions.allow = [...s.permissions.allow, "Bash(true)"];
  red(settings.judge(s, BASE_SETTINGS), "settings: permissions changed from merge-base");
});

// E2, E3 — on the real init events recorded by `phien.mjs --ghi` (no model call here).
import * as phien from "./phien.mjs";

const RANG = join(ROOT, "_acceptance/tat-plugin-cho-cu/rang");
const INIT_HEAD = JSON.parse(readFileSync(join(RANG, "init-head.json"), "utf8"));
const INIT_BASE = JSON.parse(readFileSync(join(RANG, "init-merge-base.json"), "utf8"));
const plugin = (init, source) => init.plugins.find((p) => p.source === source);

const greenE3 = () => assert.equal(phien.judge(INIT_HEAD).ok, true, "E3 not green on the recorded HEAD init");

test("E3 red (a): the recorded merge-base init, two versions", () => {
  greenE3();
  red(phien.judge(INIT_BASE), "phien: two versions of acceptance-gate");
});

test("E3 red (b): dispatch@delivery-loop missing", () => {
  greenE3();
  const i = copy(INIT_HEAD);
  i.plugins = i.plugins.filter((p) => p.source !== "dispatch@delivery-loop");
  red(phien.judge(i), "phien: delivery-loop plugins differ from the six");
});

test("E3 red (c): acceptance-gate:cat-luot still loaded", () => {
  greenE3();
  const i = copy(INIT_HEAD);
  i.slash_commands.push("acceptance-gate:cat-luot");
  red(phien.judge(i), "phien: acceptance-gate:cat-luot still loaded");
});

test("E3 red (d): a delivery-loop plugin at 2.38.1", () => {
  greenE3();
  const i = copy(INIT_HEAD);
  plugin(i, "feature-loop@delivery-loop").version = "2.38.1";
  red(phien.judge(i), "phien: feature-loop@delivery-loop is 2.38.1, want 3.0.0");
});

test("E3 red (e): an old plugin whose name differs from the new one", () => {
  greenE3();
  const i = copy(INIT_HEAD);
  i.plugins.push({ name: "road-map", source: `road-map@${settings.OLD_MARKET}`, version: "2.38.1" });
  red(phien.judge(i), `phien: old-marketplace source still loaded: road-map@${settings.OLD_MARKET}`);
});

test("E2 red: a merge-base init with one version each gives no positive control", () => {
  assert.equal(phien.controlJudge(INIT_BASE, "0000000").ok, true, "E2 not green on the recorded merge-base init");
  red(phien.controlJudge(INIT_HEAD, "0000000"), "doi-chung: the session measure is green at merge-base — no positive control");
});

// E4 — in a temporary worktree at HEAD, so breaking a file never touches the real tree.
import { appendFileSync, writeFileSync } from "node:fs";
import * as quet from "./quet-ten-cu.mjs";
import { withWorktree } from "./kit.mjs";

async function inHead(breakIt) {
  return withWorktree("HEAD", async (dir) => {
    assert.equal((await quet.measure({ root: dir })).ok, true, "E4 not green on the HEAD worktree");
    breakIt(dir);
    return quet.measure({ root: dir });
  });
}

test("E4 red (a): a line naming the old marketplace in wiki/log.md", async () => {
  const r = await inHead((dir) => appendFileSync(join(dir, "wiki/log.md"), `\n- ${settings.OLD_MARKET} still named here\n`));
  red(r, "quet-ten-cu: sweep line outside .claude/settings.json: wiki/log.md");
});

test("E4 red (b): the road-map false key dropped", async () => {
  const r = await inHead((dir) => {
    const p = join(dir, ".claude/settings.json");
    const s = JSON.parse(readFileSync(p, "utf8"));
    delete s.enabledPlugins[`road-map@${settings.OLD_MARKET}`];
    writeFileSync(p, JSON.stringify(s, null, 2) + "\n");
  });
  red(r, "quet-ten-cu: sweep finds 5 false-key lines, want 6");
});
