// AC-1: the log is kept as fragments; wiki/log.md is drawn and out of git; the drawn file holds every entry
// of wiki/log.md at SPLIT_FROM once (the two that were there twice, once), word for word, newest first, and
// nothing else but entries written since; the head is the same, in git as wiki/log.head.md, and no longer
// kept by repo-setup.
// Usage: node so-log.mjs [--root <dir>]

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { entries, git, root, run, verdict } from "./lib.mjs";
import { DISTINCT_BEFORE, ENTRIES_BEFORE, SPLIT_DAY, SPLIT_FROM } from "./matrix.mjs";

const NAME = "so-log";
const dir = root();
const problems = [];
let added = 0;

try {
  const shape = run("python3", ["tools/ledgers.py", "shape", "log"], { cwd: dir }).out.trim();
  if (shape !== "fragments") problems.push(`ledger log is ${shape || "unreadable"}, not fragments`);
  if (git(dir, "ls-files", "wiki/log.md").trim()) problems.push("wiki/log.md is in git");
  if (run("git", ["-C", dir, "check-ignore", "-q", "wiki/log.md"]).code !== 0) problems.push("wiki/log.md is not in .gitignore");
  for (const target of ["ledgers-check", "derived-untracked"]) {
    const r = run("make", ["-s", target], { cwd: dir });
    if (r.code !== 0) problems.push(`make ${target} exited ${r.code}: ${(r.out + r.err).trim().split("\n").pop()}`);
  }
  const drew = run("make", ["-s", "wiki-derived"], { cwd: dir });
  if (drew.code !== 0) throw new Error(`make wiki-derived exited ${drew.code}: ${(drew.out + drew.err).trim()}`);
  const before = entries(git(dir, "show", `${SPLIT_FROM}:wiki/log.md`));
  if (before.length !== ENTRIES_BEFORE) problems.push(`wiki/log.md of ${SPLIT_FROM.slice(0, 8)} has ${before.length} entry lines, not ${ENTRIES_BEFORE}`);
  if (new Set(before).size !== DISTINCT_BEFORE) problems.push(`wiki/log.md of ${SPLIT_FROM.slice(0, 8)} has ${new Set(before).size} distinct entries, not ${DISTINCT_BEFORE}`);
  const drawnText = readFileSync(join(dir, "wiki/log.md"), "utf8");
  const drawn = entries(drawnText);
  // The head of the log (front matter, title, rule) is the repository's own now: in git as wiki/log.head.md,
  // no longer kept by repo-setup, and drawn word for word as it was.
  const head = (text) => text.split("\n").filter((l) => !/^- \d{4}-\d{2}-\d{2} — /.test(l) && !l.startsWith("<!-- Drawn by ")).join("\n").trim();
  if (head(drawnText) !== head(git(dir, "show", `${SPLIT_FROM}:wiki/log.md`))) problems.push(`the head of the drawn log differs from ${SPLIT_FROM.slice(0, 8)}`);
  if (!git(dir, "ls-files", "wiki/log.head.md").trim()) problems.push("wiki/log.head.md is not in git");
  const setup = JSON.parse(readFileSync(join(dir, ".repo-setup.json"), "utf8"));
  if ("wiki/log.head.md" in (setup.files ?? {}) || "wiki/log.head.md" in (setup.file_versions ?? {})) problems.push(".repo-setup.json still keeps wiki/log.head.md");
  const count = new Map();
  for (const l of drawn) count.set(l, (count.get(l) ?? 0) + 1);
  for (const [l, n] of count) if (n > 1) problems.push(`entry ${n} times: ${l.slice(0, 80)}`);
  for (const l of before) if (!count.has(l)) problems.push(`entry missing: ${l.slice(0, 80)}`);
  const old = new Set(before);
  for (const l of drawn) {
    if (old.has(l)) continue;
    added += 1;
    if (l.slice(2, 12) < SPLIT_DAY) problems.push(`entry dated before the split that ${SPLIT_FROM.slice(0, 8)} did not have: ${l.slice(0, 80)}`);
  }
  for (let i = 1; i < drawn.length; i += 1) {
    if (drawn[i].slice(2, 12) > drawn[i - 1].slice(2, 12)) problems.push(`not newest first at entry ${i + 1}: ${drawn[i].slice(0, 40)}`);
  }
} catch (err) {
  problems.push(err.message);
}

verdict(
  NAME,
  problems,
  `log is fragments, wiki/log.md drawn and out of git, its head the same and the repository's own; the ${DISTINCT_BEFORE} entries of ${SPLIT_FROM.slice(0, 8)} (${ENTRIES_BEFORE} lines) each once, word for word, newest first; ${added} written since`,
);
