// AC-7: tests/design-check.test.ts holds no string the decision-sheet row's tagged-test reader takes
// for a tag, and at BASE it held three. The reader is the tool's own taggedTests (imported from the
// repository's tools/design-assembly/owner-calls.mjs), not a copy of its pattern.
// Usage: node fixture-tags.mjs [--root <repository>] [--file-from <commit>]
//   (--file-from is a break: the file as it was at that commit)
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { git, option, ROOT, scratch } from "./lib.mjs";
import { BASE, BASE_FIXTURE_TAGS, FIXTURE_FILE, TOOL_FOLDER } from "./matrix.mjs";

const root = path.resolve(option("--root", ROOT));
const { taggedTests } = await import(pathToFileURL(path.join(root, TOOL_FOLDER, "owner-calls.mjs")).href);

// The tags the reader finds in one version of the fixture file, in the order it reads them.
function tagsIn(text) {
  const dir = scratch("fixtures");
  try {
    mkdirSync(path.join(dir, "tests"));
    writeFileSync(path.join(dir, FIXTURE_FILE), text);
    return taggedTests(dir, "tests").map((found) => `decision:${found.id}`);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const from = option("--file-from");
const now = tagsIn(from ? git(root, "show", `${from}:${FIXTURE_FILE}`) : readFileSync(path.join(root, FIXTURE_FILE), "utf8"));
const before = tagsIn(git(root, "show", `${BASE}:${FIXTURE_FILE}`));
const found = [];
if (now.length) found.push(`${FIXTURE_FILE} still holds tags: ${now.join(" ")}`);
const missed = BASE_FIXTURE_TAGS.filter((tag) => !before.includes(tag));
if (missed.length) found.push(`at ${BASE.slice(0, 8)} the reader did not find ${missed.join(" ")}, so it is not the reader that bit`);
for (const line of found) process.stdout.write(`fixtures: ${line}\n`);
if (!found.length) {
  process.stdout.write(
    `fixtures: ${FIXTURE_FILE} holds no string the tagged-test reader takes for a tag; at ${BASE.slice(0, 8)} it held ${BASE_FIXTURE_TAGS.join(", ")}\n`,
  );
}
process.exitCode = found.length ? 1 : 0;
