// AC-7: the repository's lint lets a use-named function in a plain function through in the tool
// folder only: contract.mjs has no react-hooks/rules-of-hooks error, and a file in src/ and a .mjs
// file beside the tool folder that do the same still have one.
// Usage: node lint-scope.mjs [--root <repository>] [--config <file>]
//   (--config hands the copy another eslint.config.js, for the break copies)
import { readFileSync } from "node:fs";
import path from "node:path";

import { head, linkedCopy, option, ROOT, run } from "./lib.mjs";
import { HOOK_PROBE, HOOK_RULE } from "./matrix.mjs";

const root = path.resolve(option("--root", ROOT));
const config = option("--config");
const replace = { [HOOK_PROBE.src]: HOOK_PROBE.text, [HOOK_PROBE.sibling]: HOOK_PROBE.text };
if (config) replace["eslint.config.js"] = readFileSync(path.resolve(config), "utf8");
const copy = linkedCopy(root, { replace });
const found = [];
let report = [];
try {
  const lint = run(
    path.join(root, "node_modules/.bin/eslint"),
    ["--no-warn-ignored", "--format", "json", HOOK_PROBE.tool, HOOK_PROBE.src, HOOK_PROBE.sibling],
    copy.dir,
  );
  try {
    report = JSON.parse(lint.out.slice(lint.out.indexOf("[")));
  } catch {
    found.push(`eslint gave no report (exit ${lint.status}): ${lint.out.trim().split("\n")[0]}`);
  }
} finally {
  copy.remove();
}
const hits = (rel) => {
  const file = report.find((entry) => entry.filePath.endsWith(`/${rel}`));
  if (!file) return null;
  return file.messages.filter((m) => m.ruleId === HOOK_RULE && m.severity === 2).length;
};
if (report.length) {
  const tool = hits(HOOK_PROBE.tool);
  const src = hits(HOOK_PROBE.src);
  if (tool === null) found.push(`eslint did not lint ${HOOK_PROBE.tool}`);
  else if (tool > 0) found.push(`${HOOK_PROBE.tool}: ${tool} ${HOOK_RULE} error(s)`);
  for (const [rel, count] of [[HOOK_PROBE.src, src], [HOOK_PROBE.sibling, hits(HOOK_PROBE.sibling)]]) {
    if (count === null) found.push(`eslint did not lint ${rel}`);
    else if (count === 0) found.push(`${rel}: ${HOOK_RULE} is not an error there`);
  }
}
for (const line of found) process.stdout.write(`lint: ${line}\n`);
if (found.length === 0) {
  process.stdout.write(
    `lint: ${HOOK_PROBE.tool} has no ${HOOK_RULE} error; ${HOOK_PROBE.src} and ${HOOK_PROBE.sibling}, which call a use-named function from a plain function, each have one (at ${head(root).slice(0, 12)})\n`,
  );
}
process.exitCode = found.length ? 1 : 0;
