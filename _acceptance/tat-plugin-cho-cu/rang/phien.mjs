// AC-2, AC-3: a real Claude Code session started in the tree under test — which kit plugins and commands it loads.
// Reads ~/.claude/settings.json only to check the precondition; never writes it.
import { spawn } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { createInterface } from "node:readline";
import { fileURLToPath } from "node:url";

import { cli, git, mergeBase, repoRoot, withWorktree } from "./kit.mjs";
import { KIT_NAMES, NEW_COMMANDS, NEW_MARKET, NEW_PLUGINS, NEW_VERSION, OLD_COMMAND, OLD_MARKET } from "./matrix.mjs";

const PROBE_TIMEOUT_MS = 120_000;
const KIT = new Set(KIT_NAMES);
const kitCommand = (c) => KIT.has(c.split(":")[0]);

// Keeps only what the measure reads: kit plugins (name, source, version) and kit commands. No paths.
export function trim(init) {
  return {
    plugins: (init.plugins ?? [])
      .filter((p) => KIT.has(p.name))
      .map(({ name, source, version }) => ({ name, source, version })),
    slash_commands: (init.slash_commands ?? []).filter(kitCommand).sort(),
  };
}

// Starts `claude -p "ok"` in cwd, reads stream-json until the system/init event, then stops the session.
export function probe(cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn("claude", ["-p", "ok", "--output-format", "stream-json", "--verbose", "--max-turns", "1"], {
      cwd,
      stdio: ["ignore", "pipe", "ignore"],
      detached: true,
    });
    const stop = () => {
      try {
        process.kill(-child.pid, "SIGTERM");
      } catch {}
    };
    const timer = setTimeout(() => {
      stop();
      reject(new Error("phien: no init event"));
    }, PROBE_TIMEOUT_MS);
    const lines = createInterface({ input: child.stdout });
    lines.on("line", (line) => {
      let ev;
      try {
        ev = JSON.parse(line);
      } catch {
        return;
      }
      if (ev.type === "system" && ev.subtype === "init") {
        clearTimeout(timer);
        lines.close();
        stop();
        resolve(trim(ev));
      }
    });
    child.on("error", (e) => {
      clearTimeout(timer);
      reject(new Error(`phien: no init event (${e.message})`));
    });
    child.on("exit", () => {
      clearTimeout(timer);
      reject(new Error("phien: no init event"));
    });
  });
}

export function judge(init) {
  const plugins = (init.plugins ?? []).filter((p) => KIT.has(p.name));
  for (const name of KIT_NAMES) {
    if (plugins.filter((p) => p.name === name).length > 1) return { ok: false, line: `phien: two versions of ${name}` };
  }
  const old = plugins.find((p) => p.source.endsWith(`@${OLD_MARKET}`));
  if (old) return { ok: false, line: `phien: old-marketplace source still loaded: ${old.source}` };
  const fresh = plugins.filter((p) => p.source.endsWith(`@${NEW_MARKET}`));
  if (JSON.stringify(fresh.map((p) => p.name).sort()) !== JSON.stringify(NEW_PLUGINS))
    return { ok: false, line: `phien: ${NEW_MARKET} plugins differ from the six` };
  const stale = fresh.find((p) => p.version !== NEW_VERSION);
  if (stale) return { ok: false, line: `phien: ${stale.source} is ${stale.version}, want ${NEW_VERSION}` };
  const cmds = init.slash_commands ?? [];
  if (cmds.includes(OLD_COMMAND)) return { ok: false, line: `phien: ${OLD_COMMAND} still loaded` };
  const missing = NEW_COMMANDS.find((c) => !cmds.includes(c));
  if (missing) return { ok: false, line: `phien: ${missing} missing` };
  return {
    ok: true,
    line: `phien: 6 kit plugins, one version each, all @${NEW_MARKET} ${NEW_VERSION}; cat-luot absent; scope-slice and feature-loop:feature-loop present`,
  };
}

// The positive control holds when the session measure is red for two versions and the old command is loaded.
export function controlJudge(init, sha) {
  const r = judge(init);
  if (r.ok) return { ok: false, line: "doi-chung: the session measure is green at merge-base — no positive control" };
  if (!r.line.startsWith("phien: two versions of")) return { ok: false, line: `doi-chung: red for another reason: ${r.line}` };
  if (!(init.slash_commands ?? []).includes(OLD_COMMAND))
    return { ok: false, line: `doi-chung: ${OLD_COMMAND} absent at merge-base` };
  return {
    ok: true,
    line: `doi-chung: at merge-base ${sha} the session measure is red as pinned (${r.line}…), cat-luot present`,
  };
}

export function precondition(home = homedir()) {
  let on = {};
  try {
    on = JSON.parse(readFileSync(join(home, ".claude/settings.json"), "utf8")).enabledPlugins ?? {};
  } catch {}
  if (Object.entries(on).some(([k, v]) => k.endsWith(`@${OLD_MARKET}`) && v === true)) return { ok: true };
  return { ok: false, code: 3, line: "phien: cannot run the control — no old-marketplace plugin is on at user level" };
}

function noteLocal(dir) {
  if (existsSync(join(dir, ".claude/settings.local.json")))
    console.error(`phien: note — ${join(dir, ".claude/settings.local.json")} exists and may change what the session loads`);
}

export async function measure() {
  const pre = precondition();
  if (!pre.ok) return pre;
  const root = repoRoot();
  noteLocal(root);
  return judge(await probe(root));
}

export async function control() {
  const pre = precondition();
  if (!pre.ok) return pre;
  const root = repoRoot();
  const base = mergeBase(root);
  const init = await withWorktree(base, async (dir) => probe(dir), root);
  return controlJudge(init, git(root, "rev-parse", "--short", base));
}

// Records the two fixtures two-way.mjs reads, from real sessions.
async function record() {
  const root = repoRoot();
  const here = join(root, "_acceptance/tat-plugin-cho-cu/rang");
  const head = await probe(root);
  const base = await withWorktree(mergeBase(root), async (dir) => probe(dir), root);
  writeFileSync(join(here, "init-head.json"), JSON.stringify(head, null, 2) + "\n");
  writeFileSync(join(here, "init-merge-base.json"), JSON.stringify(base, null, 2) + "\n");
  return { ok: true, line: `phien: recorded init-head.json (${head.plugins.length} kit plugins) and init-merge-base.json (${base.plugins.length})` };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const flag = process.argv[2];
  await cli(flag === "--doi-chung" ? control : flag === "--ghi" ? record : measure);
}
