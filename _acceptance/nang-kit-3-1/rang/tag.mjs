// AC-2: tag v3.1.0 of the kit repo peels to the pinned commit, and each of the six plugins at that commit has the
// version of the matrix (five at 3.1.0, diagram-design unchanged at 3.0.0).
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { cli, fetchKit, short } from "./kit.mjs";
import { NEW_KIT, PLUGIN_VERSIONS, PLUGINS } from "./matrix.mjs";

export function remotePeeled(kit) {
  const out = execFileSync("git", ["ls-remote", kit.url, `refs/tags/${kit.tag}^{}`], { encoding: "utf8" });
  return out.split(/\s+/)[0] || null;
}

export function judge({ peeled, kitDir, kit = NEW_KIT }) {
  if (peeled !== kit.sha)
    return { ok: false, line: `tag: ${kit.tag} on ${kit.repo} is ${peeled ? short(peeled) : "missing"}, want ${short(kit.sha)}` };
  for (const p of [...PLUGINS].sort()) {
    const v = JSON.parse(readFileSync(join(kitDir, "plugins", p, ".claude-plugin/plugin.json"), "utf8")).version;
    if (v !== PLUGIN_VERSIONS[p]) return { ok: false, line: `tag: ${p} is ${v}, want ${PLUGIN_VERSIONS[p]}` };
  }
  return {
    ok: true,
    line: `tag: ${kit.tag} on ${kit.repo} peels to ${short(kit.sha)}; ${PLUGINS.length} plugin versions as in the matrix (${Object.values(PLUGIN_VERSIONS).filter((v) => v === "3.1.0").length} at 3.1.0)`,
  };
}

export async function measure() {
  return judge({ peeled: remotePeeled(NEW_KIT), kitDir: fetchKit(NEW_KIT) });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await cli(measure);
