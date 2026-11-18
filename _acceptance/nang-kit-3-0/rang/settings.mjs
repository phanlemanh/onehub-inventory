// AC-6: .claude/settings.json names the kit's own marketplace, pinned to the KIT_TAG of ci.yml, with exactly the
// kit's plugins on; permissions, hooks and superpowers as on main.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { readGate, gateJob } from "./ci-kit.mjs";
import { cli, fetchKit, git, mergeBase, repoRoot } from "./kit.mjs";
import { KEPT_PLUGIN, NEW_KIT } from "./matrix.mjs";

export function kitMarketplace(kitDir) {
  const m = JSON.parse(readFileSync(join(kitDir, ".claude-plugin/marketplace.json"), "utf8"));
  return { name: m.name, plugins: m.plugins.map((p) => p.name).sort() };
}

export function judge(settings, baseSettings, ciTag, market) {
  const markets = Object.keys(settings.extraKnownMarketplaces ?? {});
  if (!markets.includes(market.name))
    return { ok: false, line: `settings: marketplace is ${markets.join(",") || "none"}, want ${market.name}` };
  const src = settings.extraKnownMarketplaces[market.name].source ?? {};
  if (src.source !== "github" || src.repo !== NEW_KIT.repo)
    return { ok: false, line: `settings: marketplace source is ${src.source}:${src.repo}, want github:${NEW_KIT.repo}` };
  if (src.ref !== ciTag) return { ok: false, line: `settings: marketplace not pinned to ${ciTag}` };
  const on = Object.entries(settings.enabledPlugins ?? {})
    .filter(([, v]) => v === true)
    .map(([k]) => k);
  if (on.some((k) => k.endsWith("@acceptance-gate-kit")))
    return { ok: false, line: "settings: an @acceptance-gate-kit key is still on" };
  const fromKit = on
    .filter((k) => k.endsWith(`@${market.name}`))
    .map((k) => k.slice(0, -market.name.length - 1))
    .sort();
  if (fromKit.join(",") !== market.plugins.join(","))
    return { ok: false, line: "settings: plugins on differ from the kit marketplace" };
  if (settings.enabledPlugins[KEPT_PLUGIN] !== baseSettings.enabledPlugins?.[KEPT_PLUGIN])
    return { ok: false, line: `settings: ${KEPT_PLUGIN} changed` };
  for (const k of ["permissions", "hooks"]) {
    if (JSON.stringify(settings[k]) !== JSON.stringify(baseSettings[k]))
      return { ok: false, line: `settings: ${k} changed from origin/main` };
  }
  return {
    ok: true,
    line: `settings: marketplace ${market.name} (${src.repo}) at ref ${src.ref} = KIT_TAG of ci.yml; ${fromKit.length} plugins on, equal to the kit marketplace; no @acceptance-gate-kit key; superpowers, permissions and hooks as on origin/main`,
  };
}

export async function measure({ root = repoRoot() } = {}) {
  const settings = JSON.parse(readFileSync(join(root, ".claude/settings.json"), "utf8"));
  const baseSettings = JSON.parse(git(repoRoot(), "show", `${mergeBase()}:.claude/settings.json`));
  const ciTag = readGate(gateJob(readFileSync(join(root, ".github/workflows/ci.yml"), "utf8")) ?? []).tag;
  return judge(settings, baseSettings, ciTag, kitMarketplace(fetchKit(NEW_KIT)));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await cli(measure);
