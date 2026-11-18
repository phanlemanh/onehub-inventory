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

// E1
test("E1 green on HEAD settings", () => {
  const r = settings.judge(HEAD_SETTINGS, BASE_SETTINGS);
  assert.equal(r.ok, true, r.line);
});

test("E1 red (a): a false key dropped", () => {
  const s = copy(HEAD_SETTINGS);
  delete s.enabledPlugins[`tri-thuc@${settings.OLD_MARKET}`];
  red(settings.judge(s, BASE_SETTINGS), "settings: false keys differ from the six old-marketplace plugins");
});

test("E1 red (b): a false key turned on", () => {
  const s = copy(HEAD_SETTINGS);
  s.enabledPlugins[`feature-loop@${settings.OLD_MARKET}`] = true;
  red(settings.judge(s, BASE_SETTINGS), "settings: false keys differ from the six old-marketplace plugins");
});

test("E1 red (c): permissions changed", () => {
  const s = copy(HEAD_SETTINGS);
  s.permissions.allow = [...s.permissions.allow, "Bash(true)"];
  red(settings.judge(s, BASE_SETTINGS), "settings: permissions changed from merge-base");
});
