// AC-6: .repo-setup.json against the base of the pull request. `version` goes from 0.9.0 to 0.10.1 and
// no other top-level key changes; every file the base records at 0.9.0 is now at 0.10.1, and the
// files of KEPT_OLD keep their older version (they name samples that are not in the tree); the hash
// changes only for HASH_CHANGED, and the one entry added is HASH_ADDED, a file that is in the tree
// and has the hash recorded. Should not pass: any other file at a version other than 0.10.1.
// Usage: node manifest.mjs [--root <dir>]

import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { prBase, root, show, verdict } from "./lib.mjs";
import { HASH_ADDED, HASH_CHANGED, KEPT_OLD, NEW_VERSION, OLD_VERSION } from "./matrix.mjs";

const NAME = "manifest";
const dir = root();
const problems = [];
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

try {
  const after = JSON.parse(readFileSync(join(dir, ".repo-setup.json"), "utf8"));
  const text = show(dir, prBase(dir), ".repo-setup.json");
  if (text === null) throw new Error("the base of the pull request has no .repo-setup.json");
  const before = JSON.parse(text);

  if (before.version !== OLD_VERSION) problems.push(`the base records version ${before.version}, not ${OLD_VERSION}`);
  if (after.version !== NEW_VERSION) problems.push(`.repo-setup.json records version ${after.version}, not ${NEW_VERSION}`);
  const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
  for (const k of keys) {
    if (["version", "files", "file_versions"].includes(k)) continue;
    if (!same(before[k], after[k])) problems.push(`the key ${k} changed`);
  }

  for (const [file, v] of Object.entries(after.file_versions)) {
    const want = KEPT_OLD[file] ?? NEW_VERSION;
    if (v !== want) problems.push(`${file} records ${v}, not ${want}`);
    if (file in KEPT_OLD && before.file_versions[file] !== v) problems.push(`${file} was ${before.file_versions[file]} at the base`);
    if (file in KEPT_OLD && existsSync(join(dir, file))) problems.push(`${file} is in the tree, KEPT_OLD says it is not`);
  }
  for (const file of Object.keys(before.file_versions)) {
    if (!(file in after.file_versions)) problems.push(`${file} left file_versions`);
  }

  const changed = [];
  const added = [];
  for (const [file, h] of Object.entries(after.files)) {
    if (!(file in before.files)) added.push(file);
    else if (before.files[file] !== h) changed.push(file);
  }
  const removed = Object.keys(before.files).filter((f) => !(f in after.files));
  if (!same(changed.sort(), [...HASH_CHANGED].sort())) problems.push(`the hash changes for ${JSON.stringify(changed)}, not ${JSON.stringify(HASH_CHANGED)}`);
  if (!same(added.sort(), [...HASH_ADDED].sort())) problems.push(`files gains ${JSON.stringify(added)}, not ${JSON.stringify(HASH_ADDED)}`);
  if (removed.length > 0) problems.push(`files loses ${JSON.stringify(removed)}`);
  if (!same(Object.keys(after.files).sort(), Object.keys(after.file_versions).sort())) {
    problems.push("files and file_versions do not name the same files");
  }
  for (const file of HASH_ADDED) {
    const p = join(dir, file);
    if (!existsSync(p)) {
      problems.push(`${file} is recorded but not in the tree`);
      continue;
    }
    const h = createHash("sha256").update(readFileSync(p)).digest("hex");
    if (h !== after.files[file]) problems.push(`${file} hashes to ${h}, .repo-setup.json records ${after.files[file]}`);
  }
} catch (err) {
  problems.push(err.message);
}

verdict(
  NAME,
  problems,
  `.repo-setup.json goes from ${OLD_VERSION} to ${NEW_VERSION}; every file it records is at ${NEW_VERSION} except the ${Object.keys(KEPT_OLD).length} deleted samples, which keep 0.4.0; the hash changes for pr-title.yml and AGENTS.md only and wiki/log.head.md is added with the hash of the file`,
);
