// AC-3: .github/workflows/ci.yml differs from main in exactly one line — KIT_TAG of the gate job moves from v3.1.0 to
// v3.1.1 — and the patch kept in the record, applied to the base ci.yml, gives the ci.yml of HEAD byte for byte.
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { ciTag } from "./ci-tag.mjs";
import { cli, git, mergeBase, repoRoot } from "./kit.mjs";
import { CI_CHANGED, CI_PATCH, NEW_KIT, OLD_KIT } from "./matrix.mjs";

const CI = ".github/workflows/ci.yml";

function changed(baseText, text) {
  const a = baseText.split("\n");
  const b = text.split("\n");
  if (a.length !== b.length) return null;
  return a.map((l, i) => [l.trim(), b[i].trim()]).filter(([x, y]) => x !== y);
}

// The base ci.yml with the patch applied, in a temp folder outside the repo; null when git apply refuses.
export function applyPatch(baseText, patchText) {
  const dir = mkdtempSync(join(tmpdir(), "nk311-ci-"));
  try {
    mkdirSync(join(dir, ".github/workflows"), { recursive: true });
    writeFileSync(join(dir, CI), baseText);
    writeFileSync(join(dir, "p.patch"), patchText);
    execFileSync("git", ["apply", "p.patch"], { cwd: dir, stdio: ["ignore", "pipe", "pipe"] });
    return readFileSync(join(dir, CI), "utf8");
  } catch {
    return null;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

export function judge(text, baseText, patchText) {
  const tag = ciTag(text);
  if (tag !== NEW_KIT.tag) return { ok: false, line: `ci-line: KIT_TAG of the gate job is ${tag ?? "missing"}, want ${NEW_KIT.tag}` };
  const diff = changed(baseText, text);
  if (!diff || diff.length !== 1 || diff[0][0] !== CI_CHANGED.from || diff[0][1] !== CI_CHANGED.to)
    return {
      ok: false,
      line: `ci-line: ci.yml differs from origin/main in ${diff ? diff.length : "a different number of"} lines, want only ${CI_CHANGED.from} -> ${CI_CHANGED.to}`,
    };
  if (applyPatch(baseText, patchText) !== text)
    return { ok: false, line: "ci-line: ci-kit-tag.patch does not give the ci.yml of HEAD" };
  return {
    ok: true,
    line: `ci-line: ci.yml differs from origin/main only in KIT_TAG of the gate job, ${OLD_KIT.tag} -> ${NEW_KIT.tag}; ci-kit-tag.patch applied to the base gives HEAD`,
  };
}

export async function measure({ root = repoRoot() } = {}) {
  const text = readFileSync(join(root, CI), "utf8");
  const baseText = `${git(root, "show", `${mergeBase(root)}:${CI}`)}\n`;
  const patchText = readFileSync(join(root, CI_PATCH), "utf8");
  return judge(text, baseText, patchText);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await cli(measure);
