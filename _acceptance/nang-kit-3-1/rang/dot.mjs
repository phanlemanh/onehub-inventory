// AC-9: the dispatch hooks of kit 3.1 read this repo's batch folder as 3.0 does, and no lane is mid-S4 (rule 15 of
// docs/plan/dot-nen/LUAT-rieng.md: no kit upgrade during an S4 round).
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { cli, fetchKit, git, repoRoot } from "./kit.mjs";
import { BATCH, HOOK_CLOSURE_CHANGED, NEW_KIT, OLD_KIT, S4_LOCKS } from "./matrix.mjs";

const IMPORT = /(?:from\s+|import\()\s*['"]\.\/([A-Za-z0-9._-]+\.mjs)['"]/g;

export function hookScripts(dispatchDir) {
  const text = readFileSync(join(dispatchDir, "hooks/hooks.json"), "utf8");
  return [...new Set([...text.matchAll(/scripts\/([A-Za-z0-9._-]+\.mjs)/g)].map((m) => m[1]))].sort();
}

export function closure(scriptsDir, roots) {
  const seen = new Set();
  const todo = [...roots];
  while (todo.length) {
    const f = todo.pop();
    if (seen.has(f) || !existsSync(join(scriptsDir, f))) continue;
    seen.add(f);
    for (const m of readFileSync(join(scriptsDir, f), "utf8").matchAll(IMPORT)) todo.push(m[1]);
  }
  return [...seen].sort();
}

// The batch folder: next to the git common dir of this checkout, or of the sibling main checkout when grading
// from an outside copy.
export function batchDir(root = repoRoot()) {
  const common = resolve(root, git(root, "rev-parse", "--git-common-dir"));
  const candidates = [join(dirname(common), ".acceptance-runs", BATCH), join(dirname(root), "onehub-inventory", ".acceptance-runs", BATCH)];
  return candidates.find((d) => existsSync(join(d, "dieu-phoi.config.json"))) ?? null;
}

// JSON.stringify turns a Map or a Set into "{}", so two readers returning different Maps would compare equal.
// Spell their entries out before comparing.
export function jsonSafe(v) {
  if (v instanceof Map) return { Map: [...v].map(([k, x]) => [jsonSafe(k), jsonSafe(x)]) };
  if (v instanceof Set) return { Set: [...v].map(jsonSafe) };
  if (Array.isArray(v)) return v.map(jsonSafe);
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, jsonSafe(x)]));
  return v;
}

// {reader: JSON of its return value, or "throws <message>"} for one version of one file.
async function readWith(kitDir, file, args) {
  const mod = await import(pathToFileURL(join(kitDir, "plugins/dispatch/scripts", file)).href);
  const r = {};
  for (const [fn, which] of HOOK_CLOSURE_CHANGED[file]) {
    if (typeof mod[fn] !== "function") {
      r[fn] = "missing";
      continue;
    }
    try {
      r[fn] = JSON.stringify(jsonSafe(mod[fn](args[which]) ?? null));
    } catch (e) {
      r[fn] = `throws ${e.message}`;
    }
  }
  return r;
}

export async function judge({ oldDir, newDir, dir, root = repoRoot() }) {
  const hj = (d) => readFileSync(join(d, "plugins/dispatch/hooks/hooks.json"), "utf8");
  if (hj(oldDir) !== hj(newDir)) return { ok: false, line: "dot: dispatch hooks.json differs between v3.0.0 and v3.1.0" };
  const scripts = (d) => join(d, "plugins/dispatch/scripts");
  const files = closure(scripts(newDir), hookScripts(join(newDir, "plugins/dispatch")));
  const changed = files.filter((f) => {
    const a = join(scripts(oldDir), f);
    return !existsSync(a) || readFileSync(a, "utf8") !== readFileSync(join(scripts(newDir), f), "utf8");
  });
  const want = Object.keys(HOOK_CLOSURE_CHANGED).sort();
  if (changed.join(",") !== want.join(","))
    return { ok: false, line: `dot: hook files changed in v3.1.0 are ${changed.join(",") || "none"}, want ${want.join(",")}` };
  if (!dir) return { ok: false, line: `dot: batch folder ${BATCH} not found` };
  const args = { batch: dir, repo: root };
  for (const f of changed) {
    const a = await readWith(oldDir, f, args);
    const b = await readWith(newDir, f, args);
    const bad = Object.entries(b).find(([, v]) => v === "missing" || v.startsWith("throws "));
    if (bad) return { ok: false, line: `dot: ${f} of v3.1.0 cannot read: ${bad[0]} ${bad[1].slice(0, 160)}` };
    const diff = Object.keys(b).find((k) => a[k] !== b[k]);
    if (diff) return { ok: false, line: `dot: ${f} ${diff} reads differently in v3.0.0 and v3.1.0` };
  }
  const held = S4_LOCKS.filter((k) => existsSync(join(dir, "khoa", k, "chu.json")));
  if (held.length) return { ok: false, line: `dot: lock ${held.join(",")} is held — a lane is mid-S4` };
  const locks = existsSync(join(dir, "khoa")) ? readdirSync(join(dir, "khoa")).length : 0;
  return {
    ok: true,
    line: `dot: ${files.length} hook files of dispatch, ${changed.length} changed in v3.1.0 (${changed.join(",")}), reading batch ${BATCH} alike in both; no ${S4_LOCKS.join(",")} lock held (${locks} lock folders)`,
  };
}

export async function measure({ dir = batchDir() } = {}) {
  return judge({ oldDir: fetchKit(OLD_KIT), newDir: fetchKit(NEW_KIT), dir });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await cli(measure);
