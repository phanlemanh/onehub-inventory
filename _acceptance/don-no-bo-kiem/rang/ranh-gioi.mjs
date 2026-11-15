// Row 1u, E9 (AC-9): the branch changes no owner file and no file of an open pull request. Two-way on an invented change
// list. The two files of PR #66 (tools/e2e_templates/suite.ts, tests/e2e-db/lop-rieng.spec.ts) left the list when #66 was
// merged: the supervisor's ruling V-1511-16 moves them through the shared door in this row.
import { execFileSync } from "node:child_process";

const root = process.argv.includes("--root") ? process.argv[process.argv.indexOf("--root") + 1] : ".";
const FORBIDDEN = [
  /^\.github\/workflows\//,
  /^governance\//,
  /^PRODUCT-INVARIANTS\.md$/,
  /^tools\/proof_gate\/legacy\.py$/,
  /^db\/scripts\/ci-thu\.sh$/,
  /^vitest\.config\./,
];
const check = (files) => files.filter((f) => FORBIDDEN.some((r) => r.test(f))).map((f) => `ranh-gioi-1u: doi tep cam ${f}`);
const git = (...a) => execFileSync("git", a, { cwd: root, encoding: "utf8" }).trim();
const base = git("merge-base", "HEAD", "origin/main");
// Commits of this branch only: changes main brought in by a merge are not this row's.
const own = git("log", "--no-merges", "--format=", "--name-only", `${base}..HEAD`).split("\n").filter(Boolean);
const dirty = git("status", "--porcelain").split("\n").filter(Boolean).map((l) => l.slice(3));
const out = check([...new Set([...own, ...dirty])]);
if (!check([".github/workflows/release.yml"]).includes("ranh-gioi-1u: doi tep cam .github/workflows/release.yml"))
  out.push("ranh-gioi-1u: ban sao doi release.yml khong do");
if (out.length) {
  console.log(out.join("\n"));
  process.exit(1);
}
console.log("ranh-gioi-1u: khong tep cam nao doi");
