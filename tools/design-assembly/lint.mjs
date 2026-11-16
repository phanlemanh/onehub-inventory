// Runs the repository's own lint on probe texts, in a process of its own: the lint answers later,
// and the checks of this tool answer at once. The adapter of kind `lint` knows how to run it.
// As a script it is given a folder: it reads one request from a file there and writes its answer
// to another. No pipe joins the two processes. A request read from standard input fails whenever
// the reader gets there before the writer, which a busy machine makes happen, and a pipe that is
// never closed keeps a gate waiting for ever.
import { spawnSync } from "node:child_process";
import {
  closeSync,
  mkdtempSync,
  openSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { argv, env, execPath, exit } from "node:process";
import { fileURLToPath } from "node:url";

import { adapterOf } from "./adapters/index.mjs";

const SELF = fileURLToPath(import.meta.url);
const REQUEST = "request.json";
const ANSWER = "answer.json";
const SAID = "said.txt";

// How long the lint may take before it is stopped, in seconds. A repository with a slow lint
// raises it through LIMIT_NAME.
const LIMIT_NAME = "DESIGN_ASSEMBLY_LINT_SECONDS";
const LIMIT = 120;
const limit = () => (Number(env[LIMIT_NAME]) > 0 ? Number(env[LIMIT_NAME]) : LIMIT);

const firstLine = (error) => String(error?.message ?? error).split("\n")[0];

// What a process that died said: the line that carries the error's own words. The first line the
// runtime prints is only where in the source the error was thrown.
function lastWords(said) {
  const lines = said
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const named = lines.find((line) =>
    /^(Uncaught )?[\w.$]*(Error|Exception)( \[\w+\])?: /.test(line),
  );
  return named ?? (lines.join(" ").slice(0, 300) || "it said nothing");
}

// The answer to a request about the repository at `root`, or `{ error }`. Never throws, and never
// takes longer than `seconds`.
export function askLint(root, request, { seconds = limit() } = {}) {
  let dir = null;
  try {
    dir = mkdtempSync(path.join(tmpdir(), "design-assembly-ask-"));
    writeFileSync(path.join(dir, REQUEST), JSON.stringify({ root, request }));
    const said = openSync(path.join(dir, SAID), "w");
    let run;
    try {
      run = spawnSync(execPath, [SELF, dir], {
        stdio: ["ignore", "ignore", said],
        timeout: seconds * 1000,
        killSignal: "SIGKILL",
      });
    } finally {
      closeSync(said);
    }
    if (run.error?.code === "ETIMEDOUT") {
      return {
        error: `the lint did not answer within ${seconds} seconds and was stopped; ${LIMIT_NAME} sets the limit`,
      };
    }
    if (run.error) return { error: `the lint could not be run: ${firstLine(run.error)}` };
    if (run.signal) return { error: `the lint could not be run: it was stopped by ${run.signal}` };
    if (run.status !== 0) {
      const words = lastWords(readFileSync(path.join(dir, SAID), "utf8"));
      return { error: `the lint could not be run: ${words}` };
    }
    try {
      return JSON.parse(readFileSync(path.join(dir, ANSWER), "utf8"));
    } catch {
      return { error: "the lint gave an answer this tool cannot read" };
    }
  } catch (error) {
    return { error: `the lint could not be run: ${firstLine(error)}` };
  } finally {
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
}

// For each of `rules`, the first of `candidates` the lint reads with it as an error, or null; or
// `{ error }`.
export function whereRulesApply(root, rules, candidates) {
  if (rules.length === 0) return { at: {} };
  return askLint(root, { find: { rules, candidates } });
}

// For each job `{ key, rule, at, control, probes }`: the rules that reject each probe, then the same
// with `rule` turned off. Keyed by job.
export function lintProbes(root, jobs) {
  if (jobs.length === 0) return {};
  const answer = askLint(root, { jobs });
  if (answer.error)
    return Object.fromEntries(jobs.map((job) => [job.key, { error: answer.error }]));
  return answer.results;
}

async function main(dir) {
  let answer;
  try {
    const { root, request } = JSON.parse(readFileSync(path.join(dir, REQUEST), "utf8"));
    answer = await adapterOf("lint").run(root, request);
  } catch (error) {
    answer = { error: `the lint could not be run: ${firstLine(error)}` };
  }
  writeFileSync(path.join(dir, ANSWER), JSON.stringify(answer));
  // The answer is on disk. Whatever the lint left running must not keep the gate waiting.
  exit(0);
}

if (argv[1] && argv[2] && realpathSync(argv[1]) === realpathSync(SELF)) await main(argv[2]);
