// Shared helpers of the measures of upgrade-repo-setup-0-10-3. The repository root is derived from
// this file's place (three levels up), or given with --root <dir> (a broken copy in two-way.mjs).

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { BASE, PLUGIN_COMMIT, PLUGIN_REPO, PLUGIN_TAG } from "./matrix.mjs";

export const HERE = dirname(fileURLToPath(import.meta.url));

export function root(argv = process.argv.slice(2)) {
  const i = argv.indexOf("--root");
  return i >= 0 ? resolve(argv[i + 1]) : resolve(HERE, "../../..");
}

/** Run a command without a shell (`shell` is forced off after the caller's options); never throws. */
export function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { encoding: "utf8", maxBuffer: 256 * 1024 * 1024, ...opts, shell: false });
  return { code: r.status, out: r.stdout ?? "", err: r.stderr ?? "" };
}

export function git(dir, ...args) {
  const r = run("git", ["-C", dir, ...args]);
  if (r.code !== 0) throw new Error(`git ${args.join(" ")}: ${r.err.trim()}`);
  return r.out;
}

/** A file at a commit, or null when the commit does not have it. */
export function show(dir, ref, path) {
  const r = run("git", ["-C", dir, "show", `${ref}:${path}`]);
  return r.code === 0 ? r.out : null;
}

/** A measure's verdict: one line, `<name>: <text>`, exit 0 or 1. */
export function verdict(name, problems, okLine) {
  if (problems.length > 0) {
    for (const p of problems) console.log(`${name}: ${p}`);
    process.exit(1);
  }
  console.log(`${name}: ${okLine}`);
  process.exit(0);
}

/** The base of the pull request: where HEAD left origin/main; BASE when origin/main cannot be read. */
export function prBase(dir) {
  const r = run("git", ["-C", dir, "merge-base", "HEAD", "origin/main"]);
  return r.code === 0 && r.out.trim() ? r.out.trim() : BASE;
}

/** YAML to an object, through PyYAML (the repository has no YAML parser for node). */
export function yaml(text) {
  const r = run("python3", ["-c", "import json,sys,yaml;print(json.dumps(yaml.safe_load(sys.stdin.read())))"], {
    input: text,
  });
  if (r.code !== 0) throw new Error(`cannot read YAML: ${r.err.trim()}`);
  return JSON.parse(r.out);
}

/** The commit the tag points at, peeled through the annotated tag object. */
export function tagCommit() {
  const ref = run("gh", ["api", `repos/${PLUGIN_REPO}/git/ref/tags/${PLUGIN_TAG}`, "--jq", ".object.type + \" \" + .object.sha"]);
  if (ref.code !== 0) throw new Error(`cannot read the tag ${PLUGIN_TAG}`);
  let [type, sha] = ref.out.trim().split(" ");
  while (type === "tag") {
    const t = run("gh", ["api", `repos/${PLUGIN_REPO}/git/tags/${sha}`, "--jq", ".object.type + \" \" + .object.sha"]);
    if (t.code !== 0) throw new Error(`cannot read the tag object ${sha}`);
    [type, sha] = t.out.trim().split(" ");
  }
  return sha;
}

/**
 * The tree of repo-setup at PLUGIN_COMMIT, fetched once by that sha into a temp dir (apply.py runs
 * from it). The tag must still point at PLUGIN_COMMIT; a cached tree counts only with its marker.
 */
export function pluginTree() {
  const at = tagCommit();
  if (at !== PLUGIN_COMMIT) throw new Error(`the tag ${PLUGIN_TAG} points at ${at}, not ${PLUGIN_COMMIT}`);
  const dir = join(tmpdir(), `rs0103-repo-setup-${PLUGIN_COMMIT}`);
  const marker = join(dir, ".fetched-commit");
  if (existsSync(marker) && readFileSync(marker, "utf8") === PLUGIN_COMMIT) return dir;
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  const got = run("gh", ["api", `repos/${PLUGIN_REPO}/tarball/${PLUGIN_COMMIT}`], { encoding: "buffer" });
  if (got.code !== 0) throw new Error(`cannot read ${PLUGIN_REPO}@${PLUGIN_COMMIT}`);
  const tar = join(dir, "tree.tar.gz");
  writeFileSync(tar, got.out);
  const x = run("tar", ["-xzf", tar, "-C", dir, "--strip-components=1"]);
  if (x.code !== 0 || !existsSync(join(dir, "plugins/repo-setup"))) {
    throw new Error(`cannot read ${PLUGIN_REPO}@${PLUGIN_COMMIT}: ${x.err.trim()}`);
  }
  writeFileSync(marker, PLUGIN_COMMIT);
  return dir;
}

/** A detached worktree of `ref` in a temp dir; `remove()` takes it away. */
export function worktree(dir, ref) {
  const at = join(mkdtempSync(join(tmpdir(), "rs0103-wt-")), "w");
  git(dir, "worktree", "add", "-q", "--detach", at, ref);
  return {
    dir: at,
    remove() {
      run("git", ["-C", dir, "worktree", "remove", "--force", at]);
      rmSync(dirname(at), { recursive: true, force: true });
    },
  };
}

