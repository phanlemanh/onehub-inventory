// AC-7: every tracked file that is no .md and names wiki/log.md is one the split was weighed against: it is in
// READERS with why it is sound, or it is this record or a data file of a past run. A new reader fails by name.
// Usage: node ben-doc.mjs [--root <dir>]

import { git, root, verdict } from "./lib.mjs";
import { OWN, READERS, RECORD_DATA } from "./matrix.mjs";

const NAME = "ben-doc";
const dir = root();
const problems = [];
let weighed = 0;

try {
  const r = git(dir, "grep", "-l", "-F", "wiki/log.md", "--", ".", ":(exclude)*.md", ":(exclude)wiki/log/");
  for (const f of r.split("\n").filter(Boolean)) {
    if (f.startsWith(OWN) || RECORD_DATA.test(f)) continue;
    if (READERS[f]) weighed += 1;
    else problems.push(`reader not weighed: ${f}`);
  }
} catch (err) {
  problems.push(err.message);
}

verdict(NAME, problems, `${weighed} files that are no .md name wiki/log.md, each weighed in READERS; none new`);
