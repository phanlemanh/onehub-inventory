// Runs the repository's own lint on probe texts, in a process of its own: the lint answers later,
// and the checks of this tool answer at once. The adapter of kind `lint` knows how to run it.
// As a script it reads one request on its input and writes the answer on its output.
import { spawnSync } from "node:child_process";
import { readFileSync, realpathSync } from "node:fs";
import { argv, execPath, stdout } from "node:process";
import { fileURLToPath } from "node:url";

import { adapterOf } from "./adapters/index.mjs";

const SELF = fileURLToPath(import.meta.url);

// The answer to a request about the repository at `root`, or `{ error }`.
export function askLint(root, request) {
  const run = spawnSync(execPath, [SELF], {
    input: JSON.stringify({ root, request }),
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  if (run.status !== 0) {
    return { error: `the lint could not be run: ${(run.stderr || "no output").split("\n")[0]}` };
  }
  try {
    return JSON.parse(run.stdout);
  } catch {
    return { error: "the lint gave an answer this tool cannot read" };
  }
}

// For each of `rules`, the first of `candidates` the lint reads with it as an error, or null; or
// `{ error }`.
export function whereRulesApply(root, rules, candidates) {
  if (rules.length === 0) return { at: {} };
  return askLint(root, { find: { rules, candidates } });
}

// For each job `{ key, at, control, probes }`: the rules that reject each probe, then the same with
// those rules turned off. Keyed by job.
export function lintProbes(root, jobs) {
  if (jobs.length === 0) return {};
  const answer = askLint(root, { jobs });
  if (answer.error)
    return Object.fromEntries(jobs.map((job) => [job.key, { error: answer.error }]));
  return answer.results;
}

async function main() {
  const { root, request } = JSON.parse(readFileSync(0, "utf8"));
  stdout.write(JSON.stringify(await adapterOf("lint").run(root, request)));
}

if (argv[1] && realpathSync(argv[1]) === realpathSync(SELF)) await main();
