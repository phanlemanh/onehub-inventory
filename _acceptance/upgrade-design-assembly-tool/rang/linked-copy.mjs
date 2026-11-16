// A throwaway copy of the repository made of links: every entry at the root links back to the
// repository, except the paths given in `replace`, which are real files with the given text. The
// folders above a replaced path are real, and their other entries are links again. Nothing is
// written to the repository itself.
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readdirSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { execPath } from "node:process";

export function linkedCopy(root, replace = {}) {
  const dir = mkdtempSync(path.join(tmpdir(), "upgrade-design-assembly-tool-"));
  const links = [];
  const realDirs = new Set();
  for (const rel of Object.keys(replace)) {
    const parts = rel.split("/");
    for (let i = 1; i < parts.length; i += 1) realDirs.add(parts.slice(0, i).join("/"));
  }
  const fill = (rel) => {
    for (const name of readdirSync(path.join(root, rel))) {
      const entry = rel ? `${rel}/${name}` : name;
      if (entry in replace) continue;
      if (realDirs.has(entry)) {
        mkdirSync(path.join(dir, entry));
        fill(entry);
        continue;
      }
      symlinkSync(path.join(root, entry), path.join(dir, entry));
      links.push(path.join(dir, entry));
    }
  };
  fill("");
  for (const [rel, text] of Object.entries(replace)) {
    mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true });
    writeFileSync(path.join(dir, rel), text);
  }
  return {
    dir,
    // The links go first, one by one, so removing the copy never reaches what they point at.
    remove() {
      for (const link of links) rmSync(link, { force: true });
      rmSync(dir, { recursive: true, force: true });
    },
  };
}

// The design-assembly check of a copy, run with the copy's own tool.
export function runCheck(dir) {
  const run = spawnSync(
    execPath,
    [path.join(dir, "tools/design-assembly/check.mjs"), "--target", dir],
    { encoding: "utf8", cwd: dir },
  );
  return { code: run.status, out: `${run.stdout}${run.stderr}` };
}

// The value of `--name` in the arguments, or the fallback.
export function option(name, fallback = null) {
  const at = process.argv.indexOf(name);
  return at === -1 ? fallback : process.argv[at + 1];
}
