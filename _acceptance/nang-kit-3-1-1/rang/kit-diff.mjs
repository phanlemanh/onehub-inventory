// AC-5: between v3.1.0 and v3.1.1 exactly the nine files of the matrix change under plugins/; none under the core's
// scripts/ or lib/; each kit executor of _acceptance/config.yaml runs a file under the core's scripts/ or lib/ that
// exists at v3.1.1 and did not change; and this repo does not turn on the one switch under which the patch acts.
import { readFileSync, mkdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { cli, git, repoRoot, short } from "./kit.mjs";
import { CORE_RUN_DIRS, KIT_CHANGED, NEW_KIT, OLD_KIT, PATCH_SWITCH } from "./matrix.mjs";

// Both tags in one shallow repo in os.tmpdir(), so their trees can be compared.
export function kitPair() {
  const dir = join(tmpdir(), `nk311-pair-${OLD_KIT.tag}-${NEW_KIT.tag}`);
  const ok = () => {
    try {
      return git(dir, "rev-parse", `${OLD_KIT.tag}^{commit}`) === OLD_KIT.sha && git(dir, "rev-parse", `${NEW_KIT.tag}^{commit}`) === NEW_KIT.sha;
    } catch {
      return false;
    }
  };
  if (ok()) return dir;
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  git(dir, "init", "-q");
  for (const k of [OLD_KIT, NEW_KIT]) git(dir, "fetch", "-q", "--depth", "1", k.url, `refs/tags/${k.tag}:refs/tags/${k.tag}`);
  if (!ok()) throw new Error(`kit-diff: tags of ${NEW_KIT.repo} are not ${short(OLD_KIT.sha)} and ${short(NEW_KIT.sha)}`);
  return dir;
}

export function changedFiles(dir) {
  return git(dir, "diff", "--name-only", OLD_KIT.sha, NEW_KIT.sha, "--", "plugins/").split("\n").filter(Boolean).sort();
}

export function filesAt(dir, sha) {
  return new Set(git(dir, "ls-tree", "-r", "--name-only", sha, "--", NEW_KIT.core).split("\n").filter(Boolean));
}

// [{key: "design.floor", file: "scripts/design-floor-s4.mjs"}] for executor lines that join a path to the kit root.
export function kitExecutors(configText) {
  const found = [];
  let inExecutors = false;
  let section = null;
  for (const line of configText.split("\n")) {
    if (/^\S/.test(line)) {
      inExecutors = /^executors:\s*$/.test(line);
      section = null;
      continue;
    }
    if (!inExecutors) continue;
    const sec = line.match(/^ {2}([A-Za-z0-9_-]+):\s*$/);
    if (sec) {
      section = sec[1];
      continue;
    }
    const entry = line.match(/^ {4}([A-Za-z0-9_-]+):\s*(.*)$/);
    const value = entry?.[2].match(/^"((?:[^"\\]|\\.)*)"/)?.[1] ?? "";
    if (!section || !/CLAUDE_PLUGIN_ROOT|node tools\/kit-root\.mjs/.test(value)) continue;
    const file = value.match(/(?:\$R|\})\/([A-Za-z0-9._/-]+)/)?.[1] ?? null;
    found.push({ key: `${section}.${entry[1]}`, file });
  }
  return found;
}

// true when `<block>:` at column 0 has `  <key>: true`.
export function switchOn(configText, { block, key } = PATCH_SWITCH) {
  let inBlock = false;
  for (const line of configText.split("\n")) {
    if (/^\S/.test(line)) {
      inBlock = new RegExp(`^${block}:\\s*(#.*)?$`).test(line);
      continue;
    }
    const m = inBlock && line.match(new RegExp(`^\\s+${key}\\s*:\\s*([^#\\s]+)`));
    if (m) return m[1] === "true";
  }
  return false;
}

export function judge({ changed, executors, coreFiles, configText }) {
  const core = CORE_RUN_DIRS.map((d) => `${NEW_KIT.core.replace(/\/$/, "")}/${d.replace(/^plugins\/acceptance-gate\//, "")}`);
  const inCore = changed.find((f) => core.some((d) => f.startsWith(d)));
  if (inCore) return { ok: false, line: `kit-diff: ${inCore} changed between ${OLD_KIT.tag} and ${NEW_KIT.tag}` };
  if (changed.join("\n") !== [...KIT_CHANGED].sort().join("\n"))
    return { ok: false, line: `kit-diff: changed files differ from the matrix (${changed.length} files, want ${KIT_CHANGED.length})` };
  if (executors.length === 0) return { ok: false, line: "kit-diff: no kit executor found in _acceptance/config.yaml" };
  for (const e of executors) {
    const full = e.file ? `${NEW_KIT.core}/${e.file}` : null;
    if (!full || !core.some((d) => full.startsWith(d)))
      return { ok: false, line: `kit-diff: executor ${e.key} runs ${e.file ?? "no file"}, outside acceptance-gate/scripts and lib` };
    if (!coreFiles.has(full)) return { ok: false, line: `kit-diff: executor ${e.key} runs ${e.file}, missing in ${NEW_KIT.tag}` };
  }
  if (switchOn(configText))
    return { ok: false, line: `kit-diff: ${PATCH_SWITCH.block}.${PATCH_SWITCH.key} is on in _acceptance/config.yaml` };
  return {
    ok: true,
    line: [
      `kit-diff: ${OLD_KIT.tag}..${NEW_KIT.tag} changes the ${KIT_CHANGED.length} files of the matrix under plugins/; none under acceptance-gate/scripts or acceptance-gate/lib; ${PATCH_SWITCH.block}.${PATCH_SWITCH.key} off in _acceptance/config.yaml`,
      `kit-diff: ${executors.length} kit executors (${executors.map((e) => e.key).join(", ")}) run files under acceptance-gate/scripts or lib, all present and unchanged in ${NEW_KIT.tag}`,
    ],
  };
}

export async function measure({ root = repoRoot() } = {}) {
  const dir = kitPair();
  const configText = readFileSync(join(root, "_acceptance/config.yaml"), "utf8");
  return judge({ changed: changedFiles(dir), executors: kitExecutors(configText), coreFiles: filesAt(dir, NEW_KIT.sha), configText });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await cli(measure);
