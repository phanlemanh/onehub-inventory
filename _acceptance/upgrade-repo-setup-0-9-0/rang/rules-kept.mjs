// AC-3: the rules of the repository are as on main when it was merged in (MAIN), but for the owner's
// answers to Hoi-2 and Hoi-3.
// Usage: node rules-kept.mjs [--root <dir>] [--no-github]

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { flag, gh, git, root, verdict } from "./lib.mjs";
import { MAIN as BASE, CODEOWNERS_LINE, KEPT, REPO, RULESET_CHECKS } from "./matrix.mjs";

const NAME = "rules-kept";
const dir = root();
const problems = [];
const atBase = (path) => git(dir, "show", `${BASE}:${path}`);
const now = (path) => readFileSync(join(dir, path), "utf8");

try {
  for (const path of KEPT) {
    if (now(path) !== atBase(path)) problems.push(`${path} differs from ${BASE.slice(0, 8)}`);
  }

  const before = atBase(".github/CODEOWNERS").split("\n");
  const after = now(".github/CODEOWNERS").split("\n");
  const differ = [];
  for (let i = 0; i < Math.max(before.length, after.length); i++) if (before[i] !== after[i]) differ.push(i + 1);
  if (JSON.stringify(differ) !== JSON.stringify([CODEOWNERS_LINE])) {
    problems.push(`CODEOWNERS differs on lines [${differ.join(", ")}], not [${CODEOWNERS_LINE}]`);
  } else if (!after[CODEOWNERS_LINE - 1].startsWith("#")) {
    problems.push(`CODEOWNERS line ${CODEOWNERS_LINE} is not a comment`);
  }

  const a = JSON.parse(atBase(".claude/settings.json"));
  const b = JSON.parse(now(".claude/settings.json"));
  for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) {
    if (key === "hooks") continue;
    if (JSON.stringify(a[key]) !== JSON.stringify(b[key])) problems.push(`settings.json ${key} differs`);
  }
  const added = Object.keys(b.hooks ?? {}).filter((k) => !(k in (a.hooks ?? {})));
  for (const k of Object.keys(a.hooks ?? {})) {
    if (JSON.stringify(a.hooks[k]) !== JSON.stringify(b.hooks?.[k])) problems.push(`settings.json hook ${k} differs`);
  }
  if (JSON.stringify(added) !== JSON.stringify(["SessionStart"])) {
    problems.push(`settings.json adds hooks [${added.join(", ")}], not [SessionStart]`);
  } else if (!JSON.stringify(b.hooks.SessionStart).includes("make -s derived")) {
    problems.push("the SessionStart hook does not run make -s derived");
  }

  if (!flag("--no-github")) {
    const ids = JSON.parse(gh(["api", `repos/${REPO}/rulesets`])).map((r) => r.id);
    const rules = ids.flatMap((id) => JSON.parse(gh(["api", `repos/${REPO}/rulesets/${id}`])).rules ?? []);
    const status = rules.filter((r) => r.type === "required_status_checks");
    const checks = status.flatMap((r) => r.parameters.required_status_checks.map((c) => c.context)).sort();
    if (JSON.stringify(checks) !== JSON.stringify([...RULESET_CHECKS].sort())) {
      problems.push(`the main ruleset requires [${checks.join(", ")}], not [${RULESET_CHECKS.join(", ")}]`);
    }
    if (status.some((r) => r.parameters.strict_required_status_checks_policy)) problems.push("the main ruleset has strict on");
  }
} catch (err) {
  problems.push(err.message);
}

verdict(
  NAME,
  problems,
  `autonomy.yaml, ontology_actions.py, boundaries.py and relations.yaml as at ${BASE.slice(0, 8)}; CODEOWNERS differs on line ${CODEOWNERS_LINE} only; settings.json adds the SessionStart hook only; the main ruleset requires ${RULESET_CHECKS.join(", ")}, strict off`,
);
