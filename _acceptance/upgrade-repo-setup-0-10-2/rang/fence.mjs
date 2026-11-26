// AC-4: what a commit-msg hook prints reaches the runner as text, never as a workflow command.
// The judging step of conventional-commits runs as the workflow holds it (lib.judgeStep), in a clean
// checkout of HEAD whose .pre-commit-config.yaml gains one stand-in hook that prints the message back
// (staged, as pre-commit sets unstaged changes aside), with pre-commit from uvx.
//   - Two refused commits whose messages carry the PLANTED lines: exit 1; the hook output of each is
//     inside its own fence (`::stop-commands::<token>` ... `::<token>::`), 32 hex digits, a new token
//     each time; the planted lines are there, inside; no line outside a fence starts with one; the
//     only commands outside are the two `::error::Commit <sha> ...` lines, whose quoted subject has
//     no control character and `%` as `%25`.
//   - A refused commit whose body looks like an error of pre-commit (the could-not-run path): the
//     output is in one fence and the quoted ::error:: line has no control character, so the text after
//     its carriage return is not a command.
//   - Should not pass: with no random token (a stand-in `od` that fails) the step prints only the
//     error line NO_FENCE_ERROR, exits 1, and nothing of the hook output.
// Usage: node fence.mjs [--root <dir>] [--workflow <file>]

