// AC-4: no live document tells the reader to put a line into wiki/log.md by hand. The two instructions that did
// have lost their old words and name `make log m=`; no other tracked .md file outside the records of past work
// (HISTORY, wiki/log/, _acceptance/) has a sentence that writes wiki/log.md by hand.
// Usage: node docs-log.mjs [--root <dir>]

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { git, root, verdict } from "./lib.mjs";
import { HAND_WRITE, HISTORY, INSTRUCTIONS } from "./matrix.mjs";

const NAME = "docs-log";
const dir = root();
const problems = [];
let swept = 0;

try {
  for (const { file, old } of INSTRUCTIONS) {
    const text = readFileSync(join(dir, file), "utf8");
    if (text.includes(old)) problems.push(`${file} still has its old instruction`);
    if (!text.includes("make log m=")) problems.push(`${file} does not name make log m=`);
  }
  const files = git(dir, "ls-files", "*.md")
    .split("\n")
    .filter((f) => f && !f.startsWith("wiki/log/") && !f.startsWith("_acceptance/") && !HISTORY.some((h) => f.startsWith(h)));
  for (const f of files) {
    swept += 1;
    const lines = readFileSync(join(dir, f), "utf8").split("\n");
    lines.forEach((l, i) => {
      if (HAND_WRITE.some((re) => re.test(l))) problems.push(`${f}:${i + 1} writes wiki/log.md by hand`);
    });
  }
} catch (err) {
  problems.push(err.message);
}

verdict(NAME, problems, `the ${INSTRUCTIONS.length} instructions name make log m= and lost their old words; ${swept} live .md files swept, none writes wiki/log.md by hand`);
