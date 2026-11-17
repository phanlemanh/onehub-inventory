// AC-6: two branches that each add a screen and a block merge clean on the fragment folders of HEAD,
// and the same two additions conflict on the one-file ledgers where the branch left main (control).
// Commits are made in a clone that shares the repository's objects; the repository is not touched.
// Usage: node two-branch-merge.mjs [--root <repository>] [--on <commit of the new layout>]
//   [--control-on <commit of the old layout>] [--same-id]   (--same-id: both branches add one id, a break)
import { spawnSync } from "node:child_process";
import { rmSync } from "node:fs";
import path from "node:path";

import { git, option, ROOT, scratch, sharedClone } from "./lib.mjs";
import { BASE, FRAGMENTS } from "./matrix.mjs";

const root = path.resolve(option("--root", ROOT));
const on = option("--on", "HEAD");
const controlOn = option("--control-on", BASE);
const sameId = process.argv.includes("--same-id");

const screen = (id, side = id) => `id: ${id}\nroute: /${side}\ntitle: null\nfamily: null\naudience: dev\nstatus: planned\n`;
const block = (need, side = need) =>
  `ten: ${need}\ntep: src/components/candidate/${need}.tsx\nnguon: tao-tay\nnhu_cau: ${need}\nmo_ta: thử ${side}\nho_so: thu\nduyet: 2026-11-17\n`;
const indent = (text) => text.trimEnd().split("\n").map((l, i) => (i ? `    ${l}` : `  - ${l}`)).join("\n");

// A commit on top of `parent` with the given files written (path → text, appended when `append`).
function commit(clone, parent, files, append) {
  const indexDir = scratch("index");
  const index = path.join(indexDir, "index");
  const env = { ...process.env, GIT_INDEX_FILE: index };
  const run = (args, input) => {
    const r = spawnSync("git", ["-C", clone, ...args], { encoding: "utf8", env, input, maxBuffer: 1 << 28 });
    if (r.status !== 0) throw new Error(`git ${args.join(" ")}: ${r.stderr}`);
    return r.stdout.trim();
  };
  run(["read-tree", parent]);
  for (const [file, text] of Object.entries(files)) {
    const body = append ? `${run(["show", `${parent}:${file}`])}\n${text}\n` : text;
    const blob = run(["hash-object", "-w", "--stdin"], body);
    run(["update-index", "--add", "--cacheinfo", `100644,${blob},${file}`]);
  }
  const tree = run(["write-tree"]);
  rmSync(indexDir, { recursive: true, force: true });
  return run(["-c", "user.name=thu", "-c", "user.email=thu@example.invalid", "commit-tree", tree, "-p", parent, "-m", "thu"]);
}

function merges(clone, a, b) {
  const r = spawnSync("git", ["-C", clone, "merge-tree", "--write-tree", "--name-only", a, b], { encoding: "utf8" });
  const conflicted = r.stdout.split("\n\n")[0].split("\n").slice(1).filter(Boolean);
  return { clean: r.status === 0, conflicted };
}

const clone = sharedClone(root);
const found = [];
try {
  const head = git(clone.dir, "rev-parse", on).trim();
  const base = git(clone.dir, "rev-parse", controlOn).trim();
  const add = (parent, id, side) =>
    commit(clone.dir, parent, {
      [`${FRAGMENTS.screens.folder}/${id}.yaml`]: screen(id, side),
      [`${FRAGMENTS.intake.folder}/${id}.yaml`]: block(id, side),
    });
  const next = merges(clone.dir, add(head, "thu-a", "a"), add(head, sameId ? "thu-a" : "thu-b", "b"));
  if (!next.clean) found.push(`fragments: the two branches conflict at ${head.slice(0, 8)}: ${next.conflicted.join(" ") || "(no file named)"}`);
  for (const file of [FRAGMENTS.screens.old, FRAGMENTS.intake.old]) {
    if (spawnSync("git", ["-C", clone.dir, "cat-file", "-e", `${base}:${file}`]).status !== 0) {
      found.push(`control: ${file} is not in git at ${base.slice(0, 8)}`);
    }
  }
  const addOld = (id) =>
    commit(
      clone.dir,
      base,
      { [FRAGMENTS.screens.old]: indent(screen(id)), [FRAGMENTS.intake.old]: indent(block(id)) },
      true,
    );
  const old = found.some((line) => line.startsWith("control:")) ? null : merges(clone.dir, addOld("thu-a"), addOld("thu-b"));
  const wanted = [FRAGMENTS.intake.old, FRAGMENTS.screens.old].sort();
  if (old && (old.clean || JSON.stringify(old.conflicted.sort()) !== JSON.stringify(wanted))) {
    found.push(`control: the one-file ledgers at ${base.slice(0, 8)} do not conflict as expected: ${old.clean ? "clean" : old.conflicted.join(" ")}`);
  }
  for (const line of found) process.stdout.write(`merge: ${line}\n`);
  if (!found.length) {
    process.stdout.write(
      `merge: two branches each adding a screen and a block merge clean at ${head.slice(0, 8)}; on the one-file ledgers at ${base.slice(0, 8)} they conflict in ${wanted.join(" and ")}\n`,
    );
  }
} finally {
  clone.remove();
}
process.exitCode = found.length ? 1 : 0;
