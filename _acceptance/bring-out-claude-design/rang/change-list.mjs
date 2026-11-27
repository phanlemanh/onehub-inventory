// AC-7: from where the branch leaves origin/main to HEAD, the branch changes the exports, the push
// record, the two ledgers (adding lines only), the waiting question, wiki log lines and this record —
// nothing else, except PRODUCT-MAP.md and LO-TRINH.html when each is exactly what the kit's drawer
// draws from the records at HEAD. Usage: node change-list.mjs [--root <repository or a clone>]
import path from "node:path";

import { git, head, lines, option, report, ROOT, run } from "./lib.mjs";
import { ADD_ONLY, BRANCH_MAY_CHANGE, BRANCH_MUST_CHANGE, DRAWER, DRAWN_PAGES } from "./matrix.mjs";

const root = path.resolve(option("--root", ROOT));
const found = [];
const base = git(root, "merge-base", "HEAD", "origin/main").trim();
const merged = run("git", ["merge-base", "--is-ancestor", "HEAD", "origin/main"], root).status === 0;
const may = (file) => BRANCH_MAY_CHANGE.some((p) => (p.endsWith("/") ? file.startsWith(p) : file === p));

if (!merged) {
  const status = lines(git(root, "diff", "--name-status", "--no-renames", base, "HEAD")).map((l) => l.split("\t"));
  const files = status.map(([, file]) => file);
  for (const file of BRANCH_MUST_CHANGE) if (!files.includes(file)) found.push(`branch did not change: ${file}`);
  let drawn = null;
  for (const [mode, file] of status) {
    if (DRAWN_PAGES.includes(file)) {
      if (!drawn) {
        const kit = process.env.CLAUDE_PLUGIN_ROOT || run("node", ["tools/kit-root.mjs"], root).out.trim();
        drawn = kit ? run("node", [path.join(kit, DRAWER), "--root", root, "--check"], root).out : "";
      }
      if (!drawn.includes(`${file} khớp`)) found.push(`${file} is not what the records at HEAD draw`);
    } else if (!may(file)) {
      found.push(`branch changed beyond the export and this record: ${file}`);
    } else if (file.startsWith("wiki/log/") && mode !== "A") {
      found.push(`branch changed an existing wiki log line: ${file}`);
    }
  }
  for (const file of ADD_ONLY) {
    const removed = lines(git(root, "diff", "--unified=0", base, "HEAD", "--", file)).filter((l) => l.startsWith("-") && !l.startsWith("---"));
    if (removed.length) found.push(`branch removed lines from ${file}: «${removed[0].slice(1).trim()}»`);
  }
}
report(
  "changes",
  found,
  merged
    ? "the branch is in origin/main already; nothing to compare"
    : `the branch changes the exports, the push record, the two ledgers by adding lines, the waiting question, wiki log lines and this record, nothing else (from ${base.slice(0, 12)} to ${head(root).slice(0, 12)})`,
);
