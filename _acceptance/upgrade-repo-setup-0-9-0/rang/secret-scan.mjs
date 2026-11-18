// AC-6: gitleaks over every commit finds nothing with the allowlist of HEAD; with the one of BASE it
// finds exactly 12 over the history up to BASE and only kit hashes over every commit, still catches the same value outside _acceptance/, and the
// secret-scan job of PR 88 succeeded.
// Usage: node secret-scan.mjs [--root <dir>] [--no-github]

import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { flag, gh, git, root, run, verdict } from "./lib.mjs";
import { BASE, LEAK_PATH, LEAK_RULE, LEAKS_BASE, PR, REPO } from "./matrix.mjs";

const NAME = "secret-scan";
const dir = root();
const tmp = mkdtempSync(join(tmpdir(), "rs090-leaks-"));
const problems = [];
let allOld = 0;

function scan(config, logOpts = "HEAD") {
  const report = join(tmp, `r-${Math.random().toString(16).slice(2)}.json`);
  const r = run("gitleaks", ["git", "--no-banner", "--redact", `--log-opts=${logOpts}`, "--config", config, "--report-path", report, dir]);
  if (r.code !== 0 && r.code !== 1) throw new Error(`cannot run gitleaks: ${(r.err || r.out).trim().split("\n").pop()}`);
  return JSON.parse(readFileSync(report, "utf8") || "[]");
}

try {
  const head = scan(join(dir, ".gitleaks.toml"));
  if (head.length > 0) problems.push(`${head.length} leaks with the allowlist of HEAD: ${head.map((f) => f.File).join(", ")}`);

  const baseConfig = join(tmp, "base.toml");
  writeFileSync(baseConfig, git(dir, "show", `${BASE}:.gitleaks.toml`));
  const upToBase = scan(baseConfig, BASE);
  if (upToBase.length !== LEAKS_BASE) {
    problems.push(`${upToBase.length} leaks with the allowlist of ${BASE.slice(0, 8)} up to ${BASE.slice(0, 8)}, not ${LEAKS_BASE}`);
  }
  const base = scan(baseConfig);
  if (base.length < LEAKS_BASE) problems.push(`${base.length} leaks with the allowlist of ${BASE.slice(0, 8)} over every commit, fewer than ${LEAKS_BASE}`);
  allOld = base.length;
  const stray = base.filter((f) => f.RuleID !== LEAK_RULE || !LEAK_PATH.test(f.File));
  if (stray.length > 0) problems.push(`a leak with the old allowlist is not a kit hash: ${stray.map((f) => `${f.RuleID} ${f.File}`).join(", ")}`);

  // Control: the same kind of value outside _acceptance/ must still be caught by the new allowlist.
  const ctl = join(tmp, "control");
  run("mkdir", ["-p", join(ctl, "tools")]);
  const hex = [...Array(64)].map((_, i) => "0123456789abcdef"[(i * 7 + 3) % 16]).join("");
  writeFileSync(join(ctl, "tools", "hashes.json"), `{\n  "src/modules/catalog/keys.test.ts": "${hex}"\n}\n`);
  const c = run("gitleaks", ["dir", "--no-banner", "--redact", "--config", join(dir, ".gitleaks.toml"), ctl]);
  if (c.code !== 1) problems.push(`the control outside _acceptance/ was not caught (gitleaks exit ${c.code})`);

  if (!flag("--no-github")) {
    const checks = JSON.parse(gh(["pr", "checks", String(PR), "-R", REPO, "--json", "name,state"]));
    const job = checks.find((x) => x.name === "secret-scan");
    if (!job || job.state !== "SUCCESS") problems.push(`the secret-scan job of PR ${PR} is ${job ? job.state : "missing"}, not SUCCESS`);
  }
} catch (err) {
  problems.push(err.message);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

verdict(
  NAME,
  problems,
  `no leak over every commit with the allowlist of HEAD; with the one of ${BASE.slice(0, 8)}, ${LEAKS_BASE} up to ${BASE.slice(0, 8)} and ${allOld} over every commit, all ${LEAK_RULE} in _acceptance/*/s4-args*.json; a 64-hex value next to keys.test.ts outside _acceptance/ is caught; the secret-scan job of PR ${PR} succeeded`,
);
