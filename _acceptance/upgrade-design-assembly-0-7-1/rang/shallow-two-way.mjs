// The red side of the three shallow-clone measures (their green sides are the measures run on HEAD,
// evals E2, E4 and E6). Each case builds fresh depth-1 clones and runs make, so it takes minutes;
// kept apart from measures-two-way.mjs for that. Every case also checks it left no clone behind: each
// case runs with its own TMPDIR, so the clones of measures running beside it in a grading round, which
// share the machine's temporary folder, are not taken for its own.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";

import { HERE } from "./lib.mjs";
import { BASE, BASE_GATE, GATE, gateLine, manifestLine, NO_MAIN, OLD_MAIN } from "./matrix.mjs";

// What a measure leaves in `dir`: its own scratch folders only, not what make check writes there.
const leftIn = (dir) => readdirSync(dir).filter((name) => name.startsWith("upgrade-0-7-1-"));

function redWith(lines, script, ...args) {
  const own = mkdtempSync(path.join(tmpdir(), "upgrade-two-way-case-"));
  try {
    const run = spawnSync(process.execPath, [path.join(HERE, script), ...args], {
      encoding: "utf8",
      maxBuffer: 1 << 26,
      env: { ...process.env, TMPDIR: own },
    });
    const out = `${run.stdout}${run.stderr}`;
    assert.equal(run.status, 1, out);
    for (const line of lines) assert.ok(out.includes(line), `expected "${line}" in:\n${out}`);
    const left = leftIn(own);
    assert.deepEqual(left, [], `clones left behind: ${left.join(" ")}`);
    return out;
  } finally {
    rmSync(own, { recursive: true, force: true });
  }
}

test("redWith: a scratch folder left in the case's own TMPDIR is seen; one beside it is not", () => {
  // The leftover check both ways, without make: a measure that leaves its clone is caught, and a
  // clone some other measure keeps in the shared temporary folder is not blamed on this case.
  const shared = mkdtempSync(path.join(tmpdir(), "upgrade-0-7-1-shallow-beside-"));
  const own = mkdtempSync(path.join(tmpdir(), "upgrade-two-way-case-"));
  try {
    mkdtempSync(path.join(own, "upgrade-0-7-1-shallow-"));
    assert.equal(leftIn(own).length, 1);
    assert.equal(
      leftIn(own).some((name) => name.startsWith(path.basename(shared))),
      false,
    );
  } finally {
    rmSync(own, { recursive: true, force: true });
    rmSync(shared, { recursive: true, force: true });
  }
});

test("shallow-check: red on 8925e8ff, and red when it looks for 295 components or 2461 tests", () => {
  // One make check run on BASE. The positive control is what the gate and the manifest said there:
  // 17 decisions by 25 checks, and 294 components. So the missing 19/27 line is the gate at BASE, not a
  // make check that died before the gate, and the missing 295 line is the manifest pin biting alone.
  redWith(
    [
      `shallow: make check did not say: ${gateLine(GATE)}`,
      `shallow: make check did not say: ${manifestLine(295)}`,
      `shallow, the gate said: ${gateLine(BASE_GATE)}`,
      `shallow, the manifest said: ${manifestLine(294)}`,
      "tests and skipped 2, not 2461 and 2",
    ],
    "shallow-check.mjs",
    "--rev",
    BASE,
    "--components",
    "295",
    "--tests",
    "2461",
  );
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

test("shallow-bite: red when the gate prints the lines but exits 0", () => {
  redWith(
    [
      "bite: a new page under design/patterns printed its line, but the gate exited 0",
      "bite: an untold tag printed its line, but the gate exited 0",
      "bite: the fixtures of 8925e8ff did not stop decision-sheet by name: exit 0",
    ],
    "shallow-bite.mjs",
    "--gate",
    "make design-assembly; true",
  );
});
