// The control of PR #134's own test: tools/deploy/dat-khoa-ask.test.ts runs against two copies of the source in a run
// folder — the current source (must pass) and the same source with the order from before the PR (question written
// after readline starts, on the input line; must fail on the assertion that the question stays on a line of its own).
// The repository's files are never changed.
//
//   node bai-kiem.mjs   prints `ok lanh — …`, `ok thu-tu-cu — …` or `DO <case>: …`; last line `bai-kiem: <n>/2 ca đúng`.
import { spawnSync } from "node:child_process";
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "../../..");
const RUN = join(ROOT, ".acceptance-runs", "dat-khoa-cau-hoi-hien", `bai-kiem-${Date.now()}-${process.pid}`);
const SOURCE = join(ROOT, "tools/deploy/dat-khoa.mjs");
const TEST = join(ROOT, "tools/deploy/dat-khoa-ask.test.ts");
const NEW_ORDER =
  "output.write(`${question}\\n`);\n      const rl = createInterface({ input, output, terminal: true });";
const OLD_ORDER = "const rl = createInterface({ input, output, terminal: true });\n      output.write(question);";
// The assertion that the question sits on a settled line (the old order leaves no line break before the input line).
const PINNED = "to contain 'VERCEL_TOKEN (dán rồi Enter): \\n'";

function copy(name, change) {
  const dir = join(RUN, name);
  mkdirSync(dir, { recursive: true });
  const src = readFileSync(SOURCE, "utf8");
  if (change && !src.includes(NEW_ORDER)) {
    console.log("bai-kiem: không chạy được — không thấy thứ tự mới trong tools/deploy/dat-khoa.mjs");
    process.exit(2);
  }
  writeFileSync(join(dir, "dat-khoa.mjs"), change ? src.split(NEW_ORDER).join(OLD_ORDER) : src);
  copyFileSync(TEST, join(dir, "dat-khoa-ask.test.ts"));
  writeFileSync(join(dir, "vitest.config.mjs"), "export default { test: { include: ['*.test.ts'] } };\n");
  const r = spawnSync("npx", ["vitest", "run", "--root", dir, "--config", join(dir, "vitest.config.mjs")], {
    cwd: ROOT,
    encoding: "utf8",
    env: { ...process.env, NO_COLOR: "1", FORCE_COLOR: "0" },
  });
  const out = `${r.stdout}\n${r.stderr}`;
  writeFileSync(join(dir, "vitest.out"), out);
  return { exit: r.status, out };
}

let ok = 0;
const healthy = copy("lanh", false);
if (healthy.exit === 0 && /Tests\s+1 passed \(1\)/.test(healthy.out)) {
  ok += 1;
  console.log("ok lanh — bài kiểm xanh trên mã của PR (1/1)");
} else console.log(`DO lanh: bài kiểm không xanh trên mã của PR (exit ${healthy.exit}; ${join(RUN, "lanh", "vitest.out")})`);

const old = copy("thu-tu-cu", true);
if (old.exit !== 0 && old.out.includes(PINNED)) {
  ok += 1;
  console.log(`ok thu-tu-cu — thứ tự cũ làm đỏ bài kiểm: ${PINNED}`);
} else
  console.log(
    `DO thu-tu-cu: thứ tự cũ không làm đỏ bài kiểm đúng chỗ (exit ${old.exit}; ${join(RUN, "thu-tu-cu", "vitest.out")})`,
  );

console.log(`bai-kiem: ${ok}/2 ca đúng (${RUN})`);
process.exit(ok === 2 ? 0 : 1);