/** A commit message of this repository (the upgrade commit). */
export function messageOf(dir, sha) {
  return git(dir, "log", "-1", "--format=%B", sha);
}

/**
 * The policy file as apply.py of the tag leaves it on a throwaway copy of the base (marked), split
 * into the text before and after the marked block, and the block's three sides.
 */
export function markedPolicy(dir, base, apply) {
  const wt = worktree(dir, base);
  try {
    apply(wt.dir);
    const text = readFileSync(join(wt.dir, "governance/autonomy.yaml"), "utf8");
    const m = /^<<<<<<< this repository\n([\s\S]*?)^\|\|\|\|\|\|\| repo-setup [^\n]*\n([\s\S]*?)^=======\n([\s\S]*?)^>>>>>>> repo-setup [^\n]*\n/m.exec(text);
    if (!m) throw new Error("apply.py of the tag leaves no marked block in governance/autonomy.yaml");
    if (/^<<<<<<< /m.test(text.slice(m.index + m[0].length))) throw new Error("apply.py leaves more than one marked block");
    return { before: text.slice(0, m.index), after: text.slice(m.index + m[0].length), ours: m[1], baseSide: m[2], theirs: m[3] };
  } finally {
    wt.remove();
  }
}

/** apply.py of the pinned tree on `at`, real run; returns its JSON report. */
export function applyTag(at, ...opts) {
  const script = join(pluginTree(), "plugins/repo-setup/scripts/apply.py");
  const r = run("python3", ["-I", script, ...opts, "--json", "--target", at], { cwd: at });
  try {
    return { code: r.code, report: JSON.parse(r.out) };
  } catch {
    throw new Error(`apply.py ${opts.join(" ")} printed no JSON in ${at}: ${r.err.trim().split("\n").pop()}`);
  }
}

// What the policy decides, read in a tree through its own tools: the tier of each file, the
// CODEOWNERS block, the policy's problems, and what github_setup.py main would set (gh and the two
// readers of GitHub are stand-ins; plan() is caught with the arguments main gives it).
const POLICY_VIEW = `
import contextlib, io, json, sys
from pathlib import Path
sys.path.insert(0, "tools")
import autonomy as a, github_setup as g
root = Path(".")
policy = a.load_policy(root, None)
own = a.own_checks(root)
files = json.loads(sys.argv[1])
res = a.classify(policy, [{"path": p, "status": "M", "added": 0, "deleted": 0} for p in files], "", "", own)
# The other ways a tier is raised: a deleted test file, and a dependency update by a bot.
special = {
    "deleted test": a.classify(policy, [{"path": "tests/x.test.ts", "status": "D", "added": 0, "deleted": 40}], "", "", own)["tier"],
    "bot update": a.classify(policy, [{"path": "package.json", "status": "M", "added": 1, "deleted": 1}], "dependabot[bot]", "version-update:semver-major", own)["tier"],
}
problems = a.policy_problems(policy, own) + (a.merge_method_problems(policy) if hasattr(a, "merge_method_problems") else [])
calls = []
def stand_in_gh(args, *x, **k):
    calls.append(" ".join(args[:2]))
    return True, json.dumps({"nameWithOwner": "o/r", "defaultBranchRef": {"name": "main"}})
g.gh = stand_in_gh
g.commit_format_checks = lambda root, repo, branch: (["conventional-title", "conventional-commits"], [], [])
g.kept_checks = lambda repo, unread: []
real = g.plan
class Caught(Exception):
    pass
def caught(*args, **kwargs):
    raise Caught(real(*args, **kwargs))
g.plan = caught
out, err, steps, code = io.StringIO(), io.StringIO(), [], None
try:
    with contextlib.redirect_stdout(out), contextlib.redirect_stderr(err):
        code = g.main(json.loads(sys.argv[2]))
except Caught as c:
    steps = c.args[0]
except Exception as exc:
    code = "error: " + type(exc).__name__
rules = [r for s in steps if "ruleset" in s for r in s["ruleset"]["rules"] if r["type"] == "required_status_checks"]
merge = steps[0] if steps else {}
print(json.dumps({
    "tiers": {f["path"]: f["tier"] for f in res["files"]},
    "tier": res["tier"],
    "proof": res["proof"],
    "codeowners": a.render_codeowners(policy, own),
    "committed_block": a.codeowners_block((root / ".github" / "CODEOWNERS").read_text(encoding="utf-8")),
    "problems": problems,
    "exit": code,
    "stderr": err.getvalue().strip(),
    "checks": [c["context"] for r in rules for c in r["parameters"]["required_status_checks"]],
    "merge_what": merge.get("what", ""),
    "merge_fields": [x for x in merge.get("args", []) if x.startswith("allow_")],
    "other_steps": [st for st in steps if st is not merge],
    "special": special,
    "gh_calls": calls,
}))
`;

/** POLICY_VIEW in the tree `at`, for `files`, with github_setup.py's arguments `argv`. */
export function policyView(at, files, argv = []) {
  const r = run("python3", ["-I", "-c", POLICY_VIEW, JSON.stringify(files), JSON.stringify(argv)], { cwd: at });
  if (r.code !== 0) throw new Error(`the policy of ${at} cannot be read: ${r.err.trim().split("\n").pop()}`);
  return JSON.parse(r.out);
}
