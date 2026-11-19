// AC-5: the measures of signed records that the split broke are whole again. so-quyet-dinh (don-no-bo-kiem/E6)
// exits 0, its broken copy now aimed at a log entry in git; the case «E4 red» of tat-plugin-cho-cu's two-way
// and the case «ledgers» of upgrade-repo-setup-0-9-0's two-way pass; E10 of upgrade-repo-setup-0-9-0 declares
// `status: not-run` with `superseded_by: split-log-ledger#AC-3`, and this record's contract names it back; each
// of the three records has a sua-sau-ky.md section for this change.
// Usage: node do-cu.mjs [--root <dir>]

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { root, run, verdict } from "./lib.mjs";
import { FIXED, SUPERSEDES } from "./matrix.mjs";

const NAME = "do-cu";
const dir = root();
const problems = [];
const RECORDS = ["don-no-bo-kiem", "tat-plugin-cho-cu", "upgrade-repo-setup-0-9-0"];

function twoWayCase(file, pattern, label) {
  const r = run("node", ["--test", `--test-name-pattern=${pattern}`, file], { cwd: dir });
  const pass = Number((/ℹ pass (\d+)/.exec(r.out) ?? [])[1] ?? 0);
  if (r.code !== 0 || pass === 0) problems.push(`${label}: exit ${r.code}, ${pass} passed: ${r.out.split("\n").filter((l) => l.startsWith("✖")).join(" | ")}`);
}

try {
  const sq = run("bash", ["-c", FIXED.soQuyetDinh], { cwd: dir });
  if (sq.code !== 0) problems.push(`so-quyet-dinh exited ${sq.code}: ${sq.out.trim()}`);
  twoWayCase(FIXED.tpcTwoWay, FIXED.tpcCase, "tat-plugin-cho-cu two-way «E4 red»");
  twoWayCase(FIXED.rs090TwoWay, FIXED.rs090Case, "upgrade-repo-setup-0-9-0 two-way «ledgers»");
  const py = "import json,sys,yaml; d=yaml.safe_load(open(sys.argv[1])); print(json.dumps([e for e in d['evals'] if e.get('id')==sys.argv[2]]))";
  const got = run("python3", ["-c", py, join(dir, SUPERSEDES.evals), SUPERSEDES.id]);
  const e10 = got.code === 0 ? JSON.parse(got.out)[0] : undefined;
  if (!e10) problems.push(`cannot read ${SUPERSEDES.id} of ${SUPERSEDES.evals}: ${got.err.trim()}`);
  else {
    if (e10.status !== "not-run") problems.push(`${SUPERSEDES.id} status is ${e10.status ?? "absent"}, not not-run`);
    if (e10.superseded_by !== SUPERSEDES.pointer) problems.push(`${SUPERSEDES.id} superseded_by is ${e10.superseded_by ?? "absent"}, not ${SUPERSEDES.pointer}`);
  }
  if (!readFileSync(join(dir, "_acceptance/split-log-ledger/contract.md"), "utf8").includes(`upgrade-repo-setup-0-9-0/${SUPERSEDES.id}`))
    problems.push(`contract.md does not name upgrade-repo-setup-0-9-0/${SUPERSEDES.id}`);
  for (const r of RECORDS) {
    const p = join(dir, "_acceptance", r, "sua-sau-ky.md");
    if (!existsSync(p) || !readFileSync(p, "utf8").includes("split-log-ledger")) problems.push(`_acceptance/${r}/sua-sau-ky.md has no section for split-log-ledger`);
  }
} catch (err) {
  problems.push(err.message);
}

verdict(
  NAME,
  problems,
  `so-quyet-dinh exits 0; two-way «E4 red» of tat-plugin-cho-cu and «ledgers» of upgrade-repo-setup-0-9-0 pass; ${SUPERSEDES.id} declares not-run, superseded_by ${SUPERSEDES.pointer}; three sua-sau-ky.md sections`,
);
