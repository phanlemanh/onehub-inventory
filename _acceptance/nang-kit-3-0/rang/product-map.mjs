// AC-4: kit 3.0's product-map --check passes, and every executor command that joins a script to the kit root
// finds that script under <kit>/plugins/acceptance-gate.
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { cli, coreRoot, fetchKit, repoRoot } from "./kit.mjs";
import { KIT_EXECUTORS, NEW_KIT } from "./matrix.mjs";

// [{key: "design.floor", script: "scripts/design-floor-s4.mjs"}] for executor lines that use the kit root.
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
    // The quoted command only, never its trailing comment.
    const value = entry?.[2].match(/^"((?:[^"\\]|\\.)*)"/)?.[1] ?? "";
    if (!section || !/CLAUDE_PLUGIN_ROOT|node tools\/kit-root\.mjs/.test(value)) continue;
    const script = value.match(/(?:\$R|\})\/(scripts\/[A-Za-z0-9._-]+)/)?.[1] ?? null;
    found.push({ key: `${section}.${entry[1]}`, script });
  }
  return found;
}

export function executorLine(configText, core) {
  const found = kitExecutors(configText);
  const keys = found.map((f) => f.key);
  if (keys.join(",") !== KIT_EXECUTORS.join(","))
    return { ok: false, line: `executor-scripts: commands under the kit root are ${keys.join(", ")}, want ${KIT_EXECUTORS.join(", ")}` };
  for (const f of found) {
    if (!f.script || !existsSync(join(core, f.script)))
      return { ok: false, line: `executor-scripts: ${f.key} calls ${f.script ?? "no script"}, missing in kit ${NEW_KIT.tag}` };
  }
  return {
    ok: true,
    line: `executor-scripts: ${found.length} executor commands under the kit root (${keys.join(", ")}), ${found.length} scripts, all present in kit ${NEW_KIT.tag} ${NEW_KIT.core}`,
  };
}

export async function measure({ root = repoRoot() } = {}) {
  const core = coreRoot(NEW_KIT, fetchKit(NEW_KIT));
  const r = spawnSync("node", [join(core, "scripts/product-map.mjs"), "--root", root, "--check"], { encoding: "utf8" });
  const label = root === repoRoot() ? "HEAD" : root;
  const mapLine = `product-map: kit ${NEW_KIT.tag} product-map.mjs --check exit ${r.status} on ${label}`;
  const ex = executorLine(readFileSync(join(root, "_acceptance/config.yaml"), "utf8"), core);
  return { ok: r.status === 0 && ex.ok, line: [mapLine, ex.line] };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await cli(measure);
