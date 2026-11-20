// AC-3: the three files the upgrade writes are the templates of the tag byte for byte, and
// .repo-setup.json records them; against the base of the pull request:
//   - .repo-setup.json: `version` goes from 0.10.1 to 0.10.2 and no other top-level key changes;
//     every file is at 0.10.2 except the 8 samples of KEPT_OLD, which keep 0.4.0; the hash changes
//     for the three files only, no entry is added or dropped;
//   - pr-title.yml: name, triggers, permissions, the list of jobs and conventional-title are as they
//     were; in conventional-commits only the checkout gains `persist-credentials: false` and only
//     the run of the judging step changes.
// Usage: node template-same.mjs [--root <dir>]

import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { WORKFLOW, pluginTree, prBase, root, show, verdict, yaml } from "./lib.mjs";
import { HASH_CHANGED, KEPT_OLD, NEW_VERSION, OLD_VERSION, TEMPLATE_DIR, UPDATED } from "./matrix.mjs";

const NAME = "template-same";
const dir = root();
const problems = [];
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const sha256 = (b) => createHash("sha256").update(b).digest("hex");

try {
  const base = prBase(dir);
  const after = JSON.parse(readFileSync(join(dir, ".repo-setup.json"), "utf8"));
  const beforeText = show(dir, base, ".repo-setup.json");
  if (beforeText === null) throw new Error("the base of the pull request has no .repo-setup.json");
  const before = JSON.parse(beforeText);

  for (const [file, template] of Object.entries(UPDATED)) {
    const here = readFileSync(join(dir, file));
    if (!here.equals(readFileSync(join(pluginTree(), TEMPLATE_DIR, template)))) {
      problems.push(`${file} is not the template ${template} of the tag byte for byte`);
    }
    if (after.files[file] !== sha256(here)) problems.push(`.repo-setup.json records ${after.files[file]} for ${file}, the file hashes to ${sha256(here)}`);
  }

  if (before.version !== OLD_VERSION) problems.push(`the base records version ${before.version}, not ${OLD_VERSION}`);
  if (after.version !== NEW_VERSION) problems.push(`.repo-setup.json records version ${after.version}, not ${NEW_VERSION}`);
  for (const k of new Set([...Object.keys(before), ...Object.keys(after)])) {
    if (!["version", "files", "file_versions"].includes(k) && !same(before[k], after[k])) problems.push(`the key ${k} changed`);
  }
  for (const [file, v] of Object.entries(after.file_versions)) {
    const want = KEPT_OLD[file] ?? NEW_VERSION;
    if (v !== want) problems.push(`${file} records ${v}, not ${want}`);
    if (file in KEPT_OLD && before.file_versions[file] !== v) problems.push(`${file} was ${before.file_versions[file]} at the base`);
    if (file in KEPT_OLD && existsSync(join(dir, file))) problems.push(`${file} is in the tree, KEPT_OLD says it is not`);
  }
  const changed = Object.keys(after.files).filter((f) => f in before.files && before.files[f] !== after.files[f]);
  const added = Object.keys(after.files).filter((f) => !(f in before.files));
  const dropped = Object.keys(before.files).filter((f) => !(f in after.files));
  if (!same(changed.sort(), [...HASH_CHANGED].sort())) problems.push(`the hash changes for ${JSON.stringify(changed)}, not ${JSON.stringify(HASH_CHANGED)}`);
  if (added.length + dropped.length > 0) problems.push(`files gains ${JSON.stringify(added)} and loses ${JSON.stringify(dropped)}`);
  if (!same(Object.keys(after.files).sort(), Object.keys(after.file_versions).sort())) {
    problems.push("files and file_versions do not name the same files");
  }

  const wb = yaml(show(dir, base, WORKFLOW) ?? "{}");
  const wa = yaml(readFileSync(join(dir, WORKFLOW), "utf8"));
  for (const key of ["name", "on", "permissions"]) if (!same(wb[key], wa[key])) problems.push(`the workflow's ${key} changed`);
  if (!same(Object.keys(wb.jobs ?? {}), Object.keys(wa.jobs ?? {}))) problems.push("the list of jobs changed");
  if (!same(wb.jobs?.["conventional-title"], wa.jobs?.["conventional-title"])) problems.push("the job conventional-title changed");
  const { steps: bs = [], ...bRest } = wb.jobs?.["conventional-commits"] ?? {};
  const { steps: as = [], ...aRest } = wa.jobs?.["conventional-commits"] ?? {};
  if (!same(bRest, aRest)) problems.push("conventional-commits changed outside its steps");
  if (bs.length !== 2 || as.length !== 2) problems.push(`conventional-commits has ${as.length} steps (base ${bs.length}), not 2`);
  const { with: w1, ...c1 } = as[0] ?? {};
  const { with: w0, ...c0 } = bs[0] ?? {};
  if (!same(c0, c1) || w0 !== undefined || !same(w1, { "persist-credentials": false })) {
    problems.push("the checkout of conventional-commits changed otherwise than by gaining persist-credentials: false");
  }
  const { run: r1, ...s1 } = as[1] ?? {};
  const { run: r0, ...s0 } = bs[1] ?? {};
  if (!same(s0, s1)) problems.push("the judging step changed outside its run");
  if (r0 === r1) problems.push("the run of the judging step did not change");
} catch (err) {
  problems.push(err.message);
}

verdict(
  NAME,
  problems,
  `pr-title.yml, tools/autonomy.py and tools/github_setup.py are the tag's templates byte for byte with the hashes .repo-setup.json records; the manifest goes from ${OLD_VERSION} to ${NEW_VERSION} for every file but the ${Object.keys(KEPT_OLD).length} deleted samples (0.4.0), and only those three hashes change; in pr-title.yml only the checkout of conventional-commits (persist-credentials: false) and the run of its judging step changed`,
);
