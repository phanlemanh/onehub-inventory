// AC-1: .claude/settings.json at HEAD = the merge-base file plus six false keys, one per old-marketplace plugin.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { cli, git, mergeBase, repoRoot } from "./kit.mjs";
import { OLD_MARKET, OLD_PLUGINS, OLD_PLUGINS_SHOWN } from "./matrix.mjs";

export { OLD_MARKET };

const SUFFIX = `@${OLD_MARKET}`;
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

export function judge(head, base) {
  const on = head.enabledPlugins ?? {};
  const old = Object.entries(on).filter(([k]) => k.endsWith(SUFFIX));
  const names = old.map(([k]) => k.slice(0, -SUFFIX.length)).sort();
  if (!same(names, OLD_PLUGINS) || old.some(([, v]) => v !== false))
    return { ok: false, line: "settings: false keys differ from the six old-marketplace plugins" };
  const rest = Object.fromEntries(Object.entries(on).filter(([k]) => !k.endsWith(SUFFIX)));
  if (!same(rest, base.enabledPlugins ?? {})) return { ok: false, line: "settings: enabledPlugins changed from merge-base" };
  const keys = new Set([...Object.keys(head), ...Object.keys(base)]);
  for (const k of [...keys].sort()) {
    if (k !== "enabledPlugins" && !same(head[k], base[k])) return { ok: false, line: `settings: ${k} changed from merge-base` };
  }
  return {
    ok: true,
    line: `settings: enabledPlugins = merge-base + 6 false keys (${OLD_PLUGINS_SHOWN.join(", ")} @${OLD_MARKET}); every other key as at merge-base`,
  };
}

export async function measure({ root = repoRoot() } = {}) {
  const head = JSON.parse(readFileSync(join(root, ".claude/settings.json"), "utf8"));
  const base = JSON.parse(git(root, "show", `${mergeBase(root)}:.claude/settings.json`));
  return judge(head, base);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await cli(measure);
