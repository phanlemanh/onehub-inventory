// Shared helpers of the measures of upgrade-repo-setup-0-10-2. The repository root is derived from
// this file's place (three levels up), or given with --root <dir> (a broken copy in two-way.mjs).

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { BASE, PLUGIN_COMMIT, PLUGIN_REPO, PLUGIN_TAG, STEP_START } from "./matrix.mjs";

export const HERE = dirname(fileURLToPath(import.meta.url));
export const WORKFLOW = ".github/workflows/pr-title.yml";

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
  const dir = join(tmpdir(), `rs0102-repo-setup-${PLUGIN_COMMIT}`);
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
  const at = join(mkdtempSync(join(tmpdir(), "rs0102-wt-")), "w");
  git(dir, "worktree", "add", "-q", "--detach", at, ref);
  return {
    dir: at,
    remove() {
      run("git", ["-C", dir, "worktree", "remove", "--force", at]);
      rmSync(dirname(at), { recursive: true, force: true });
    },
  };
}

/**
 * The `run` of the step of conventional-commits that judges the commits, as the workflow holds it
 * (never retyped), with pre-commit from uvx in place of `pipx run`.
 */
export function judgeStep(workflowText) {
  const steps = yaml(workflowText).jobs["conventional-commits"].steps;
  const step = steps.find((s) => typeof s.run === "string" && s.run.startsWith(STEP_START));
  if (!step) throw new Error("conventional-commits has no step that judges the commits");
  return step.run.replaceAll("pipx run pre-commit", "uvx pre-commit");
}

/**
 * Run the judging step in `at` (a checkout whose .pre-commit-config.yaml is used) the way the runner
 * does (`bash --noprofile --norc -eo pipefail`), with a stand-in for `gh`: the merge settings answer
 * `keeps`, the pull request has `commits` ({sha, message}). `binDir` is put first on PATH.
 */
export function runStep(at, body, { commits = [], keeps = "true", binDir = "" } = {}) {
  const tmp = mkdtempSync(join(tmpdir(), "rs0102-step-"));
  try {
    const data = join(tmp, "data");
    const runnerTemp = join(tmp, "runner");
    mkdirSync(data);
    mkdirSync(runnerTemp);
    writeFileSync(join(data, "shas"), commits.map((c) => `${c.sha}\n`).join(""));
    for (const c of commits) writeFileSync(join(data, `msg-${c.sha}`), c.message);
    const shim = [
      "gh() {",
      '  case "$1 $2" in',
      '    "repo view") echo "$STAND_IN_KEEPS" ;;',
      '    "api --paginate") cat "$STAND_IN_DATA/shas" ;;',
      '    "api "*) cat "$STAND_IN_DATA/msg-${2##*/}" ;;',
      "    *) echo \"stand-in gh: $*\" >&2; return 1 ;;",
      "  esac",
      "}",
      "",
    ].join("\n");
    const script = join(tmp, "step.sh");
    writeFileSync(script, shim + body);
    const env = {
      ...process.env,
      PATH: binDir ? `${binDir}:${process.env.PATH}` : process.env.PATH,
      RUNNER_TEMP: runnerTemp,
      GITHUB_STEP_SUMMARY: join(tmp, "summary"),
      GITHUB_REPOSITORY: "stand-in/repository",
      PR: "1",
      STAND_IN_DATA: data,
      STAND_IN_KEEPS: keeps,
    };
    const r = run("bash", ["--noprofile", "--norc", "-eo", "pipefail", script], { cwd: at, env });
    return { code: r.code, out: r.out, err: r.err };
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

/**
 * What the runner reads as commands in `out`: lines outside the fences. A fence opens with
 * `::stop-commands::<token>` and closes with a line `::<token>::`. Returns the lines outside, the
 * fences ({token, lines}) and whether a fence is left open.
 */
export function fences(out) {
  const outside = [];
  const found = [];
  let open = null;
  for (const line of out.split("\n")) {
    if (open) {
      if (line.trimStart() === `::${open.token}::`) {
        found.push(open);
        open = null;
      } else open.lines.push(line);
      continue;
    }
    // The runner trims the start of a line before it looks for `::`.
    const m = /^::stop-commands::(.*)$/.exec(line.trimStart());
    if (m) open = { token: m[1], lines: [] };
    else outside.push(line);
  }
  if (open) found.push(open);
  return { outside, fences: found, unclosed: Boolean(open) };
}

/** A commit message of this repository (the upgrade commit). */
export function messageOf(dir, sha) {
  return git(dir, "log", "-1", "--format=%B", sha);
}
