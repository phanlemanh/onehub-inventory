// AC-5: `node tools/kit-root.mjs` on real registry files — only the delivery-loop install counts.
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { cli, git, repoRoot } from "./kit.mjs";
import { NEW_KEY, OLD_KEY } from "./matrix.mjs";

function run(kitRoot, registryText, cwd) {
  const dir = mkdtempSync(join(tmpdir(), "nk30-reg-"));
  const reg = join(dir, "installed_plugins.json");
  writeFileSync(reg, registryText);
  const r = spawnSync("node", [kitRoot], { cwd, encoding: "utf8", env: { ...process.env, PLUGIN_REGISTRY: reg } });
  return r.stdout.trim();
}

export async function measure({ kitRoot = join(repoRoot(), "tools/kit-root.mjs"), cwd = repoRoot() } = {}) {
  const base = mkdtempSync(join(tmpdir(), "nk30-installs-"));
  const dirs = Object.fromEntries(["old", "new", "user", "project"].map((n) => [n, join(base, n)]));
  for (const d of Object.values(dirs)) mkdirSync(d);
  const top = git(cwd, "rev-parse", "--show-toplevel");
  const reg = (plugins) => JSON.stringify({ version: 2, plugins });
  const old = [{ scope: "user", installPath: dirs.old }];
  const neu = [{ scope: "user", installPath: dirs.new }];

  const cases = [
    ["old-only", reg({ [OLD_KEY]: old }), ""],
    ["new-only", reg({ [NEW_KEY]: neu }), dirs.new],
    ["both", reg({ [OLD_KEY]: old, [NEW_KEY]: neu }), dirs.new],
    [
      "project beats user",
      reg({
        [NEW_KEY]: [
          { scope: "user", installPath: dirs.user },
          { scope: "project", projectPath: top, installPath: dirs.project },
        ],
      }),
      dirs.project,
    ],
    ["entry not a list", reg({ [NEW_KEY]: { scope: "user", installPath: dirs.new } }), ""],
    ["registry not JSON", "not json", ""],
  ];
  for (const [name, text, want] of cases) {
    const got = run(kitRoot, text, cwd);
    if (got !== want)
      return { ok: false, line: `kit-root cli: ${name} printed ${got || "nothing"}${want ? `, want ${want}` : ""}` };
  }
  return { ok: true, line: "kit-root cli: old-only -> empty; new-only -> new; both -> new; project beats user" };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await cli(measure);
