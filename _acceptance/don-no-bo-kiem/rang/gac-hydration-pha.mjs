// Row 1u, E5 (AC-5): the hydration guard turns a run red on the planted mismatch and names the break test, even with
// other tests running beside it; without the break the run is green and says «0 canh bao». Both configurations mount
// the guard (checked by loading them, tests/cong-chay.test.ts).
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const ARGS = ["playwright", "test", "-g", "cho-tai|gac-hydration pha", "--project=1440", "--workers=3"];

function run(env) {
  const r = spawnSync("npx", ARGS, { cwd: ROOT, encoding: "utf8", env: { ...process.env, ...env } });
  return { code: r.status, out: `${r.stdout}\n${r.stderr}` };
}
const problems = [];
const red = run({ GAC_HYDRATION_PHA: "1" });
const line = red.out.split("\n").find((l) => l.startsWith("gac-hydration:")) ?? "(khong co dong gac-hydration)";
if (red.code === 0) problems.push("luot co bai pha van thoat 0");
if (!/^gac-hydration: 1 canh bao, bai: .*gac-hydration pha/.test(line)) problems.push(`dong gac sai: ${line}`);
const green = run({ GAC_HYDRATION_PHA: "" });
if (green.code !== 0) problems.push(`luot khong bai pha thoat ${green.code}`);
if (!green.out.includes("gac-hydration: 0 canh bao")) problems.push("luot khong bai pha khong bao 0 canh bao");
const mount = spawnSync(
  "npx",
  ["vitest", "run", "tests/cong-chay.test.ts", "-t", "gac-hydration", "--coverage.enabled=false"],
  { cwd: ROOT, encoding: "utf8" },
);
if (mount.status !== 0) problems.push(`hai cau hinh khong deu gan phep gac:\n${mount.stdout.slice(-1500)}`);
if (problems.length) {
  console.log(problems.map((p) => `gac-hydration-pha: ${p}`).join("\n"));
  process.exit(1);
}
console.log(`gac-hydration-pha: luot co bai pha do (${line}); luot khong bai pha xanh, 0 canh bao; hai cau hinh gan phep gac`);
