// AC-8: the screen proof gate stays on with the fragment folders alone. On a copy of the repository
// where neither one-file copy (design/intake.yaml, design/screens.yaml) is drawn, the gate passes and
// counts every block of design/intake, as it does on the repository with the copies drawn.
// Usage: node proof-gate-fragments.mjs [--root <repository>] [--omit <path,...>] [--model <file>]
//   (--omit drops more paths from the copy; --model puts another model.py in the copy: both are breaks)
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { linkedCopy, option, ROOT } from "./lib.mjs";
import { FRAGMENTS, PROOF_GATE } from "./matrix.mjs";

const root = path.resolve(option("--root", ROOT));
const omit = [FRAGMENTS.intake.old.replace("so-khoi", "intake"), FRAGMENTS.screens.old];
for (const extra of (option("--omit") ?? "").split(",").filter(Boolean)) omit.push(extra);
// check.py finds its modules beside its resolved path, so a copy with another model.py holds every
// module of the gate as a real file, not a link back to the repository.
const replace = {};
if (option("--model")) {
  for (const name of readdirSync(path.join(root, "tools/proof_gate")).filter((n) => n.endsWith(".py"))) {
    replace[`tools/proof_gate/${name}`] = readFileSync(path.join(root, "tools/proof_gate", name), "utf8");
  }
  replace["tools/proof_gate/model.py"] = readFileSync(option("--model"), "utf8");
}

const gate = (dir, ...args) =>
  spawnSync("python3", [path.join(dir, "tools/proof_gate/check.py"), "--root", dir, ...args], { encoding: "utf8" });

const copy = linkedCopy(root, { omit, replace });
const found = [];
try {
  const plain = gate(copy.dir);
  const report = gate(copy.dir, "--report", "--json");
  let blocks = null;
  try {
    blocks = JSON.parse(report.stdout).nhap_kho;
  } catch {
    found.push(`the gate's report is not JSON: ${(report.stderr || report.stdout).trim().split("\n")[0]}`);
  }
  if (plain.status !== 0 || !plain.stdout.includes(PROOF_GATE.line)) {
    found.push(`the gate is red without the copies (exit ${plain.status}): ${(plain.stdout + plain.stderr).trim().split("\n").slice(0, 3).join(" | ")}`);
  }
  if (blocks !== null && blocks !== PROOF_GATE.blocks) {
    found.push(`decision 0023 reads ${blocks} blocks without the copies, not ${PROOF_GATE.blocks}`);
  }
} finally {
  copy.remove();
}
for (const line of found) process.stdout.write(`proof gate: ${line}\n`);
if (!found.length) {
  process.stdout.write(
    `proof gate: with ${omit.join(" and ")} absent, the gate passes and decision 0023 reads ${PROOF_GATE.blocks} blocks from ${FRAGMENTS.intake.folder}\n`,
  );
}
process.exitCode = found.length ? 1 : 0;
