// AC-1: .claude/settings.json differs from main in exactly one line — the delivery-loop marketplace ref moves from
// v3.0.0 to v3.1.0 — and the plugins on are exactly the plugins of the kit 3.1 marketplace.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { ciTag } from "./ci-tag.mjs";
import { cli, fetchKit, git, mergeBase, repoRoot } from "./kit.mjs";
import { KEPT_PLUGIN, MARKETPLACE, NEW_KIT, SETTINGS_CHANGED } from "./matrix.mjs";

export function kitMarketplace(kitDir) {
  const m = JSON.parse(readFileSync(join(kitDir, ".claude-plugin/marketplace.json"), "utf8"));
  return { name: m.name, plugins: m.plugins.map((p) => p.name).sort() };
}

function changed(baseText, text) {
  const a = baseText.trimEnd().split("\n");
  const b = text.trimEnd().split("\n");
  if (a.length !== b.length) return null;
  return a.map((l, i) => [l.trim(), b[i].trim()]).filter(([x, y]) => x !== y);
}

export function judge(text, baseText, market, ci) {
  const settings = JSON.parse(text);
  const src = settings.extraKnownMarketplaces?.[MARKETPLACE]?.source ?? {};
  if (market.name !== MARKETPLACE) return { ok: false, line: `settings: kit marketplace is ${market.name}, want ${MARKETPLACE}` };
  if (src.source !== "github" || src.repo !== NEW_KIT.repo)
    return { ok: false, line: `settings: marketplace source is ${src.source}:${src.repo}, want github:${NEW_KIT.repo}` };
  if (src.ref !== NEW_KIT.tag) return { ok: false, line: `settings: marketplace not pinned to ${NEW_KIT.tag}` };
  const diff = changed(baseText, text);
  if (!diff || diff.length !== 1 || diff[0][0] !== SETTINGS_CHANGED.from || diff[0][1] !== SETTINGS_CHANGED.to)
    return {
      ok: false,
      line: `settings: differs from origin/main in ${diff ? diff.length : "a different number of"} lines, want only ${SETTINGS_CHANGED.from} -> ${SETTINGS_CHANGED.to}`,
    };
  const on = Object.entries(settings.enabledPlugins ?? {})
    .filter(([, v]) => v === true)
    .map(([k]) => k);
  const fromKit = on
    .filter((k) => k.endsWith(`@${MARKETPLACE}`))
    .map((k) => k.slice(0, -MARKETPLACE.length - 1))
    .sort();
  if (fromKit.join(",") !== market.plugins.join(","))
    return { ok: false, line: "settings: plugins on differ from the kit marketplace" };
  if (settings.enabledPlugins[KEPT_PLUGIN] !== true) return { ok: false, line: `settings: ${KEPT_PLUGIN} is not on` };
  return {
    ok: true,
    line: `settings: marketplace ${MARKETPLACE} (${src.repo}) at ref ${src.ref}; the only line changed from origin/main; ${fromKit.length} plugins on, equal to the kit ${NEW_KIT.tag} marketplace; KIT_TAG of ci.yml is ${ci}`,
  };
}

export async function measure({ root = repoRoot() } = {}) {
  const text = readFileSync(join(root, ".claude/settings.json"), "utf8");
  const baseText = git(repoRoot(), "show", `${mergeBase()}:.claude/settings.json`);
  const ci = ciTag(readFileSync(join(repoRoot(), ".github/workflows/ci.yml"), "utf8"));
  return judge(text, baseText, kitMarketplace(fetchKit(NEW_KIT)), ci);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await cli(measure);
