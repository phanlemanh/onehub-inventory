// AC-3: .github/workflows/pr-title.yml is the template of the tag byte for byte, its hash is the one
// .repo-setup.json records, and against the base of the pull request only the `run` of the second
// step of `conventional-commits` changed: triggers, permissions, `conventional-title` and the rest of
// `conventional-commits` are as they were.
// Usage: node template-same.mjs [--root <dir>]

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { pluginTree, prBase, root, show, verdict, yaml } from "./lib.mjs";
import { TEMPLATE } from "./matrix.mjs";

const NAME = "template-same";
const FILE = ".github/workflows/pr-title.yml";
const dir = root();
const problems = [];

try {
  const head = readFileSync(join(dir, FILE));
  const template = readFileSync(join(pluginTree(), TEMPLATE));
  if (!head.equals(template)) problems.push(`${FILE} is not the template ${TEMPLATE} of the tag byte for byte`);

  const recorded = JSON.parse(readFileSync(join(dir, ".repo-setup.json"), "utf8")).files[FILE];
  const sha = createHash("sha256").update(head).digest("hex");
  if (recorded !== sha) problems.push(`.repo-setup.json records ${recorded} for ${FILE}, the file hashes to ${sha}`);

  const baseText = show(dir, prBase(dir), FILE);
  if (baseText === null) throw new Error(`the base of the pull request has no ${FILE}`);
  const before = yaml(baseText);
  const after = yaml(head.toString("utf8"));
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  for (const key of ["name", "on", "permissions"]) {
    if (!same(before[key], after[key])) problems.push(`the workflow's ${key} changed`);
  }
  if (!same(Object.keys(before.jobs), Object.keys(after.jobs))) problems.push("the list of jobs changed");
  if (!same(before.jobs["conventional-title"], after.jobs["conventional-title"])) {
    problems.push("the job conventional-title changed");
  }
  const b = before.jobs["conventional-commits"];
  const a = after.jobs["conventional-commits"];
  const { steps: bs, ...bRest } = b;
  const { steps: as, ...aRest } = a;
  if (!same(bRest, aRest)) problems.push("conventional-commits changed outside its steps");
  if (bs.length !== as.length) problems.push(`conventional-commits has ${as.length} steps, it had ${bs.length}`);
  as.forEach((step, i) => {
    const { run: r1, ...s1 } = step;
    const { run: r0, ...s0 } = bs[i] ?? {};
    if (!same(s0, s1)) problems.push(`step ${i + 1} of conventional-commits changed outside its run`);
    if (i !== 1 && r0 !== r1) problems.push(`the run of step ${i + 1} of conventional-commits changed`);
  });
  if (as[1]?.run === bs[1]?.run) problems.push("the run of step 2 of conventional-commits did not change");
  if (/conventional-pre-commit/.test(as[1]?.run ?? "")) {
    problems.push("conventional-commits still names the hook id conventional-pre-commit");
  }
} catch (err) {
  problems.push(err.message);
}

verdict(
  NAME,
  problems,
  "pr-title.yml is the tag's template byte for byte and has the hash .repo-setup.json records; only the run of step 2 of conventional-commits changed, and it no longer names conventional-pre-commit",
);
