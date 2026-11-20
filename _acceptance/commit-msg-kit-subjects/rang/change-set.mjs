// AC-6: the pull request changes CHANGE_FILES, files under CHANGE_GLOBS, this dossier and the round's own files
// (ROUND_FILES), nothing else; it touches none of UNTOUCHED (the hook's wiring in .pre-commit-config.yaml, the job
// in .github, governance). Both CHANGE_FILES change. Every non-merge commit of the pull request passes
// tools/commit_msg.py of the base: the job conventional-commits judges this pull request with the base's rule, so a
// subject only the new rule accepts (the kit's own Gate 2 signoff among them) would turn it red here.
// Usage: node change-set.mjs [--root <dir>] [--files <a,b,...>] [--messages <file.json>]
//   (for two-way.mjs: --files replaces the diff, --messages a JSON list of messages replaces the commits of the PR)

import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { git, judgeAll, prBase, root, show, verdict } from "./lib.mjs";
import { CHANGE_FILES, CHANGE_GLOBS, DOSSIER, ROUND_FILES, UNTOUCHED } from "./matrix.mjs";

const NAME = "change-set";
const argv = process.argv.slice(2);
const dir = root(argv);
const problems = [];

const glob = (g) => new RegExp(`^${g.split("**").map((p) => p.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, "[^/]*")).join(".*")}$`);
const matches = (f, globs) => globs.some((g) => glob(g).test(f));

try {
  const i = argv.indexOf("--files");
  const changed =
    i >= 0
      ? argv[i + 1].split(",").filter(Boolean)
      : git(dir, "diff", "--name-only", `${prBase(dir)}...HEAD`).split("\n").filter(Boolean);
  for (const f of changed) {
    if (matches(f, UNTOUCHED)) problems.push(`${f} changes, and this change must not touch it`);
    else if (!(CHANGE_FILES.includes(f) || matches(f, CHANGE_GLOBS) || f.startsWith(DOSSIER) || ROUND_FILES.includes(f))) {
      problems.push(`${f} changes, and it is not part of this change`);
    }
  }
  for (const f of CHANGE_FILES) if (!changed.includes(f)) problems.push(`${f} does not change`);

  const base = prBase(dir);
  const shas = git(dir, "rev-list", "--no-merges", `${base}..HEAD`).split("\n").filter(Boolean);
  const tmp = mkdtempSync(join(tmpdir(), "cmks-own-"));
  try {
    const rule = join(tmp, "commit_msg_base.py");
    writeFileSync(rule, show(dir, base, "tools/commit_msg.py") ?? "");
    const j = argv.indexOf("--messages");
    const messages =
      j >= 0 ? JSON.parse(readFileSync(argv[j + 1], "utf8")) : shas.map((sha) => git(dir, "log", "-1", "--format=%B", sha));
    judgeAll(dir, messages, rule).forEach((c, k) => {
      const which = j >= 0 ? `message ${k + 1}` : `commit ${shas[k].slice(0, 8)}`;
      if (c !== 0) problems.push(`${which} "${messages[k].split("\n")[0]}" does not pass the base's rule`);
    });
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
} catch (err) {
  problems.push(err.message);
}

verdict(
  NAME,
  problems,
  `the pull request changes ${CHANGE_FILES.join(" and ")}, ${CHANGE_GLOBS.join(", ")}, this dossier and the files of its round; none of ${UNTOUCHED.join(", ")}; every commit of the pull request passes the base's rule`,
);
