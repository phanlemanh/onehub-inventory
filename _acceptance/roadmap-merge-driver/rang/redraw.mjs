// AC-3: after a merge that kept the branch's page, the page is stale. On a copy of HEAD (a temporary
// git work tree) the kit's product-map --check must catch a stale LO-TRINH.html, and the redraw must
// bring the page back to the one of HEAD. This runs the kit's real command, not the words of a guide.
// Usage: node redraw.mjs [--kit <dir>]   (--kit replaces the kit root tools/kit-root.mjs finds)

import { join } from "node:path";

import { PAGE } from "./matrix.mjs";
import { atBase, done, opt, read, refuse, REPO, rm, run, scratchDir, write } from "./lib.mjs";

const NAME = "redraw";
const given = opt(process.argv.slice(2), "kit");
const kit = given ?? run("node", [join(REPO, "tools/kit-root.mjs")], { cwd: REPO }).stdout.trim();
if (kit === "") refuse(NAME, "tools/kit-root.mjs found no kit");
const productMap = join(kit, "scripts/product-map.mjs");

const stale = atBase(PAGE);
if (stale === null) refuse(NAME, `the base has no ${PAGE}`);
const fresh = run("git", ["-C", REPO, "show", `HEAD:${PAGE}`]).stdout;
if (fresh === stale) refuse(NAME, `${PAGE} of the base equals the one of HEAD: nothing to test`);

const copy = scratchDir("copy");
const added = run("git", ["-C", REPO, "worktree", "add", "--detach", "-q", copy, "HEAD"]);
if (added.status !== 0) {
  rm(copy);
  refuse(NAME, `git worktree add failed: ${added.stderr.trim()}`);
}
const problems = [];
try {
  const check = () => run("node", [productMap, "--root", copy, "--check"]);
  const first = check();
  if (first.status !== 0) {
    problems.push(`product-map --check fails on a clean copy of HEAD: ${(first.stderr || first.stdout).trim().split("\n")[0]}`);
  } else {
    write(copy, PAGE, stale);
    const second = check();
    if (second.status === 0 || !`${second.stdout}${second.stderr}`.includes(PAGE)) {
      problems.push("the stale page was not caught");
    } else {
      const drawn = run("node", [productMap, "--root", copy]);
      const third = check();
      if (drawn.status !== 0 || third.status !== 0) problems.push("product-map --check still fails after the redraw");
      else if (read(copy, PAGE) !== fresh) problems.push("after the redraw the page differs from the one of HEAD");
    }
  }
} finally {
  run("git", ["-C", REPO, "worktree", "remove", "--force", copy]);
  rm(copy);
}

done(
  NAME,
  problems,
  "on a copy of HEAD product-map --check passes; with the page of the base it fails naming LO-TRINH.html; after product-map --root it passes and the page equals HEAD",
);