import { appendFileSync, chmodSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

import { WORKFLOW, fences, git, judgeStep, root, runStep, verdict, worktree } from "./lib.mjs";
import { CANNOT_RUN_ERROR, NO_FENCE_ERROR, PLANTED } from "./matrix.mjs";

const NAME = "fence";
const dir = root();
const i = process.argv.indexOf("--workflow");
const workflowFile = i >= 0 ? resolve(process.argv[i + 1]) : join(dir, WORKFLOW);
const problems = [];
const ECHO_HOOK = [
  "",
  "  - repo: local",
  "    hooks:",
  "      - id: echo-message",
  "        name: Stand-in for a hook that prints the message back",
  "        entry: cat",
  "        language: system",
  "        verbose: true",
  "        stages: [commit-msg]",
  "",
].join("\n");
const COMMITS = [
  { sha: "1".repeat(40), message: `update stuff 100%\r${PLANTED[0]}\n\n${PLANTED[1]}\n${PLANTED[2]}\n` },
  { sha: "2".repeat(40), message: `update stuff again\n\n${PLANTED[1]}\n` },
];
const PLANTED_CR = "::add-mask::planted-cr";
const CANNOT_RUN_COMMIT = { sha: "3".repeat(40), message: `update stuff\n\nAn error has occurred: FatalError: x\r${PLANTED_CR}\n` };
const tmp = mkdtempSync(join(tmpdir(), "rs0102-fence-"));
let copy = null;

try {
  const body = judgeStep(readFileSync(workflowFile, "utf8"));
  const cats = body.split("\n").filter((l) => l.includes('cat "$RUNNER_TEMP/hook-out"'));
  if (cats.length !== 1) problems.push(`the step prints the whole hook output in ${cats.length} places, not 1`);

  copy = worktree(dir, "HEAD");
  appendFileSync(join(copy.dir, ".pre-commit-config.yaml"), ECHO_HOOK);
  git(copy.dir, "add", ".pre-commit-config.yaml");

  const r = runStep(copy.dir, body, { commits: COMMITS });
  const out = r.out + r.err;
  const f = fences(out);
  if (r.code !== 1) problems.push(`the step exited ${r.code} on two refused commits, not 1`);
  if (f.fences.length !== COMMITS.length) problems.push(`the hook output is in ${f.fences.length} fences, not ${COMMITS.length}`);
  if (f.unclosed) problems.push("a fence is left open: every later line would be text");
  const tokens = f.fences.map((x) => x.token);
  if (!tokens.every((t) => /^[0-9a-f]{32}$/.test(t))) problems.push(`a fence token is not 32 hex digits: ${JSON.stringify(tokens)}`);
  if (new Set(tokens).size !== tokens.length) problems.push("two fences share a token");
  // A carriage return starts a line of its own for the runner, and it trims a line's start.
  const segments = (lines) => lines.flatMap((l) => l.split("\r")).map((l) => l.trimStart());
  const inside = segments(f.fences.flatMap((x) => x.lines));
  const outsideSegments = segments(f.outside);
  for (const p of PLANTED) {
    if (!inside.some((l) => l.startsWith(p))) problems.push(`the stand-in hook's "${p}" is not inside a fence (the measure saw nothing to fence)`);
    if (outsideSegments.some((l) => l.startsWith(p))) problems.push(`"${p}" reaches the runner as a workflow command`);
  }
  const commands = outsideSegments.filter((l) => l.startsWith("::"));
  const errors = commands.filter((l) => l.startsWith("::error::Commit "));
  if (commands.length !== errors.length || errors.length !== COMMITS.length) {
    problems.push(`outside the fences the runner reads ${JSON.stringify(commands)}, not one ::error:: line per refused commit`);
  }
  const first = f.outside.find((l) => l.includes(COMMITS[0].sha)) ?? "";
  if ([...first].some((ch) => ch.charCodeAt(0) < 0x20)) problems.push("the error line quotes the subject with a control character in it");
  if (!first.includes("100%25") || /100%(?!25)/.test(first)) problems.push(`the error line does not escape % of the subject: ${JSON.stringify(first)}`);

  // The author's text on the path where pre-commit "could not run": a body line that looks like an
  // error of pre-commit, printed back by the stand-in hook, is quoted in the ::error:: line.
  const c = runStep(copy.dir, body, { commits: [CANNOT_RUN_COMMIT] });
  const cf = fences(c.out + c.err);
  const cOutside = segments(cf.outside);
  if (c.code !== 1 || !(c.out + c.err).includes(CANNOT_RUN_ERROR)) problems.push(`on a body that looks like an error of pre-commit the step exited ${c.code} without "${CANNOT_RUN_ERROR}"`);
  if (cf.fences.length !== 1 || cf.unclosed) problems.push(`on the could-not-run path the hook output is in ${cf.fences.length} fences, not 1 closed fence`);
  if (cOutside.some((l) => l.startsWith(PLANTED_CR))) problems.push(`on the could-not-run path "${PLANTED_CR}" reaches the runner as a workflow command`);
  const cline = cf.outside.find((l) => l.includes(CANNOT_RUN_ERROR)) ?? "";
  if ([...cline].some((ch) => ch.charCodeAt(0) < 0x20)) problems.push("the could-not-run line quotes the author's text with a control character in it");

  const bin = join(tmp, "bin");
  mkdirSync(bin);
  writeFileSync(join(bin, "od"), "#!/bin/sh\nexit 1\n");
  chmodSync(join(bin, "od"), 0o755);
  const n = runStep(copy.dir, body, { commits: COMMITS.slice(0, 1), binDir: bin });
  const nout = n.out + n.err;
  if (n.code !== 1) problems.push(`with no random token the step exited ${n.code}, not 1`);
  if (!nout.includes(NO_FENCE_ERROR)) problems.push("with no random token the step does not say it cannot show the output safely");
  if (PLANTED.some((p) => nout.includes(p)) || nout.includes("::stop-commands::")) {
    problems.push("with no random token the step still prints the hook output");
  }
} catch (err) {
  problems.push(err.message);
} finally {
  copy?.remove();
  rmSync(tmp, { recursive: true, force: true });
}

verdict(
  NAME,
  problems,
  "the hook output of each refused commit is fenced by a new 32-hex token and the planted commands stay inside; outside, the runner reads only one ::error:: line per commit, its subject without control characters and with % escaped; on the could-not-run path the author's text is fenced and quoted too; with no random token the step prints nothing of the output and is red",
);
