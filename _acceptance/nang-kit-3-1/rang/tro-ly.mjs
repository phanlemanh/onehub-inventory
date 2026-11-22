// AC-3: the decision assistant of kit 3.1 counts on this repo: --dem exits 0, its first line counts exactly the
// records that have a contract, and it prints one line per question kind of the kit's closed list.
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { cli, coreRoot, fetchKit, repoRoot } from "./kit.mjs";
import { NEW_KIT, TRO_LY } from "./matrix.mjs";

export function records(root) {
  return readdirSync(join(root, "_acceptance")).filter(
    (n) => !n.startsWith(".") && existsSync(join(root, "_acceptance", n, "contract.md")),
  ).length;
}

export function judge({ kit, core, root, status, out }) {
  if (!existsSync(join(core, TRO_LY.script))) return { ok: false, line: `tro-ly: ${TRO_LY.script} missing in kit ${kit.tag}` };
  if (status !== 0) return { ok: false, line: `tro-ly: --dem exit ${status}` };
  const lines = out.split("\n");
  const m = lines[0]?.match(TRO_LY.firstLine);
  if (!m) return { ok: false, line: `tro-ly: first line is not the count: ${(lines[0] ?? "").slice(0, 120)}` };
  const want = records(root);
  if (Number(m[1]) !== want) return { ok: false, line: `tro-ly: counts ${m[1]} records, want ${want}` };
  const missing = TRO_LY.kinds.filter((k) => !lines.some((l) => l.startsWith(`${k} · hỏi `)));
  if (missing.length) return { ok: false, line: `tro-ly: no count line for ${missing.join(", ")}` };
  return {
    ok: true,
    line: `tro-ly: kit ${kit.tag} ${TRO_LY.script} --dem exit 0 on this repo; ${want} records counted (= records with a contract), mặc-ký ${m[2]}, ${TRO_LY.kinds.length} kind lines`,
  };
}

export function run(kit, root) {
  const core = coreRoot(kit, fetchKit(kit));
  if (!existsSync(join(core, TRO_LY.script))) return { kit, core, root, status: null, out: "" };
  const r = spawnSync("node", [join(core, TRO_LY.script), "--root", root, ...TRO_LY.args], { encoding: "utf8" });
  return { kit, core, root, status: r.status, out: `${r.stdout ?? ""}` };
}

export async function measure({ root = repoRoot(), kit = NEW_KIT } = {}) {
  return judge(run(kit, root));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await cli(measure);
