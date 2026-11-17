// The red side of shallow-check.mjs (its green side is the measure run on HEAD, eval E2): the same
// clone, made the same way, of the commit where the branch left main. There the derived files are
// tracked and make check draws none of them, so the measure must go red with its pinned lines.
// One make check run; kept apart from measures-two-way.mjs because it takes minutes.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { test } from "node:test";

import { HERE } from "./lib.mjs";
import { BASE } from "./matrix.mjs";

test("shallow-check: red on the old layout, with the lines it pins", () => {
  const run = spawnSync(process.execPath, [path.join(HERE, "shallow-check.mjs"), "--rev", BASE], { encoding: "utf8", maxBuffer: 1 << 26 });
  const out = `${run.stdout}${run.stderr}`;
  assert.equal(run.status, 1, out);
  for (const line of [
    "shallow: make check did not say: derived files: wrote design/screens.yaml from design/screens",
    "shallow: make check did not say: design-assembly: 17 decisions held by 25 checks, each seen failing on a changed copy",
    "shallow: tracked in the clone: design/component-registry.json design/screens.yaml",
  ]) {
    assert.ok(out.includes(line), `expected "${line}" in:\n${out}`);
  }
});
