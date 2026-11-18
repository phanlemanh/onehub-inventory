// AC-1: the gate job of ci.yml fetches delivery-loop v3.0.0 and points CLAUDE_PLUGIN_ROOT at the core plugin.
import { existsSync, mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { cli, git, mergeBase, repoRoot, short } from "./kit.mjs";
import { CI_CHANGED_LINES, CI_CORE_FILES, CI_PLUGIN_ROOT_SUFFIX, NEW_KIT } from "./matrix.mjs";

export function gateJob(text) {
  const lines = text.split("\n");
  const start = lines.findIndex((l) => /^ {2}gate:\s*$/.test(l));
  if (start < 0) return null;
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (/^ {2}[A-Za-z0-9_-]+:\s*$/.test(lines[i])) {
      end = i;
      break;
    }
  }
  const job = lines.slice(start, end);
  while (job.length && job[job.length - 1].trim() === "") job.pop();
  return job;
}

export function readGate(job) {
  const text = job.join("\n");
  const tag = text.match(/KIT_TAG:\s*(\S+)/)?.[1];
  const url = text.match(/fetch -q --depth 1 (\S+) "refs\/tags\/\$KIT_TAG"/)?.[1];
  const suffix = text.match(/CLAUDE_PLUGIN_ROOT=\$RUNNER_TEMP\/kit(\S*)" >> "\$GITHUB_ENV"/)?.[1];
  return { tag, url, suffix };
}

function changedLines(a, b) {
  if (a.length !== b.length) return Math.abs(a.length - b.length) + Math.min(a.length, b.length);
  return a.filter((l, i) => l !== b[i]).length;
}

export async function measure({ root = repoRoot(), base } = {}) {
  const job = gateJob(readFileSync(join(root, ".github/workflows/ci.yml"), "utf8"));
  if (!job) return { ok: false, line: "ci-kit: no gate job in ci.yml" };
  const { tag, url, suffix } = readGate(job);
  if (tag !== NEW_KIT.tag) return { ok: false, line: `ci-kit: KIT_TAG is ${tag}, want ${NEW_KIT.tag}` };
  if (url !== NEW_KIT.url) return { ok: false, line: `ci-kit: the gate fetches ${url}, want ${NEW_KIT.url}` };
  if (suffix !== CI_PLUGIN_ROOT_SUFFIX)
    return { ok: false, line: `ci-kit: CLAUDE_PLUGIN_ROOT is <kit>${suffix ?? "?"}, want <kit>${CI_PLUGIN_ROOT_SUFFIX}` };

  // The fetch step, as the job runs it, into a temp folder outside the repo.
  const kit = mkdtempSync(join(tmpdir(), "nk30-ci-kit-"));
  try {
    git(kit, "init", "-q");
    git(kit, "fetch", "-q", "--depth", "1", url, `refs/tags/${tag}`);
    git(kit, "checkout", "-q", "FETCH_HEAD");
  } catch {
    return { ok: false, line: `ci-kit: cannot fetch ${url} ${tag}` };
  }
  const head = git(kit, "rev-parse", "HEAD");
  if (head !== NEW_KIT.sha) return { ok: false, line: `ci-kit: ${tag} is ${short(head)}, want ${short(NEW_KIT.sha)}` };
  for (const f of CI_CORE_FILES) {
    if (!existsSync(join(kit, suffix, f))) return { ok: false, line: `ci-kit: <kit>${suffix} has no ${f}` };
  }

  const baseRev = base ?? mergeBase();
  const baseJob = gateJob(git(repoRoot(), "show", `${baseRev}:.github/workflows/ci.yml`));
  const n = changedLines(job, baseJob ?? []);
  if (n !== CI_CHANGED_LINES)
    return { ok: false, line: `ci-kit: the gate job differs from origin/main in ${n} lines, want ${CI_CHANGED_LINES}` };
  return {
    ok: true,
    line: `ci-kit: gate fetches ${NEW_KIT.repo} ${tag} at ${short(head)}; CLAUDE_PLUGIN_ROOT=<kit>${suffix} has ${CI_CORE_FILES.join(" and ")}; the gate job differs from origin/main in ${n} lines`,
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await cli(measure);
