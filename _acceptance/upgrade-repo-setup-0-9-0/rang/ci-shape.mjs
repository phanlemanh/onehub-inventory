// AC-4: the jobs of the tiered ci.yml, the gate job byte for byte, and tools/ci_verdict.py on all
// 64 combinations of the three tiers it waits for, against the expectation written below from
// its documented rule (never from its output).
// Usage: node ci-shape.mjs [--root <dir>]

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { git, root, run, verdict, yaml } from "./lib.mjs";
import { BASE, CHECK_NEEDS, DRAFT_IF, HEAVY, JOBS, PHRASE, STATES } from "./matrix.mjs";

const NAME = "ci-shape";
const dir = root();
const WORKFLOW = ".github/workflows/ci.yml";
const problems = [];

/** The text block of one job: from `  <name>:` to the next line at job indentation. */
function jobText(text, name) {
  const lines = text.split("\n");
  const start = lines.indexOf(`  ${name}:`);
  if (start < 0) return "";
  let end = start + 1;
  while (end < lines.length && !/^ {2}\S/.test(lines[end]) && !/^\S/.test(lines[end])) end++;
  return lines.slice(start, end).join("\n");
}

const steps = (job) => (job.steps ?? []).map((s) => s.run ?? s.uses ?? "");

/** The lines ci_verdict.py must print for one combination: one per tier that is not success. */
function expected(results) {
  return Object.entries(results)
    .filter(([, r]) => r !== "success")
    .map(([name, r]) => {
      const othersPassed = Object.entries(results).every(([o, s]) => o === name || s === "success");
      const phrase = r === "skipped" ? (othersPassed ? PHRASE.skippedDraft : PHRASE.skippedBehind) : PHRASE[r];
      return { name, r, phrase };
    });
}

let combos = 0;
try {
  const text = readFileSync(join(dir, WORKFLOW), "utf8");
  const wf = yaml(join(dir, WORKFLOW));
  const names = Object.keys(wf.jobs ?? {});
  if (JSON.stringify(names) !== JSON.stringify(JOBS)) problems.push(`jobs are [${names.join(", ")}], not [${JOBS.join(", ")}]`);

  const quick = steps(wf.jobs.quick ?? {});
  const qi = quick.indexOf("make check-quick");
  if (qi < 0 || quick.indexOf("make build") < qi) problems.push("quick does not run make check-quick then make build");

  for (const name of HEAVY) {
    const job = wf.jobs[name] ?? {};
    if (job.needs !== "quick") problems.push(`${name} needs ${JSON.stringify(job.needs)}, not quick`);
    if (job.if !== DRAFT_IF) problems.push(`${name} is not skipped on a draft (if: ${job.if})`);
    if (!jobText(text, name).includes(`heavy-ok-${name}-`)) problems.push(`${name} has no reuse key heavy-ok-${name}-`);
  }

  const check = wf.jobs.check ?? {};
  if (JSON.stringify(check.needs) !== JSON.stringify(CHECK_NEEDS)) {
    problems.push(`check needs ${JSON.stringify(check.needs)}, not ${JSON.stringify(CHECK_NEEDS)}`);
  }
  if (check.if !== "always()") problems.push(`check runs if ${check.if}, not always()`);
  if (!steps(check).some((s) => s.includes("tools/ci_verdict.py"))) problems.push("check does not run tools/ci_verdict.py");

  const gateNow = jobText(text, "gate");
  const gateBase = jobText(git(dir, "show", `${BASE}:${WORKFLOW}`), "gate");
  if (!gateNow || gateNow !== gateBase) problems.push(`the gate job differs from ${BASE.slice(0, 8)}`);

  for (const a of STATES) {
    for (const b of STATES) {
      for (const c of STATES) {
        combos++;
        const results = { quick: a, e2e: b, "e2e-db": c };
        const needs = Object.fromEntries(Object.entries(results).map(([k, r]) => [k, { result: r }]));
        const got = run("python3", ["tools/ci_verdict.py"], { cwd: dir, env: { ...process.env, NEEDS_JSON: JSON.stringify(needs) } });
        const want = expected(results);
        const label = `${a}/${b}/${c}`;
        if (got.code !== (want.length === 0 ? 0 : 1)) problems.push(`ci_verdict ${label}: exit ${got.code}`);
        const lines = got.out.trim() ? got.out.trim().split("\n") : [];
        if (lines.length !== want.length) problems.push(`ci_verdict ${label}: ${lines.length} lines, not ${want.length}`);
        for (const w of want) {
          const line = lines.find((l) => l.startsWith(`${w.name}: ${w.r} `));
          if (!line) problems.push(`ci_verdict ${label}: no line for ${w.name}`);
          else if (!line.includes(w.phrase)) problems.push(`ci_verdict ${label}: ${w.name} does not say "${w.phrase}"`);
        }
      }
    }
  }
} catch (err) {
  problems.push(err.message);
}

verdict(
  NAME,
  problems,
  `five jobs ${JOBS.join(", ")}; e2e and e2e-db behind quick, skipped on a draft, one reuse key each; check waits for ${CHECK_NEEDS.join(", ")} and runs ci_verdict.py; gate as at ${BASE.slice(0, 8)}; ci_verdict.py: ${combos} of 64 combinations as written beforehand, 1 exits 0 and 63 exit 1`,
);
