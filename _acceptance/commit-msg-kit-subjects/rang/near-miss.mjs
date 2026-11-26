// AC-2 (should NOT fire): a message that only looks like a kit subject stays refused by tools/commit_msg.py — every
// message of NEAR_MISSES exits 1: an empty text after the prefix, another case, another gate, no colon, an empty or
// spaced scope, a wip of another scope, and the two probes the conventional-commits job sends first.
// Usage: node near-miss.mjs [--root <dir>]

import { judgeAll, root, verdict } from "./lib.mjs";
import { NEAR_MISSES } from "./matrix.mjs";

const NAME = "near-miss";
const dir = root();
const problems = [];

try {
  const codes = judgeAll(dir, NEAR_MISSES.map((m) => (m ? `${m}\n` : m)));
  codes.forEach((c, i) => {
    const shown = NEAR_MISSES[i].length > 40 ? `${NEAR_MISSES[i].slice(0, 12)}… (${NEAR_MISSES[i].length} characters)` : NEAR_MISSES[i];
    if (c !== 1) problems.push(`tools/commit_msg.py exits ${c}, not 1, on "${shown}"`);
  });
} catch (err) {
  problems.push(err.message);
}

verdict(NAME, problems, `the ${NEAR_MISSES.length} near misses are refused, the two probes of the job among them`);
