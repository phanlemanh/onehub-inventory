// The red side of the three shallow-clone measures (their green sides are the measures run on HEAD,
// evals E2, E4 and E6). Each case builds fresh depth-1 clones and runs make, so it takes minutes;
// kept apart from measures-two-way.mjs for that. Every case also checks it left no clone behind.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";

import { HERE } from "./lib.mjs";
import { BASE, BASE_GATE, GATE, gateLine, manifestLine, NO_MAIN, OLD_MAIN } from "./matrix.mjs";

const clones = () => new Set(readdirSync(tmpdir()).filter((name) => name.startsWith("upgrade-0-7-1-shallow-")));

function redWith(lines, script, ...args) {
  const before = clones();
  const run = spawnSync(process.execPath, [path.join(HERE, script), ...args], {
    encoding: "utf8",
    maxBuffer: 1 << 26,
  });
  const out = `${run.stdout}${run.stderr}`;
  assert.equal(run.status, 1, out);
  for (const line of lines) assert.ok(out.includes(line), `expected "${line}" in:\n${out}`);
  const left = [...clones()].filter((name) => !before.has(name));
  assert.deepEqual(left, [], `clones left behind: ${left.join(" ")}`);
  return out;
}

test("shallow-check: red on 8925e8ff, and red when it looks for 295 components", () => {
  // One make check run: at BASE the gate holds 17 by 25, and the manifest line still says 294, so the
  // missing 295 line proves the manifest pin bites on its own.
  const out = redWith(
    [`shallow: make check did not say: ${gateLine(GATE)}`, `shallow: make check did not say: ${manifestLine(295)}`],
    "shallow-check.mjs",
    "--rev",
    BASE,
    "--components",
    "295",
  );
  assert.ok(!out.includes(`did not say: ${gateLine(BASE_GATE)}`));
});

test("shallow-alone: red with the 0.7.0 owner-calls", () => {
  redWith(
    [
      "alone: decision-sheet did not say main was fetched from origin",
      "alone: make design-assembly exit 2",
      `decision-sheet: what this branch writes cannot be compared: ${NO_MAIN}`,
      `owner-calls: what this branch adds cannot be read, so a new kind of screen or a new brand colour would pass unseen: ${NO_MAIN}`,
    ],
    "shallow-alone.mjs",
    "--owner-calls-from",
    BASE,
  );
});

test("shallow-alone: red when origin main is older", () => {
  redWith(["alone: the clone left main at ea774a0f, not 8925e8ff"], "shallow-alone.mjs", "--main-at", OLD_MAIN);
});

test("shallow-bite: red without the two checks", () => {
  redWith(
    ["bite: a new page under design/patterns did not stop owner-calls", "bite: an untold tag did not stop decision-sheet"],
    "shallow-bite.mjs",
    "--omit-checks",
  );
});
