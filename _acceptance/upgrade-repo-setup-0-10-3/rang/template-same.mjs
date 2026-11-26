// AC-3: the eight tool files are the templates of the tag byte for byte, with the hash the manifest
// records; .repo-setup.json goes from 0.10.2 to 0.10.3 (90 files, the 8 deleted samples at 0.4.0,
// the five new tools added, no other key or entry changed); AGENTS.md loses exactly one sentence.
// Usage: node template-same.mjs [--root <dir>]

import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { pluginTree, prBase, root, show, verdict } from "./lib.mjs";
import {
  AGENTS_AFTER,
  AGENTS_BEFORE,
  CREATED,
  KEPT_OLD,
  MARKED,
  MERGED,
  NEW_COUNT,
  NEW_VERSION,
  OLD_VERSION,
  TEMPLATE_DIR,
  TOOLS,
} from "./matrix.mjs";

const NAME = "template-same";
const dir = root();
const problems = [];
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const sha256 = (b) => createHash("sha256").update(b).digest("hex");

try {
  const base = prBase(dir);
  const after = JSON.parse(readFileSync(join(dir, ".repo-setup.json"), "utf8"));
  const before = JSON.parse(show(dir, base, ".repo-setup.json") ?? "{}");

  for (const f of TOOLS) {
    const here = readFileSync(join(dir, f));
    if (!here.equals(readFileSync(join(pluginTree(), TEMPLATE_DIR, f)))) problems.push(`${f} is not the template of the tag byte for byte`);
    if (after.files?.[f] !== sha256(here)) problems.push(`.repo-setup.json records another hash for ${f}`);
  }

  if (before.version !== OLD_VERSION) problems.push(`the base records version ${before.version}, not ${OLD_VERSION}`);
  if (after.version !== NEW_VERSION) problems.push(`.repo-setup.json records version ${after.version}, not ${NEW_VERSION}`);
  for (const k of new Set([...Object.keys(before), ...Object.keys(after)])) {
    if (!["version", "files", "file_versions"].includes(k) && !same(before[k], after[k])) problems.push(`the key ${k} changed`);
  }
  const versions = Object.entries(after.file_versions ?? {});
  const fresh = versions.filter(([, v]) => v === NEW_VERSION).length;
  if (fresh !== NEW_COUNT) problems.push(`${fresh} files record ${NEW_VERSION}, not ${NEW_COUNT}`);
  for (const [file, v] of versions) {
    const want = KEPT_OLD[file] ?? NEW_VERSION;
    if (v !== want) problems.push(`${file} records ${v}, not ${want}`);
    if (file in KEPT_OLD && existsSync(join(dir, file))) problems.push(`${file} is in the tree, KEPT_OLD says it is not`);
  }
  const changed = Object.keys(after.files).filter((f) => f in before.files && before.files[f] !== after.files[f]);
  const added = Object.keys(after.files).filter((f) => !(f in before.files));
  const dropped = Object.keys(before.files).filter((f) => !(f in after.files));
  const wantChanged = [...TOOLS.filter((f) => !CREATED.includes(f)), ...MERGED, ...MARKED].sort();
  if (!same(changed.sort(), wantChanged)) problems.push(`the hash changes for ${JSON.stringify(changed)}, not ${JSON.stringify(wantChanged)}`);
  if (!same(added.sort(), [...CREATED].sort())) problems.push(`files gains ${JSON.stringify(added)}, not the five new tools`);
  if (dropped.length > 0) problems.push(`files loses ${JSON.stringify(dropped)}`);

  const a0 = (show(dir, base, "AGENTS.md") ?? "").split("\n");
  const a1 = readFileSync(join(dir, "AGENTS.md"), "utf8").split("\n");
  const diff = a0.map((l, i) => [l, a1[i]]).filter(([x, y]) => x !== y);
  if (a0.length !== a1.length || diff.length !== 1 || diff[0][0] !== AGENTS_BEFORE || diff[0][1] !== AGENTS_AFTER) {
    problems.push(`AGENTS.md does not change exactly the line "${AGENTS_BEFORE}" into "${AGENTS_AFTER}"`);
  }
} catch (err) {
  problems.push(err.message);
}

verdict(
  NAME,
  problems,
  `the eight tool files are the tag's templates byte for byte with the hashes .repo-setup.json records; the manifest goes from ${OLD_VERSION} to ${NEW_VERSION} for ${NEW_COUNT} files, the ${Object.keys(KEPT_OLD).length} deleted samples keep 0.4.0, and it gains the five new tools; AGENTS.md loses only "The gate sees both and raises the tier."`,
);
